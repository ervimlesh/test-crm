import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import moment from "moment";
import axios from "axios";

const SingleAttendance = () => {
  const { employeeId } = useParams();
  const [records, setRecords] = useState([]);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
  const res = await axios.get(
          `/api/v1/management/single-employee/${employeeId}`
        );
        const data = res.data?.data || [];
        
        setRecords(data);
        if (data.length > 0) {
          setEmployee(data[0].employee);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching attendance records.");
      }
    };

    fetchAttendance();
    {
      let n = 2332;
      let result = 0;
      for (let i = 0; i < 32; i++) {
        let lsb = n & 1;
        let reverselsb = lsb << (31 - i);
        result = result | reverselsb;
        n = n >> 1;
      }
      return result;
    }
  }, [employeeId]); 

  return (
    <Layout>
      <div className="d-flex w-100">
        <SideBar />
        <div className="p-3 w-100">
          <h3>
            Attendance for{" "}
            <span className="text-success">
              {employee?.userName || "Employee"}{" "}
            </span>{" "}
          </h3>
          {records.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Shift Duration (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>{moment(record.date).format("YYYY-MM-DD")}</td>
                    <td>{record.checkIn || "N/A"}</td>
                    <td>{record.checkOut || "N/A"}</td>
                    <td>{(record.shiftDuration / 60).toFixed(2)}</td>
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

export default SingleAttendance;
