import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const PopAllCtmFlights = ({
  flightDealsPop,
  deals,
  onClose,
  fetchFlightDeals,
}) => {
  const formattedCreatedAt = deals.createdAt
    ? new Date(deals.createdAt).toLocaleString()
    : "N/A";
  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content" id="printable-popup">
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          <h2>Pnr Details</h2>
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

          {/* {deals.status === "newBooking" ? (
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
                    console.log(error)
                    toast.error("Error refreshing status!");
                  }
                }}
              >
                Refresh Booking
              </button>
            </>
          )} */}

         

          <button className="btn btn-warning p  m-1 p-1">Download</button>
        </div>
      </div>
    </>
  );
};

export default PopAllCtmFlights;
