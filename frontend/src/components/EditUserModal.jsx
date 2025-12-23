import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    number: "",
    role: "user",

    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        number: user.number || "",
        role: user.role || "user",

        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `/api/v1/auth/update-super-admin-all-profile/${user._id}`,
        formData
      );

      onSuccess();
      //toast
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
      }
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Update failed!");
    }
  };

  return (
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
      <div className="provider_semi_semi" id="printable-popup">
        <h4 className="add_pr_title">Edit User</h4>
        <hr className="my-3" />
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control form_in_pr"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control form_in_pr"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="form-control form_in_pr"
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-control form_in_pr"
          >
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control form_in_pr"
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control form_in_pr"
            required
          />
        </div>
        <div className="flex_props gap-2 mt-3 justify-content-end">
        <button
          onClick={handleSave}
          className="btn_provider_pop btn_provider_pop_add"
        >
          Save
        </button>
        <button onClick={onClose} className="btn_provider_pop">
          Cancel
        </button>
      </div>
      </div>

       
    </div>
  );
};

export default EditUserModal;
