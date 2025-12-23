import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import axios from "axios";

const AadminRegistrationRequest = () => {
  const [agents, setAllAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlightDeals();
  }, []);

  const fetchFlightDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/auth/agent-request");
      setAllAgents(res.data);
    } catch (error) {
      setError(error.response.message || "Something went wrong ");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    // Get current user from localStorage
    const data = JSON.parse(localStorage.getItem("auth"));
    const approvedBy = data?.user?.email;

    const res = await axios.patch(`/api/v1/auth/status/${id}`, {
      status,
      approvedBy,
    });
    await fetchFlightDeals();
  };
  return (
    <>
      <Layout>
        <main class="crm_all_body d-flex">
          <SideBar />
          {/* Main Content */}
           <div className="crm_right relative">
          <div className="bid_table">
             <p className="crm_title">All Registration Requests</p>
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
                    <th>Approved/Reject By</th>
                  </tr>
                </thead>

                <tbody>
                  {agents ? (
                    <>
                      {agents?.data?.map((deal, index) => (
                        <tr key={deal._id}>
                          <td>{index + 1}</td>
                          <td>{deal.userName}</td>
                          <td>{deal.email}</td>
                          <td>{deal.number || "-"}</td>
                          <td>{deal.role}</td>
                          <td>
                             {deal.status === "pending" ? (
                              <div className="flex_props justify-content-center gap-2">
                                <button
                                  className="btn_status_agent btn_warning"
                                  onClick={() =>
                                    updateStatus(deal._id, "approved")
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn_status_agent"
                                  onClick={() =>
                                    updateStatus(deal._id, "rejected")
                                  }
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <success>
                                {
                                  <button
                                    className={
                                      deal.status === "rejected"
                                        ? "btn_status_agent"
                                        : deal.status === "approved"
                                        ? "btn_status_agent btn_warning"
                                        : ""
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        deal._id,
                                        deal.status === "approved"
                                          ? "rejected"
                                          : "approved"
                                      )
                                    }
                                  >
                                    {deal.status}
                                  </button>
                                }
                              </success>
                            )}
                          </td>

                          <td> {deal?.approvedBy} </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="23" className="text-center">
                        {loading
                          ? "Loading..."
                          : error
                          ? error
                          : "No Users data  available."}
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

export default AadminRegistrationRequest;
