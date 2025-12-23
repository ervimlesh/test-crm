import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopHotelDeals from './PopHotelDeals.jsx';
import axios from "axios";
import io from "socket.io-client"
import { useHotelDeals } from "../../context/HotelDealsContext.jsx";
import { getSocket } from "../../context/SocketContext.jsx";


const socket = getSocket();


const HotelDeals = () => {

    const [hotelDealsPop, setHotelDealsPop] = useState(false);
    const [hotelDealsPopData, setHotelDealsPopData] = useState(null);

    const { fetchHotelDeals, hotelDeals, setHotelDeals, errorCode, loading, } = useHotelDeals();

    const [filteredDeals, setFilteredDeals] = useState(hotelDeals);

    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [bookingId, setBookingId] = useState("");
    const [showNotifications, setShowNotifications] = useState(true);
    const itemsPerPage = 5;

    const STATUS_NEW_BOOKING = "newBooking";
    const STATUS_REJECTED = "rejected";

    useEffect(() => {
        fetchHotelDeals();
    }, []);



    useEffect(() => {
        // Listen for real-time updates
        // socket.on('newFlightAdded', (data) => {

        //     if (data.success) {
        //         setHotelDeals((prevDeals) => [data.data, ...prevDeals]);
        //         setFilteredDeals((prevDeals) => [data.data, ...prevDeals]);
        //         toast.success(data.message);
        //     }
        // });
        // return () => {
        //     socket.off('newFlightAdded');
        // };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [startDate, endDate, bookingId, hotelDeals]);

    // Apply filters
    const applyFilters = () => {
        let filtered = hotelDeals;

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
        setFilteredDeals(hotelDeals);
    };

    // Filter by predefined categories
    const handleFilterClick = (filterType) => {
        let filtered;
        const today = new Date().toISOString().split("T")[0];
        switch (filterType) {
            case "today":
                filtered = hotelDeals.filter(
                    (deal) =>
                        new Date(deal.createdAt).toISOString().split("T")[0] === today
                );
                break;
            case STATUS_NEW_BOOKING:
                filtered = hotelDeals.filter((deal) => deal.status === STATUS_NEW_BOOKING);
                break;
            case STATUS_REJECTED:
                filtered = hotelDeals.filter((deal) => deal.status === STATUS_REJECTED);
                break;
            default:
                filtered = hotelDeals;
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

    const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);
    const pendingBookings = filteredDeals.filter(
        (deal) => deal.status === STATUS_NEW_BOOKING
    ).length;


    const showHotelDealsPop = (deal) => {
        setHotelDealsPopData(deal);
        setHotelDealsPop(true);
    };

    const closeHotelPop = () => {
        setHotelDealsPop(false);
        setHotelDealsPopData(null);
    };

    const updateStatus = async (id, status) => {

        const res = await axios.patch(`/api/v1/hotels/status/${id}`, { status });

        if (res && res.data.success) {

            toast.success(res.data.message);

            await fetchHotelDeals();

        }
        else {
            toast.error(res.data.message || "Something went wrong!");

        }
    }

    return (
        <Layout>
            <div className="d-flex">
                <SideBar todayDealsCount={pendingBookings} />
                <div className="flex-grow-1 p-4">
                    <h2 className="text-start">All Hotel Details</h2>

                    {/* Filter buttons */}
                    <div className="d-flex gap-2 mb-3">
                        <button
                            className="btn btn-danger"
                            onClick={() => handleFilterClick("today")}
                        >
                            Today's Booking:{" "}
                            <strong>
                                {/* {hotelDeals.filter(
                                    (deal) =>
                                        new Date(deal.createdAt).toISOString().split("T")[0] ===
                                        new Date().toISOString().split("T")[0]
                                ).length} */}
                            </strong>
                        </button>
                        <button className="btn btn-success" onClick={clearFilters}>
                            Total Booking: <strong>{hotelDeals.length}</strong>
                        </button>
                        <button
                            className="btn btn-warning"
                            onClick={() => handleFilterClick(STATUS_NEW_BOOKING)}
                        >
                            New Booking:{" "}
                            <strong>
                                {hotelDeals.filter((deal) => deal.status === STATUS_NEW_BOOKING)
                                    .length}
                            </strong>
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleFilterClick(STATUS_REJECTED)}
                        >
                            Rejected Booking:{" "}
                            <strong>
                                {hotelDeals.filter((deal) => deal.status === STATUS_REJECTED).length}
                            </strong>
                        </button>
                    </div>

                    {/* Notifications */}
                    {showNotifications && (
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
                                        <td className="d-flex gap-1">
                                            <button
                                                className="btn btn-primary text-nowrap"
                                                onClick={() => showHotelDealsPop(deal)}
                                            >
                                                View Details
                                            </button>
                                            {/* {
                                                deal.status === 'newBooking' ? (
                                                    <>
                                                        <button className='btn btn-primary ' onClick={() => updateStatus(deal._id, 'approved')}>Approve</button>
                                                        <button className='btn btn-danger' onClick={() => updateStatus(deal._id, 'rejected')}>Reject</button>
                                                    </>
                                                ) : (
                                                    <div>

                                                        {
                                                            <button className={deal?.status === "rejected" ? 'btn btn-warning' : deal.status === 'approved' ? "btn btn-success" : ''} > {deal?.status} </button>}

                                                    </div>

                                                )
                                            } */}
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


            {
                hotelDealsPop && (
                    <PopHotelDeals hotelDealsPop={hotelDealsPop} deals={hotelDealsPopData} onClose={closeHotelPop} fetchHotelDeals={fetchHotelDeals} />
                )
            }
        </Layout>
    )
}

export default HotelDeals