import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useFlightDeals } from "../context/FlightDealsContext.jsx";
import { useHotelDeals } from "../context/HotelDealsContext.jsx";
import io from "socket.io-client";
import axios from "axios";
import { getSocket } from "../context/SocketContext.jsx";

// const socket = io(import.meta.env.VITE_SOCKET_URL);
const socket = getSocket();

const SideBar = () => {
  const { flightDeals, setFlightDeals } = useFlightDeals();
  const { hotelDeals, setHotelDeals } = useHotelDeals();
  const [asideCustom, setAsideCustom] = useState(true);
  const initialPendingCount = flightDeals.filter(
    (deal) => deal.status === "newBooking"
  ).length;
  const [pendingBookings, setPendingBookings] = useState(initialPendingCount);
  const [bookingMails, setBookingMails] = useState(null);
  const [originalBookingMails, setOriginalBookingMails] = useState([]); // Store the original data
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState(""); // NEW
  const location = useLocation();

  const userRole = localStorage.getItem("auth");
  const parsedUserRole = JSON.parse(userRole);
  const userRoleName = parsedUserRole?.user?.role;

  // Sidebar visibility toggle
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    // Update pendingBookings whenever flightDeals changes
    const newPendingCount = flightDeals.filter(
      (deal) => deal.status === "newBooking"
    ).length;
    setPendingBookings(newPendingCount);
  }, [flightDeals]);

  useEffect(() => {
    const fetchBookingMails = async () => {
      try {
        const res = await axios.get("/api/v1/flights/get-booking-mails");

        if (res.data?.success) {
          setBookingMails(res.data.ctmFlightMails || []);
          setOriginalBookingMails(res.data.ctmFlightMails || []);
          // Log the actual fetched payload (not the state which updates asynchronously)
        } else {
          console.error("Failed to fetch booking mails:", res.data?.message);
        }
      } catch (error) {
        console.error("Error fetching booking mails:", error);
      }
    };

    fetchBookingMails();
  }, []);

  const uniqueValues = useMemo(() => {
    // bookingMails may be undefined/null/empty; guard against that
    if (!Array.isArray(bookingMails) || bookingMails.length === 0) {
      return [];
    }

    const setItems = new Set(
      bookingMails.map((mailData) =>
        JSON.stringify({ url: mailData?.webUrl, mail: mailData?.webMail })
      )
    );

    return Array.from(setItems)
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter((item) => item && (item.url || item.mail));
  }, [bookingMails]);

  // useEffect(() => {
  //   const handleNewFlightAdded = (data) => {
  //     if (data.success) {
  //       setFlightDeals((prevDeals) => {
  //         const updatedDeals = [data.data, ...prevDeals];

  //         setPendingBookings((prevCount) => {
  //           const newPendingCount = updatedDeals.filter(
  //             (deal) => deal.status === "newBooking"
  //           ).length;
  //           return newPendingCount;
  //         });

  //         return updatedDeals;
  //       });
  //     }
  //   };

  //   const handleNewHotelAdded = (data) => {
  //     if (data?.success) {
  //       setHotelDeals((prevDeals) => {
  //         const updatedDeals = [data.data, ...prevDeals];
  //         return updatedDeals;
  //       });
  //     }
  //   };

  //   socket.on("newFlightAdded", handleNewFlightAdded);
  //   socket.on("newHotelAdded", handleNewHotelAdded);

  //   return () => {
  //     socket.off("newFlightAdded", handleNewFlightAdded);
  //   };
  // }, [socket, setFlightDeals, setHotelDeals]);



  const _newFaresWayBookings = flightDeals.filter(
    (deal) => deal.status === "newBooking" && deal.webUrl === "faresway.com"
  ).length;

  const newTravelowaysBooking = flightDeals.filter(
    (deal) => deal.status === "newBooking" && deal.webUrl === "traveloways.com"
  ).length;

  const _newBusinessBookings = flightDeals.filter(
    (deal) =>
      deal.status === "newBooking" && deal.webUrl === "businessclassflyers.com"
  ).length;

  const mainTabs = useMemo(() => {
    let tabs = [];

    // ==========================
    // ROLE-BASED SECTIONS
    // ==========================

    if (userRoleName === "employee") {
      tabs.push({
        id: "employee-management",
        name: "Employee Management",
        subTabs: [
          { name: "Profile", path: "/astrivion/single-employee" },
          
        ],
      });
    }

    if (userRoleName === "hr") {
      tabs.push({
        id: "hr-management",
        name: "HR Management",
        subTabs: [{ name: "Attendance", path: "/astrivion/data-attendance" }],
      });
    }

    if (userRoleName === "account") {
      tabs.push({
        id: "account-management",
        name: "Account Management",
        subTabs: [{ name: "Attendance", path: "/astrivion/data-attendance" }],
      });
    }

    if (userRoleName === "marketing") {
      tabs.push({
        id: "marketing-management",
        name: "Marketing Management",
        subTabs: [
          { name: "AllVoiceRecord", path: "/astrivion/all-voice-record" },
        ],
      });
    }

    // ==========================
    //  COMMON TAB (Visible to Everyone)
    // ==========================
    tabs.push({
      id: "time-management",
      name: "Time Management",
      subTabs: [
       
        { name: "Punch In/Out", path: "/astrivion/single-employee" },
        // { name: "Attendance", path: "/astrivion/hr-attendance" },
      ],
    });


    // ==================================
    // ADMIN / SUPERADMIN / AEGNT TABS
    // ==================================

    if (
      userRoleName === "superadmin" ||
      userRoleName === "admin" ||
      userRoleName === "agent"
    ) {
      tabs.push({
        name: "PNRS",
        path: "/",
        img: "/imgs/pnr-icon.png",
        imgDrop: "/imgs/down-icon.png",
        subTabs: [
          {
            name: "All BIDS",
            path: "/astrivion/all-ctm-booking",
            img: "/imgs/pnr-icon.png",
          },
          {
            name: <span>Create PNR</span>,
            path: "/astrivion/create-flight-booking",
            img: "/imgs/pnr-icon.png",
            imgDrop: "/imgs/down-icon.png",
          },
           {
            name: <span>Create Ship PNR</span>,
            path: "/astrivion/create-ship-booking",
            img: "/imgs/pnr-icon.png",
            imgDrop: "/imgs/down-icon.png",
          },
        ],
      });

      tabs.push({
        name: "Agents",
        path: "/",
        img: "/imgs/agents-icon1.png",
        imgDrop: "/imgs/down-icon.png",
        subTabs: [
          {
            name: "All Agents",
            path: "/astrivion/all-agents",
            img: "/imgs/register-icon.png",
          },
          {
            name: "Add Call Log Details",
            path: "/astrivion/voice-detail",
            img: "/imgs/register-icon.png",
          },
        ],
      });

      // ==========================
      // TRAVELOWAYS TAB (FOR ALL)
      // ==========================
      tabs.push({
        name: (
          <span>
            Traveloways
            {newTravelowaysBooking > 0 && (
              <span className="badge bg-danger ms-2">
                {newTravelowaysBooking}
              </span>
            )}
          </span>
        ),
        path: "/",
        subTabs: [{ name: "Booking", path: "/astrivion/traveloways-booking" }],
      });

      // ==========================
      // DEAL'S MAILS (Only if uniqueValues available)
      // ==========================
      if (uniqueValues.length > 0) {
        tabs.push({
          name: "Deal's Mails",
          path: "/",
          subTabs: uniqueValues.map((value, index) => ({
            name: value.url
              ? value.url.replace(".com", "")
              : `Mail ${index + 1}`,
            path: value.url
              ? `/astrivion/booking-mails?url=${encodeURIComponent(value.url)}`
              : "#",
          })),
        });
      }
    }

    // ==========================
    // SUPERADMIN EXCLUSIVE
    // ==========================
    if (userRoleName === "superadmin") {
      tabs.unshift(
        {
          name: "SuperAdmin",
          path: "/",
          img: "/imgs/admin-icon-side.png",
          imgDrop: "/imgs/down-icon.png",
          subTabs: [
            {
              name: "Register Agents",
              path: "/astrivion/super-admin-register",
              img: "/imgs/register-icon.png",
            },
            {
              name: "Registration / Registered",
              path: "/astrivion/all-register-user",
              img: "/imgs/register-icon.png",
            },
            {
              name: "Otp Access",
              path: "/astrivion/login-otp",
              img: "/imgs/otp-icon.png",
            },
            {
              name: "Provider",
              path: "/astrivion/provider",
              img: "/imgs/provider-icon.png",
            },
            {
              name: "Auth & Invoice Mails",
              path: "/astrivion/auth-mails",
              img: "/imgs/provider-icon.png",
            },
            {
              name: "Add Airlines",
              path: "/astrivion/add-airline",
              img: "/imgs/airlines-icon1.png",
            },
            {
              name: "Add Airlines Class | Currency | Card",
              path: "/astrivion/add-currency-card",
              img: "/imgs/add-icon.png",
            },
            {
              name: "Charging & Refund Details",
              path: "/astrivion/charging-refund-details",
              img: "/imgs/add-icon.png",
            },
          ],
        },
        {
          name: "Admins",
          path: "/",
          img: "/imgs/admins-icon.png",
          imgDrop: "/imgs/down-icon.png",
          subTabs: [
            {
              name: "Registration Request",
              path: "/astrivion/admin-register-request",
              img: "/imgs/registration-request-icon.png",
            },
            {
              name: "Otp Access",
              path: "/astrivion/otp-login",
              img: "/imgs/otp-icon.png",
            },
          ],
        }
      );
    } else if (userRoleName === "admin") {
      tabs.unshift({
        name: "Admins",
        path: "/",
        subTabs: [
          { name: "All Admins", path: "/astrivion/all-admins" },
          { name: "Admin Booking", path: "/astrivion/admin-booking" },
          {
            name: "Registration Request",
            path: "/astrivion/admin-register-request",
          },
          { name: "Otp Access", path: "/astrivion/otp-login" },
        ],
      });
    }

    return tabs;
  }, [userRoleName, uniqueValues, newTravelowaysBooking]);

  // Set the active tab based on the current location
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    const matchedTab = mainTabs.find((tab) =>
      tab.subTabs.some((sub) => sub.path === currentPath)
    );

    setActiveTab(matchedTab ? matchedTab.name : "");

    if (matchedTab) {
      const matchedSub = matchedTab.subTabs.find(
        (sub) => sub.path === currentPath
      );

      setActiveSubTab(matchedSub ? matchedSub.name : "");
    } else {
      setActiveSubTab("");
    }
  }, [location.pathname, location.search, mainTabs]);

  const _pendingBookingsHotel = hotelDeals.filter(
    (deal) => deal.status === "newBooking"
  ).length;
  
  return (
    <>
      <button
        className={
          asideCustom ? "dashboard_show" : "dashboard_show dashboard_show_ac"
        }
        onClick={() => {
          setAsideCustom(!asideCustom);
        }}
      >
        <img src="/imgs/dashboard-icon.png" />
      </button>
      <aside
        className={
          asideCustom
            ? "crm_aside_c white"
            : "crm_aside_c white crm_aside_c_none"
        }
      >
        <div className="crm_logo white text-center relative">
          <img src="/imgs/logo.png" />
          <button
            className="aside_btnn"
            onClick={() => {
              setAsideCustom(!asideCustom);
            }}
          >
            <img src="/imgs/arrow-right.png" />
          </button>
        </div>
        <div className="main_m">
          <p>Menu Astrivion Ventures</p>
        </div>
        <div className="crm_ul_li">
          <ul>
            <li>
              <NavLink to="/">
                <div className="crm_icons">
                  <img src="/imgs/dashboard-icon.png" />
                </div>
                <p> Dashboard</p>
              </NavLink>
            </li>

            {mainTabs.map((tab) => (
              <li key={tab.name}>
                <NavLink
                  to={tab.path || "/"}
                  onClick={() =>
                    setActiveTab(activeTab === tab.name ? "" : tab.name)
                  }
                >
                  <div className="crm_icons">
                    <img src={tab.img} />
                  </div>
                  <p> {tab.name}</p>
                  <div className="drop_img">
                    <img src={tab.imgDrop} />
                  </div>
                </NavLink>
                {activeTab === tab.name && (
                  <ul className="sup_em">
                    {tab.subTabs.map((sub) => (
                      <li key={sub.name}>
                        <NavLink
                          to={sub.path}
                          onClick={() => setActiveSubTab(sub.name)}
                        >
                          <div className="crm_icons">
                            <img src={sub.img} />
                          </div>
                          <p>{sub.name}</p>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {userRoleName !== "employee" &&
              userRoleName !== "marketing" &&
              userRoleName !== "hr" &&
              userRoleName !== "account" && (
                <>
                  <li>
                    <li>
                      <NavLink to="/astrivion/find-booking">
                        <div className="crm_icons">
                          <img src="/imgs/booking-i.png" />
                        </div>
                        <p>Find Booking</p>
                      </NavLink>
                    </li>
                    <NavLink to="/astrivion/top-performers">
                      <div className="crm_icons">
                        <img src="/imgs/admin-icon1.png" />
                      </div>{" "}
                      <p> Top Performers</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/astrivion/my-performance">
                      <div className="crm_icons">
                        <img src="/imgs/performance-icon.png" />
                      </div>
                      <p>My Performance</p>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/astrivion/work-space">
                      <div className="crm_icons">
                        <img src="/imgs/online-sheet-icon1.png" />
                      </div>
                      <p>Online WorkSheet</p>
                    </NavLink>
                  </li>
                </>
              )}

           
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
