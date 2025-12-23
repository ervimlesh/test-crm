import React from "react";
import { useCtmFlightDeals } from "../../../context/CtmFlightDealsContext";
import { useEffect } from "react";
import { useAuth } from "../../../context/Auth";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar";

const TodayFlight = () => {
  const { ctmFlightDeals, fetchCtmFlightDeals } = useCtmFlightDeals();
  const [todayFlights, setTodayFlights] = useState([]);
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    if (!auth?.user) return;
    const userRole = auth.user.role?.toLowerCase();

    if (userRole === "admin" || userRole === "superadmin") {
      const today = new Date();
      const todayString = today.toLocaleDateString("en-CA");

      const flightsToday = ctmFlightDeals.filter((deal) => {
        if (!deal?.outboundSegments?.length) return false;

        const rawDeparture = deal.outboundSegments[0].departure;
        const depDateObj = new Date(rawDeparture);

        const depDate = depDateObj.toLocaleDateString("en-CA");

        const matched = depDate === todayString;
        return matched;
      });

      if (flightsToday.length > 0) {
        setTodayFlights(flightsToday);
      }
    }
  }, [auth, ctmFlightDeals]);

  useEffect(() => {
    if (auth?.user) {
      fetchCtmFlightDeals && fetchCtmFlightDeals();
    }
  }, [auth]);

  return (
    <>
      <Layout>
        <main class="crm_all_body d-flex">
          <SideBar />
          <div className="modal-body mt-5">
            {todayFlights.length === 0 ? (
              <p className="text-muted text-center py-3">
                No flights scheduled today.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle table-bordered">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>BID</th>
                      <th>CCH NAME</th>
                      <th>PROVIDER</th>
                      <th>TRAVEL DATE</th>
                      <th>FROM</th>
                      <th>TO</th>
                      <th>Transaction Type</th>
                      <th>AGENT</th>
                      <th>Remark</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayFlights
                      ?.slice()
                      .sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                      )
                      ?.map((pnr, index) => (
                        <tr key={index}>
                          <td>
                            <NavLink
                              to={`/ztsPage/details-pnr-flight/${pnr?._id}`}
                              className="text-primary text-decoration-underline fw-semibold"
                            >
                              {pnr.bookingId}
                            </NavLink>
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
                            <span className="badge bg-info text-dark">
                              {pnr.transactionType}
                            </span>
                          </td>
                          <td>{pnr?.agent?.userName}</td>
                          <td>{pnr?.remarks}</td>
                          <td>
                            <span
                              className={`badge ${
                                pnr?.pnrRemark ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {pnr?.pnrRemark || "fresh booking"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
};

export default TodayFlight;
