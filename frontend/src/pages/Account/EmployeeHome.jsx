// src/pages/EmployeeHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeSlip.css";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useAuth } from "../../context/Auth.jsx";

const EmployeeHome = () => {
  const { auth } = useAuth();
  const [attendance, setAttendance] = useState({}); // {1:'P', 2:'A', ...}
  const [currentDate, setCurrentDate] = useState(new Date());

  const id = auth?.user?._id;

  // get month info
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0=Jan
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `/api/v1/management/attendance-data/${id}?month=${
            month + 1
          }&year=${year}`
        );

        if (res.data.success) {
          const attendanceArray = res.data.attendance;

          // Convert attendance array -> { dayNumber: "P" }
          const attendanceMap = {};
          attendanceArray.forEach((record) => {
            const recordDate = new Date(record.date);

            const recordMonth = recordDate.getMonth();
            const recordYear = recordDate.getFullYear();

            //  Only include records for the selected month & year
            if (recordMonth === month && recordYear === year) {
              const day = recordDate.getDate();

              if (record.sessions[0]?.in) {
                attendanceMap[day] = "P"; // Present
              } else {
                attendanceMap[day] = "A"; // Absent
              }
            }
          });

          setAttendance(attendanceMap);
        } else {
          setAttendance({});
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setAttendance({});
      }
    };

    if (id) fetchAttendance();
  }, [id, month, year]);

  // navigation handlers
  const goToPrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    const today = new Date();
    const isCurrentMonth =
      month === today.getMonth() && year === today.getFullYear();

    if (!isCurrentMonth) {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      );
    }
  };

  return (
    <Layout>
      <div className="crm_all_body d-flex">
        <SideBar />

        <div className="crm_right relative">
          <div className="flex-grow-1 p-4">
            <div className="employee-home">
              <div className="d-flex justify-content-between align-items-center my-3">
                <button className="btn btn-secondary" onClick={goToPrevMonth}>
                  ⬅ Prev
                </button>
                <h2 className="text-center">
                  {monthName} {year} - My Attendance
                </h2>
                <button className="btn btn-secondary" onClick={goToNextMonth}>
                  Next ➡
                </button>
              </div>

              <div className="calendar-grid">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => (
                    <div
                      key={day}
                      className={`day-box ${
                        attendance[day] === "P" ? "present" : "absent"
                      }`}
                    >
                      <span className="day-number">{day}</span>
                      <span className="status">
                        {attendance[day] ? attendance[day] : "A"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeHome;
