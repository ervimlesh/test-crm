import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const UserSidebar = () => {

    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };





    return (
        <div className="d-flex bg-light">
            <div>
                <button
                    className={`${isSidebarVisible ? "hide1" : "show1"}`}
                    onClick={toggleSidebar}
                >
                    <RxHamburgerMenu />
                </button>

                {isSidebarVisible && (
                    <div
                        className="p-3"
                        style={{ position: "relative", width: "250px", minHeight: "100vh" }}
                    >

                        <NavLink to="/" className="text-decoration-none text-dark fw-bold mb-4 d-block">
                            <p>Home</p>
                        </NavLink>

                        <ul className="list-unstyled">

                            {/* <li lassName="mb-3">
                                <NavLink to="/dashboard/s-personal-dashboard" className='text-decoration-none text-dark fw-sm mb-4 d-block' >
                                    Dashboard
                                </NavLink>


                            </li> */}

                            <li lassName="mb-3">
                                <NavLink to="/dashboard/s-personal-dashboard" className='text-decoration-none text-dark fw-sm mb-4 d-block' >
                                    Dashboard
                                </NavLink>


                            </li>

                        </ul>
                        {/*     
                            <NavLink
                                to="/flight-deals"
                                className={`text-decoration-none ${location.pathname === "/flight-deals" ? "text-primary fw-bold" : "text-dark"} mt-4 d-block`}
                            >
                                <p>Flight Deals</p>
                            </NavLink>
                            <NavLink
                                to="/hotel-deals"
                                className={`text-decoration-none ${location.pathname === "/hotel-deals" ? "text-primary fw-bold" : "text-dark"} mt-4 d-block`}
                            >
                                <p>Hotel Deals</p>
                            </NavLink> */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSidebar