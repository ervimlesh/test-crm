import React, { useMemo, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import { useCtmFlightDeals } from "../../../context/CtmFlightDealsContext.jsx";
import DatePicker from "react-datepicker";

const AllRevenue = () => {
  const { ctmFlightDeals } = useCtmFlightDeals();

  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    return { start, end };
  };
 
  const { start, end } = getCurrentMonthRange();
  // State for date filters
  const [fromDate, setFromDate] = useState(start);
  const [toDate, setToDate] = useState(end);
  const [transactionType, setTransactionType] = useState({
    transactionType: "",
  });
 
  // Applied filter states
  const [appliedFromDate, setAppliedFromDate] = useState(start);
  const [appliedToDate, setAppliedToDate] = useState(end);
  const [appliedTransactionType, setAppliedTransactionType] = useState("");

  //  Filter only bookings where latest bid-status-update has ticketmco = "ticketMco"
  const approvedFlights = useMemo(() => {
    return ctmFlightDeals.filter((pnr) => {
      if (!Array.isArray(pnr.logActivity)) return false;

      // get only bid-status-update logs
      const bidLogs = pnr.logActivity.filter(
        (log) => log.type === "bid-status-update"
      );

      if (bidLogs.length === 0) return false;

      // get latest by updatedAt
      const latestLog = bidLogs.reduce((latest, log) =>
        new Date(log.updatedAt) > new Date(latest.updatedAt) ? log : latest
      );

      return latestLog?.data?.ticketmco === "ticketMco";
    });
  }, [ctmFlightDeals]);

  console.log("approvedFlights", approvedFlights);

  //  Apply both date and transaction type filters
  const filteredByDateAndTransaction = useMemo(() => {
    return approvedFlights.filter((pnr) => {
      // --- DATE FILTER ---
      const bidLogs = pnr.logActivity.filter(
        (log) => log.type === "bid-status-update"
      );
      if (bidLogs.length === 0) return false;

      const latestLog = bidLogs.reduce((latest, log) =>
        new Date(log.updatedAt) > new Date(latest.updatedAt) ? log : latest
      );

      const flightDate = new Date(latestLog.updatedAt);
      const from = appliedFromDate ? new Date(appliedFromDate) : null;
      const to = appliedToDate ? new Date(appliedToDate) : null;

      const sameOrAfterFrom =
        !from ||
        flightDate.getFullYear() > from.getFullYear() ||
        (flightDate.getFullYear() === from.getFullYear() &&
          flightDate.getMonth() > from.getMonth()) ||
        (flightDate.getFullYear() === from.getFullYear() &&
          flightDate.getMonth() === from.getMonth() &&
          flightDate.getDate() >= from.getDate());

      const sameOrBeforeTo =
        !to ||
        flightDate.getFullYear() < to.getFullYear() ||
        (flightDate.getFullYear() === to.getFullYear() &&
          flightDate.getMonth() < to.getMonth()) ||
        (flightDate.getFullYear() === to.getFullYear() &&
          flightDate.getMonth() === to.getMonth() &&
          flightDate.getDate() <= to.getDate());

      const dateMatch = sameOrAfterFrom && sameOrBeforeTo;

      // --- TRANSACTION TYPE FILTER ---
      const transactionMatch =
        !appliedTransactionType ||
        pnr.transactionType === appliedTransactionType;

      return dateMatch && transactionMatch;
    });
  }, [approvedFlights, appliedFromDate, appliedToDate, appliedTransactionType]);

  //  Calculate totals from filtered data
  const totals = useMemo(() => {
    return filteredByDateAndTransaction.reduce(
      (acc, pnr) => {
        acc.baseFare += Number(pnr.baseFare || 0);
        acc.taxes += Number(pnr.taxes || 0);
        return acc;
      },
      { baseFare: 0, taxes: 0 }
    );
  }, [filteredByDateAndTransaction]);

  // Apply button handler
  const handleApplyFilter = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedTransactionType(transactionType.transactionType);
  };

  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">Total Revenue</p>
          </div>

          {/* Date + Transaction Type filter UI */}
          <div className="mt-3 mb-2">
            <div className="row bid_cont">
              <div className="col-3">
                <div className="bids_inn_fresh">
                  <label>
                    <img src="/imgs/search-icon.png" />
                    From Date
                  </label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    placeholderText="Enter Pickup Date"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                    maxDate={new Date()}
                    name="fromDate"
                    id="start-date"
                  />
                </div>
              </div>

              <div className="col-3">
                <div className="bids_inn_fresh">
                  <label>
                    <img src="/imgs/date-icon.png" /> To Date
                  </label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    placeholderText="Enter Pickup Date"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                    name="toDate"
                    id="end-date"
                  />
                </div>
              </div>

              <div className="col-3">
                <div className="bids_inn_fresh">
                   <div className="bids_inn_fresh_in">
                    <label>Transaction Type</label>
                    <div className="select_minus">
                    <select
                      value={transactionType.transactionType}
                      className="form-select"
                      onChange={(e) =>
                        setTransactionType((prev) => ({
                          ...prev,
                          transactionType: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="newBooking">New Booking</option>
                      <option value="exchange">Exchange</option>
                      <option value="seatAssignments">Seat Assignments</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="cancellationRefund">
                        Cancellation for Refund
                      </option>
                      <option value="cancellationFutureCredit">
                        Cancellation for Future Credit
                      </option>
                      <option value="extraAddOn">Extra Add On</option>
                      <option value="ticketIssuance">Ticket Issuance</option>
                    </select>
                    </div>
                    </div>
                 
                </div>
              </div>

              <div className="col-2">
                <div className="bids_inn_fresh1">
                  <button
                    onClick={handleApplyFilter}
                    className="apply_btn_filter"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bid_table">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Total Approved Bookings</th>
                    <th>Total Base Fares</th>
                    <th>Total Taxes & Fees</th>
                    <th>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{filteredByDateAndTransaction.length}</td>
                    <td>${totals.baseFare}</td>
                    <td>${totals.taxes}</td>
                    <td>${totals.baseFare + totals.taxes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AllRevenue;
