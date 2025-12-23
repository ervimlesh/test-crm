import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout.jsx";
import { useAuth } from "../../context/Auth.jsx";

async function requestPermanentMediaAccess() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      preferCurrentTab: false,
      selfBrowserSurface: "exclude",
      surfaceSwitching: "include",
      systemAudio: "exclude",
    });

    // store global so agent page can reuse without new popup
    window.agentScreenStream = stream;

    // store deviceId so auto-reconnect works
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    localStorage.setItem("screenCaptureId", settings.deviceId);

    console.log("Permission granted and saved:", settings.deviceId);
    return true;
  } catch (err) {
    console.warn("Permission denied", err);
    return false;
  }
}

const Login = () => {
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const checkInOnLogin = async (token) => {
    try {
      const res = await axios.post(
        "/api/v1/management/punch-in",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success(res.data.message || "Checked in successfully");
    } catch (err) {
      console.error("Check-in error:", err.response?.data || err.message);
      // toast.error("Auto Check-in failed (maybe already checked in).");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!otpSent) {
        const roleRes = await axios.post("/api/v1/auth/check-role", {
          userName: formData.userName,
          email: formData.email,
        });

        if (roleRes?.data?.success && roleRes.data.role === "employee") {
          const res = await axios.post("/api/v1/auth/login", {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
            otp: "bypass",
          });

          if (res?.data?.success) {
            toast.success(res.data.message);
            setAuth({
              ...auth,
              user: res.data.user,
              token: res.data.token,
            });
            localStorage.setItem("auth", JSON.stringify(res.data));

            await checkInOnLogin(res.data.token);
            // 👇 Request screen access IMMEDIATELY after login click
            setTimeout(async () => {
              if (
                res.data.user.role === "admin" ||
                res.data.user.role === "superadmin"
              ) {
                localStorage.setItem("crm_screen_permission", "skipped");
                navigate("/");
                return;
              }

              const granted = await requestPermanentMediaAccess();

              if (!granted) {
                toast.error(
                  "You must allow screen access before using CRM. Logging out..."
                );

                
                setAuth({ user: null, token: "" });
                localStorage.removeItem("auth");
                localStorage.removeItem("crm_screen_permission");

                navigate("/login"); // redirect to login page
                return;
              }

              // Save permission status
              localStorage.setItem("crm_screen_permission", "granted");

              navigate("/");
            }, 300);
          } else {
            toast.error(res.data.message);
          }
        } else {
          const res = await axios.post("/api/v1/auth/send-otp", {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          });

          if (res?.data?.success) {
            toast.success(res.data.message);
            setOtpSent(true);
          } else {
            toast.error(res.data.message);
          }
        }
      } else {
        const res = await axios.post("/api/v1/auth/login", formData);

        if (res?.data?.success) {
          toast.success(res.data.message);
          setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem("auth", JSON.stringify(res.data));
          await checkInOnLogin(res.data.token);
          // 👇 Request screen access IMMEDIATELY after login click
          setTimeout(async () => {
            if (
              res.data.user.role === "admin" ||
              res.data.user.role === "superadmin"
            ) {
              localStorage.setItem("crm_screen_permission", "skipped");
              navigate("/");
              return;
            }

            const granted = await requestPermanentMediaAccess();

            if (!granted) {
              toast.error(
                "You must allow screen access before using CRM. Logging out..."
              );

              
              setAuth({ user: null, token: "" });
              localStorage.removeItem("auth");
              localStorage.removeItem("crm_screen_permission");

              navigate("/login"); // redirect to login page
              return;
            }

            // Save permission status
            localStorage.setItem("crm_screen_permission", "granted");

            navigate("/");
          }, 300);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const [loaderC, setLoaderC] = useState(false);
  setTimeout(() => {
    setLoaderC(false);
  }, 6000);
  return (
    <main className="crm_all_body_body">
      <section className="login_section container-fluid flex_props">
        <div className="container h-100 flex_props">
          <div className="row justify-content-center align-items-center">
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
                <p className="agent_title">Agents Login</p>
                <p className="mt-1">
                  Log in securely to manage your account—fast, reliable access
                  to your personal tools and information.
                </p>
                <form
                  onSubmit={handleLogin}
                  className="container row form_agent mt-3"
                  autoComplete="off"
                >
                  {otpSent ? (
                    <div className="col-12">
                      <div className="form_input">
                        <label htmlFor="inputOtp" className="form-label">
                          OTP<strong>*</strong>
                        </label>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="form-control form_c"
                          id="inputOtp"
                          placeholder="Enter OTP"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="col-12">
                        <div className="form_input">
                          <label htmlFor="" className="form-label">
                            Username*
                          </label>
                          <input
                            type="text"
                            placeholder="Enter UserName"
                            name="userName"
                            required
                            value={formData?.userName}
                            onChange={handleInputChange}
                            id="inputUserName"
                            className="form-control form_c"
                            autoComplete="new-username"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form_input">
                          <label htmlFor="inputEmail4" className="form-label">
                            EMAIL <strong>*</strong>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control form_c"
                            id="inputEmail4"
                            placeholder="Enter Your Email"
                            autoComplete="off"
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
                            onChange={handleInputChange}
                            className="form-control form_c"
                            id="inputpassword"
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-12">
                    <div className="cont_down_all">
                      <button
                        className="sub_sign_in"
                        type="submit"
                        onClick={() => {
                          setLoaderC(!loaderC);
                        }}
                      >
                        {otpSent ? "Verify " : "login"}
                      </button>
                    </div>
                  </div>
                  <div className="col-12 mt-1">
                    <div className="forget_pass text-end">
                      <a href="/forgot-password">Forgot Password?</a>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="cont_down_all">
                      <div className="flex_props ac_liness justify-content-center">
                        <span className="ac_line"></span>
                        <p>
                          Don't Have Account?{" "}
                          <a className="creat_ac" href="/register">
                            Create Now
                          </a>
                        </p>
                        <span className="ac_line"></span>
                      </div>
                      <p className="mt-1 text-center">
                        Astrivion Ventures © 2025, All Rights Reserved.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={loaderC ? "loader1 loader1_ac" : "loader1"}>
          <div class="loader"></div>
        </div>
      </section>
    </main>
  );
};

export default Login;
