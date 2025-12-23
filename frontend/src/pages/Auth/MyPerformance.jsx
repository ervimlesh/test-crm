import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useCtmFlightDeals } from "../../context/CtmFlightDealsContext.jsx";
import DatePicker from "react-datepicker";
import { useAllTeams } from "../../context/AllTeamsContext.jsx";
import { toUtcDate, toUtcEndOfDay } from "../utils/formatUTC.jsx";

const MyPerformance = () => {
  const { agent } = useAllTeams();
  const { ctmFlightDeals, fetchCtmFlightDeals } = useCtmFlightDeals();

  const [myStats, setMyStats] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [applyFilter, setApplyFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("");

  // NEW states for the two filters requested
  const [bidStatusFilter, setBidStatusFilter] = useState(""); 
  const [transactionFilter, setTransactionFilter] = useState(""); 

  const userData = useMemo(() => {
    const userRole = localStorage.getItem("auth");
    const parsedUserRole = userRole ? JSON.parse(userRole) : null;
    return parsedUserRole?.user;
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCtmFlightDeals().finally(() => setLoading(false));
  }, []);

  console.log("CTM Flight Deals:", ctmFlightDeals);

  useEffect(() => {
    if (!userData || !ctmFlightDeals?.length) return;

    let count = 0;
    let totalPrice = 0;
    let pictures = [];

    ctmFlightDeals.forEach((deal) => {
      if (!deal?.agent) return;

      const agentId =
        typeof deal.agent === "object" ? deal.agent._id : deal.agent;

      if (
        selectedAgent ? agentId === selectedAgent : agentId === userData._id
      ) {
        count += 1;
        totalPrice += Number(deal?.taxes) || 0;

        if (
          typeof deal.agent === "object" &&
          Array.isArray(deal.agent.userPictures)
        ) {
          pictures.push(...deal.agent.userPictures);
        }
      }
    });

    setMyStats({
      userName: selectedAgent
        ? agent.find((a) => a._id === selectedAgent)?.userName || "Agent"
        : userData.userName || "You",
      userPictures: pictures,
      count,
      totalPrice,
    });
  }, [ctmFlightDeals, userData?._id, userData?.userName, selectedAgent, agent]);

  // Helper to check if a transaction object exists and is non-empty
  const hasTransactionObject = (deal, key) => {
    if (!key) return true; // no filter on transaction
    const obj = deal?.[key];
    if (!obj) return false;
    // If object has _id (mongoose doc) consider it present
    if (obj._id) return true;
    // Otherwise check keys length
    if (typeof obj === "object" && Object.keys(obj).length > 0) return true;
    // Also if it's a string (rare), check truthiness
    if (typeof obj === "string" && obj.trim() !== "") return true;
    return false;
  };


  const handleApplyFilter = () => {
  const fromUTC = fromDate ? toUtcDate(fromDate) : null;
  const toUTC = toDate ? toUtcEndOfDay(toDate) : null;

  const filtered = (ctmFlightDeals || []).filter((deal) => {
    const agentId =
      typeof deal.agent === "object" ? deal.agent._id : deal.agent;

    const matchAgent = selectedAgent
      ? agentId === selectedAgent
      : agentId === userData._id;

    if (!matchAgent) return false;

    // --- APPLY DATE FILTER ONLY IF VALUES SELECTED ---
    if (fromUTC && toUTC) {
      const dealUTC = new Date(deal.createdAt);
      if (!(dealUTC >= fromUTC && dealUTC <= toUTC)) return false;
    }

    // --- BID STATUS filter ---
    if (bidStatusFilter) {
      if (bidStatusFilter === "ticketMco") {
        if (!deal?.ticketmco !== "ticketMco" || String(deal.ticketmco).trim() === "") return false;
      } else if (bidStatusFilter === "cancelled") {
        if (String(deal.ticketmco) !== "cancelled") return false;
      } else if (bidStatusFilter === "underFollowUp") {
        if (String(deal.ticketmco) !== "underFollowUp") return false;
      } else {
        if (String(deal.bidStatus) !== String(bidStatusFilter)) return false;
      }
    }

    // --- TRANSACTION TYPE filter ---
    if (transactionFilter) {
      if (!hasTransactionObject(deal, transactionFilter)) return false;
    }

    return true;
  });

  let count = filtered.length;
  let totalPrice = filtered.reduce((sum, d) => sum + Number(d.taxes || 0), 0);

  setFilteredDeals(filtered);
  setMyStats((prev) => ({
    ...prev,
    count,
    totalPrice,
  }));

  setApplyFilter(true);
};


  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setApplyFilter(false);
    setSelectedAgent("");
    setBidStatusFilter("");
    setTransactionFilter("");
    setFilteredDeals([]);
    fetchCtmFlightDeals(); // refetch original data to restore stats
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <h2 className="mb-4">My Performance</h2>
            <p>Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title mb_3">My Performance</p>
          </div>

          {/* 🔹 Filter Section */}
          <div className="bid_bg">
            <div className="bid_table">
              <div className="row bid_cont">
                {/* From UTC DateTime */}
                <div className="col-5">
                  <div className="bids_inn_fresh">
                    <label>
                      <img src="/imgs/date-icon.png" alt="from" /> From
                    </label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      placeholderText="Select From Date "
                      showTimeSelect
                      timeFormat="HH:mm"
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      className="form-control"
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                

                {/* To UTC DateTime */}
                <div className="col-5">
                  <div className="bids_inn_fresh">
                    <label>
                      <img src="/imgs/date-icon.png" alt="to" /> To
                    </label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      placeholderText="Select To Date "
                      showTimeSelect
                      timeFormat="HH:mm"
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      className="form-control"
                      maxDate={new Date()}
                    />
                  </div>
                </div>

                {/* Agent Filter */}
                <div className="col-5">
                  <div className="bids_inn_fresh">
                    <label>
                      <img src="/imgs/date-icon.png" alt="agent" /> Agent
                    </label>
                    <select
                      className="form-control"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      <option value="">Select Agent</option>
                      {agent.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bid Status Filter */}
                <div className="col-5">
                  <div className="bids_inn_fresh">
                    <label>
                      <img src="/imgs/date-icon.png" alt="bidStatus" /> Bid
                      Status
                    </label>
                    <select
                      className="form-control"
                      value={bidStatusFilter}
                      onChange={(e) => setBidStatusFilter(e.target.value)}
                    >
                      <option value=""> Select Bid Status </option>
                      <option value="pending"> pending </option>

                      <option value="cancelled"> cancelled </option>

                      <option value="rejected"> rejected </option>
                      {/* special option: check existence of ticketmco */}
                      <option value="ticketMco"> ticketMco </option>
                      <option value="underFollowUp"> underFollowUp </option>
                    </select>
                  </div>
                </div>

                {/* Transaction Type Filter */}
                <div className="col-5">
                  <div className="bids_inn_fresh">
                    <label>
                      <img src="/imgs/date-icon.png" alt="txn" /> Transaction
                      Type
                    </label>
                    <select
                      className="form-control"
                      value={transactionFilter}
                      onChange={(e) => setTransactionFilter(e.target.value)}
                    >
                      <option value=""> Select Transaction Type </option>
                      <option value="refund"> Refund Details </option>
                      <option value="chargeBackDetails">
                        {" "}
                        ChargeBack Details{" "}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Apply / Reset */}
                <div className="col-2 ps-2">
                  <div className="row">
                    <div className="col-5 pe-1">
                      <button
                        className="btn_apply apply_filter"
                        onClick={handleApplyFilter}
                      >
                        Apply
                      </button>
                    </div>
                    <div className="col-5 ps-1">
                      <button
                        className="btn_apply reset_btn"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔹 Data Table Section */}
              {/* Data Table Section */}
              <div className="bid_table">
                {applyFilter ? (
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>PNR Status</th>
                          <th>Bid Status</th>
                          <th>Refund</th>
                          <th>ChargeBack</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeals.length > 0 ? (
                          filteredDeals.map((d, i) => (
                            <tr key={i}>
                              <td>{d.bookingId}</td>
                              <td>{d.pnrStatus}</td>
                              <td>{d.bidStatus}</td>
                              <td>{d.refund?._id ? "Yes" : "No"}</td>
                              <td>{d.chargeBackDetails?._id ? "Yes" : "No"}</td>
                              <td>₹{Number(d.taxes || 0).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No Booking Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>hei</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default MyPerformance;
