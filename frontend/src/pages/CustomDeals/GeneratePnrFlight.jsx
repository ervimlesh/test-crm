import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";
import { NavLink } from "react-router-dom";

const GeneratePnrFlight = () => {
  const [pnrs, setPnrs] = useState([]);

  useEffect(
    () => async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/generatePnrFlight");
        if (res.data.success) {
          setPnrs(res.data.pnrs);
        }
      } catch (error) {
        console.error("Error fetching PNR data:", error);
      }
    },
    []
  );

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">View All New BID</p>
          </div>
          <div className="bid_bg">
            <div className="bid_table">
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
                      <th> Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pnrs.map((pnr, index) => (
                      <tr key={index}>
                        <td>
                          {pnr.bookingId}
                          <NavLink
                            to={`/astrivion/details-pnr-flight/${pnr?._id}`}
                            className="view_btn_bid"
                          >
                            View
                          </NavLink>
                        </td>
                        <td>{pnr.cchName}</td>
                        <td>{pnr.provider}</td>

                        <td>
                          {pnr?.departure
                            ? new Date(pnr.departure).toLocaleDateString()
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
                        <td>{pnr?.agent}</td>

                        <td>{pnr?.remarks}</td>
                      </tr>
                    ))}
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

export default GeneratePnrFlight;
