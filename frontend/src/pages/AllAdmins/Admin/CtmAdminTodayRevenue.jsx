import React, { useMemo, useEffect } from "react";
import { useAuth } from "../../../context/Auth";
import { useCtmFlightDeals } from "../../../context/CtmFlightDealsContext";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar";

import { NavLink, useNavigate, useParams } from "react-router-dom";

const CtmAdminTodayRevenue = () => {
  const { auth } = useAuth();
  const { ctmFlightDeals } = useCtmFlightDeals();
  const today = new Date();

  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (params?.id && auth?.user?._id && auth?.user?._id !== params.id) {
      navigate("*", { replace: true });
    }
  }, [params?.id, auth?.user?._id, navigate]);

  // Filter today's flights
  const todayFlights = useMemo(() => {
    return (
      ctmFlightDeals?.filter((pnr) => {
        if (!pnr?.outboundSegments?.length) return false;
        const rawDeparture = pnr.createdAt;
        const departureDate = new Date(rawDeparture);

        const matchesSearch =
          departureDate.getDate() === today.getDate() &&
          departureDate.getMonth() === today.getMonth() &&
          departureDate.getFullYear() === today.getFullYear();

        const matchesRole = auth?.user?._id
          ? pnr?.agent?._id?.toLowerCase() === auth?.user?._id.toLowerCase()
          : true;

        return matchesSearch && matchesRole;

        // return (
        //   departureDate.getDate() === today.getDate() &&
        //   departureDate.getMonth() === today.getMonth() &&
        //   departureDate.getFullYear() === today.getFullYear()
        // );
      }) || []
    );
  }, [ctmFlightDeals, today]);

  //  Only approved bookings
  const approvedFlights = useMemo(() => {
    return todayFlights.filter((pnr) => pnr?.agentFigure === "yes");
  }, [todayFlights]);

  // Calculate totals for approved flights
  const totals = useMemo(() => {
    return approvedFlights.reduce(
      (acc, pnr) => {
        acc.baseFare += Number(pnr.baseFare || 0);
        acc.taxes += Number(pnr.taxes || 0);
        return acc;
      },
      { baseFare: 0, taxes: 0 }
    );
  }, [approvedFlights]);
  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="header_crm flex_props justify-content-between">
            <p className="crm_title">Today's Revenue</p>
          </div>
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
                    <td>{approvedFlights.length}</td>
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

export default CtmAdminTodayRevenue;
