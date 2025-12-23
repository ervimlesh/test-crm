import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useAuth } from "../../context/Auth.jsx";
import axios from "axios";
import { toUtcDate, toUtcEndOfDay } from "../utils/formatUTC.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ----------------- Helpers -----------------

// Format seconds to HH:mm:ss
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

// Calculate duration in seconds between HH:mm:ss
const calcDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return 0;
  const [inH, inM, inS] = inTime.split(":").map(Number);
  const [outH, outM, outS] = outTime.split(":").map(Number);
  const inSec = inH * 3600 + inM * 60 + inS;
  const outSec = outH * 3600 + outM * 60 + outS;
  return Math.max(0, outSec - inSec);
};

// Calculate live duration for active session/break
const getLiveDuration = (entries = [], storedTotal = 0) => {
  if (!entries?.length) return storedTotal || 0;
  const last = entries[entries.length - 1];
  if (last?.in && !last?.out) {
    const now = new Date();
    const [h, m, s] = last.in.split(":").map(Number);
    const inDate = new Date();
    inDate.setHours(h, m, s, 0);
    return storedTotal + Math.floor((now - inDate) / 1000);
  }
  return storedTotal;
};

// ----------------- Component -----------------

const SingleEmployee = () => {
  const { auth } = useAuth();
  const [record, setRecord] = useState({});
  const [timer, setTimer] = useState(0);
  const [allAttendance, setAllAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch today's record
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/management/today", {
        headers: { Authorization: auth?.token },
      });
      setRecord(res.data);
    } catch {
      toast.error("Failed to fetch data");
    }
  }, [auth?.token]);

  const loginUserAttendance = useCallback(async (from = "", to = "") => {
    try {
      const res = await axios.get("/api/v1/management/login-attendance", {
        params: from && to ? { from, to } : {},
      });
      setAllAttendance(res.data || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Apply filter
  const applyFilter = useCallback(() => {
    loginUserAttendance(toUtcDate(fromDate), toUtcEndOfDay(toDate));
  }, [fromDate, toDate, loginUserAttendance]);

  // Reset filter
  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    loginUserAttendance();
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
    loginUserAttendance();
  }, [fetchData, loginUserAttendance]);

  // Live timer update every second for current shift
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(
        getLiveDuration(record?.sessions, record?.totalShiftDuration || 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [record]);

  // Punch actions
  const punchIn = async (breakType) => {
    try {
      await axios.post(
        "/api/v1/management/punch-in",
        { breakType },
        { headers: { Authorization: auth?.token } }
      );
      toast.success("Punched in!");
      fetchData();
      loginUserAttendance();
    } catch {
      toast.error("Punch in failed");
    }
  };

  const punchOut = async (breakType) => {
    try {
      await axios.put(
        "/api/v1/management/punch-out",
        { breakType },
        { headers: { Authorization: auth?.token } }
      );
      toast.success("Punched out!");
      fetchData();
      loginUserAttendance();
    } catch {
      toast.error("Punch out failed");
    }
  };

  // Disable logic for punch buttons
  const isPunchInDisabled = (breakType) => {
    if (!breakType) {
      const lastSession = record?.sessions?.[record.sessions.length - 1];
      return Boolean(lastSession?.in && !lastSession?.out);
    }
    const breakArr = record?.[breakType];
    // Break can be used only once per day
    if (!breakArr || breakArr.length === 0) return false;
    const lastBreak = breakArr[breakArr.length - 1];
    return Boolean(lastBreak?.in); // disable if already punched in once
  };

  const isPunchOutDisabled = (breakType) => {
    if (!breakType) {
      const lastSession = record?.sessions?.[record.sessions.length - 1];
      return !(lastSession?.in && !lastSession?.out);
    }
    const breakArr = record?.[breakType];
    if (!breakArr || breakArr.length === 0) return true;
    const lastBreak = breakArr[breakArr.length - 1];
    return !(lastBreak?.in && !lastBreak?.out);
  };

  // Render each punch section
  const renderSection = (title, breakType) => {
    let inTime = "--";
    let outTime = "--";
    let totalDuration = 0;
    let displayText = "";

    if (!breakType) {
      const lastSession = record?.sessions?.[record?.sessions?.length - 1];
      if (lastSession) {
        inTime = lastSession?.in || "--";
        outTime = lastSession?.out || "--";
        const isRunning = lastSession?.in && !lastSession?.out;
        totalDuration = record?.sessions?.reduce(
          (acc, s) => acc + calcDuration(s.in, s.out),
          0
        );
        if (isRunning) {
          totalDuration = timer;
          displayText = "Current Shift: ";
        } else {
          displayText = "Total: ";
        }
      }
    } else {
      const breakArr = record?.[breakType];
      const lastBreak = breakArr?.[breakArr?.length - 1];
      if (lastBreak) {
        inTime = lastBreak?.in || "--";
        outTime = lastBreak?.out || "--";
        const isRunning = lastBreak?.in && !lastBreak?.out;
        totalDuration = breakArr?.reduce(
          (acc, s) => acc + calcDuration(s.in, s.out),
          0
        );
        if (isRunning) {
          totalDuration = getLiveDuration(breakArr, totalDuration);
          displayText = "Current Break: ";
        } else {
          displayText = "Total: ";
        }
      }
    }

    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h5>{title}</h5>
            <div className="row mt-3">
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => punchIn(breakType)}
                  disabled={isPunchInDisabled(breakType)}
                >
                  Punch In
                </button>
                <p>{inTime}</p>
              </div>
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => punchOut(breakType)}
                  disabled={isPunchOutDisabled(breakType)}
                >
                  Punch Out
                </button>
                <p>{outTime}</p>
              </div>
            </div>
            <div className="bg-light mt-2 p-2 rounded">
              {displayText} {formatSeconds(totalDuration)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ----------------- Render -----------------
  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="container">
          <h3 className="mb-4">Attendance</h3>

          <div className="row">
            {renderSection("Overall Timing", null)}
            {renderSection("Tea Break 1", "teaBreak1")}
            {renderSection("Lunch Break", "lunchBreak")}
            {renderSection("Tea Break 2", "teaBreak2")}
          </div>

          <h3 className="mt-5">All Attendance Data</h3>

          <div className="table-responsive">
            {/* Filter Section */}
            <div className="mb-4 d-flex gap-3 align-items-center">
              <div>
                <label className="form-label">From:</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div>
                <label className="form-label">To:</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <button className="btn btn-primary mt-4" onClick={applyFilter}>
                Apply Filter
              </button>

              <button className="btn btn-danger mt-4" onClick={resetFilter}>
                Reset
              </button>
            </div>

            <table className="table table-bordered text-center">
              <thead className="thead-dark">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Punch In Time</th>
                  <th>Punch Out Time</th>
                  <th>Overall Time</th>
                  <th>Tea 1</th>
                  <th>Lunch</th>
                  <th>Tea 2</th>
                </tr>
              </thead>
              <tbody>
                {allAttendance?.length > 0 ? (
                  allAttendance.map((att, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{att?.employee?.userName}</td>
                      <td>{att?.employee?.email || "N/A"}</td>
                      <td>
                        {att?.date
                          ? new Date(att.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </td>
                      <td>{att?.sessions?.[0]?.in || "--"}</td>
                      <td>
                        {att?.sessions?.[att?.sessions?.length - 1]?.out ||
                          "--"}
                      </td>
                      <td>
                        {formatSeconds(
                          att?.sessions?.reduce(
                            (acc, s) => acc + calcDuration(s.in, s.out),
                            0
                          )
                        )}
                      </td>
                      <td>
                        {formatSeconds(
                          att?.teaBreak1?.reduce(
                            (acc, b) => acc + calcDuration(b.in, b.out),
                            0
                          )
                        )}
                      </td>
                      <td>
                        {formatSeconds(
                          att?.lunchBreak?.reduce(
                            (acc, b) => acc + calcDuration(b.in, b.out),
                            0
                          )
                        )}
                      </td>
                      <td>
                        {formatSeconds(
                          att?.teaBreak2?.reduce(
                            (acc, b) => acc + calcDuration(b.in, b.out),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">No attendance data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleEmployee;
