import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import { useCtmFlightDeals } from "../../context/CtmFlightDealsContext.jsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const CtmTodayBooking = () => {
  const { ctmFlightDeals } = useCtmFlightDeals();

  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useParams();


  const navigate = useNavigate();


  // Filter only today's bookings
  const todayDate = new Date().toISOString().split("T")[0];
  const todayBooking = ctmFlightDeals.filter(
    (deal) => new Date(deal.createdAt).toISOString().split("T")[0] === todayDate
  );

  // Further filter by search input (Bid No, Email, or Phone)
  const filteredBookings = todayBooking.filter((pnr) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      pnr?.bookingId?.toLowerCase().includes(query) ||
      pnr?.email?.toLowerCase().includes(query) ||
      pnr?.phone?.toLowerCase().includes(query);

    const matchesRole = role
      ? pnr?.agent?.role?.toLowerCase() === role.toLowerCase()
      : true;

    return matchesSearch && matchesRole;
  });



const handleShareClick = (pnr) => {
  const bookingText = `
Link: ${window.location.origin}/astrivion/details-pnr-flight/${pnr._id}
  `.trim();

  navigate("/", { state: { bookingText } });
};


  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">All Today BIDS</p>
          </div>
          <div className="bid_bg">
            <div className="bid_table">
              <div>
                {/* 🔍 Search Input */}
                <div className="row bid_cont">
                  <div className="col-12">
                    <div className="bids_inn_fresh bids_inn_fresh_br">
                      <label htmlFor="">
                        <img src="/imgs/search-icon.png" />
                        Search
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Search Field"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* 📋 Table */}
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
                        <th>DNIS</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings
                          ?.slice()
                          .sort(
                            (a, b) =>
                              new Date(b.updatedAt) - new Date(a.updatedAt)
                          )
                          ?.map((pnr, index) => (
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
                              <td>{pnr.provider.provider}</td>
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
                              <td>{pnr?.dnis}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleShareClick(pnr)}
                                >
                                  Share
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="9">No matching bookings found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </Layout>
  );
};

export default CtmTodayBooking;
