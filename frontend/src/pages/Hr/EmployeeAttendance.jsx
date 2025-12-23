import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import axios from "axios";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
  const res = await axios.get(`/api/v1/management/attendance-data/${id}`);
        setAttendance(res.data?.attendance || []);
      } catch (err) {
        console.error("Error fetching attendance", err);
        setMessage("Failed to fetch attendance records");
      }
    };

    fetchAttendance();
  }, [id]);

  const formatSeconds = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const calcDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [inH, inM, inS] = inTime.split(":").map(Number);
    const [outH, outM, outS] = outTime.split(":").map(Number);
    const inSec = inH * 3600 + inM * 60 + inS;
    const outSec = outH * 3600 + outM * 60 + outS;
    return Math.max(0, outSec - inSec);
  };

const downloadExcel = () => {
  const rows = attendance.map((rec, idx) => {
    const firstSession = rec.sessions[0];
    const lastSession = rec.sessions[rec.sessions.length - 1];

    return {
      "S. No": idx + 1,
      "Punch-In Date": new Date(rec.date).toLocaleDateString("en-US"),
      "Punch-In Time": firstSession?.in || "-",
      "Punch-Out Time": lastSession?.out || "-",
      "Total Shift Duration": formatSeconds(rec.totalShiftDuration || 0),
    };
  });

  // Convert JSON to worksheet
  const ws = XLSX.utils.json_to_sheet(rows);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");

  // Write workbook as binary string
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  // Helper: convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Save as Excel
  saveAs(new Blob([s2ab(wbout)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "attendance.xlsx");
};



  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <h2>Attendance Records</h2>
          {message && <p style={{ color: "red" }}>{message}</p>}

          {/* Employee Details */}
          {/* Download Button */}
          <button className="btn btn-success mb-3" onClick={downloadExcel}>
             Download Excel
          </button>
          

          {/* Attendance Summary Table */}
          {attendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>S. No</th>
                  <th>Punch-In Date</th>
                  <th>Punch-In Time</th>
                  <th>Punch-Out Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec, idx) => {
                  const firstSession = rec.sessions[0];
                  const lastSession = rec.sessions[rec.sessions.length - 1];
                  return (
                    <tr key={rec._id}>
                      <td>{idx + 1}</td>
                      <td>
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>{firstSession?.in || "-"}</td>
                      <td>{lastSession?.out || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedRecord(rec)}
                          data-bs-toggle="modal"
                          data-bs-target="#detailsModal"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Modal */}
          <div
            className="modal fade"
            id="detailsModal"
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Attendance Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedRecord ? (
                    <>
                      <p>
                        <b>Date:</b>{" "}
                        {new Date(selectedRecord.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p>
                        <b>Total Shift Duration:</b>{" "}
                        {formatSeconds(selectedRecord.totalShiftDuration || 0)}
                      </p>

                      {/* Sessions */}
                      <h6>Sessions</h6>
                      <table className="table table-bordered table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>In</th>
                            <th>Out</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.sessions.length === 0 ? (
                            <tr>
                              <td colSpan="4">No sessions</td>
                            </tr>
                          ) : (
                            selectedRecord.sessions.map((s, i) => {
                              const dur = calcDuration(s.in, s.out);
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{s.in || "-"}</td>
                                  <td>{s.out || "-"}</td>
                                  <td>{formatSeconds(dur)}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>

                      {/* Breaks */}
                      <h6>Breaks</h6>
                      {["teaBreak1", "lunchBreak", "teaBreak2"].map((brk) => (
                        <div key={brk}>
                          <b>{brk}:</b>
                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>In</th>
                                <th>Out</th>
                                <th>Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedRecord[brk].length === 0 ? (
                                <tr>
                                  <td colSpan="4">No records</td>
                                </tr>
                              ) : (
                                selectedRecord[brk].map((b, j) => {
                                  const dur = calcDuration(b.in, b.out);
                                  return (
                                    <tr key={j}>
                                      <td>{j + 1}</td>
                                      <td>{b.in || "-"}</td>
                                      <td>{b.out || "-"}</td>
                                      <td>{formatSeconds(dur)}</td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No record selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
}; 

export default EmployeeAttendance;
