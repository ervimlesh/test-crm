import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";
import { IoIosContact } from "react-icons/io";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Header = () => {
  const { auth, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [dropP, setDropP] = useState(false);
  const handleLogout = async () => {
    try {
      // Punch out before logging out
      // const employeeId = auth?.user?._id;  
      // if (employeeId) {
      //   console.log(employeeId);
      //   const res = await axios.put(
      //     `/api/v1/management/punch-out/${employeeId}`
      //   );
 
      //   if (!res?.data?.sucess) {
      //     toast.error(res?.data?.message);
      //   }
      //   else{
      //       toast.error(res?.data?.message);
      //   }
      // }
 
      logout();
      toast.success("Logout Out Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error punching out:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <div className="mt-1">
      {!isAuthenticated ? (
        <> </>
      ) : (
        <>
          <button
            className="profile_img flex_props relative"
            onClick={() => {
              setDropP(!dropP);
            }}
          >
            <div className="profile_i">
              <img src="/imgs/profile-i.png" />
            </div>
            <div className="profile_content">
              <p className="profile_title">{auth?.user?.userName}</p>
              <p className="font_12 flex_props gap-1">
                Role : {auth?.user?.role}
                <img src="/imgs/down-icon.png" />
              </p>
            </div>

            <div
              className={
                dropP
                  ? "profile_cont_semi profile_cont_semi_ac"
                  : "profile_cont_semi"
              }
            >
              <ul>
                <li>
                  <NavLink to="/astrivion/profile">
                 
                    <img src="/imgs/user-icon.png" /> My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout} to="#">
                    <img src="/imgs/logout-icon.png" />
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
