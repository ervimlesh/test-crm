import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import Header from "../../../components/Header.jsx";

const SuperAdminRegister = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "superadmin",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevDAta) => ({
      ...prevDAta,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("number", formData.number);
      data.append("role", formData.role);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.post("/api/v1/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };
  return (
    <Layout>
      <>
        <main class="crm_all_body d-flex">
          <SideBar />
          <div className="crm_right relative">
            <section className="">
              <div className="header_crm flex_props justify-content-between">
                <p className="crm_title">REGISTRATION FORM</p>
                 
              </div>
            </section>
            <section>
            <div className="box_crm_tr">
              <p className="title_common_semi">
                Add - SuperAdmin / Admin / Agent / Employee
              </p>
              <form
                onSubmit={handleSubmit}
                className="mt-2 flex_all form_box_auth"
              >
                <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Name</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="form-control box_crm_input_all"
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                </div>
                <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Number</label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="form-control box_crm_input_all"
                      placeholder="Enter Number"
                      required
                    />
                  </div>
                </div>
                <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control box_crm_input_all"
                      placeholder="Enter Email"
                    />
                  </div>
                </div>
                 <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                   <label htmlFor="">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control box_crm_input_all"
                    placeholder="Enter Password"
                  />
                </div>
                </div>
                 <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                  <label htmlFor="">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select box_crm_input_all"
                    id="inputRole"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
                </div>
                 <div className="width_control_in50 box_sp">
                  <div className="box_crm_input">
                      <label htmlFor="">Upload Image*</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="form-control box_crm_input_all"
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid #eee",
                        }}
                      />
                    </div>
                  )}
                </div>
                </div>

                <div className="width_control_in50 box_sp mt-2">
                  <button type="submit" className="create_bid">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </section>
          </div>
           
        </main>
      </>
    </Layout>
  );
};

export default SuperAdminRegister;
