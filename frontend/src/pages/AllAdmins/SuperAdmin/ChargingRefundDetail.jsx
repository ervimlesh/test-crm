import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import { useAllTeams } from "../../../context/AllTeamsContext.jsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ChargingRefundDetail = () => {
  const { agent } = useAllTeams(); // ✅ Agent list from context

  console.log("Agents:", agent); // Debugging line to check agents
  const [providers, setProviders] = useState([]);
  const [filters, setFilters] = useState({
    agent: "",
    fromDate: null,
    toDate: null,
    transactionType: "",
    provider: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);



  useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      
      try {
        const res = await axios.get("/api/v1/auth/get-all-users");
        setAllUsers(res.data.getAllusers.filter((user) => !user.isTrashed)); // Exclude trashed users
      } catch (err) {
        console.error("Error fetching users:", err);
        
      } finally {
        setLoading(false);
      }
    };

 
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-provider");
        if (res.data.success) setProviders(res.data.booking);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };
    fetchProviders();
  }, []);



  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/ctmFlights/filter-charge-refunds",
        filters
      );
      console.log("Filter Response:", res.data); // Debugging line to check response
      setResults(res.data.data || []);
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <main className="crm_all_body d-flex">
        <SideBar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Charging Refund Details</h3>

          {/* -------------------- FILTERS -------------------- */}
          <div className="row g-3">
            {/* Agent Filter */}
            <div className="col-md-3">
              <label className="form-label">Agent</label>
              <select
                name="agent"
                value={filters.agent}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Agent</option>
                {allUsers &&
                  allUsers.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.userName || a.agentuserName}
                    </option>
                  ))}
              </select>
            </div>

            {/* From Date */}
            <div className="col-md-3">
              <label className="form-label">From</label>
              <DatePicker
                selected={filters.fromDate}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, fromDate: date }))
                }
                placeholderText="Select Date"
                dateFormat="MM-dd-yyyy"
                className="form-control"
                maxDate={new Date()}
              />
            </div>

            {/* To Date */}
            <div className="col-md-3">
              <label className="form-label">To</label>
              <DatePicker
                selected={filters.toDate}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, toDate: date }))
                }
                placeholderText="Select Date"
                dateFormat="MM-dd-yyyy"
                className="form-control"
                maxDate={new Date()}
              />
            </div>

            {/* Transaction Type */}
            <div className="col-md-3">
              <label className="form-label">Transaction Type</label>
              <select
                name="transactionType"
                value={filters.transactionType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select</option>

                <option value="refund">
                  Refund Details
                </option>
                <option value="chargeBackDetails">
                   ChargeBack Details
                </option>
              </select>
            </div>

            {/* Provider */}
            <div className="col-md-3">
              <label className="form-label">Provider</label>
              <select
                name="provider"
                value={filters.provider}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Provider</option>
                {providers
                  .filter((p) => p.providerStatus === "Active")
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.provider}
                    </option>
                  ))}
              </select>
            </div>

            {/* Apply Filter Button */}
            <div className="col-md-3 align-self-end">
              <button
                onClick={handleApplyFilter}
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply Filter"}
              </button>
            </div>
          </div>

          {/* -------------------- RESULTS -------------------- */}
          <div className="mt-4">
            <h5>Results:</h5>
            {loading ? (
              <p>Loading...</p>
            ) : results.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Agent</th>
                    <th>Provider</th>
                    <th>Transaction Type</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, index) => (
                    <tr key={r._id}>
                      <td>{index + 1}</td>
                      <td>{r.agent?.userName || r.agent.userName || "N/A"}</td>
                      <td>{r.provider?.provider || "N/A"}</td>
                      <td>{r.transactionType}</td>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ChargingRefundDetail;
