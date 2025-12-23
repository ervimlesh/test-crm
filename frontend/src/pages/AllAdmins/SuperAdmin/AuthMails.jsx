import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const AuthMails = () => {
  const [authMails, setAuthMails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    authMails: "",
    authPassword: "",
    mailStatus: "",
    status: "inactive",
  });
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    authMails: "",
    authPassword: "",
    mailStatus: "",
    status: "inactive",
  });
  const [editId, setEditId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchCurrentProvider = async () => {
    try {
      const response = await axios.get("/api/v1/service/get-auth-mails");
      if (response.data.success) {
        setAuthMails(response?.data?.data || []);
      } else {
        console.error("Failed to fetch auth mails");
      }
    } catch (error) {
      console.error("Error fetching auth mails:", error);
    }
  };

  useEffect(() => {
    fetchCurrentProvider();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/service/delete-auth-mails/${id}`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        fetchCurrentProvider();
      } else {
        toast.error("Failed to delete auth mail.");
      }
    } catch (error) {
      console.error("Error deleting auth mail:", error);
      toast.error("An error occurred while deleting auth mail.");
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/service/create-auth-mails", {
        authMails: form.authMails,
        authPassword: form.authPassword,
        mailStatus: form.mailStatus,
        status: form.status,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setShowModal(false);
        setForm({
          authMails: "",
          authPassword: "",
          mailStatus: "",
          status: "inactive",
        });
        fetchCurrentProvider();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while adding auth mail.");
    }
    setLoading(false);
  };

  const openEditModal = (mail) => {
    setEditId(mail._id);
    setEditForm({
      authMails: mail.authMails || "",
      authPassword: mail.authPassword || "",
      mailStatus: mail.mailStatus || "",
      status: mail.status || "inactive",
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
      const res = await axios.put(`/api/v1/service/update-auth-mails/${editId}`, {
        authMails: editForm.authMails,
        authPassword: editForm.authPassword,
        mailStatus: editForm.mailStatus,
        status: editForm.status,
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Updated successfully");
        setShowEditModal(false);
        fetchCurrentProvider();
      } else {
        toast.error(res?.data?.message || "Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
    }
    setEditLoading(false);
  };

  // NEW: Divide list into two sections
  const authMailList = authMails.filter((m) => m.mailStatus === "auth-mail");
  const invoiceMailList = authMails.filter((m) => m.mailStatus === "invoice-mail");

  return (
    <>
      <Layout>
        <main class="crm_all_body d-flex">
          <SideBar />
          <div className="crm_right relative">
            <section className="">
              <div className="header_crm flex_props justify-content-between">
                <p className="crm_title">Auth Mail Manager</p>
              </div>
            </section>

            <section>
              <div className="box_crm_tr">
                <p className="title_common_semi flex_props justify-content-between">
                  Added Auth Mails
                  <div>
                    <p onClick={() => setShowModal(true)} className="provider_btnn">
                      <img src="/imgs/add.png" />
                      Add Auth Mail
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
                          <h4 className="add_pr_title">Add Auth Mail</h4>
                          <hr className="my-3" />

                          <form onSubmit={handleAddProvider}>
                            <div className="mb-2">
                              <label className="form-label">Auth Email</label>
                              <input
                                type="email"
                                className="form-control form_in_pr"
                                name="authMails"
                                value={form.authMails}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Auth Password</label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="authPassword"
                                value={form.authPassword}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Mail Type</label>
                              <select
                                className="form-select form_in_pr"
                                name="mailStatus"
                                value={form.mailStatus}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Mail Type</option>
                                <option value="auth-mail">Auth Mail</option>
                                <option value="invoice-mail">Invoice Mail</option>
                              </select>
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
                                <option value="inactive">Inactive</option>
                                <option value="active">Active</option>
                              </select>
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
                                onClick={() => setShowModal(false)}
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
                          <h4 className="add_pr_title">Edit Auth Mail</h4>
                          <hr className="my-3" />

                          <form onSubmit={handleEditProvider}>
                            <div className="mb-2">
                              <label className="form-label">Auth Email</label>
                              <input
                                type="email"
                                className="form-control form_in_pr"
                                name="authMails"
                                value={editForm.authMails}
                                onChange={handleEditInputChange}
                                required
                              />
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Auth Password</label>
                              <input
                                type="text"
                                className="form-control form_in_pr"
                                name="authPassword"
                                value={editForm.authPassword}
                                onChange={handleEditInputChange}
                                required
                              />
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Mail Type</label>
                              <select
                                className="form-select form_in_pr"
                                name="mailStatus"
                                value={editForm.mailStatus}
                                onChange={handleEditInputChange}
                                required
                              >
                                <option value="auth-mail">Auth Mail</option>
                                <option value="invoice-mail">Invoice Mail</option>
                              </select>
                            </div>

                            <div className="mb-2">
                              <label className="form-label">Status</label>
                              <select
                                className="form-select form_in_pr"
                                name="status"
                                value={editForm.status}
                                onChange={handleEditInputChange}
                                required
                              >
                                <option value="inactive">Inactive</option>
                                <option value="active">Active</option>
                              </select>
                            </div>

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

                    {/* TABLE SECTION 1: AUTH MAILS */}
                    <h3 className="mt-4 mb-2">Auth Mails</h3>
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Password</th>
                            {/* <th>Mail Type</th> */}
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {authMailList.length > 0 ? (
                            authMailList.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.authMails}</td>
                                <td>{item?.authPassword}</td>
                                {/* <td>{item?.mailStatus}</td> */}
                                <td
                                  className={
                                    item?.status === "active"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {item?.status}
                                </td>

                                <td className="action_provider">
                                  <div className="action_provider_btn_main">
                                    <button
                                      className="action_provider_btn"
                                      onClick={() => openEditModal(item)}
                                    >
                                      <img src="/imgs/edit.png" />
                                      Edit
                                    </button>

                                    <button
                                      className="action_provider_btn action_provider_dlt"
                                      onClick={() => handleDelete(item._id)}
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
                              <td colSpan="5">No Auth Mail Data Available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* TABLE SECTION 2: INVOICE MAILS */}
                    <h3 className="mt-5 mb-2">Invoice Mails</h3>
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Mail Type</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {invoiceMailList.length > 0 ? (
                            invoiceMailList.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.authMails}</td>
                                <td>{item?.authPassword}</td>
                                <td>{item?.mailStatus}</td>
                                <td
                                  className={
                                    item?.status === "active"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {item?.status}
                                </td>

                                <td className="action_provider">
                                  <div className="action_provider_btn_main">
                                    <button
                                      className="action_provider_btn"
                                      onClick={() => openEditModal(item)}
                                    >
                                      <img src="/imgs/edit.png" />
                                      Edit
                                    </button>

                                    <button
                                      className="action_provider_btn action_provider_dlt"
                                      onClick={() => handleDelete(item._id)}
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
                              <td colSpan="5">No Invoice Mail Data Available</td>
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

export default AuthMails;
