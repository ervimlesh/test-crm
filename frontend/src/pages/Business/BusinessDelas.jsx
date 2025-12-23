import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar.jsx'
import Layout from '../../components/Layout/Layout.jsx'
import axios from 'axios';
import PopFlightDeals from '../Flight/PopFlightDeals.jsx';
import { useFlightDeals } from '../../context/FlightDealsContext.jsx';

const BusinessDelas = () => {
    const {fetchFlightDeals } = useFlightDeals();
    const [businessDeals, setBusinessDeals] = useState([]);
    const [flightDealsPop, setFlightDealsPop] = useState(false);
    const [flightDealsPopData, setFlightDealsPopData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

      const closeFlightPop = () => {
    setFlightDealsPop(false);
    setFlightDealsPopData(null);
  };



    useEffect(() => {
        const getAllBusinessDeals = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/v1/business/get-business-deals");
                console.log(res);

                if (res.data.success) {

                    setBusinessDeals(res.data.businessDeals);
                    setLoading(false);

                }
                else {
                    setLoading(false);
                    setError("Something went wrong while fetching business deals.");
                }

            }
            catch (error) {
                console.error("Error fetching business deals:", error);
                setLoading(false);
                setError("Something went wrong while fetching business deals.");
            }
        }
        getAllBusinessDeals();
    }, []);



    return (

        <Layout>

            <div className="d-flex">
                <SideBar />

                <div className="flex-grow-1 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0">Business Deals</h4>
                        <button className="btn btn-primary"> {loading ? "Reloading" : "Reload"} </button>
                    </div>

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>UserName</th>
                                <th>Mail</th>
                                <th>Phone</th>
                                <th>Action</th>
                                <th> Status </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="text-center">{error}</td>
                                </tr>
                            ) : businessDeals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">No Cars Found</td>
                                </tr>
                            ) : (
                                businessDeals.map((pkg, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>

                                        <td>{pkg?.firstName}</td>
                                        <td>{pkg?.email}</td>
                                        <td>{pkg?.mobile}</td>

                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm text-nowrap"
                                                onClick={() => {
                                                    setFlightDealsPopData(pkg);
                                                    setFlightDealsPop(true);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </td>

                                        <td>
                                            <span
                                                className={`${pkg?.status === "approved"
                                                    ? "text-success"
                                                    : pkg?.status === "rejected"
                                                        ? "text-danger"
                                                        : "text-primary"
                                                    }`}
                                            >
                                                {pkg?.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
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

export default BusinessDelas