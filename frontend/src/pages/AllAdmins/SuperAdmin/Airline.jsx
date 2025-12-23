import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Airline = () => {
  const [ctmAirline, setCtmAirline] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ctmAirline: "", status: "" });
  const [loading, setLoading] = useState(false);

  // Image state
  const [ctmAirlineImages, setCtmAirlineImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ ctmAirline: "", status: "" });
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchCurrentCtmAirline = async () => {
    try {
      const response = await axios.get("/api/v1/ctmFlights/get-ctmAirline");
      if (response.data.success) {
        setCtmAirline(response?.data?.booking);
        console.log(response?.data?.booking);
        // console.log("ctmAirline", response?.data?.booking);
      } else {
        console.error("Failed to fetch current ctmAirline percentage.");
      }
    } catch (error) {
      console.error("Error fetching current ctmAirline  percentage:", error);
    }
  };

  useEffect(() => {
    fetchCurrentCtmAirline();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `/api/v1/ctmFlights/delete-ctmAirline/${id}`
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCurrentCtmAirline();
      } else {
        toast.error("Failed to delete ctmAirline.");
      }
    } catch (error) {
      console.error("Error deleting ctmAirline:", error);
      toast.error("An error occurred while deleting the ctmAirline.");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleCtmAirlineImages = (e) => {
    const files = Array.from(e.target.files);
    setCtmAirlineImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleAddCtmAirline = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ctmAirline", form.ctmAirline);
      formData.append("status", form.status);
      ctmAirlineImages.forEach((img) => {
        formData.append("ctmAirlineImages", img);
      });

      console.log("formData working ", formData);

      const res = await axios.post(
        "/api/v1/ctmFlights/create-ctmAirline",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setShowModal(false);
        setForm({ ctmAirline: "", status: "" });
        setCtmAirlineImages([]);
        setImagePreviews([]);
        fetchCurrentCtmAirline();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the ctmAirline.");
    }
    setLoading(false);
  };

  // Edit modal handlers
  const openEditModal = (ctmAirline) => {
    setEditId(ctmAirline._id);
    setEditForm({
      ctmAirline: ctmAirline.ctmAirline || "",
      status: ctmAirline.ctmAirlineStatus || "",
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditCtmAirline = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await axios.put(
        `/api/v1/ctmFlights/update-ctmAirline/${editId}`,
        {
          ctmAirline: editForm.ctmAirline,
          status: editForm.status,
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message || "ctmAirline updated successfully");
        setShowEditModal(false);
        fetchCurrentCtmAirline();
      } else {
        toast.error(res?.data?.message || "Failed to update ctmAirline");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the ctmAirline.");
    }
    setEditLoading(false);
  };
  return (
    <>
      <Layout>
          <main class="crm_all_body d-flex">
          <SideBar />

          <div className="crm_right relative pt-5">
          <section className="">
               
                 <div className="header_crm flex_props justify-content-between">
              <p className="crm_title">View & Add Airlines</p>
          
                  <p
                    onClick={() => setShowModal(true)}
                    className="provider_btnn"
                  >
                    <img src="/imgs/add.png" />
                    Add Airline
                  </p>
                </div>

                {/* Add Modal */}
                {showModal && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 9999,
                    }}
                  >
                    <div className="provider_semi_semi">
                      <h4 className="add_pr_title">ADD Airlines</h4>
                          <hr className="my-3"/>
                      <form onSubmit={handleAddCtmAirline}>
                        <div className="mb-2">
                          <label className="form-label">Airline Name</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="ctmAirline"
                            value={form.ctmAirline}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Airline code</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="status"
                            value={form.status}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Airline Image</label>
                          <input
                            type="file"
                            multiple
                            name="ctmAirlineImages"
                            className="form-control form_in_pr"
                            onChange={handleCtmAirlineImages}
                            required
                          />
                          <div className="mt-2 d-flex gap-2 flex-wrap">
                            {imagePreviews.length > 0 &&
                              imagePreviews.map((src, idx) => (
                                <img
                                  key={idx}
                                  src={src}
                                  alt="preview"
                                  style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    border: "1px solid #eee",
                                  }}
                                />
                              ))}
                          </div>
                          <div className="mt-2">
                            {ctmAirlineImages.length > 0 &&
                              ctmAirlineImages.map((pic, index) => (
                                <div key={index}>{pic.name}</div>
                              ))}
                          </div>
                        </div>

                        <div className="flex_props gap-2 mt-3 justify-content-end">
                          
                          <button
                            type="submit"
                            className="btn_provider_pop btn_provider_pop_add"
                            disabled={loading}
                          >
                            {loading ? "Adding..." : "Add"}
                          </button>
                           <button
                            type="button"
                            className="btn_provider_pop"
                            onClick={() => {
                              setShowModal(false);
                              setCtmAirlineImages([]);
                              setImagePreviews([]);
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 9999,
                    }}
                  >
                    <div className="provider_semi_semi">
                      <h4 className="add_pr_title">Edit Airline</h4>
                        <hr className="my-3"/>
                      <form onSubmit={handleEditCtmAirline}>
                        <div className="mb-2">
                          <label className="form-label">Airline Name</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="ctmAirline"
                            value={editForm.ctmAirline}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Airline code</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="status"
                            value={editForm.status}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        {/* You can add image edit here if needed */}
                        <div className="flex_props gap-2 mt-3 justify-content-end">
                          
                          <button
                            type="submit"
                            className="btn_provider_pop btn_provider_pop_add"
                            disabled={editLoading}
                          >
                            {editLoading ? "Updating..." : "Update"}
                          </button>
                           <button
                            type="button"
                            className="btn_provider_pop"
                            onClick={() => setShowEditModal(false)}
                            disabled={editLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

               <div className="bid_table mt-2">
                <div className="table-responsive">
                    <table >
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Airlines Name</th>
                          <th>Airlines Code</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ctmAirline && ctmAirline.length > 0 ? (
                          ctmAirline?.map((ctmAirline, index) => (
                            <tr key={index}>
                              <td className="corp-img">
                                <div style={{ display: "flex" }}>
                                  {ctmAirline?.ctmAirlinePictures.map(
                                    (picture) => (
                                      <>
                                        <div className="productImgContainer crud-table-img">
                                          <img
                                            src={`${
                                              import.meta.env
                                                .VITE_REACT_APP_MAIN_URL
                                            }uploads/${picture.img}`}
                                            alt="images"
                                            style={{
                                              width: 60,
                                              height: 60,
                                              objectFit: "cover",
                                              borderRadius: 4,
                                              border: "1px solid #eee",
                                            }}
                                          />
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                              </td>
                              <td>{ctmAirline?.ctmAirline || "-"}</td>
                              <td
                                className={
                                  ctmAirline?.ctmAirlineStatus === "Active"
                                    ? "text-success  text-center "
                                    : "text-warning text-center"
                                }
                              >
                                {ctmAirline?.ctmAirlineStatus || "-"}
                                {console.log('hererere', ctmAirline)}
                              </td>
                              <td>
                                <div className="action_provider_btn_main">
                                <button
                                  className="action_provider_btn"
                                  onClick={() => openEditModal(ctmAirline)}
                                >
                                  <img src="/imgs/edit.png" />
                                  Edit
                                </button>
                                <button
                                  className="action_provider_btn action_provider_dlt"
                                  onClick={() => handleDelete(ctmAirline._id)}
                                >
                                  <img src="/imgs/delete-i.png" />
                                  Delete
                                </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No ctmAirline data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
               </section>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Airline;
