import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../../components/Layout/Layout.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    number: "",
    role: "employee",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
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
    <main>
      <section className="login_section container-fluid flex_props">
        <div className="container h-100 flex_props">
          <form
            onSubmit={handleSubmit}
            className="row justify-content-center align-items-center"
            encType="multipart/form-data"
          >
            <div className="col-12 col-lg-6">
              <div className="cont_login">
                <h1 className="login_title">
                  Securely access your account anytime, anywhere — your gateway
                  to a smarter, faster digital experience.
                </h1>
                <div className="login_img mt-4">
                  <img src="imgs/login-img.png" />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="agents_bg">
                <p className="agent_title">Create Account</p>

                <div className="form_agent row mt-1">
                  <div className="col-6">
                    <div className="form_input">
                      <label>Name</label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="form-control form_c"
                        placeholder="Enter Your Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form_input">
                      <label>Number</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className="form-control form_c"
                        placeholder="Enter Number"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form_input">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control form_c"
                        required
                        placeholder="Enter Your Email"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form_input">
                      <label htmlFor="inputpassword" className="form-label">
                        PASSWORD<strong>*</strong>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control form_c"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form_input">
                      <label htmlFor="inputRole" className="form-label">
                        Role<strong>*</strong>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-select form_c"
                        id="inputRole"
                        required
                      >
                        <option value="employee">Employee</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form_input">
                      <label className="form-label text-dark">
                        Upload Image<strong>*</strong>
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="form-control form_c"
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

                  <div className="col-12">
                    <div className="cont_down_all">
                      <button type="submit" className="sub_sign_in">
                        Create Now
                      </button>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="cont_down_all">
                      <div className="flex_props ac_liness justify-content-center">
                        <span className="ac_line"></span>
                        <p>
                          Already Have Account?{" "}
                          <a className="creat_ac" href="/login">
                            Login in
                          </a>
                        </p>
                        <span className="ac_line"></span>
                      </div>
                      <p className="mt-1 text-center">
                        Astrivion Ventures © 2025, All Rights Reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
