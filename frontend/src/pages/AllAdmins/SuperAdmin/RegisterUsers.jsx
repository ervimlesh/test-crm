import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import { MdDelete } from "react-icons/md";
import SuperThrash from "../../../components/SuperThrash.jsx";
import EditUserModal from "../../../components/EditUserModal.jsx";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/Auth.jsx";

const RegisterUsers = () => {
  const { auth,logout} = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sprThrash, setSprThrash] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Edit modal
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const closeSuperPop = () => {
    setShowModal(false);
  };

  const handleMoveToTrashSuccess = (id) => {
    setAllUsers(allUsers.filter((user) => user._id !== id));
    setShowModal(false);
  };
  // crud operation in typeScript using plain backend and plain frontend with structure
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/auth/get-all-users");
      console.log("newly console.log",res);
      setAllUsers(res.data.getAllusers.filter((user) => !user.isTrashed)); // Exclude trashed users
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
    const res  =  await axios.patch(`/api/v1/auth/status/${id}`, { status });
    
    if ( res && res?.data?.status === "rejected" && id === auth?.user?._id) {
      toast.error("Your access has been removed. Logging out...");
      logout();   
    }
    console.log("Status updated");
      fetchUsers(); // Refresh the list after updating the status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  // const rolesOrder = ["superadmin", "admin", "agent", "user"];
  const rolesOrder = [
    "superadmin",
    "admin",
    "agent",
    "marketing",
    "account",
    "hr",
    "employee",
  ];

  const updateUserRole = async (id, role) => {
  try {

    const res = await axios.patch(`/api/v1/auth/update-role/${id}`, { role });
    
    if(res && res?.data && res?.data?.succes){
      toast.success( res?.data?.message);
    }
    console.log("Role updated successfully");
    fetchUsers(); // Refresh after update
  } catch (error) {
    console.error("Error updating role:", error);
  }
};


  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        <div className="crm_right relative">
          <section className="">
            <div className="header_crm flex_props justify-content-between">
              <p className="crm_title">All Astrivion Ventures Teams</p>
            </div>
          </section>
          <section className="margin_minus_b">
            {rolesOrder.map((role) => (
              <div key={role} className="box_crm_tr margin_box_tr">
                <p className="title_common_semi">{role}</p>
                <div className="bid_bg mt-4">
                  <div className="bid_table">
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Number</th>
                            <th>Status</th>
                            <th>Edit User / Password</th>
                            <th>Action</th>
                            <th> Assign Role </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                Loading...
                              </td>
                            </tr>
                          ) : error ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                {error}
                              </td>
                            </tr>
                          ) : allUsers.filter((user) => user.role === role)
                              .length > 0 ? (
                            allUsers
                              .filter((user) => user.role === role)
                              .map((user, index) => (
                                <tr key={user._id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div>
                                      {user?.userPictures.map((picture) => (
                                        <>
                                          <div className="img_team">
                                            <img
                                              src={`${
                                                import.meta.env
                                                  .VITE_REACT_APP_MAIN_URL
                                              }uploads/${picture.img}`}
                                              alt={`${user.userName} Image missing`}
                                            />
                                          </div>
                                        </>
                                      ))}
                                    </div>
                                  </td>
                                  <td>{user.userName}</td>
                                  <td>{user.email}</td>
                                  <td>{user.number || "-"}</td>
                                  <td>
                                    {user.status === "pending" ? (
                                      <div className="flex_props justify-content-center gap-2">
                                        <button
                                          className="btns_status btns_status_success"
                                          onClick={() =>
                                            updateStatus(user._id, "approved")
                                          }
                                        >
                                          Approve
                                        </button>
                                        <button
                                          className="btns_status reject_btt"
                                          onClick={() => {
                                            setShowModal(true);
                                            setSprThrash(user._id);
                                          }}
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        className={
                                          user.status === "rejected"
                                            ? "btns_status"
                                            : "btns_status btns_status_success"
                                        }
                                        onClick={() =>
                                          updateStatus(
                                            user._id,
                                            user.status === "approved"
                                              ? "rejected"
                                              : "approved"
                                          )
                                        }
                                      >
                                        {user.status === "approved"
                                          ? "Remove Access"
                                          : "Grant Access"}
                                      </button>
                                    )}
                                  </td>

                                  <td>
                                    <button
                                      className="btns_status btns_status_success"
                                      onClick={() => {
                                        setEditUser(user);
                                        setShowEditModal(true);
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </td>

                                  {user.email !== "srijha723@gmail.com" && (
                                    <td>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                          setShowModal(true);
                                          setSprThrash(user._id);
                                        }}
                                      >
                                        <MdDelete />
                                      </button>
                                    </td>
                                  )}

                                  <td>
                                    <select
                                      value={user.role}
                                      onChange={(e) =>
                                        updateUserRole(user._id, e.target.value)
                                      }
                                      className="form-select border px-2 py-1 rounded-md"
                                    >
                                      {rolesOrder.map((r) => (
                                        <option key={r} value={r}>
                                          {r.charAt(0).toUpperCase() +
                                            r.slice(1)}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No users in this role.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      {showModal && (
        <SuperThrash
          setShowModal={setShowModal}
          sprThrash={sprThrash}
          onClose={closeSuperPop}
          onMoveToTrashSuccess={handleMoveToTrashSuccess}
        />
      )}
      {showEditModal && (
        <EditUserModal
          user={editUser}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchUsers}
        />
      )}
    </Layout>
  );
};

export default RegisterUsers;
