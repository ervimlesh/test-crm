import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
  const res = await axios.get("/api/v1/management/employee-data");
        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.log("Error fetching data", err);
        setMessage("Failed to fetch employee records");
      }
    };

    fetchEmployees();
  }, []);

  const handleViewProfile = (employee) => {
    navigate(`/astrivion/employee/profile/${employee._id}`, { state: { employee } });
  };

    const handleViewSlip = (employee) => {
    navigate(`/astrivion/employee/slip/${employee._id}`, { state: { employee } });
  };

  const handleViewAttendance = (id) => {
    navigate(`/astrivion/employee/attendance/${id}`);
  };

  // Apply Filter
  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = records.filter((rec) => {
      if (!rec?.createdAt) return false;
      const empDate = new Date(rec.createdAt);
      return empDate >= from && empDate <= to;
    });

    setFilteredRecords(filtered);
    setApplyFilter(true);
  };

  // Reset Filter
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setApplyFilter(false);
    setFilteredRecords([]);
  };

  // Decide which data to show
  const dataToShow = applyFilter ? filteredRecords : records;

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <div style={{ padding: "30px" }}>
            <h2 className="mb-4"> Management</h2>
            {message && <p style={{ color: "red" }}>{message}</p>}

            {/* Date Filter Section */}
            <div className="mb-4 d-flex gap-3 align-items-center">
              <div>
                <label className="form-label">From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label className="form-label">To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <button className="btn btn-primary mt-4" onClick={handleApplyFilter}>
                Apply Filter
              </button>
              <button className="btn btn-danger mt-4" onClick={handleReset}>
                Reset
              </button>
            </div>

            {/* Employee Table */}
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Employee Role</th>
                  <th>View Profile</th>
                  <th>View Attendance</th>
                  <th>Status</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {dataToShow.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No employee records found.
                    </td>
                  </tr>
                ) : (
                  dataToShow.map((rec, idx) => (
                    <tr key={rec._id}>
                      <td>{idx + 1}</td>
                      <td>{rec?.userName}</td>
                      <td>{rec?.email}</td>
                      <td>{rec?.role}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewProfile(rec)}
                        >
                          View Profile
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleViewAttendance(rec?._id)}
                        >
                          View Attendance
                        </button>
                         <button
                          className="btn btn-primary btn-sm text-center mt-1"
                          onClick={() => handleViewSlip(rec)}
                        >
                          Create Slips
                        </button>
                      </td>
                      <td>
                        {rec?.status === "approved" ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>
                      <td>{rec?.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;
