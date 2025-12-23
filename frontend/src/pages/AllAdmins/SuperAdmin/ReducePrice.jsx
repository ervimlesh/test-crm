import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const ReducePrice = () => {
  const [formData, setFormData] = useState({
    reducePercentage: "",
    reduceUrl: "",
  });
  const [currentReduction, setCurrentReduction] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/api/v1/flights/reduction-percentage",
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ reducePercentage: "", reduceUrl: "" }); // Reset form
        fetchCurrentReduction(); // Refresh table after submit
      } else {
        alert("Failed to update reduction percentage.");
      }
    } catch (error) {
      console.error("Error updating reduction percentage:", error);
      alert("Failed to update reduction percentage. Please try again.");
    }
  };

  // Move fetchCurrentReduction outside useEffect so it can be used in button
  const fetchCurrentReduction = async () => {
    try {
      const response = await axios.get(
        "/api/v1/flights/get-reduction-percentage"
      );
      if (response.data.success) {
        setCurrentReduction(response?.data?.data);
      } else {
        console.error("Failed to fetch current reduction percentage.");
      }
    } catch (error) {
      console.error("Error fetching current reduction percentage:", error);
    }
  };

  useEffect(() => {
    fetchCurrentReduction();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/flights/delete-reduce-reduction/${id}`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCurrentReduction();
      } else {
        toast.error("Failed to delete reduction.");
      }
    } catch (error) {
      console.error("Error deleting reduction:", error);
      toast.error("An error occurred while deleting the reduction.");
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Reduce Price</h2>
              <form onSubmit={handleSubmit} className="form_booking">
                <div className="form_booking">
                  <label htmlFor="">
                    Reduce Amount <span>*</span>
                  </label>
                  <div className="form_input">
                    <input
                      type="Number"
                      maxLength="3"
                      id="reducePercentage"
                      value={formData.reducePercentage}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter reduction percentage"
                      className="form-control"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="col-md-9 mb-3">
                    <label htmlFor="reduceUrl" className="form-label">
                      Reduce Url
                    </label>
                    <select
                      id="reduceUrl"
                      className="form-select"
                      value={formData.reduceUrl}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="faresway.com">Faresway</option>
                      <option value="traveloways.com">Traveloways</option>
                      <option value="faresvilla.com"> Faresvilla</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="d-flex justify-content-between align-items-center p-2 bg-light">
              <h6 className="m-1 p-1">Current Price</h6>
             
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Reduction Percentage</th>
                      <th>Reduction Url</th>
                      {/* <th>Source & Dest</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReduction.filter(
                      (reduction) =>
                        reduction?.reducePercentage &&
                        reduction?.reduceUrl 
                    ).length > 0 ? (
                      currentReduction
                        .filter(
                          (reduction) =>
                            reduction?.reducePercentage &&
                           reduction?.reduceUrl
                        )
                        .map((reduction, index) => (
                          <tr key={index}>
                            <td>
                              {reduction?.reducePercentage || "-"} %
                            </td>
                            <td>{reduction?.reduceUrl || "-"}</td>
                            
                            
                            <td className="d-flex gap-2">
                            <NavLink
                              to={`/astrivion/reduce-src-dest-details/${reduction._id}`}
                              className="btn btn-primary btn-sm"
                            >
                              Edit
                            </NavLink>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(reduction._id)}
                            >
                              Delete
                            </button>
                          </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5">No reduction data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReducePrice;
