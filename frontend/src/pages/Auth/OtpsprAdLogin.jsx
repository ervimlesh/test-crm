import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";
import moment from "moment";
import { io } from "socket.io-client";
import { getSocket } from "../../../socket";

// const socket = io(import.meta.env.VITE_SOCKET_URL);
const socket = getSocket();
const OtpsprAdLogin = () => {
  const [otpUser, setOtpUser] = useState([]);

  useEffect(() => {
    fetchAdmin();

    socket.on("otpInserted", (data) => {
      toast.success("New OTP inserted!");
      fetchAdmin();
    });

    socket.on("otpUpdated", (data) => {
      toast.success("OTP updated!");
      fetchAdmin();
    });

    // Optional: handle errors
    socket.on("error", (data) => {
      toast.error(data.message || "Socket error");
    });

    // Cleanup on unmount
    return () => {
      socket.off("otpInserted");
      socket.off("otpUpdated");
      socket.off("error");
    };
    // eslint-disable-next-line
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await axios.get("/api/v1/auth/get-otp-all");
      if (res?.data) {
        setOtpUser(res.data);
      } else {
        setOtpUser([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const updateOtpStatus = async (id, otpEmail, otpStatus) => {
    try {
      const res = await axios.post(`/api/v1/auth/agent-otp-status/${id}`, {
        otpEmail,
        otpStatus,
      });
      if (res?.data?.success) {
        toast.success(res.data.message); // Show success message
        await fetchAdmin(); // Refresh data
        // console.log('OTP status updated:', res.data);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error updating OTP status:", error);
      toast.error("Failed to update status!");
    }
  };
  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        {/* Main Content */}
        <div className="crm_right relative">
          <section className="">
            <div className="header_crm flex_props justify-content-between">
              <p className="crm_title">
                Astrivion Ventures OTP Access Of All Employees
              </p>
            </div>
          </section>
          <section>
            <div className="box_crm_tr">
              <p className="title_common_semi">Share OTP</p>
              <div className="bid_bg mt-4">
                <div className="bid_table">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">S.No.</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Number</th>
                          <th scope="col">Role</th>
                          <th scope="col">Otp</th>
                          <th scope="col">Expired At</th>
                          <th scope="col">Send Otp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {otpUser?.data?.length > 0 ? (
                          otpUser.data.map((deal, index) => (
                            <tr key={deal._id}>
                              <th scope="row">{index + 1}</th>
                              <td>{deal.userName}</td>
                              <td>{deal.email}</td>
                              <td>{deal.number || "-"}</td>
                              <td>{deal.role}</td>
                              <td>{deal?.otp?.value || "-"}</td>
                              <td>
                                {deal?.otp?.expiresAt
                                  ? moment(deal.otp.expiresAt).format(
                                      "YYYY-MM-DD HH:mm:ss"
                                    )
                                  : "-"}
                              </td>
                              <td>
                                {deal?.otp?.value ? (
                                  <button
                                    className="send_auth_again color_btn_ch"
                                    onClick={() =>
                                      updateOtpStatus(
                                        deal._id,
                                        deal.email,
                                        deal.otp.value
                                      )
                                    }
                                  >
                                    Send Otp
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              <h1>Not available</h1>
                            </td>
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
  );
};

export default OtpsprAdLogin;
