import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useAllTeams } from "../../context/AllTeamsContext.jsx";
 
const AllAgent = () => {
  const { agent } = useAllTeams();
  const [agents, setAgents] = useState([]);
 
  useEffect(() => {
    if (agent) setAgents(agent);
  }, [agent]);
 
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/v1/auth/status/${id}`, { status });
 
      // Instantly update UI without re-fetch
      setAgents((prevAgents) =>
        prevAgents.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
 
  return (
    <Layout>
    <main class="crm_all_body d-flex">
        <SideBar />
 
        {/* Main Content */}
      <div className="crm_right relative">
         <div className="header_crm flex_props justify-content-between">
          <p className="crm_title">All Agents({agents.length})</p>
          </div>
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
                <th>Status</th>
              </tr>
            </thead>
 
            <tbody>
              {agents && agents.length > 0 ? (
                agents.map((deal, index) => (
                  <tr key={deal._id}>
                    <td>{index + 1}</td>
                    <td>{deal.userName}</td>
                    <td>{deal.email}</td>
                    <td>{deal.number || "-"}</td>
                    <td>{deal.role}</td>
                    <td>
                      {deal?.status === "pending" ? (
                        <button
                          className="btn_status_agent"
                          onClick={() => updateStatus(deal._id, "approved")}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          className={
                            deal?.status === "rejected" ||
                            deal?.status === "rejectedAgain"
                              ? "btn_status_agent btn_warning"
                              : "btn_status_agent"
                          }
                          onClick={() =>
                            updateStatus(
                              deal._id,
                              deal.status === "approved"
                                ? "rejectedAgain"
                                : "approved"
                            )
                          }
                        >
                          {deal.status === "approved"
                            ? "Remove Access"
                            : "Grant Access"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="23" className="text-center">
                    <h1>Not available</h1>
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
  );
};
 
export default AllAgent;