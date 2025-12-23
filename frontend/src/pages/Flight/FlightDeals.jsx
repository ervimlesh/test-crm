import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import PopFlightDeals from "./PopFlightDeals.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import io from "socket.io-client"; 
import { useFlightDeals } from "../../context/FlightDealsContext.jsx";
import { getSocket } from "../../context/SocketContext.jsx";

// const socket = io(import.meta.env.VITE_SOCKET_URL); 
const socket = getSocket();

const FlightDeals = () => {

  const { flightDeals,setFlightDeals, loading, setLoading, errorCode, fetchFlightDeals } = useFlightDeals();
  const [flightDealsPop, setFlightDealsPop] = useState(false);
  const [flightDealsPopData, setFlightDealsPopData] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState(flightDeals);
  const [currentPage, setCurrentPage] = useState(1);  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const itemsPerPage = 5;
  

  const STATUS_NEW_BOOKING = "newBooking";
  const STATUS_REJECTED = "rejected";

  useEffect(() => {
    fetchFlightDeals();
  }, []);

  useEffect(() => {
    // Listen for real-time updates
    socket.on('newFlightAdded', (data) => {

      if (data.success) {
        setFlightDeals((prevDeals) => [data.data, ...prevDeals]);
        setFilteredDeals((prevDeals) => [data.data, ...prevDeals]);
      
      }
    });
    return () => {
      socket.off('');
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, bookingId, flightDeals]);
  
  // Apply filters
  const applyFilters = () => {
    let filtered = flightDeals;

    if (startDate) {
      filtered = filtered.filter(
        (deal) => new Date(deal.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (deal) => new Date(deal.createdAt) <= new Date(endDate)
      );
    }
    if (bookingId.trim()) {
      filtered = filtered.filter((deal) =>
        deal.bookingId?.includes(bookingId.trim())
      );
    }

    setFilteredDeals(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setBookingId("");
    setFilteredDeals(flightDeals);
  };

  // Filter by predefined categories
  const handleFilterClick = (filterType) => {
    let filtered;
    const today = new Date().toISOString().split("T")[0];
    switch (filterType) {
      case "today":
        filtered = flightDeals.filter(
          (deal) =>
            new Date(deal.createdAt).toISOString().split("T")[0] === today
        );
        break;
      case STATUS_NEW_BOOKING:
        filtered = flightDeals.filter((deal) => deal.status === STATUS_NEW_BOOKING);
        break;
      case STATUS_REJECTED:
        filtered = flightDeals.filter((deal) => deal.status === STATUS_REJECTED);
        break;
      default:
        filtered = flightDeals;
    }
    setFilteredDeals(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {

    // Reset to the first page when filteredDeals changes
    if (filteredDeals.length > 0) {
      const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      } else if (currentPage < 1) {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1); // Reset to page 1 if no deals are available
    }

  }, [currentPage, filteredDeals])


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  //  current.charAt(current.length() - 1) <= vowel.charAt(0))
  

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);
  const pendingBookings = filteredDeals.filter(
    (deal) => deal.status === STATUS_NEW_BOOKING
  ).length;

  const closeFlightPop = () => {
    setFlightDealsPop(false);
    setFlightDealsPopData(null);
  };

  // Render component
  return (
    <Layout>
      <div className="d-flex">
        <SideBar todayDealsCount={pendingBookings} />
        <div className="flex-grow-1 p-4">
          <h2 className="text-start">All Flight Details</h2>

          {/* Filter buttons */}
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-danger"
              onClick={() => handleFilterClick("today")}
            >
              Today's Booking:{" "}
              <strong>
                {flightDeals.filter(
                  (deal) =>
                    new Date(deal.createdAt).toISOString().split("T")[0] ===
                    new Date().toISOString().split("T")[0]
                ).length}
              </strong>
            </button>
            <button className="btn btn-success" onClick={clearFilters}>
              Total Booking: <strong>{flightDeals.length}</strong>
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleFilterClick(STATUS_NEW_BOOKING)}
            >
              New Booking:{" "}
              <strong>
                {flightDeals.filter((deal) => deal.status === STATUS_NEW_BOOKING)
                  .length}
              </strong>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleFilterClick(STATUS_REJECTED)}
            >
              Rejected Booking:{" "}
              <strong>
                {flightDeals.filter((deal) => deal.status === STATUS_REJECTED).length}
              </strong>
            </button>
          </div>

          {/* Notifications */}
         {showNotifications ? (
            <div className="alert alert-info">
              {pendingBookings > 0 ? (
                <>
                  <strong>
                    <span className="badge bg-info text-dark fs-5">
                      {pendingBookings}
                    </span>{" "}
                    Notifications
                  </strong>
                  <ul>
                    {filteredDeals
                      .filter((deal) => deal.status === STATUS_NEW_BOOKING)
                      .map((booking, index) => (
                        <li key={booking._id}>
                          {index + 1}: Booking ID {booking.bookingId}:{" "}
                          {booking.firstName} ({booking.email})
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                "No new bookings at the moment."
              )}
              <button
                className="btn btn-link text-dark"
                onClick={toggleNotifications}
              >
                {showNotifications ? "Hide" : "Show"} Notifications
              </button>
            </div>
          ) : (
            <button
              className="btn btn-link text-dark"
              onClick={toggleNotifications}
            >
              Show Notifications
            </button>
          )} 

          {/* Filters */}
          <div className="mb-3">
            <h5>Filter Options</h5>
            <div className="d-flex gap-3">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                dateFormat="MM-dd-yyyy"
                className="form-control"
                maxDate={new Date()}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                dateFormat="MM-dd-yyyy"
                className="form-control"
                maxDate={new Date()}
              />
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Enter Booking ID"
                className="form-control"
              />
            </div>
            <button className="btn btn-secondary mt-3" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          {/* Flight deals table */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Action</th>
                <th>Status</th>
                <th>approve/reject/refresh by</th>
              </tr>
            </thead>
            <tbody>
              {currentDeals.length ? (
                currentDeals.map((deal, index) => (
                  <tr key={deal._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{deal.firstName}</td>
                    <td>{deal.mobile}</td>
                    <td>{deal.email}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm text-nowrap"
                        onClick={() => {
                          setFlightDealsPopData(deal);
                          setFlightDealsPop(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                    <td>
                      <span
                        className={`${deal.status === "approved"
                          ? "text-success"
                          : deal.status === "rejected"
                            ? "text-danger"
                            : "text-primary"
                          }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td> {deal.approvedBy || "-"}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {loading
                      ? "Loading..."
                      : errorCode
                        ? errorCode
                        : "No flight deals available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination mt-3">
            <button
              className="btn btn-secondary mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            {Array.from({ length: 3 }, (_, i) => {

              const offset = i - 0;

              const page = currentPage + offset;


              if (page < 1 || page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? "btn-primary" : "btn-secondary"} mx-1`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="btn btn-secondary mx-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {flightDealsPop && (
        <PopFlightDeals
          flightDealsPop={flightDealsPop}
          deals={flightDealsPopData}
          onClose={closeFlightPop}
          fetchFlightDeals={fetchFlightDeals}
        />
      )}
    </Layout>
  );
};

export default FlightDeals;