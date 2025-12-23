import React, { useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";

const CheckInPage = () => {
  const [message, setMessage] = useState("");
  const [isLate, setIsLate] = useState(null);
  const [penalty, setPenalty] = useState(null);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");

  const res = await axios.post("/api/v1/management/checkin");

      setIsLate(res.data.isLate);
      setPenalty(res.data.penaltyAmount);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        "Check-in failed. You may have already checked in or are unauthorized."
      );
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div style={{ padding: "30px", textAlign: "center" }}>
          <h2>Employee Check-In</h2>

          <button
            onClick={handleCheckIn}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Check In
          </button>

          {message && (
            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>Status:</strong> {message}
              </p>
              <p>
                <strong>Late:</strong> {isLate ? "Yes" : "No"}
              </p>
              <p>
                <strong>Penalty:</strong> ₹{penalty}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckInPage;
