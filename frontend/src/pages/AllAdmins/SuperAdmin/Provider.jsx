import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Provider = () => {
  const [provider, setProvider] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    provider: "",
    status: "",
    tollFreePrimary: "",
    tollFreeSecondary: "",
    providerAddress:"",
  });
  const [loading, setLoading] = useState(false);

  // Image state
  const [providerImages, setProviderImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ provider: "", status: "" });
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchCurrentProvider = async () => {
    try {
      const response = await axios.get("/api/v1/ctmFlights/get-provider");
      if (response.data.success) {
        setProvider(response?.data?.booking);
        
      } else {
        console.error("Failed to fetch current provider.jsx percentage.");
      }
    } catch (error) {
      console.error("Error fetching current provider.jsx percentage:", error);
    }
  };

  useEffect(() => {
    fetchCurrentProvider();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `/api/v1/ctmFlights/delete-provider/${id}`
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCurrentProvider();
      } else {
        toast.error("Failed to delete provider.");
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast.error("An error occurred while deleting the provider.");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleProviderImages = (e) => {
    const files = Array.from(e.target.files);
    setProviderImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("provider", form.provider);
      formData.append("providerAddress", form.providerAddress);
      formData.append("status", form.status);
      formData.append("tollFreePrimary", form.tollFreePrimary);
      formData.append("tollFreeSecondary", form.tollFreeSecondary);
      providerImages.forEach((img) => {
        formData.append("providerImages", img);
      });

      const res = await axios.post(
        "/api/v1/ctmFlights/create-provider",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      //  for (int i = 0; i < nums1.length && i < k; i++) {
      //       pq.add(new int[]{nums1[i] + nums2[0], i, 0});
      //   }

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setShowModal(false);
        setForm({
          provider: "",
          status: "",
          tollFreePrimary: "",
          tollFreeSecondary: "",
        });
        setProviderImages([]);
        setImagePreviews([]);
        fetchCurrentProvider();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding the provider.");
    }
    setLoading(false);
  };

  // Edit modal handlers
  const openEditModal = (provider) => {
    setEditId(provider._id);
    setEditForm({
      provider: provider.provider || "",
      tollFreePrimary: provider.tollFreePrimary || "",
      tollFreeSecondary: provider.tollFreeSecondary || "",
      status: provider.providerStatus || "",
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditProvider = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await axios.put(
        `/api/v1/ctmFlights/update-provider/${editId}`,
        {
          provider: editForm.provider,
           providerAddress: editForm.providerAddress,
          tollFreePrimary: editForm.tollFreePrimary,
          tollFreeSecondary: editForm.tollFreeSecondary,
          status: editForm.status,
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message || "Provider updated successfully");
        setShowEditModal(false);
        fetchCurrentProvider();
      } else {
        toast.error(res?.data?.message || "Failed to update provider");
      }
    } catch (error) {
      toast.error("An error occurred while updating the provider.");
    }
    setEditLoading(false);
  };
  return (
    <>
      <Layout>
        <main class="crm_all_body d-flex">
          <SideBar />
          <div className="crm_right relative">
            <section className="">
              <div className="header_crm flex_props justify-content-between">
                <p className="crm_title">Dynamic Providers</p>
              </div>
            </section>

            <section>
              <div className="box_crm_tr">
                <p className="title_common_semi flex_props justify-content-between">
                   Added Provider Detail
                  <div>
                    <p
                      onClick={() => setShowModal(true)}
                      className="provider_btnn"
                    >
                      <img src = "/imgs/add.png" />
                      Add Provider
                    </p>
                  </div>
                </p>
                <div className="bid_bg mt-4">
                  <div className="bid_table">
                    {/* Add Modal */}
                    {showModal && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          background: "rgba(0,0,0,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 9999,
                        }}
                      >
                        <div className="provider_semi_semi">
                          <h4 className="add_pr_title">Add Provider Details</h4>
                          <hr className="my-3"/>
                          <form onSubmit={handleAddProvider}>
                            <div className="mb-2">
                              <label className="form-label">
                                Provider Name
                              </label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="provider"
                                value={form.provider}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                             <div className="mb-2">
                              <label className="form-label">
                                Provider Address
                              </label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="providerAddress"
                                value={form.providerAddress}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            {/* Toll Free Numbers */}
                        <div className="mb-2">
                          <label className="form-label">
                            Toll Free Number (Primary) 
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="tollFreePrimary"
                            value={form.tollFreePrimary}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">
                            Toll Free Number (Secondary Optional)
                          </label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="tollFreeSecondary"
                            value={form.tollFreeSecondary}
                            onChange={handleInputChange}
                          />
                        </div>
                            <div className="mb-2">
                              <label className="form-label">Status</label>
                              <select
                                className="form-select form_in_pr"
                                name="status"
                                value={form.status}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                            <div className="mb-2">
                              <label className="form-label">
                                Provider Image
                              </label>
                              <input
                                type="file"
                                multiple
                                name="providerImages"
                                className="form-control form_in_pr"
                                onChange={handleProviderImages}
                                required
                              />
                              <div className="">
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
                                {providerImages.length > 0 &&
                                  providerImages.map((pic, index) => (
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
                                  setProviderImages([]);
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
                          background: "rgba(0,0,0,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 9999,
                        }}
                      >
                        <div className="provider_semi_semi">
                          <h4 className="add_pr_title">Edit Provider</h4>
                          <hr className="my-3"/>
                          <form onSubmit={handleEditProvider}>
                            <div className="mb-2">
                              <label className="form-label">
                                Provider Name
                              </label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="provider"
                                value={editForm.provider}
                                onChange={handleEditInputChange}
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label className="form-label">
                                Provider Image
                              </label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="providerAddress"
                                value={editForm.providerAddress}
                                onChange={handleEditInputChange}
                                required
                              />
                            </div>
                             <div className="mb-2">
                          <label className="form-label">Primary Number</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="tollFreePrimary"
                            value={editForm.tollFreePrimary}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Secondary Number</label>
                          <input
                            type="text"
                            className="form-control form_in_pr"
                            name="tollFreeSecondary"
                            value={editForm.tollFreeSecondary}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                            <div className="mb-2">
                              <label className="form-label">Status</label>
                              <select
                                className="form-control form_in_pr"
                                name="status"
                                value={editForm.status}
                                onChange={handleEditInputChange}
                                required
                              >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
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

                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>image</th>
                            <th>Provider Name</th>
                            <th> Provider image</th>
                             <th>Primary</th>
                          <th>Secondary</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {provider && provider.length > 0 ? (
                            provider?.map((provider, index) => (
                              <tr key={index}>
                                <td className="corp-img">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {provider?.providerPictures.map(
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
                                                width: 120,
                                                height: 60,
                                                objectFit: "contain",
                                                borderRadius: 4,
                                                padding: 10,
                                                border: "1px solid #eee",
                                              }}
                                            />
                                          </div>
                                        </>
                                      )
                                    )}
                                  </div>
                                </td>
                                <td>{provider?.provider || "-"}</td>
                                <td> {provider?.providerAddress} </td>
                                  <td>{provider?.tollFreePrimary || "-"}</td>
                              <td>{provider?.tollFreeSecondary || "-"}</td>
                                <td
                                  className={
                                    provider?.providerStatus === "Active"
                                      ? "text-success  text-center "
                                      : "text-warning text-center"
                                  }
                                >
                                  {provider?.providerStatus || "-"}
                                </td>
                                <td className="action_provider">
                                  <div class = "action_provider_btn_main">
                                    <button
                                    className="action_provider_btn"
                                    onClick={() => openEditModal(provider)}
                                  >
                                    <img src = "/imgs/edit.png" />
                                    Edit
                                  </button>
                                  <button
                                    className="action_provider_btn action_provider_dlt"
                                    onClick={() => handleDelete(provider._id)}
                                  >
                                     <img src = "/imgs/delete-i.png" />
                                    Delete
                                  </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5">No provider data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Provider;
