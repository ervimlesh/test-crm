import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout/Layout.jsx";
import { RxHamburgerMenu } from "react-icons/rx";
import SideBar from "../components/SideBar.jsx";
import { useCtmFlightDeals } from "../context/CtmFlightDealsContext.jsx";
import { useAllTeams } from "../context/AllTeamsContext.jsx";
import { useAuth } from "../context/Auth.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import axios from "axios";
import { getSocket } from "../context/SocketContext.jsx";
import RevenueChart from "../components/RevenueChart.jsx";
import Chatbot from "./Services/Chatbot.jsx";


const Home = () => {
  const { ctmFlightDeals, fetchCtmFlightDeals } = useCtmFlightDeals();
  const { auth, setAuth } = useAuth();
  const { agent, fetchAdmin } = useAllTeams();
  const [todayFlights, setTodayFlights] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const token = auth?.token;

  // ======================= For Realtime data====================================================
  useEffect(() => {
    const socket = getSocket();

    socket.on("newCtmFlightAdded", (data) => {
      if (data.success) {
        fetchCtmFlightDeals();
      }
    });

    socket.on("pnrStatusUpdated", () => {
      fetchCtmFlightDeals();
    });

    socket.on("userUpdated", (data) => {
       if (auth && !auth?.user?._id) return;
      console.log("✅ userUpdated Event triggered...", data);
      fetchAdmin();
    });

    return () => {
      socket.off("newCtmFlightAdded");
      socket.off("pnrStatusUpdated");
      socket.off("userUpdated");
    };
  }, [fetchCtmFlightDeals, fetchAdmin]);

  // =======================End For Realtime data====================================================

  //  Check role & prepare today flights
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

  //  Auto Logout
  useEffect(() => {
    const autoLogout = async () => {
      const storedAuth = localStorage.getItem("auth");
      if (!storedAuth) return;

      try {
        const parsedAuth = JSON.parse(storedAuth);
        const decoded = jwtDecode(parsedAuth.token);
        const expiryTime = decoded.exp * 1000;
        const now = Date.now();

        if (expiryTime <= now) {
          if (token) {
            const res = await axios.put(
              "/api/v1/management/punch-out",
              {},
              {
                headers: { Authorization: token },
              }
            );
            if (!res?.data?.success) {
              toast.error("punchout failed");
            } else {
              toast.success("punchout successfully");
            }
          }
          axios.post("/api/v1/auth/logout", { userId: auth?.user?._id });
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("auth");
          setAuth({ user: null, token: "" });
          navigate("/astrivion-login");
          return;
        }

        const timeout = setTimeout(() => {
          axios.post("/api/v1/auth/logout", { userId: auth?.user?._id });
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("auth");
          setAuth({ user: null, token: "" });
          navigate("/astrivion-login");
        }, expiryTime - now);

        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("JWT decode failed:", err);
      }
    };

    autoLogout();
  }, [setAuth, navigate, token]);

  // ---------------------------Today's Ticket and mco charged----------------------------
  const today = new Date();
  const todayFlightsMco = useMemo(() => {
    return (
      ctmFlightDeals?.filter((pnr) => {
        if (!pnr?.outboundSegments?.length) return false;
        const rawDeparture = pnr.createdAt;
        const departureDate = new Date(rawDeparture);

        return (
          departureDate.getDate() === today.getDate() &&
          departureDate.getMonth() === today.getMonth() &&
          departureDate.getFullYear() === today.getFullYear()
        );
      }) || []
    );
  }, [ctmFlightDeals, today]);

  // -----------------------------------------------------All Ticket and mco charged--------------------------------------

  const currentMonthTaxRevenue = useMemo(() => {
    if (!ctmFlightDeals?.length) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return ctmFlightDeals
      .filter((flight) => {
        if (flight.ticketmco !== "ticketMco") return false;
        const flightDate = new Date(flight.createdAt);
        return (
          flightDate.getMonth() === currentMonth &&
          flightDate.getFullYear() === currentYear
        );
      })
      .reduce((total, flight) => {
        const tax = parseFloat(flight.chargingTaxes) || 0;
        return total + tax;
      }, 0)
      .toFixed(2); // round to 2 decimals
  }, [ctmFlightDeals]);
  const TodayTaxRevenue = useMemo(() => {
    if (!todayFlightsMco?.length) return 0;

    return todayFlightsMco
      .filter((flight) => {
        if (flight.agentFigure !== "yes") return false;

        return true;
      })
      .reduce((total, flight) => {
        const tax = parseFloat(flight.taxes) || 0;
        return total + tax;
      }, 0)
      .toFixed(2); // round to 2 decimals
  }, [ctmFlightDeals]);

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
        
        <Chatbot />
          <NavLink
            to="astrivion/today-flight"
            className="btn btn-success position-fixed"
            style={{ bottom: "20px", right: "160px", zIndex: 1000 }}
          >
            Today's Flight
          </NavLink>

          {/*=======================================Popup For Today's Flight============================== */}

          {showPopup && (
            <div
              className="modal fade show"
              style={{
                width: "100%",
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content rounded shadow">
                  <div className="modal-header">
                    <h5 className="modal-title text-primary">
                      ✈️ Today's Flights
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowPopup(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {todayFlights.length === 0 ? (
                      <p className="text-muted">No flights scheduled today.</p>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table className="min-w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2">BID</th>
                              <th className="border px-4 py-2">CCH NAME</th>
                              <th className="border px-4 py-2">PROVIDER</th>
                              <th className="border px-4 py-2">TRAVEL DATE</th>
                              <th className="border px-4 py-2">FROM</th>
                              <th className="border px-4 py-2">TO</th>
                              <th className="border px-4 py-2">
                                Transaction Type
                              </th>
                              <th className="border px-4 py-2">AGENT</th>
                              <th className="border px-4 py-2">Remark</th>
                              <th className="border px-4 py-2">Activity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {todayFlights
                              ?.slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.updatedAt) - new Date(a.updatedAt)
                              )
                              ?.map((pnr, index) => (
                                <tr key={index}>
                                  <td className="border px-4 py-2">
                                    <NavLink
                                      to={`/ztsPage/details-pnr-flight/${pnr?._id}`}
                                    >
                                      {pnr.bookingId}
                                    </NavLink>
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr.cchName}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr.provider.provider}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr?.outboundSegments
                                      ? new Date(
                                          pnr?.outboundSegments[0]?.departure
                                        ).toLocaleString()
                                      : "N/A"}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr?.outboundSegments[0]?.from}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {
                                      pnr?.outboundSegments[
                                        pnr?.outboundSegments.length - 1
                                      ]?.to
                                    }
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr.transactionType}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr?.agent?.userName}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr?.remarks}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {pnr?.pnrRemark || "fresh booking"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <section className="">
            <div className="header_crm flex_props justify-content-between">
              <p className="crm_title">Overview of All Booking</p>
            </div>

            <div className="all_booking_grid">
              <div className="booking_container_crm relative">
                <NavLink
                  className="booking_head"
                  to="/astrivion/ctm-today-booking"
                >
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/today-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">Today BIDS</p>
                      <p className="font_12">
                        Review today’s BIDS and submit...
                      </p>
                    </div>
                  </div>

                  <div className="booking_body_control">
                    {/* ✅ Badge added here — only addition */}
                    {ctmFlightDeals.filter(
                      (deal) =>
                        new Date(deal.createdAt).toISOString().split("T")[0] ===
                        new Date().toISOString().split("T")[0]
                    ).length > 0 && (
                      <span className="badge bg-danger ms-2">
                        {
                          ctmFlightDeals.filter(
                            (deal) =>
                              new Date(deal.createdAt)
                                .toISOString()
                                .split("T")[0] ===
                              new Date().toISOString().split("T")[0]
                          ).length
                        }
                      </span>
                    )}

                    <p className="booking_num1">
                      {
                        ctmFlightDeals.filter(
                          (deal) =>
                            new Date(deal.createdAt)
                              .toISOString()
                              .split("T")[0] ===
                            new Date().toISOString().split("T")[0]
                        ).length
                      }
                    </p>

                    <p className="booking_t">
                      Bids compiled and submitted for processing
                    </p>
                  </div>

                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>

              <div className="booking_container_crm relative">
                <NavLink
                  className="booking_head"
                  to="/astrivion/ctm-fresh-booking"
                >
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/all-new.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">All New Bids</p>
                      <p className="font_12">
                        Explore all New BIDS published...
                      </p>
                    </div>
                  </div>

                  <div className="booking_body_control">
                    {/* ✅ Added badge — nothing else changed */}
                    {ctmFlightDeals?.filter((f) => f.bidStatus === "pending")
                      .length > 0 && (
                      <span className="badge bg-danger ms-2">
                        {
                          ctmFlightDeals?.filter(
                            (f) => f.bidStatus === "pending"
                          ).length
                        }
                      </span>
                    )}
                    <p className="booking_num1">
                      {
                        ctmFlightDeals?.filter((f) => f.bidStatus === "pending")
                          .length
                      }
                    </p>

                    <p className="booking_t">
                      Fresh bids posted—review without delay
                    </p>
                  </div>

                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>
              <div className="booking_container_crm relative">
                <NavLink
                  className="booking_head"
                  to="/astrivion/all-ctm-booking"
                >
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/booking-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">Total Bids</p>
                      <p className="font_12">Complete list of total BIDS...</p>
                    </div>
                  </div>
                  <div className="booking_body_control">
                    {ctmFlightDeals.length > 0 && (
                      <span className="badge bg-danger ms-2">
                        {ctmFlightDeals.length}
                      </span>
                    )}

                    <p className="booking_num1"> {ctmFlightDeals.length}</p>

                    <p className="booking_t">
                      Complete list of total bids to date
                    </p>
                  </div>

                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>

              <div className="booking_container_crm relative">
                <NavLink className="booking_head" to="/astrivion/active-agent">
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/active-agent-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">Active Agents</p>
                      <p className="font_12">
                        View all agents active right now...
                      </p>
                    </div>
                  </div>
                  <div className="booking_body_control">
                    <p className="booking_num1">
                      {
                        agent?.filter(
                          (f) => f.isTrashed === false && f.isOnline
                        ).length
                      }
                    </p>
                    <p className="booking_t">
                      Currently online and handling live bids
                    </p>
                  </div>
                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>
              <div className="booking_container_crm relative">
                <NavLink className="booking_head" to="/astrivion/all-agents">
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/admins-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">Total Agents</p>
                      <p className="font_12">Active and Registered agents...</p>
                    </div>
                  </div>
                  <div className="booking_body_control">
                    <a className="booking_num1">
                      {
                        agent?.filter(
                          (f) =>
                            f.status === "approved" ||
                            (f.status === "rejectedAgain" &&
                              f.isTrashed === false)
                        ).length
                      }
                    </a>
                    <p className="booking_t">
                      View all active and registered agents listed here
                    </p>
                  </div>
                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>
              <div className="booking_container_crm relative">
                <NavLink
                  className="booking_head"
                  to="/astrivion/ctm-today-revenue"
                >
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/today-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">TODAY'S REVENUE</p>
                      <p className="font_12">
                        Review today’s BIDS and submit...
                      </p>
                    </div>
                  </div>
                  <div className="booking_body_control">
                    <p className="booking_num1">{TodayTaxRevenue}</p>
                    <p className="booking_t">
                      Bids compiled and submitted for processing
                    </p>
                  </div>
                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>
              <div className="booking_container_crm relative">
                <NavLink
                  className="booking_head"
                  to="/astrivion/ctm-all-revenue"
                >
                  <div className="booking_head_all">
                    <div className="booking_img">
                      <img src="/imgs/today-icon.png" />
                    </div>
                    <div className="booking_cont_crm">
                      <p className="booking_num">TOTAL REVENUE</p>
                      <p className="font_12">
                        Review today’s BIDS and submit...
                      </p>
                    </div>
                  </div>
                  <div className="booking_body_control">
                    <p className="booking_num1">{currentMonthTaxRevenue}</p>
                    <p className="booking_t">
                      Bids compiled and submitted for processing
                    </p>
                  </div>
                  <div className="booking_graph_ic">
                    <img src="imgs/graph-icon.png" />
                  </div>
                </NavLink>
              </div>
            </div>
            <hr className="hr_crm" />
            <div className="row">
              <div className="col-12">
                <div>
                  <p className="crm_title">Revenue Via Graph</p>
                  <div className="mt-4">
                    <RevenueChart />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
