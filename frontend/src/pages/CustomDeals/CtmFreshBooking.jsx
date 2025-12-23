import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import { useCtmFlightDeals } from "../../context/CtmFlightDealsContext.jsx";
import { NavLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker";
const CtmFreshBooking = () => {
  const { ctmFlightDeals } = useCtmFlightDeals();

  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Filter only "pending" bookings
  const pendingBookings = ctmFlightDeals?.filter(
    (f) => f.bidStatus === "pending"
  );

  // Further filter by search input and date range
  const filteredBookings = pendingBookings?.filter((pnr) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      pnr?.bookingId?.toLowerCase().includes(query) ||
      pnr?.email?.toLowerCase().includes(query) ||
      pnr?.phone?.toLowerCase().includes(query);

    // Handle date filtering
    const departureDate = new Date(pnr?.createdAt);

    console.log("departur", departureDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const inDateRange =
      (!from || departureDate >= from) && (!to || departureDate <= to);

    return matchesSearch && inDateRange;
  });

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">View All Fresh BID</p>
          </div>
          <div className="bid_bg">
            <div className="bid_table">
              <div className="row bid_cont">
                <div className="col-4">
                  <div className="bids_inn_fresh">
                    <label htmlFor="">
                      <img src="/imgs/search-icon.png" />
                      Search by Bid No, Email, or Phone
                    </label>
                    <div className="bids_inn_fresh_in">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bids_inn_fresh">
                    <label htmlFor="">
                      <img src="/imgs/date-icon.png" />
                      Date From
                    </label>
                    <div className="bids_inn_fresh_in">
                      <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        placeholderText="Pick Date"
                        dateFormat="MM-dd-yyyy"
                        className="form-control"
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bids_inn_fresh">
                    <label htmlFor="">
                      <img src="/imgs/date-icon.png" />
                      Date To
                    </label>
                    <div className="bids_inn_fresh_in">
                      <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        placeholderText="Pick Date"
                        dateFormat="MM-dd-yyyy"
                        className="form-control"
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>BID</th>
                      <th>CCH NAME</th>
                      <th>PROVIDER</th>
                      <th>TRAVEL DATE & Time</th>
                      <th>Desti. FROM</th>
                      <th>Desti. TO</th>
                      <th>Transaction Type</th>
                      <th>AGENT</th>
                      <th> DNIS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings?.length > 0 ? (
                      filteredBookings.map((pnr, index) => (
                        <tr key={index}>
                          <td>
                            <div className="bid_numm">
                              {pnr.bookingId}
                              <NavLink
                                to={`/astrivion/details-pnr-flight/${pnr?._id}`}
                                className="view_btn_bid"
                              >
                                View
                              </NavLink>
                            </div>
                          </td>
                          <td>{pnr.cchName}</td>
                          <td>{pnr?.provider.provider}</td>
                          <td>
                            {pnr?.outboundSegments
                              ? new Date(
                                  pnr?.outboundSegments[0]?.departure
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td>{pnr?.outboundSegments[0]?.from}</td>
                          <td>
                            {
                              pnr?.outboundSegments[
                                pnr?.outboundSegments.length - 1
                              ]?.to
                            }
                          </td>
                          <td>
                            <button className="status_crm">
                              {pnr.transactionType}
                            </button>
                          </td>
                          <td>{pnr?.agent?.userName}</td>
                          <td> 
                            {pnr?.dnis}
                            {/* <span
                            className={`text_cap ${
                              pnr.ticketmco === "ticketMco"
                                ? "text-success"
                                : pnr.ticketmco === "underFollowUp"
                                ? "text-warning"
                                : pnr?.ticketmco === "cancelled"
                                ? "text-danger"
                                : "text-warning"
                            }`}
                          >
                            {pnr.ticketmco || "Pending"}
                          </span> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9}>
                          <h5>
                            No results found. Try checking your spelling or
                            using different keywords...
                          </h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CtmFreshBooking;
