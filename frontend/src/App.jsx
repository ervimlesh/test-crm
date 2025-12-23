import React, { useEffect, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import SuperAdminRoute from "./routes/SuperAdminRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import UserRoute from "./routes/UserRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import { useAuth } from "./context/Auth.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Loader from "./components/Loader.jsx";
import { getSocket } from "./context/SocketContext.jsx";
import { useCtmFlightDeals } from "./context/CtmFlightDealsContext.jsx";
import * as Pages from "./Routes/LazyPages.jsx";

function App() {
  // useAxiosInterceptor();
  const { auth, isAuthenticated } = useAuth();

  const { ctmFlightDeals, setCtmFlightDeals } = useCtmFlightDeals();

  useEffect(() => {
    const socket = getSocket();
    const handleNewCtmFlight = (data) => {
      if (!data?.success || !data?.data) return;
      setCtmFlightDeals((prev) =>
        (prev || []).some((f) => f._id === data.data._id)
          ? prev
          : [data.data, ...(prev || [])]
      );
    };
    if (socket) {
      socket.on("newCtmFlight", handleNewCtmFlight);
      socket.on("newCtmFlightBroadcast", handleNewCtmFlight);
    }
    return () => {
      socket?.off("newCtmFlight", handleNewCtmFlight);
      socket?.off("newCtmFlightBroadcast", handleNewCtmFlight);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Toaster />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home ctmFlightDeals={ctmFlightDeals} />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}

          <Route
            path="/"
            element={
              isAuthenticated ? (
                auth?.user?.role === "superadmin" ? (
                  <Pages.Home />
                ) : auth?.user?.role === "admin" ? (
                  <Pages.AdminHome />
                ) : auth?.user?.role === "agent" ? (
                  <Pages.AgentHome />
                ) : auth?.user?.role === "account" ? (
                  <Pages.EmployeeHome />
                ) : auth?.user?.role === "marketing" ? (
                  <Pages.MarketingHome />
                ) : auth?.user?.role === "employee" ? (
                  <Pages.EmployeeHome />
                ) : (
                  <Pages.Home />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={!isAuthenticated ? <Pages.Login /> : <Navigate to="/" />}
          />
          <Route path="/ip-restricted" element={<Pages.IpRestricted />} />
          <Route path="/register" element={<Pages.Register />} />
          <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
          {/* Private Routes */}
          <Route
            path="/astrivion/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route
                    path="dashboard/superAdmin"
                    element={
                      <SuperAdminRoute>
                        <Pages.SuperAdminUserDashboard />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="dashboard/admin"
                    element={
                      <AdminRoute>
                        <Pages.AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="dashboard/user"
                    element={
                      <UserRoute>
                        <Pages.UserDashboard />
                      </UserRoute>
                    }
                  />

                  {/* Auth */}

                  {/* -----------------------start superadmin route -t------------------------------------------ */}

                  <Route element={<RoleRoute allowedRoles={["superadmin"]} />}>
                    <Route path="otp-login" element={<Pages.OtpLogin />} />
                    <Route path="login-otp" element={<Pages.OtpsprAdLogin />} />
                    <Route path="agents" element={<Pages.Agents />} />

                    {/* <Route path="agent-booking" element={<AgentBooking />} /> */}
                    <Route path="all-admins" element={<Pages.AllAdmins />} />
                    <Route
                      path="super-admin-dashboard"
                      element={<Pages.SuperAdminDashboard />}
                    />
                    <Route
                      path="super-admin-register"
                      element={<Pages.SuperAdminRegister />}
                    />
                    <Route
                      path="all-register-user"
                      element={<Pages.RegisterUsers />}
                    />
                    <Route
                      path="admin-register-request"
                      element={<Pages.AadminRegistrationRequest />}
                    />
                    <Route
                      path="admin-booking"
                      element={<Pages.AdminBooking />}
                    />
                    <Route path="brokers" element={<Pages.Brokers />} />
                    <Route
                      path="flight-deals"
                      element={<Pages.FlightDeals />}
                    />
                    <Route path="hotel-deals" element={<Pages.HotelDeals />} />
                    <Route path="package" element={<Pages.Package />} />
                    <Route path="car" element={<Pages.Car />} />

                    <Route
                      path="booking-mails"
                      element={<Pages.BookingMails />}
                    />

                    <Route
                      path="business-query"
                      element={<Pages.BusinessQuery />}
                    />
                    <Route
                      path="business-booking"
                      element={<Pages.BusinessDelas />}
                    />
                    <Route
                      path="traveloways-booking"
                      element={<Pages.TravelowaysBooking />}
                    />
                    <Route
                      path="faresway-booking"
                      element={<Pages.FaresWayBooking />}
                    />

                    <Route
                      path="flight-pnr"
                      element={<Pages.GeneratePnrFlight />}
                    />

                    <Route
                      path="reduce-price-superadmin"
                      element={<Pages.ReducePrice />}
                    />
                    <Route path="src-dest" element={<Pages.SrcDest />} />
                    <Route
                      path="src-dest-details/:id"
                      element={<Pages.SrcDestDetails />}
                    />
                    <Route
                      path="reduce-src-dest-details/:id"
                      element={<Pages.ReduceSrcDest />}
                    />

                    <Route
                      path="all-ctm-booking"
                      element={<Pages.AllCtmFlights />}
                    />
                    <Route path="provider" element={<Pages.Provider />} />
                     <Route path="auth-mails" element={<Pages.AuthMails />} />

                    <Route
                      path="/invoice-preview-cancellation-for-refund"
                      element={<Pages.InvoicePreviewCancellation />}
                    />
                    <Route
                      path="/invoice-preview-cancellation-for-future-refund"
                      element={<Pages.InvoicePreviewFutureRefeund />}
                    />

                    <Route
                      path="/today-flight"
                      element={<Pages.TodayFlight />}
                    />

                    <Route
                      path="/invoice-preview-ticket-issuance"
                      element={<Pages.TicketIssueInvoicePreview />}
                    />

                    <Route
                      path="/auth-invoice-preview-ticket-issuance"
                      element={<Pages.AuthTicketIssuePreview />}
                    />

                    <Route path="add-airline" element={<Pages.Airline />} />

                    <Route
                      path="/add-currency-card"
                      element={<Pages.SuperAdminDropdownPage />}
                    />

                    <Route
                      path="ctm-fresh-booking"
                      element={<Pages.CtmFreshBooking />}
                    />

                    <Route
                      path="/auth-refund-invoice-preview"
                      element={<Pages.RefundInVoicePreview />}
                    />
                    <Route
                      path="/auth-future-credit-invoice-preview"
                      element={<Pages.FutureCreditInVoicePreview />}
                    />
                    <Route
                      path="ctm-today-revenue"
                      element={<Pages.TodayRevenue />}
                    />
                    <Route
                      path="ctm-all-revenue"
                      element={<Pages.AllRevenue />}
                    />
                    <Route
                      path="authorize-preview"
                      element={<Pages.AuthorizePreview />}
                    />

                    <Route
                      path="ticket-mco-charged-preview"
                      element={<Pages.TicketMcoPreview />}
                    />
                    <Route
                      path="/voice-detail"
                      element={<Pages.VoiceDetail />}
                    />
                  </Route>

                  <Route
                    path="ctm-today-booking-superadmin"
                    element={<Pages.CtmSuperAdminTodayBooking />}
                  />

                  <Route
                    path="ctm-today-revenue-superadmin"
                    element={<Pages.CtmSuperAdminTodayRevenue />}
                  />
                  <Route
                    path="charging-refund-details"
                    element={<Pages.ChargingRefundDetail />}
                  />

                  {/* -----------------------end superadmin route------------------------------------------------*/}

                  {/* --------------------------- start admin route---------------------------------------------- */}

                  <Route
                    element={
                      <RoleRoute allowedRoles={["admin", "superadmin"]} />
                    }
                  >
                    {" "}
                    <Route
                      path="ctm-today-booking-admin/:id"
                      element={<Pages.CtmAdminTodayBooking />}
                    />
                    <Route
                      path="ctm-today-revenue-admin/:id"
                      element={<Pages.CtmAdminTodayRevenue />}
                    />{" "}
                    <Route
                      path="/invoice-preview"
                      element={<Pages.InvoicePreview />}
                    />
                  </Route>
                  {/* ---------------------------end admin route ---------------------------------------------- */}

                  {/* --------------------------- start agent route ---------------------------------------------- */}

                  <Route
                    element={
                      <RoleRoute
                        allowedRoles={["admin", "superadmin", "agent"]}
                      />
                    }
                  >

                    
                    <Route
                      path="/active-agent"
                      element={<Pages.ActiveAgent />}
                    />
                    <Route
                      path="ctm-today-booking"
                      element={<Pages.CtmTodayBooking />}
                    />
                    <Route
                      path="details-pnr-flight/:id"
                      element={<Pages.DetailsPnrFlight />}
                    />{" "}
                    <Route path="all-agents" element={<Pages.AllAgent />} />
                    <Route
                      path="find-booking"
                      element={<Pages.CustomBookingFind />}
                    />
                    <Route
                      path="my-performance"
                      element={<Pages.MyPerformance />}
                    />
                    <Route path="work-space" element={<Pages.MyWorkSpace />} />
                    <Route
                      path="top-performers"
                      element={<Pages.TopPerformance />}
                    />
                    <Route
                      path="ctm-today-booking-agent/:id"
                      element={<Pages.CtmAgentTodayBooking />}
                    />
                    <Route
                      path="ctm-today-revenue-agent/:id"
                      element={<Pages.CtmAgentTodayRevenue />}
                    />
                    <Route
                      path="/auth-invoice-preview"
                      element={<Pages.AuthInvoicePreview />}
                    />
                    <Route
                      path="create-flight-booking"
                      element={<Pages.CreateCtmFlight />}
                    />

                     <Route
                      path="create-ship-booking"
                      element={<Pages.CreateCtmShip />}
                    />

                  </Route>

                  <Route path="*" element={<Navigate to="/404" replace />} />

                  {/* --------------------------- end agent route---------------------------------------------- */}

                  {/* =====================================marketing route============================================ */}

                  <Route
                    element={
                      <RoleRoute allowedRoles={["marketing", "superadmin"]} />
                    }
                  >
                    <Route
                      path="/all-voice-record"
                      element={<Pages.AllVoiceRecord />}
                    />
                  </Route>

                  {/* ===================================== end marketing route============================================ */}
                  {/* ---------------------------start Hr & other route ---------------------------------------------- */}
                  <Route
                    path="employee/profile/:id"
                    element={<Pages.EmployeeProfile />}
                  />
                  <Route
                    path="employee/slip/:id"
                    element={<Pages.EmployeeSlip />}
                  />
                  <Route
                    path="employee/attendance/:id"
                    element={<Pages.EmployeeAttendance />}
                  />
                  <Route
                    path="data-attendance"
                    element={<Pages.AttendancePage />}
                  />
                  <Route path="checkin" element={<Pages.CheckInPage />} />
                  <Route
                    path="single-employee"
                    element={<Pages.SingleEmployee />}
                  />
                  <Route
                    path="hr-attendance"
                    element={<Pages.AllAttendance />}
                  />
                  <Route
                    path="single-attendance/:employeeId"
                    element={<Pages.SingleAttendance />}
                  />
                  <Route path="profile" element={<Pages.Profile />} />
                  {/* ---------------------------end Hr & other route---------------------------------------------- */}
                </Routes>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Pages.PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
