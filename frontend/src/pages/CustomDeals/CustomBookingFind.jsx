import React, { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useCtmFlightDeals } from "../../context/CtmFlightDealsContext.jsx";
import { NavLink } from "react-router-dom";

const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};
// fun(int nums,index, int count,int k,int dp)

const getFieldValue = (deal, key) => {
  switch (key) {
    case "bid":
      return deal?.bookingId || "";
    case "cchname":
      return deal?.cchName || "";
    case "email":
      return deal?.email || "";
    case "billingphone":
      return deal?.contactNumber || "";
    case "cardlast4":
      return deal?.cardNumber?.slice(-4) || "";
    case "provider":
      return deal?.provider || "";
    case "bidstatus":
      return deal?.bidStatus || "";
    case "date":
      return formatDate(deal?.outboundSegments?.[0]?.departure);

    case "from":
      return [
        ...(deal?.outboundSegments || []).map((seg) => seg.from),
        ...(deal?.inboundSegments || []).map((seg) => seg.from),
      ].join(", ");

    case "to":
      return [
        ...(deal?.outboundSegments || []).map((seg) => seg.to),
        ...(deal?.inboundSegments || []).map((seg) => seg.to),
      ].join(", ");

    case "alloc":
      return [
        ...(deal?.outboundSegments || []).map((seg) => seg.alLocator),
        ...(deal?.inboundSegments || []).map((seg) => seg.alLocator),
      ].join(", ");

    case "ticketnumber":
      return (deal?.passengerDetails || [])
        .map((p) => p.ticketNumber)
        .join(", ");

    default:
      return "";
  }
};

const CustomBookingFind = () => {
  const { ctmFlightDeals } = useCtmFlightDeals();

  const [searchKey, setSearchKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(() => {
    setSearchValue(inputValue.trim());
    setHasSearched(true);
  }, [inputValue]);

  const filteredData = useMemo(() => {
    if (!hasSearched || !searchKey || !searchValue) return [];

    return ctmFlightDeals.filter((deal) => {
      const fieldValue = getFieldValue(deal, searchKey);
      return fieldValue
        .toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
  }, [ctmFlightDeals, searchKey, searchValue, hasSearched]);

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          {/* 🔹 Search Section */}
          <div className="margin_minus_b">
            <div className="box_crm_tr margin_box_tr">
              <p class="title_common_semi">Find Booking</p>
              <div className="box_crm_input mt-4">
                <select
                  className="form-select box_crm_input_all"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                >
                  <option value="">------- Select Search Key -------</option>
                  <option value="bid">BID</option>
                  <option value="cchname">CCH NAME</option>
                  <option value="email">EMAIL</option>
                  <option value="billingphone">BILLING PHONE</option>
                  <option value="cardlast4">CARD LAST 4 DIGIT</option>
                  <option value="provider">Provider</option>
                  <option value="bidstatus">BID Status</option>
                  <option value="date">Departure Date</option>
                  <option value="alloc">AL Locator</option>
                  <option value="ticketnumber">Ticket Number</option>
                  <option value="from">From</option>
                  <option value="to">To</option>
                </select>
              </div>
              <div className="box_crm_input mt-4">
                <input
                  type="text"
                  className="form-control box_crm_input_all"
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!searchKey}
                />
              </div>
              <div className="mt-3 find_booking_btn">
                <button className="create_bid w-100" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* 🔹 Results Section */}
          {filteredData.length > 0 ? (
            <>
              <hr className="my-5 hr_h1" />
              <h4 className="crm_title">Searched Data</h4>
              <div className="bid_table mt-4">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>BID</th>
                        <th>CCH NAME</th>

                        <th>PROVIDER</th>
                        <th>BOOKING STATUS</th>
                        <th>TRAVEL DATE</th>
                        <th>FROM</th>
                        <th>TO</th>
                        <th>Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((deal) => (
                        <tr key={deal?._id}>
                          <td>
                            
                             <div className="bid_numm">
                              {deal.bookingId}
                              <NavLink
                                to={`/astrivion/details-pnr-flight/${deal?._id}`}
                                className="view_btn_bid"
                              >
                                View
                              </NavLink>
                            </div>
                          </td>
                          <td>{deal?.cchName || "-"}</td>
                          <td>{deal?.provider || "-"}</td>
                          <td>{deal?.bidStatus || "-"}</td>
                          <td>
                            {formatDate(deal?.outboundSegments?.[0]?.departure)}
                          </td>

                          {/* FROM */}
                          <td>
                            {deal?.outboundSegments?.length > 0 && (
                              <div>
                                <p className="segment_span_semi">
                                  OutBound Flight From
                                </p>
                                {deal.outboundSegments[0].from}
                              </div>
                            )}
                                {deal?.inboundSegments?.length > 0 && (
                              <div>
                                <p className="segment_span_semi">
                                  InBound Flight From
                                </p>
                                 {deal.inboundSegments[0].from}
                              </div>
                            )}
                          </td>

                          {/* TO */}
                          <td>
                          
                            {deal?.outboundSegments?.length > 0 && (
                              <div>
                                <p className="segment_span_semi">
                                 OutBound Flight To
                                </p>
                                {
                                  deal?.outboundSegments?.[
                                    deal.outboundSegments.length - 1
                                  ]?.to
                                }
                              </div>
                            )}
                            {deal?.inboundSegments?.length > 0 && (
                              <div>
                                <p className="segment_span_semi">
                                 InBound Flight To
                                </p>
                               {
                                  deal?.inboundSegments?.[
                                    deal.inboundSegments.length - 1
                                  ]?.to
                                }
                              </div>
                            )}
                          </td>

                          <td>{deal?.chargedBy}</td>
                          {console.log('heeeeeeee',deal)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : hasSearched ? (
            <span>No data found</span>
          ) : null}
        </div>
      </main>
    </Layout>
  );
};

export default React.memo(CustomBookingFind);
