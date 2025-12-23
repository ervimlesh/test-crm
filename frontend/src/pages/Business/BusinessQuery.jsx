import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout.jsx';
import axios from 'axios';
import SideBar from '../../components/SideBar.jsx';

const SearchFlightData = () => {
    const [flightData, setFlightData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getAllFlightData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/business/get-business-query', );
            if (res.data.success) {
                console.log(res.data);
                setFlightData(res?.data?.businessQuery);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setError('Something went wrong while fetching flight data.');
        }
    };

    useEffect(() => {
        getAllFlightData();
    }, []);

    return (
        <Layout>
            <div className="d-flex">
                <SideBar flightData={flightData}/>
                <div className="flex-grow-1 p-4">
                  
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0">Flight Query Data List</h4>
                        <button
                            className="btn btn-primary"
                            onClick={getAllFlightData}
                            disabled={loading}
                        >
                            {loading ? 'Reloading...' : 'Reload'}
                        </button>
                    </div>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Date</th>
                                <th>Return Date</th>
                                <th>Trip Type</th>
                                <th>Adults</th>
                                <th>Children</th>
                                <th>Infants</th>
                                <th>Total Passengers</th>
                                <th>Class Type</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>User Phone</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flightData?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.source}</td>
                                    <td>{item?.destination}</td>
                                    <td>{new Date(item?.date).toLocaleDateString()}</td>
                                    <td>{new Date(item?.rtnDate).toLocaleDateString()}</td>
                                    <td>{item?.trpType}</td>
                                    <td>{item?.adults}</td>
                                    <td>{item?.children}</td>
                                    <td>{item?.infants}</td>
                                    <td>{item?.tpassenger}</td>
                                    <td>{item?.classType}</td>
                                    <td>{item?.userName}</td>
                                    <td>{item?.userMail}</td>
                                    <td>{item?.userNumber}</td>
                                    <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {loading ? (
                                <tr>
                                    <td colSpan={15} className="text-center">Loading...</td>
                                </tr>
                            ) : flightData?.length === 0 ? (
                                <tr>
                                    <td colSpan={15} className="text-center">No Flight Data Found</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default SearchFlightData;