import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { NavLink } from "react-router-dom";
import PopAllCtmFlights from "./PopAllCtmFlights.jsx";
import { useCtmFlightDeals } from "../../context/CtmFlightDealsContext.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker";
import { useAllTeams } from "../../context/AllTeamsContext.jsx";
import { toUtcDate, toUtcEndOfDay } from "../utils/formatUTC.jsx";

const updateBidStatus = async (flightId, body = {}) => {
  try {
    const res = await fetch(
      `/api/v1/ctmFlights/update-bid-status/${flightId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("updateBidStatus error:", err);
    throw err;
  }
};
// const socket = getSocket();

const AllCtmFlights = () => {
  // --- CONTEXT ---
  const { ctmFlightDeals, loading, errorCode } = useCtmFlightDeals();

  const { agent } = useAllTeams();

  console.log("agents is ", agent);
  // --- STATE ---
  const [flightDealsPop, setFlightDealsPop] = useState(false);
  const [flightDealsPopData, setFlightDealsPopData] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState(ctmFlightDeals || []);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState(null);

  const itemsPerPage = 5;

  const STATUS_NEW_BOOKING = "underFollowUp";
  const TICKETMCO = "ticketMco";
  const STATUS_REJECTED = "cancelled";

  // Helper: determine if taxes are pending / not filled
  const isTaxesPending = (deal) => {
    // Logic: treat as NOT pending only when chargingTaxStatus === "charged" AND chargingTaxes > 0
    const chargingTaxStatus = deal?.chargingTaxStatus;
    const chargingTaxesRaw = deal?.chargingTaxes;
    // Normalize numeric value (handles "5", 5, "", undefined, null)
    const chargingTaxesNumber = Number(String(chargingTaxesRaw ?? "").trim());
    const hasPositiveTaxes =
      !isNaN(chargingTaxesNumber) && chargingTaxesNumber > 0;
    if (chargingTaxStatus === "charged" && hasPositiveTaxes) return false; // taxes filled & charged
    return true; // otherwise pending/not filled
  };

  // --- APPLY FILTERS ---
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, bookingId, ctmFlightDeals, activeTabFilter, selectedAgentId]);

  const applyFilters = () => {
    let baseDeals = ctmFlightDeals || [];

    // Step 1: Apply the active tab filter first
    if (activeTabFilter) {
      const today = new Date().toISOString().split("T")[0];
      switch (activeTabFilter) {
        case "today":
          baseDeals = baseDeals.filter(
            (deal) =>
              new Date(deal.createdAt).toISOString().split("T")[0] === today
          );
          break;
        case STATUS_NEW_BOOKING:
          baseDeals = baseDeals.filter(
            (deal) => deal?.ticketmco === STATUS_NEW_BOOKING
          );
          break;
        case TICKETMCO:
          baseDeals = baseDeals.filter((deal) => deal?.ticketmco === TICKETMCO);
          break;
        case STATUS_REJECTED:
          baseDeals = baseDeals.filter(
            (deal) => deal?.ticketmco === STATUS_REJECTED
          );
          break;
        case "todayUnderFollowUp":
          baseDeals = baseDeals.filter((deal) => {
            const isToday =
              new Date(deal.createdAt).toISOString().split("T")[0] === today;
            return isToday && deal?.ticketmco === STATUS_NEW_BOOKING;
          });
          break;
        case "todayTicketMco":
          baseDeals = baseDeals.filter((deal) => {
            const isToday =
              new Date(deal.createdAt).toISOString().split("T")[0] === today;
            return isToday && deal?.ticketmco === TICKETMCO;
          });
          break;
        case "todayCancelled":
          baseDeals = baseDeals.filter((deal) => {
            const isToday =
              new Date(deal.createdAt).toISOString().split("T")[0] === today;
            return isToday && deal?.ticketmco === STATUS_REJECTED;
          });
          break;
        case "todayPendingAgent":
          baseDeals = baseDeals.filter((deal) => {
            const isToday =
              new Date(deal.createdAt).toISOString().split("T")[0] === today;
            return (
              isToday &&
              deal?.agentFigure === "yes" &&
              deal?.ticketmco !== "ticketMco"
            );
          });
          break;
        case "allPendingAgent":
          baseDeals = baseDeals.filter(
            (deal) =>
              deal?.agentFigure === "yes" && deal?.ticketmco !== "ticketMco"
          );
          break;

        case "todayPending":
          baseDeals = baseDeals.filter((deal) => {
            const isToday =
              new Date(deal.createdAt).toISOString().split("T")[0] === today;
            return (
              isToday &&
              deal?.bidStatus === "pending" &&
              deal?.agentFigure === "no"
            );
          });
          break;
        case "allPending":
          baseDeals = baseDeals.filter(
            (deal) =>
              deal?.bidStatus === "pending" && deal?.agentFigure === "no"
          );
          break;
        default:
          break;
      }
    }

    // Step 2: Apply date + booking filters on the baseDeals
    let filtered = baseDeals;

    if (startDate) {
      filtered = filtered.filter(
        (deal) => new Date(deal.createdAt) >= new Date(toUtcDate(startDate))
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (deal) => new Date(deal.createdAt) <= new Date( toUtcEndOfDay(endDate))
      );
    }

    if (bookingId.trim()) {
      filtered = filtered.filter((deal) =>
        deal.bookingId?.includes(bookingId.trim())
      );
    }
   
    const getAgentId = (deal) => {
      if (!deal) return null;
      const a = deal.agent;
    
      if (a && typeof a === "object" && !Array.isArray(a)) {
        return a._id || a.id || null;
      }
     
      if (Array.isArray(a) && a.length > 0) {
        const first = a[0];
        if (first && typeof first === "object") return first._id || first.id || null;
        if (typeof first === "string") return first;
      }
      
      if (a !== undefined && a !== null) return String(a);
      return null;
    };

    if (selectedAgentId) {
      filtered = filtered.filter((deal) => {
        const aid = getAgentId(deal);
        
        return aid && String(aid) === String(selectedAgentId);
      });
    }

    setFilteredDeals(filtered);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setBookingId("");
    setFilteredDeals(ctmFlightDeals || []);
   
    setActiveTabFilter(null);
  };

  const handleFilterClick = (filterType) => {
    
    if (filterType === activeTabFilter) {
      // setActiveTabFilter(null);
      // setFilteredDeals(ctmFlightDeals || []);
      // setCurrentPage(1);
      return;
    }

    setActiveTabFilter(filterType); // remember the active tab
    let filtered;
    const today = new Date().toISOString().split("T")[0];

    // (keep your switch case as is)
    switch (filterType) {
      case "today":
        filtered = (ctmFlightDeals || []).filter(
          (deal) =>
            new Date(deal.createdAt).toISOString().split("T")[0] === today
        );
        break;
      case STATUS_NEW_BOOKING:
        filtered = (ctmFlightDeals || []).filter(
          (deal) => deal?.ticketmco === STATUS_NEW_BOOKING
        );
        break;
      // ... your other cases unchanged
      default:
        filtered = ctmFlightDeals || [];
    }

    setFilteredDeals(filtered);
    setCurrentPage(1);
  };

  // --- PAGINATION ---
  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (filteredDeals.length > 0) {
      const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages);
      else if (currentPage < 1) setCurrentPage(1);
    } else {
      setCurrentPage(1);
    }
  }, [currentPage, filteredDeals, itemsPerPage]);

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeals = filteredDeals.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const pendingBookings = filteredDeals.filter(
    (deal) => deal?.ticketmco === STATUS_NEW_BOOKING
  ).length;


  useEffect(() => {
    if (selectedAgentId) {
      setActiveTabFilter("filterByAgent");
    } else {
      setActiveTabFilter(null);
    }
    setCurrentPage(1);
  }, [selectedAgentId]);

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar todayDealsCount={pendingBookings} />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title mb_3">Complete list of total BIDS...</p>
          </div>
          {/* Filter buttons */}

          <div className="mb-2 tabs_list_all">
            <button
              type="button"
              className="todays_booking"
              onClick={() => handleFilterClick("today")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) =>
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                      new Date().toISOString().split("T")[0]
                  ).length
                }
              </span>
              Today's Booking:
            </button>

            <button
              type="button"
              className="under_follow_btn"
              onClick={() => handleFilterClick(STATUS_NEW_BOOKING)}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) => deal?.ticketmco === STATUS_NEW_BOOKING
                  ).length
                }
              </span>
              Under Follow Up:
            </button>
            {/* NEW Filters: Today's UnderFollowUp, Today's TicketMco Charged, Today's Cancelled */}
            <button
              type="button"
              className="under_follow_btn"
              onClick={() => handleFilterClick("todayUnderFollowUp")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter((deal) => {
                    const today = new Date().toISOString().split("T")[0];
                    return (
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                        today && deal?.ticketmco === STATUS_NEW_BOOKING
                    );
                  }).length
                }
              </span>
              Today's Under Follow Up
            </button>
            <button
              type="button"
              className="mco_charged_btn"
              onClick={() => handleFilterClick(TICKETMCO)}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) => deal?.ticketmco === TICKETMCO
                  ).length
                }
              </span>
              Ticketed & MCO Charged
            </button>
            <button
              type="button"
              className="mco_charged_btn"
              onClick={() => handleFilterClick("todayTicketMco")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter((deal) => {
                    const today = new Date().toISOString().split("T")[0];
                    return (
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                        today && deal?.ticketmco === TICKETMCO
                    );
                  }).length
                }
              </span>
              Today's Ticketed / MCO Charged
            </button>
            <button
              type="button"
              className="mco_charged_btn  cancellation_btn"
              onClick={() => handleFilterClick(STATUS_REJECTED)}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) => deal?.ticketmco === STATUS_REJECTED
                  ).length
                }
              </span>
              Cancelled Booking
            </button>

            <button
              type="button"
              className="todays_booking cancellation_btn"
              onClick={() => handleFilterClick("todayCancelled")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter((deal) => {
                    const today = new Date().toISOString().split("T")[0];
                    return (
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                        today && deal?.ticketmco === STATUS_REJECTED
                    );
                  }).length
                }
              </span>
              Today's Cancelled Booking
            </button>

            {/* NEW: Today's Pending Booking (taxes pending/not filled) */}
            <button
              type="button"
              className="pending_bookingg"
              onClick={() => handleFilterClick("todayPendingAgent")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter((deal) => {
                    const today = new Date().toISOString().split("T")[0];
                    const isToday =
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                      today;
                    return (
                      isToday &&
                      deal?.agentFigure === "yes" &&
                      deal?.ticketmco !== "ticketMco"
                    );
                  }).length
                }
              </span>
              Today's Sent Invoice by Agent
            </button>

            {/* NEW: All Pending Booking (taxes pending/not filled) */}
            <button
              type="button"
              className="pending_bookingg"
              onClick={() => handleFilterClick("allPendingAgent")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) =>
                      deal?.agentFigure === "yes" &&
                      deal?.ticketmco !== "ticketMco"
                  ).length
                }
              </span>
              All Sent Invoice by Agent
            </button>

            {/* ----------------------------------------------------------newly changes------------------------------- */}

            {/* NEW: Today's Pending Booking (taxes pending/not filled) */}
            <button
              type="button"
              className="pending_bookingg"
              onClick={() => handleFilterClick("todayPending")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter((deal) => {
                    const today = new Date().toISOString().split("T")[0];
                    const isToday =
                      new Date(deal.createdAt).toISOString().split("T")[0] ===
                      today;
                    return (
                      isToday &&
                      deal?.bidStatus === "pending" &&
                      deal?.agentFigure === "no"
                    );
                  }).length
                }
              </span>
              Today's Pending BID Status
            </button>

            {/* NEW: All Pending Booking (taxes pending/not filled) */}
            <button
              type="button"
              className="pending_bookingg"
              onClick={() => handleFilterClick("allPending")}
            >
              <span>
                {
                  (ctmFlightDeals || []).filter(
                    (deal) =>
                      deal?.bidStatus === "pending" &&
                      deal?.agentFigure === "no"
                  ).length
                }
              </span>
              All Pending BID Status
            </button>

            <button
              type="button"
              className="todays_booking"
              onClick={clearFilters}
            >
              <span>{ctmFlightDeals?.length}</span>
              All Bookings
            </button>

            {/* <button
              type="button"
              className="todays_booking"
              onClick={clearFilters}
            >
              <span>
                
                 {
                  (ctmFlightDeals || []).filter(
                    (deal) =>
                      deal?.bidStatus === "pending" &&
                      deal?.agentFigure === "no"
                  ).length
                }

              </span>
              Filter By Agent
            </button> */}
            <div className="col-4">
              <div className="bids_inn_fresh">
                <label htmlFor="agentSelect">
                  <img src="/imgs/search-icon.png" />
                  Select Agent
                </label>
                <select
                  id="agentSelect"
                  className="form-control"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                >
                  <option value="">-- Select Agent --</option>
                  {agent?.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.userName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="mb-2">
            <div className="flex_props justify-content-between mt-3 mb-2">
              <p className="crm_title mb-0">Filter By :</p>
              <button className="clear_filter" onClick={clearFilters}>
                <img src="/imgs/clear-filter.png" />
                Clear Filters
              </button>
            </div>
            <div className="row bid_cont">
              <div className="col-4">
                <div className="bids_inn_fresh">
                  <label htmlFor="">
                    <img src="/imgs/search-icon.png" />
                    Search by Bid No, Email, or Phone
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Booking ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="bids_inn_fresh">
                  <label htmlFor="">
                    <img src="/imgs/date-icon.png" />
                    Date From
                  </label>
                  {/* <input
                type="date"
                className="form-control"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              /> */}

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Enter Pickup Date"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                    maxDate={new Date()}
                    name="startDate"
                    id="start-date"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="bids_inn_fresh">
                  <label htmlFor="">
                    <img src="/imgs/date-icon.png" />
                    Date To
                  </label>
                  {/* <input
                    type="date"
                    className="form-control"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setEndDate(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  /> */}
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="Enter Pickup Date"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                    maxDate={new Date()}
                    name="endDate"
                    id="start-date"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flight deals table */}
          <div className="bid_table">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>BID</th>
                    <th>Reservation date</th>
                    <th>First Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDeals.length ? (
                    currentDeals.map((deal, index) => (
                      <tr key={deal._id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{deal.bookingId}</td>
                        <td>
                          {new Date(
                            deal.outboundSegments[0].departure
                          ).toLocaleDateString()}
                        </td>
                        <td>{deal.cchName}</td>
                        <td>{deal.billingPhoneNumber}</td>
                        <td>{deal.email}</td>
                        <td>
                          <div className="flex_props justify-content-center">
                            <NavLink
                              to={`/astrivion/details-pnr-flight/${deal._id}`}
                              className="btn_common_c"
                            >
                              View PNR
                            </NavLink>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text_cap ${
                              deal.ticketmco === "ticketMco"
                                ? "text-success"
                                : deal.ticketmco === "underFollowUp"
                                ? "text-warning"
                                : deal?.ticketmco === "cancelled"
                                ? "text-danger"
                                : "text-warning"
                            }`}
                          >
                            {deal.ticketmco || "Pending"}
                          </span>
                          {/* show taxes pending badge (optional) */}
                          {/* {isTaxesPending(deal) ? (
                            <small className="d-block text-muted">
                              Taxes: Pending
                            </small>
                          ) : (
                            <small className="d-block text-muted">
                              Taxes: Charged
                            </small>
                          )} */}
                        </td>

                        {/* <td> {deal.approvedBy || "-"}</td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {loading
                          ? "Loading..."
                          : errorCode
                          ? errorCode
                          : "No flight deals available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination mt-3">
            <button
              className="btn btn-secondary mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            {Array.from({ length: 3 }, (_, i) => {
              const offset = i - 0;
              const page = currentPage + offset;
              if (page < 1 || page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={`btn ${
                    currentPage === page ? "btn-primary" : "btn-secondary"
                  } mx-1`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="btn btn-secondary mx-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AllCtmFlights;
