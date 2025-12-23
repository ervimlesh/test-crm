// src/routes/LazyPages.js
import { lazy } from "react";

// ========== Auth ==========
export const Login = lazy(() => import("../pages/Auth/Login.jsx"));
export const Register = lazy(() => import("../pages/Auth/Register.jsx"));
export const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword.jsx"));
export const OtpLogin = lazy(() => import("../pages/Auth/OtpLogin.jsx"));
export const OtpsprAdLogin = lazy(() => import("../pages/Auth/OtpsprAdLogin.jsx"));
export const MyWorkSpace = lazy(() => import("../pages/Auth/MyWorkSpace.jsx"));
export const MyPerformance = lazy(() => import("../pages/Auth/MyPerformance.jsx"));
export const Profile = lazy(() => import("../pages/Auth/Profile.jsx"));

// ========== Dashboards ==========
export const SuperAdminDashboard = lazy(() => import("../pages/AllAdmins/SuperAdmin/SuperAdminDashboard.jsx"));
export const AdminDashboard = lazy(() => import("../pages/AllAdmins/Admin/AdminDashboard.jsx"));
export const UserDashboard = lazy(() => import("../pages/User/UserDashboard.jsx"));

// ========== Super Admin ==========
export const AllAdmins = lazy(() => import("../pages/AllAdmins/Admin/AllAdmins.jsx"));
export const RegisterUsers = lazy(() => import("../pages/AllAdmins/SuperAdmin/RegisterUsers.jsx"));
export const SuperAdminRegister = lazy(() => import("../pages/AllAdmins/SuperAdmin/SuperAdminRegister.jsx"));
export const ReducePrice = lazy(() => import("../pages/AllAdmins/SuperAdmin/ReducePrice.jsx"));
export const SrcDest = lazy(() => import("../pages/AllAdmins/SuperAdmin/SrcDest.jsx"));
export const SrcDestDetails = lazy(() => import("../pages/AllAdmins/SuperAdmin/SrcDestDetails.jsx"));
export const ReduceSrcDest = lazy(() => import("../pages/AllAdmins/SuperAdmin/ReduceSrcDest.jsx"));
export const Provider = lazy(() => import("../pages/AllAdmins/SuperAdmin/Provider.jsx"));
export const Airline = lazy(() => import("../pages/AllAdmins/SuperAdmin/Airline.jsx"));
export const TodayRevenue = lazy(() => import("../pages/AllAdmins/SuperAdmin/TodayRevenue.jsx"));
export const AllRevenue = lazy(() => import("../pages/AllAdmins/SuperAdmin/AllRevenue.jsx"));
export const SuperAdminDropdownPage = lazy(() => import("../pages/AllAdmins/SuperAdmin/SuperAdminDropdownPage.jsx"));
export const SuperAdminHome = lazy(() => import("../pages/AllAdmins/SuperAdmin/SuperAdminHome.jsx"));
export const CtmSuperAdminTodayBooking = lazy(() => import("../pages/AllAdmins/SuperAdmin/CtmSuperAdminTodayBooking.jsx"));
export const CtmSuperAdminTodayRevenue = lazy(() => import("../pages/AllAdmins/SuperAdmin/CtmSuperAdminTodayRevenue.jsx"));
export const ChargingRefundDetail = lazy(() => import("../pages/AllAdmins/SuperAdmin/ChargingRefundDetail.jsx"));
export const TicketIssueInvoicePreview = lazy(() => import("../pages/CustomDeals/TicketIssueInvoicePreview.jsx"));
export const TodayFlight = lazy(() => import("../pages/AllAdmins/SuperAdmin/TodayFlight.jsx"));
export const AuthTicketIssuePreview = lazy(() => import("../pages/CustomDeals/AuthTicketIssuePreview.jsx"));
export const AuthMails = lazy(() => import("../pages/AllAdmins/SuperAdmin/AuthMails.jsx") )

// ========== Admin ==========
export const AdminHome = lazy(() => import("../pages/AllAdmins/Admin/AdminHome.jsx"));
export const AdminBooking = lazy(() => import("../pages/AllAdmins/Admin/AdminBooking.jsx"));
export const AadminRegistrationRequest = lazy(() => import("../pages/AllAdmins/Admin/AadminRegistrationRequest.jsx"));
export const CtmAdminTodayBooking = lazy(() => import("../pages/AllAdmins/Admin/CtmAdminTodayBooking.jsx"));
export const CtmAdminTodayRevenue = lazy(() => import("../pages/AllAdmins/Admin/CtmAdminTodayRevenue.jsx"));

// ========== Agent ==========
export const Agents = lazy(() => import("../pages/Agent/Agents.jsx"));
export const AllAgent = lazy(() => import("../pages/Agent/AllAgent.jsx"));
export const ActiveAgent = lazy(() => import("../pages/Agent/ActiveAgent.jsx"));
export const AgentBooking = lazy(() => import("../pages/Agent/AgentBooking.jsx"));
export const AgentHome = lazy(() => import("../pages/Agent/AgentHome.jsx"));
export const VoiceDetail = lazy(() => import("../pages/Agent/VoiceDetail.jsx"));
export const CtmAgentTodayBooking = lazy(() => import("../pages/Agent/CtmAgentTodayBooking.jsx"));
export const CtmAgentTodayRevenue = lazy(() => import("../pages/Agent/CtmAgentTodayRevenue.jsx"));

// ========== Flights / Custom Deals ==========
export const FlightDeals = lazy(() => import("../pages/Flight/FlightDeals.jsx"));
export const BookingMails = lazy(() => import("../pages/Flight/BookingMails.jsx"));
export const CreateCtmFlight = lazy(() => import("../pages/CustomDeals/CreateCtmFlight.jsx"));
export const CreateCtmShip = lazy(() => import("../pages/CustomShip/CreateCtmShip.jsx"));
export const GeneratePnrFlight = lazy(() => import("../pages/CustomDeals/GeneratePnrFlight.jsx"));
export const DetailsPnrFlight = lazy(() => import("../pages/CustomDeals/DetailsPnrFlight.jsx"));
export const AllCtmFlights = lazy(() => import("../pages/CustomDeals/AllCtmFlights.jsx"));
export const CtmTodayBooking = lazy(() => import("../pages/CustomDeals/CtmTodayBooking.jsx"));
export const CtmFreshBooking = lazy(() => import("../pages/CustomDeals/CtmFreshBooking.jsx"));
export const InvoicePreview = lazy(() => import("../pages/CustomDeals/InvoicePreview.jsx"));
export const AuthInvoicePreview = lazy(() => import("../pages/CustomDeals/AuthInvoicePreview.jsx"));
export const RefundInVoicePreview = lazy(() => import("../pages/CustomDeals/RefundInVoicePreview.jsx"));
export const FutureCreditInVoicePreview = lazy(() => import("../pages/CustomDeals/FutureCreditInVoicePreview.jsx"));
export const InvoicePreviewFutureRefeund = lazy(() => import("../pages/CustomDeals/InvoicePreviewFutureRefeund.jsx"));
export const InvoicePreviewCancellation = lazy(() => import("../pages/CustomDeals/InvoicePreviewCancellation.jsx"));
export const AuthorizePreview = lazy(() => import("../pages/CustomDeals/AuthorizePreview.jsx"));
export const TicketMcoPreview = lazy(() => import("../pages/AllAdmins/SuperAdmin/TicketMcoPreview.jsx"));
export const CustomBookingFind = lazy(() => import("../pages/CustomDeals/CustomBookingFind.jsx"));

// ========== Misc ==========
export const HotelDeals = lazy(() => import("../pages/Hotel/HotelDeals.jsx"));
export const Package = lazy(() => import("../pages/packages/Package.jsx"));
export const Car = lazy(() => import("../pages/Cars/Car.jsx"));
export const BusinessQuery = lazy(() => import("../pages/Business/BusinessQuery.jsx"));
export const BusinessDelas = lazy(() => import("../pages/Business/BusinessDelas.jsx"));
export const TravelowaysBooking = lazy(() => import("../pages/Traveloways/TravelowaysBooking.jsx"));
export const FaresWayBooking = lazy(() => import("../pages/FaresWay/FaresWayBooking.jsx"));

export const Home = lazy(() => import("../pages/Home.jsx"));
export const TopPerformance = lazy(() => import("../TopPerformance.jsx"));

// ========== Marketing ==========
export const MarketingHome = lazy(()=> import("../pages/Marketing/MarketingHome.jsx"))
export const AllVoiceRecord = lazy(() => import("../pages/Marketing/AllVoiceRecord.jsx"));

// ========== HR & Management ==========
export const AttendancePage = lazy(() => import("../pages/Management/AttendancePage.jsx"));
export const CheckInPage = lazy(() => import("../pages/Management/CheckInPage.jsx"));
export const SingleEmployee = lazy(() => import("../pages/Management/SingleEmployee.jsx"));
export const AllAttendance = lazy(() => import("../pages/Management/AllAttendance.jsx"));
export const SingleAttendance = lazy(() => import("../pages/Management/SingleAttendance.jsx"));
export const EmployeeProfile = lazy(() => import("../pages/Hr/EmployeeProfile.jsx"));
export const EmployeeSlip = lazy(() => import("../pages/Account/EmployeeSlip.jsx"));
export const EmployeeAttendance = lazy(() => import("../pages/Hr/EmployeeAttendance.jsx"));
export const EmployeeHome = lazy(() => import("../pages/Account/EmployeeHome.jsx"));

// ========== Utils ==========
export const PageNotFound = lazy(() => import("../pages/PageNotFound.jsx"));
export const IpRestricted = lazy(() => import("../pages/utils/ip-restricted.jsx"));
