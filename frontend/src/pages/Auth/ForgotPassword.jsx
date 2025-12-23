import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // step 1 = enter email, step 2 = enter OTP, step 3 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/send-otp-forgot", { email });
      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/verify-otp-forgot", {
        email,
        otp,
      });
      if (res.data.success) {
        toast.success("OTP verified successfully");
        setStep(3);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while verifying OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("/api/v1/auth/reset-password-forgot", {
        email,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while resetting password");
    }
  };

  return (
    <Layout title={"Forgot Password - Astrivion Ventures"}>
      <main className="crm_all_body_body">
        <section className="login_section container-fluid flex_props">
          <div className="container h-100 flex_props">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-lg-6">
                <div className="cont_login">
                  <div className="login_img">
                    <img src="imgs/login-img.png" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="agents_bg">
                  {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                      <p className="agent_title">Forgot Password</p>
                      <p className="mt-1">
                        If you've forgotten your password, don't worry — simply
                        follow the steps to reset it securely and regain access
                        to your account in just a few minutes.
                      </p>
                      <div className="row form_agent mt-2">
                        <div className="col-12">
                          <div className="form_input">
                            <label className="form-label">Email*</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="form-control form_c"
                              placeholder="Enter Your Registered Email"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="cont_down_all">
                            <button type="submit" className="sub_sign_in">
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="row form_agent mt-2">
                      <div className="col-12">
                        <div className="form_input">
                        <label>Enter OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="form-control form_c"
                          placeholder="Enter OTP sent to your email"
                          required
                        />
                        </div>
                      </div>
                        <div className="col-12">
                    <div className="cont_down_all"> 
                      <button type="submit" className="sub_sign_in">
                        Verify OTP
                      </button>
                      </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleResetPassword}>  
                       <div className="row form_agent mt-2">
                      <div className="col-12">
                      <div className="form_input">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-control form_c"
                          placeholder="Enter New Password"
                          required
                        />
                      </div>
                      </div>
                     <div className="col-12">
                        <div className="form_input">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-control form_c"
                          placeholder="Confirm New Password"
                          required
                        />
                         </div>
                      </div>
                         <div className="col-12">
                        <div className="cont_down_all">
                      <button type="submit" className="sub_sign_in">
                        Reset Password
                      </button>
                      </div>
                       </div>
                        </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ForgotPassword;
