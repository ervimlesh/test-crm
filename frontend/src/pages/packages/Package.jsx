import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout.jsx';
import SideBar from '../../components/SideBar.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const Package = () => {
    
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const getAllPackageQuery = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/package/get-packages-query");
            if (res.data.success) {
                setPackages(res?.data?.packageQuery);
                setLoading(false);
            } else {
                setError(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setError("Something went wrong while fetching package queries.");
        }
    };

    useEffect(() => {
        getAllPackageQuery();
    }, []);

    return (
        <Layout>
            <div className="d-flex">
                <SideBar />
                <div className="flex-grow-1 p-4">
                    <h2 className="text-start">All Packages</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0">Package List</h4>
                        <button
                            className="btn btn-primary"
                            onClick={getAllPackageQuery}
                            disabled={loading}
                        >
                            {loading ? 'Reloading...' : 'Reload'}
                        </button>
                    </div>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                
                                <th>UserName</th>
                                <th>Mail</th>
                                <th>Phone</th>
                               
                                <th>Created At</th>
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
                            ) : packages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">No Packages Found</td>
                                </tr>
                            ) : (
                                packages.map((pkg, index) => (
                                    <tr key={index}>
                                         <td className='text-center'>{ index + 1}</td>
                                        
                                        <td>{pkg?.userName}</td>
                                        <td>{pkg?.email}</td>
                                        <td>{pkg?.phone}</td>
                                        
                                        <td>
                                            {pkg?.createdAt
                                                ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(new Date(pkg?.createdAt)).replace(/\d+/, match => {
                                                    const suffix = ['th', 'st', 'nd', 'rd'][(match % 10) - 1] || 'th';
                                                    return `${match}${suffix}`;
                                                })
                                                : ""}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Package;
