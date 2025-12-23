import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import SideBar from "../../../components/SideBar";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const ReduceSrcDest = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reducePercentage: "",
    reduceUrl: "",
  });
  const [currentReduction, setCurrentReduction] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

    useEffect(() => {
    const fetchReduction = async () => {
      try {
        const res = await axios.get(`/api/v1/flights/detail-reduce-reduction-percentage/${id}`);
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setFormData({
            reducePercentage: data.reducePercentage || "",
            reduceUrl: data.reduceUrl || "",
          });
         
        } else {
          toast.error("Failed to fetch reduction data.");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching reduction data.");
      } 
    };
    fetchReduction();
  }, [id]);

   // Submit updated data
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          reducePercentage: formData.reducePercentage,
          reduceUrl: formData.reduceUrl,
        };
        const response = await axios.patch(
          `/api/v1/flights/reduce-reduction-percentage-srcDest-update/${id}`,
          payload
        );
        if (response.data.success) {
          toast.success(response.data.message );
          navigate(-1); // Go back to previous page
        } else {
          toast.error(response.data.message || "Update failed");
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to update. Please try again.");
      }
    };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Edit Reduce Price</h2>
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
        </div>
      </div>
    </Layout>
  );
};

export default ReduceSrcDest;
