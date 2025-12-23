import React, { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar.jsx";
import { useAuth } from "../../../context/Auth.jsx";
import { useCtmFlightDeals } from "../../../context/CtmFlightDealsContext.jsx";

const SuperAdminHome = () => {
  const { auth } = useAuth();
  const { ctmFlightDeals } = useCtmFlightDeals();

  // ---------------------------Today's Ticket and mco charged----------------------------
  const today = new Date();

  const userid = auth?.user?._id || "";
  const userRole = auth?.user?.role;

  // Filter today's flights
  const todayFlightsMco = useMemo(() => {
    return (
      ctmFlightDeals?.filter((pnr) => {
        if (!pnr?.outboundSegments?.length) return false;
        const rawDeparture = pnr.createdAt;
        const departureDate = new Date(rawDeparture);

        return (
          departureDate.getDate() === today.getDate() &&
          departureDate.getMonth() === today.getMonth() &&
          departureDate.getFullYear() === today.getFullYear() &&
          userid === pnr?.agent?._id
        );
      }) || []
    );
  }, [ctmFlightDeals, today]);

  //  Only approved bookings and show total revenue of taxes for all flights today
  let totalRevenueToday = 0;
  todayFlightsMco.forEach((pnr) => {
    if (pnr?.agentFigure === "yes") {
      totalRevenueToday += Number(pnr?.taxes || 0);
    }
  });

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <section className="">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">Overview of All Booking</p>
          </div>

          <div className="all_booking_grid">
            <div className="booking_container_crm relative">
              <NavLink
                className="booking_head"
                to={`/astrivion/ctm-today-booking-admin${auth?.user?._id ? `/${auth.user._id}` : ""}`}
              >
                <div className="booking_head_all">
                  <div className="booking_img">
                    <img src="/imgs/today-icon.png" />
                  </div>
                  <div className="booking_cont_crm">
                    <p className="booking_num">Today BIDS</p>
                    <p className="font_12">Review today’s BIDS and submit...</p>
                  </div>
                </div>
                <div className="booking_body_control">
                  <p className="booking_num1">{todayFlightsMco.length}</p>
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
                to={`/astrivion/ctm-today-revenue-admin${auth?.user?._id ? `/${auth.user._id}` : ""}`}
              >
                <div className="booking_head_all">
                  <div className="booking_img">
                    <img src="/imgs/today-icon.png" />
                  </div>
                  <div className="booking_cont_crm">
                    <p className="booking_num">Today's revenue</p>
                    <p className="font_12">
                      Review today’s revenue and submit...
                    </p>
                  </div>
                </div>
                <div className="booking_body_control">
                  <p className="booking_num1">{totalRevenueToday.toFixed(2)}</p>
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
        </section>
      </main>
    </Layout>
  );
}

export default SuperAdminHome