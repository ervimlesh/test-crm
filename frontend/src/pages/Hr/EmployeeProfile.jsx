import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import SideBar from "../../components/SideBar";

const EmployeeProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const employee = state?.employee;

  // Format joining date safely
  const joiningDate = employee?.createdAt
    ? new Date(employee.createdAt).toLocaleString()
    : "N/A";

// 
  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <h2> Profile</h2>
          {!employee ? (
            <p style={{ color: "red" }}>No employee data found</p>
          ) : (
            <div className="card p-3 mt-3">
              {/* Profile Image */}
              <div className="text-center">
                {employee?.userPictures.map((picture) => (
                  <>
                    <div className="productImgContainer crud-table-img">
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_MAIN_URL
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
                ))}
              </div>

              {/* Employee Details */}
              <h4>Name:{employee.userName}</h4>
              <p>
                <b>Email:</b> {employee.email}
              </p>
              <p>
                <b>Role:</b> {employee.role}
              </p>
              <p>
                <b>Status:</b> {employee.status}
              </p>
              <p>
                <b>Phone:</b> {employee.number}
              </p>
              <p>
                <b>Joining Date:</b> {joiningDate}
              </p>

              <button
                className="btn btn-secondary mt-2"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeProfile;
