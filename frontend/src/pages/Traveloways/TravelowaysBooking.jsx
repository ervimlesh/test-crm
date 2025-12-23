import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import SideBar from '../../components/SideBar.jsx'
import axios from 'axios';
import { useFlightDeals } from '../../context/FlightDealsContext.jsx';
import PopFlightDeals from '../Flight/PopFlightDeals.jsx';

const TravelowaysBooking = () => {
    const {  fetchFlightDeals } = useFlightDeals
    const [flightDealsPop, setFlightDealsPop] = useState(false);
    const [flightDealsPopData, setFlightDealsPopData] = useState(null);
    const [traveloDeals, setTraveloDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const getAllPackageQuery = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/flights/traveloways-booking");
            
            if (res.data.success) {
                setTraveloDeals(res?.data?.data);
                setLoading(false);
            } else {
                setError(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
            setError("Something went wrong while fetching traveloways queries.");
        }
    };

    useEffect(() => {
        getAllPackageQuery();
    }, []);
    const closeFlightPop = () => {
        setFlightDealsPop(false);
        setFlightDealsPopData(null);
    };
    return (
        <Layout>

            <div className="d-flex">
                <SideBar />
                <div className="flex-grow-1 p-4">
                    <h2 className="text-center">
                        All Flight Details
                    </h2>


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
                            {traveloDeals.length ? (
                                traveloDeals.map((deal, index) => (
                                    <tr key={deal._id}>
                                        <td>{index + 1}</td>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        {loading
                                            ? "Loading..."
                                            : error
                                                ? error
                                                : "No flight deals available."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
    )
}

export default TravelowaysBooking