import React, { useEffect, useState } from "react";
import Layout from "./components/Layout/Layout.jsx";
import SideBar from "./components/SideBar.jsx";
import { useCtmFlightDeals } from "./context/CtmFlightDealsContext.jsx";

const TopPerformance = () => {
  const { ctmFlightDeals, fetchCtmFlightDeals } = useCtmFlightDeals();
  const [performance, setPerformance] = useState([]);
  const [dayPerformers, setDayPerformers] = useState([]);
  const [weekPerformers, setWeekPerformers] = useState([]);
  const [monthPerformers, setMonthPerformers] = useState([]);

  useEffect(() => {
    fetchCtmFlightDeals();
  }, []);

  // Check same day
  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  // Check same week
  const isSameWeek = (targetDate, referenceDate) => {
    const dayOfWeek = referenceDate.getDay(); // Sunday = 0
    const diffToMonday = (dayOfWeek + 6) % 7; // Days from Monday
    const weekStart = new Date(referenceDate);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(referenceDate.getDate() - diffToMonday);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return targetDate >= weekStart && targetDate <= weekEnd;
  };

  // Check same month
  const isSameMonth = (date1, date2) =>
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  useEffect(() => {
    if (!ctmFlightDeals || ctmFlightDeals.length === 0) return;

    const today = new Date();
    const stats = {},
      dayStats = {},
      weekStats = {},
      monthStats = {};
    const agentDetails = {};

    ctmFlightDeals.forEach((deal) => {
      if (deal.agent && deal.createdAt) {
        const dealDate = new Date(deal.createdAt);
        const agentId =
          typeof deal.agent === "object" ? deal.agent._id : deal.agent;

        // Agent details
        if (typeof deal.agent === "object") {
          agentDetails[agentId] = {
            userName: deal.agent.userName,
            userPictures: deal.agent.userPictures,
          };
        }

        // Overall stats
        if (!stats[agentId]) stats[agentId] = { count: 0, totalPrice: 0 };
        stats[agentId].count++;
        stats[agentId].totalPrice += Number(deal?.taxes) || 0;

        // Day stats
        if (isSameDay(today, dealDate)) {
          if (!dayStats[agentId])
            dayStats[agentId] = { count: 0, totalPrice: 0 };
          dayStats[agentId].count++;
          dayStats[agentId].totalPrice += Number(deal?.taxes) || 0;
        }

        // Week stats
        if (isSameWeek(dealDate, today)) {
          if (!weekStats[agentId])
            weekStats[agentId] = { count: 0, totalPrice: 0 };
          weekStats[agentId].count++;
          weekStats[agentId].totalPrice += Number(deal?.taxes) || 0;
        }

        
        if (
          isSameMonth(today, dealDate) &&
          deal?.ticketmco === "ticketMco"
        ) {
          if (!monthStats[agentId])
            monthStats[agentId] = { count: 0, totalPrice: 0 };
          monthStats[agentId].count++;
          monthStats[agentId].totalPrice += Number(deal?.taxes) || 0;
        }
      }
    });

    const toSortedArray = (data) =>
      Object.entries(data)
        .map(([agentId, d]) => ({
          agentId,
          userName: agentDetails[agentId]?.userName || "Unknown",
          userPictures: agentDetails[agentId]?.userPictures || [],
          count: d.count,
          totalPrice: d.totalPrice,
        }))
        .sort((a, b) => b.totalPrice - a.totalPrice);

    setPerformance(toSortedArray(stats));
    setDayPerformers(toSortedArray(dayStats));
    setWeekPerformers(toSortedArray(weekStats));
    setMonthPerformers(toSortedArray(monthStats));
  }, [ctmFlightDeals]);

  const renderPerformerList = (performers) => {
    if (!performers || performers.length === 0)
      return <p>No data available.</p>;
    return (
      <>
        <div className="performer_grid mt-4">
          {performers.slice(0, 3).map((p, index) => (
            <div className="performer_container_main" key={p.agentId}>
              <div className="performer_container text-center relative">
                <div className="performer_img2 relative">
                  {p.userPictures.map((picture, idx) => (
                    <div key={idx}>
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_MAIN_URL
                        }uploads/${picture.img}`}
                        alt="agent"
                      />
                    </div>
                  ))}
                  <div className="rank_cont">
                    <p className="rank_title">#Rank</p>
                    <p>{index + 1}</p>
                  </div>
                  <div className="reward_icon">
                    <img src="/imgs/reward-icon.png" />
                  </div>
                </div>
                <div className="performer_content text-center white">
                  <p className="perf_title">{p.userName}</p>
                  <p className="per_profit">
                    With Avg. of{" "}
                    <span className="profit_title">
                      {p.totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="performer_content_1 text-center">
                <span className="performer_content_1_num">
                  No. Of Booking {p.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <div className="box_crm_tr">
            <p className="title_common_semi">Top Performers of the Day</p>
            {renderPerformerList(dayPerformers)}
          </div>
          <div className="box_crm_tr margin_box_tr">
            <p className="title_common_semi">Top Performers of Week</p>
            {renderPerformerList(weekPerformers)}
          </div>
          <div className="box_crm_tr margin_box_tr">
            <p className="title_common_semi">Top Performers of Current Month</p>
            {renderPerformerList(monthPerformers)}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TopPerformance;
