import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

const PopFlightDeals = ({
  flightDealsPop,
  deals,
  onClose,
  fetchFlightDeals,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    deals.status || "Select Status"
  );

  if (!flightDealsPop || !deals) return null;

  const formattedCreatedAt = deals.createdAt
    ? new Date(deals.createdAt).toLocaleString()
    : "N/A";

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Flight Details", 10, 10);
    doc.text(`Booking ID: ${deals.bookingId || "N/A"}`, 10, 20);
    doc.text(`First Name: ${deals.firstName || "N/A"}`, 10, 30);
    doc.text(`Mobile: ${deals.mobile || "N/A"}`, 10, 40);
    doc.text(`Email: ${deals.email || "N/A"}`, 10, 50);
    doc.text(`Card Holder Name: ${deals.cardHolderName || "N/A"}`, 10, 60);
    doc.text(`Card Number: ${deals.cardNumber || "N/A"}`, 10, 70);
    doc.text(`City: ${deals.city || "N/A"}`, 10, 80);
    doc.text(`Country: ${deals.country || "N/A"}`, 10, 90);
    doc.text(`Adult: ${deals.adt || "N/A"}`, 10, 100);
    doc.text(`Infant: ${deals.ift || "N/A"}`, 10, 110);
    doc.text(`Currency: ${deals.currency || "N/A"}`, 10, 130);
    doc.text(`DOB: ${deals.dob || "N/A"}`, 10, 140);
    doc.text(
      `From: ${deals?.flight?.cityFrom || "N/A"} (${
        deals?.flight?.flyFrom || "N/A"
      })`,
      10,
      150
    );
    doc.text(
      `To: ${deals?.flight?.cityTo || "N/A"} (${
        deals?.flight?.flyTo || "N/A"
      })`,
      10,
      160
    );
    doc.text(`Price: ${deals?.flight?.price || "N/A"}`, 10, 170);
    doc.text(`Postal Code: ${deals.postalCode || "N/A"}`, 10, 180);
    doc.text(`State: ${deals.state || "N/A"}`, 10, 190);
    doc.text(`Total Amount: ${deals.totalAmount || "N/A"}`, 10, 200);
    doc.text(`Status: ${deals.status || "N/A"}`, 10, 210);
    doc.text(`Created At: ${formattedCreatedAt}`, 10, 120);

    doc.save(`FlightDetails_${deals.bookingId || "N/A"}.pdf`);
  };

  const updateStatus = async (id) => {
    const data = JSON.parse(localStorage.getItem("auth"));
    const approvedBy = data?.user?.userName;
    console.log(data);
    try {
      const res = await axios.patch(`/api/v1/flights/status/${id}`, {
        status: selectedStatus,
        approvedBy,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
        await fetchFlightDeals();
        if (deals._id === id) {
          deals.status = selectedStatus;
        }
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status!");
    }
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content" id="printable-popup">
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          <h2>Flight Details</h2>
          <p>
            <strong>Booking ID:</strong> {deals.bookingId}
          </p>
          <p>
            <strong>First Name:</strong> {deals.firstName}
          </p>
          <p>
            <strong>Mobile:</strong> {deals.mobile}
          </p>
          <p>
            <strong>Email:</strong> {deals.email}
          </p>
          <p>
            <strong>Card Holder Name:</strong> {deals.cardHolderName}
          </p>
          <p>
            <strong>Card Number:</strong> {deals.cardNumber}
          </p>
          <p>
            <strong>City:</strong> {deals.city}
          </p>
          <p>
            <strong>Country:</strong> {deals.country}
          </p>
          <p>
            <strong>Adult:</strong> {deals.adt}
          </p>
          <p>
            <strong>Infant:</strong> {deals?.ift}
          </p>
          <p>
            <strong>Currency:</strong> {deals.currency}
          </p>
          <p>
            <strong>DOB:</strong> {deals.dob}
          </p>
          <p>
            <strong>From:</strong> {deals?.flight?.cityFrom}(
            {deals?.flight?.flyFrom})
          </p>
          <p>
            <strong>To:</strong> {deals?.flight?.cityTo}({deals?.flight?.flyTo})
          </p>
          <p>
            <strong>Price:</strong> {deals?.flight?.price}
          </p>
          <p>
            <strong>Postal Code:</strong> {deals.postalCode}
          </p>
          <p>
            <strong>State:</strong> {deals.state}
          </p>
          <p>
            <strong>Total Amount:</strong> {deals.totalAmount}
          </p>
          <p>
            <strong>Status:</strong> {deals.status}
          </p>
          <p>
            <strong>Created At:</strong> {formattedCreatedAt}
          </p>

          {deals.status === "newBooking" ? (
            <>
              <div>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle btn-sm"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedStatus}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSelectStatus("approved")}
                      >
                        Approve
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSelectStatus("rejected")}
                      >
                        Reject
                      </button>
                    </li>
                  </ul>
                </div>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => updateStatus(deals._id)}
                >
                  Update Status
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-info"
                onClick={async () => {
                  try {
                    const data = JSON.parse(localStorage.getItem("auth"));
                    const approvedBy = data?.user?.userName;
                    const res = await axios.patch(
                      `/api/v1/flights/status/${deals._id}`,
                      {
                        status: "newBooking",
                        approvedBy,
                      }
                    );
                    if (res && res.data.success) {
                      toast.success(res.data.message);
                      await fetchFlightDeals();
                      deals.status = "newBooking";
                      setSelectedStatus("newBooking");
                    } else {
                      toast.error(res.data.message || "Something went wrong!");
                    }
                  } catch (error) {
                    toast.error("Error refreshing status!");
                  }
                }}
              >
                Refresh Booking
              </button>
            </>
          )}

          <button
            className="btn btn-warning p  m-1 p-1"
            onClick={handleDownloadPDF}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default PopFlightDeals;
