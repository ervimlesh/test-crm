import React from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useAllTeams } from "../../context/AllTeamsContext.jsx";
import { useEffect } from "react";
import { getSocket } from "../../context/SocketContext.jsx";

const ActiveAgent = () => {
  const { agent,fetchAdmin } = useAllTeams();

    useEffect(() => {
      const socket = getSocket();
  
      socket.on("userUpdated", (data) => {
        console.log("✅ userUpdated Event triggered...", data);
        fetchAdmin();
      });
  
      return () => {
      
        socket.off("userUpdated");
      };
    }, [ fetchAdmin]);

  // Filter active agents
  const activeAgents =
    agent?.filter((f) => f.isTrashed === false && f.role === "agent" && f.isOnline === true) || [];

  return (
    <>
      <Layout>
        <main class="crm_all_body d-flex">
          <SideBar />

          {/* Main Content */}
          <div className="crm_right relative">
            <p className="crm_title">
              No. of Active Agents ({activeAgents.length})
            </p>
            <div className="bid_table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Number</th>
                      <th>Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeAgents.length > 0 ? (
                      activeAgents.map((deal, index) => (
                        <tr key={deal._id}>
                          <td>{index + 1}</td>
                          <td>{deal.userName}</td>
                          <td>{deal.email}</td>
                          <td>{deal.number || "-"}</td>
                          <td>{deal.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <h5>No active agents found</h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default ActiveAgent;
