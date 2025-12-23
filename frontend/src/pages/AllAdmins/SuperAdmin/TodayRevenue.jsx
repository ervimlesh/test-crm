import React, { useMemo } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import { useCtmFlightDeals } from "../../../context/CtmFlightDealsContext.jsx";
import { useParams } from "react-router-dom";

const TodayRevenue = () => {
  const { ctmFlightDeals } = useCtmFlightDeals();
  const { role } = useParams();
  const today = new Date();

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

        const matchesRole = role
          ? pnr?.agent?.role?.toLowerCase() === role.toLowerCase()
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
  // const approvedFlights = useMemo(() => {
  //   return todayFlights.filter((pnr) => pnr?.agentFigure === "yes");
  // }, [todayFlights]);

  // Calculate totals for approved flights
  const totals = useMemo(() => {
    return todayFlights.reduce(
      (acc, pnr) => {
        acc.baseFare += Number(pnr.baseFare || 0);
        acc.taxes += Number(pnr.taxes || 0);
        return acc;
      },
      { baseFare: 0, taxes: 0 }
    );
  }, [todayFlights]);


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
                    <td>{todayFlights.length}</td>
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

export default TodayRevenue;
