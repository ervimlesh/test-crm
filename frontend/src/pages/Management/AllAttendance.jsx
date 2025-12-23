import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllAttendance = async () => {
      try {
  const res = await axios.get("/api/v1/management/hr-attendance");
        setAttendance(res.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching attendance");
      }
    };

    getAllAttendance();
  }, []);

  // Extract unique employees
  const uniqueEmployeesMap = new Map();
  attendance.forEach((record) => {
    const emp = record.employee;
    if (emp && !uniqueEmployeesMap.has(emp._id)) {
      uniqueEmployeesMap.set(emp._id, emp);
    }
  });
  const uniqueEmployees = Array.from(uniqueEmployeesMap.values());

  return (
    <Layout>
      <div className="d-flex w-100">
        <SideBar />
        <div className="p-3 w-100">
          <h2>All Employees</h2>
          {uniqueEmployees.length === 0 ? (
            <p>No employee data available.</p>
          ) : (
            <table className="table table-bordered table-striped mt-2">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uniqueEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.userName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.number}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/ztsPage/single-attendance/${emp._id}`)}
                      >
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllAttendance;
