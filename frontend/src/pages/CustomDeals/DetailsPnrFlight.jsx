import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import toast from "react-hot-toast";
import moment from "moment";
import { FaLine } from "react-icons/fa";
import { useAuth } from "../../context/Auth.jsx";
import DatePicker from "react-datepicker";
import { formatEST } from "../utils/formatUTC.jsx";
import { getSocket } from "../../context/SocketContext.jsx";
// const socket = io(import.meta.env.VITE_SOCKET_URL, {
//   transports: ["websocket"],
// });
const socket = getSocket();

const DetailsPnrFlight = () => {
  const { id: flightId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const ticketMcoRef = useRef();

  const [flightDetails, setFlightDetails] = useState({});
  const [providers, setProviders] = useState([]);
  const [ctmAirline, setCtmAirline] = useState([]);
  const [curDrop, setCurDrop] = useState([]);
  const [classDrop, setClassDrop] = useState([]);
  const [cardDrop, setCardDrop] = useState([]);

  const [pnrRemark, setPnrRemark] = useState("");
  const [pnrShowModal, setPnrShowModal] = useState(false);
  const [modalPurpose, setModalPurpose] = useState("");
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [originalSegments, setOriginalSegments] = useState({
    outboundSegments: [],
    inboundSegments: [],
  });

  const [isPriceEditable, setIsPriceEditable] = useState(false);
  const [isChargingEditable, setIsChargingEditable] = useState(false);
  const [isPassengerEditable, setIsPassengerEditable] = useState(false);
  const [isBillingEditable, setIsBillingEditable] = useState(false);
  const [isBillingEditable2, setIsBillingEditable2] = useState(false);
  const [isRefundEditable, setIsRefundEditable] = useState(false);
  const [isChargebackEditable, setIsChargebackEditable] = useState(false);
  const [isFutureCreditEditable, setIsFutureCreditEditable] = useState(false);
  const [isTicketIssueEditable, setIsTicketIssueEditable] = useState(false);
  const [isIineraryUpdateEditable, setIsIineraryUpdateEditable] =
    useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Handler for AuthorizePreview button
  const handleAuthorizePreview = async () => {
    if (flightDetails?.pnrStatus === "approved") {
      navigate("/astrivion/authorize-preview", {
        state: { flightDetails },
      });
    } else {
      toast.error("PNR status must be approved to authorize preview.");
    }
  };

  // Handler for Ticket and Mco charged button
  const handleTicketMcoCharged = async () => {
    if (flightDetails?.ticketmco === "ticketMco") {
      navigate("/astrivion/ticket-mco-charged-preview", {
        state: { flightDetails },
      });
    } else {
      toast.error("Bid status must be approved to proceed.");
    }
  };
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/flights/get-single-flight/${flightId}`
        );

        console.log("data is coming", data);

        if (data.success) {
          setFlightDetails(data.data);
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
      }
    };

    fetchFlightDetails();
  }, [flightId, showActivityModal]);

  useEffect(() => {
    socket.on("pnrStatusUpdated", (data) => {
      if (data.flightId === flightId && data.pnrStatus) {
        setFlightDetails((prev) => ({ ...prev, pnrStatus: data.pnrStatus }));
      }
    });
    return () => socket.off("pnrStatusUpdated");
  }, [flightId]);

  useEffect(() => {
    const fetchDropdown = async (type, setter) => {
      try {
        const res = await axios.get(
          `/api/v1/dropdown/get-dropdown?type=${type}`
        );
        setter(res.data.items);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load dropdown items");
      }
    };

    fetchDropdown("currency", setCurDrop);
    fetchDropdown("class", setClassDrop);
    fetchDropdown("cardType", setCardDrop);
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-provider");
        if (res.data.success) setProviders(res.data.booking);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };
    const fetchCtmAirline = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-ctmAirline");
        if (res.data.success) setCtmAirline(res.data.booking);
      } catch (error) {
        console.error("Failed to fetch ctmAirline", error);
      }
    };
    fetchProviders();
    fetchCtmAirline();
  }, []);

  useEffect(() => {
    if (
      originalSegments.outboundSegments.length === 0 &&
      originalSegments.inboundSegments.length === 0 &&
      (flightDetails?.outboundSegments?.length > 0 ||
        flightDetails?.inboundSegments?.length > 0)
    ) {
      setOriginalSegments({
        outboundSegments: JSON.parse(
          JSON.stringify(flightDetails.outboundSegments || [])
        ),
        inboundSegments: JSON.parse(
          JSON.stringify(flightDetails.inboundSegments || [])
        ),
      });
      // setIsSegmentChanged(false);
    } else {
      const hasChanges =
        JSON.stringify(flightDetails.outboundSegments) !==
          JSON.stringify(originalSegments.outboundSegments) ||
        JSON.stringify(flightDetails.inboundSegments) !==
          JSON.stringify(originalSegments.inboundSegments);
      // setIsSegmentChanged(hasChanges);
    }
  }, [flightDetails, originalSegments]);

  const handleSegmentChange = (type, index, field, value) => {
    setFlightDetails((prev) => {
      const updated = [...prev[`${type}Segments`]];
      updated[index][field] = value;
      return { ...prev, [`${type}Segments`]: updated };
    });
  };

  const handleItineraryUpdate = async () => {
    try {
      await axios.patch(`/api/v1/ctmFlights/update-segments/${flightId}`, {
        outboundSegments: flightDetails.outboundSegments,
        inboundSegments: flightDetails.inboundSegments,
      });

      alert("Itinerary segments updated!");
      setOriginalSegments({
        outboundSegments: JSON.parse(
          JSON.stringify(flightDetails.outboundSegments)
        ),
        inboundSegments: JSON.parse(
          JSON.stringify(flightDetails.inboundSegments)
        ),
      });

      setIsIineraryUpdateEditable(false);
    } catch (err) {
      console.log("its error err", err);
      alert("Failed to update itinerary segments.");
    }
  };

  const handleProviderUpdate = async () => {
    try {
      await axios.patch(`/api/v1/ctmFlights/update-provider/${flightId}`, {
        provider: flightDetails?.provider,
      });
      alert("Provider updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating provider.");
    }
  };

  const handleBidStatusUpdate = async () => {
    try {
      const value = ticketMcoRef.current.value;

      if (!value) {
        alert("Please select a valid bid status");
        return;
      }

      const res = await axios.patch(
        `/api/v1/ctmFlights/update-bid-status/${flightId}`,
        {
          ticketmco: value,
          adminAuthorize: flightDetails?.adminAuthorize,
          bidStatus: flightDetails?.bidStatus,
        }
      );

      if (res.data.success) {
        setFlightDetails((prev) => ({
          ...prev,
          ticketmco: value,
        }));
      }

      if (
        res &&
        res?.data?.booking?.ticketmco &&
        res?.data?.booking?.ticketmco === "ticketMco"
      ) {
        handleRemarksConfirm();
      }

      alert("Bid status updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating bid status.");
    }
  };

  const formattedCreatedAt = flightDetails.createdAt
    ? new Date(flightDetails.createdAt).toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "N/A";

  const userRole = localStorage.getItem("auth");
  const parsedUserRole = JSON.parse(userRole);
  const userRoleName = parsedUserRole?.user?.userName;

  useEffect(() => {
    setFlightDetails((prev) => ({
      ...prev,
      chargingBaseFare: prev.chargingBaseFare || prev.baseFare,
      chargingTaxes: prev.chargingTaxes || prev.taxes,
    }));
  }, [flightDetails?.baseFare, flightDetails?.taxes]);
  const [verifyMe, setVerifyMe] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  const handleClickVerify = () => {
    if (clickTimer) clearTimeout(clickTimer);

    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 4) {
        setVerifyMe((prevVerify) => !prevVerify);
        return 0;
      }
      return newCount;
    });

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    setClickTimer(timer);
  };
  const handleRemarksConfirm = () => {
    if (flightDetails.transactionType === "cancellationRefund") {
      navigate("/astrivion/invoice-preview-cancellation-for-refund", {
        state: { flightDetails, isAuthFlow: true },
      });
    } else if (flightDetails.transactionType === "cancellationFutureCredit") {
      navigate("/astrivion/invoice-preview-cancellation-for-future-refund", {
        state: { flightDetails, isAuthFlow: true },
      });
    } else if (flightDetails.transactionType === "ticketIssuance") {
      navigate("/astrivion/invoice-preview-ticket-issuance", {
        state: { flightDetails, isAuthFlow: true },
      });
    } else {
      navigate("/astrivion/invoice-preview", {
        state: { flightDetails, isAuthFlow: true },
      });
    }
  };

  const transactionTypeLabels = {
    newBooking: "New Booking",
    exchange: "Exchange",
    seatAssignments: "Seat Assignments",
    upgrade: "Upgrade",
    cancellationRefund: "Cancellation for Refund",
    cancellationFutureCredit: "Cancellation for Future Credit",
    extraAddOn: "Extra Add On",
    ticketIssuance: "Ticket Issuance",
  };

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />

        <div className="crm_right relative">
          <section className="">
            <div className="header_crm flex_props justify-content-between">
              <p className="crm_title">Provider Details</p>
            </div>
            <div className="box_crm_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Details of Auth Form
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div className="flex_props gap_2">
                    {/* Close Booking Button */}
                    <button
                      onClick={() => {
                        setModalPurpose("close");
                        setPnrShowModal(true);
                      }}
                      className="send_auth_again"
                    >
                      Close Booking
                    </button>

                    {/* Auth Button */}
                    <button
                      onClick={() => {
                        setModalPurpose("auth");
                        setPnrShowModal(true);
                      }}
                      className="send_auth_again auth_btnn"
                    >
                      Send Auth
                    </button>

                    {/* Refresh Button */}
                    {/* <button className="send_auth_again refresh_bt">
                    Refresh
                  </button> */}
                  </div>
                ) : null}
              </p>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  {/* Reusable Modal */}
                  {pnrShowModal && (
                    <div className="log_all_pop">
                      <div className="log_pop_semi">
                        <p className="log_header flex_props justify-content-between">
                          {modalPurpose === "auth"
                            ? "Add Auth Remark"
                            : "Add Closeing Remark "}
                          <button
                            type="button"
                            className="log_close"
                            onClick={() => setPnrShowModal(false)}
                          >
                            {" "}
                            <img src="/imgs/close-icon.png" />
                          </button>
                        </p>

                        <div className="box_crm_input">
                          <textarea
                            className="form-control box_crm_input_all"
                            placeholder="Enter your remark here..."
                            value={pnrRemark}
                            onChange={(e) => setPnrRemark(e.target.value)}
                            rows={5}
                          ></textarea>
                        </div>
                        <div className="mt-3">
                          <button
                            className="auth_btn"
                            onClick={async () => {
                              try {
                                if (!pnrRemark.trim()) {
                                  alert(
                                    "Please enter a remark before submitting."
                                  );
                                  return;
                                }

                                // Create final remark string
                                const finalRemark = `[${modalPurpose.toUpperCase()}] ${pnrRemark}`;

                                // Create remark object
                                const newRemark = {
                                  date: new Date().toISOString(),
                                  remark: finalRemark,
                                  agent: userRoleName,
                                };

                                // Call appropriate API
                                if (modalPurpose === "auth") {
                                  setTimeout(() => {
                                    if (
                                      flightDetails.transactionType ===
                                      "cancellationRefund"
                                    ) {
                                      navigate(
                                        "/astrivion/auth-refund-invoice-preview",
                                        {
                                          state: {
                                            flightDetails,
                                            isAuthFlow: true,
                                            flightId,
                                            newRemark,
                                          },
                                        }
                                      );
                                    } else if (
                                      flightDetails.transactionType ===
                                      "cancellationFutureCredit"
                                    ) {
                                      navigate(
                                        "/astrivion/auth-future-credit-invoice-preview",
                                        {
                                          state: {
                                            flightDetails,
                                            isAuthFlow: true,
                                            flightId,
                                            newRemark,
                                          },
                                        }
                                      );
                                    } else {
                                      navigate(
                                        "/astrivion/auth-invoice-preview",
                                        {
                                          state: {
                                            flightDetails,
                                            isAuthFlow: true,
                                            flightId,
                                            newRemark,
                                          },
                                        }
                                      );
                                    }
                                  }, 100);
                                } else if (modalPurpose === "close") {
                                  await axios.patch(
                                    `/api/v1/ctmFlights/update-pnrRemark-flight/${flightId}`,
                                    { pnrRemark: newRemark }
                                  );
                                  alert("Close booking remark submitted!");
                                }

                                // Update local flightDetails state
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  pnrRemarks: [
                                    newRemark,
                                    ...(prev?.pnrRemarks || []),
                                  ],
                                }));

                                // Close modal and reset
                                // setIsProviderAuthorized(true);
                                setPnrShowModal(false);
                                setPnrRemark("");
                                // navigate("/astrivion/all-ctm-booking");
                              } catch (err) {
                                console.error(err);
                                alert("Failed to update provider details.");
                              }
                            }}
                          >
                            Submit Now
                            {/* Submit Remark &{" "}
                              {modalPurpose === "auth" ? "Auth" : "Close"} */}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* modal start */}

                {showRemarksModal && (
                  <div className="log_all_pop">
                    <div className="log_pop_semi">
                      <p className="log_header flex_props justify-content-between">
                        REMARKS
                        <button
                          className="log_close"
                          onClick={() => setShowRemarksModal(false)}
                        >
                          <img src="/imgs/close-icon.png" />
                        </button>
                      </p>
                      <div className="bid_table">
                        {/* AUTH REMARKS */}
                        {flightDetails?.pnrRemarks?.some((item) =>
                          item.remark.startsWith("[AUTH]")
                        ) && (
                          <>
                            <p className="remarks_semi_title remarks_semi_title_minuss">
                              Authentication Remarks
                            </p>
                            <div className="table-responsive">
                              <table>
                                <thead>
                                  <tr>
                                    <th>DATE</th>
                                    <th>REMARK</th>
                                    <th>AGENT</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {flightDetails.pnrRemarks
                                    .filter((item) =>
                                      item.remark.startsWith("[AUTH]")
                                    )
                                    .map((item, index) => (
                                      <tr key={`auth-${index}`}>
                                        <td>
                                          {item.date ? (
                                            <p>{formatEST(item.date)}</p>
                                          ) : (
                                            <p>Loading date...</p>
                                          )}
                                        </td>

                                        <td>
                                          {item.remark
                                            ?.replace("[AUTH]", "")
                                            .trim()}
                                        </td>
                                        <td>{item.agent}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* CLOSE REMARKS */}
                        {flightDetails?.pnrRemarks?.some((item) =>
                          item.remark.startsWith("[CLOSE]")
                        ) && (
                          <>
                            <p className="remarks_semi_title mt-3">
                              Closed Booking Remarks
                            </p>
                            <div className="bid_table">
                              <div className="table-responsive">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>DATE</th>
                                      <th>REMARK</th>
                                      <th>AGENT</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {flightDetails.pnrRemarks
                                      .filter((item) =>
                                        item.remark.startsWith("[CLOSE]")
                                      )
                                      .map((item, index) => (
                                        <tr key={`close-${index}`}>
                                          <td>
                                            {item.date ? (
                                              <p>{formatEST(item.date)}</p>
                                            ) : (
                                              <p>Loading date...</p>
                                            )}
                                          </td>

                                          <td>
                                            {item.remark
                                              ?.replace("[CLOSE]", "")
                                              .trim()}
                                          </td>
                                          <td>{item.agent}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showActivityModal && (
                  <div className="log_all_pop">
                    <div className="log_pop_semi">
                      <p className="log_header flex_props justify-content-between">
                        Activity Log
                        <button
                          className="log_close"
                          onClick={() => setShowActivityModal(false)}
                        >
                          <img src="/imgs/close-icon.png" />
                        </button>
                      </p>
                      <div className="created_bg_c">
                        <p>Created By : {flightDetails?.agent?.userName} </p>
                        <div className="flex_props gap-2">
                          Date :{" "}
                          {flightDetails?.createdAt ? (
                            <p>{formatEST(flightDetails.createdAt)}</p>
                          ) : (
                            <p>Loading date...</p>
                          )}
                        </div>
                      </div>
                      <div className="bid_table">
                        {flightDetails?.logActivity.length === 0 ? (
                          <p>No activity yet.</p>
                        ) : (
                          <div className="table-responsive">
                            <table>
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Details</th>
                                  <th>Date & Time</th>
                                  <th>Edit by </th>
                                </tr>
                              </thead>

                              <tbody>
                                {flightDetails?.logActivity
                                  ?.slice()
                                  .sort(
                                    (a, b) =>
                                      new Date(b.updatedAt) -
                                      new Date(a.updatedAt)
                                  )
                                  ?.map((log, index) => (
                                    <tr key={log._id?.$oid || index}>
                                      <td>{log.type}</td>
                                      <td>
                                        {/* SEGMENT UPDATE */}
                                        {log.type === "segment-update" && (
                                          <>
                                            <div class="title_common_semi_main1 title_common_semi_main_activity">
                                              <span>Outbound Segment:</span>
                                            </div>
                                            {log?.data?.outboundSegments?.map(
                                              (seg, idx) => (
                                                <div key={idx}>
                                                  {seg?.airline && (
                                                    <>
                                                      Airline: {seg.airline},{" "}
                                                    </>
                                                  )}
                                                  {seg?.flight && (
                                                    <>Flight: {seg.flight}, </>
                                                  )}
                                                  {seg?.from && (
                                                    <>From: {seg.from}, </>
                                                  )}
                                                  {seg?.to && (
                                                    <>To: {seg.to}, </>
                                                  )}
                                                  {seg?.departure && (
                                                    <>
                                                      Departure:{" "}
                                                      {new Date(
                                                        seg.departure
                                                      ).toLocaleString()}
                                                      ,{" "}
                                                    </>
                                                  )}
                                                  {seg?.arrival && (
                                                    <>
                                                      Arrival:{" "}
                                                      {new Date(
                                                        seg.arrival
                                                      ).toLocaleString()}
                                                      ,{" "}
                                                    </>
                                                  )}
                                                  {seg?.class && (
                                                    <>Class: {seg.class}, </>
                                                  )}
                                                  {seg?.alLocator && (
                                                    <>
                                                      Locator: {seg.alLocator}
                                                    </>
                                                  )}
                                                </div>
                                              )
                                            )}

                                            {log?.data?.inboundSegments?.map(
                                              (seg, idx) => (
                                                <>
                                                  <div class="title_common_semi_main1 title_common_semi_main_activity">
                                                    <span>
                                                      Inbound Segment:
                                                    </span>
                                                  </div>
                                                  <div key={idx}>
                                                    {seg?.airline && (
                                                      <>
                                                        Airline: {seg.airline},{" "}
                                                      </>
                                                    )}
                                                    {seg?.flight && (
                                                      <>
                                                        Flight: {seg.flight},{" "}
                                                      </>
                                                    )}
                                                    {seg?.from && (
                                                      <>From: {seg.from}, </>
                                                    )}
                                                    {seg?.to && (
                                                      <>To: {seg.to}, </>
                                                    )}
                                                    {seg?.departure && (
                                                      <>
                                                        Departure:{" "}
                                                        {new Date(
                                                          seg.departure
                                                        ).toLocaleString()}
                                                        ,{" "}
                                                      </>
                                                    )}
                                                    {seg?.arrival && (
                                                      <>
                                                        Arrival:{" "}
                                                        {new Date(
                                                          seg.arrival
                                                        ).toLocaleString()}
                                                        ,{" "}
                                                      </>
                                                    )}
                                                    {seg?.class && (
                                                      <>Class: {seg.class}, </>
                                                    )}
                                                    {seg?.alLocator && (
                                                      <>
                                                        Locator: {seg.alLocator}
                                                      </>
                                                    )}
                                                  </div>
                                                </>
                                              )
                                            )}
                                          </>
                                        )}
                                        {/* PRICE UPDATE */}
                                        {log.type === "price-update" && (
                                          <>
                                            {log?.data?.baseFare && (
                                              <>
                                                Base Fare: {log.data.baseFare},{" "}
                                              </>
                                            )}
                                            {log?.data?.taxes && (
                                              <>Taxes: {log.data.taxes}, </>
                                            )}
                                            {log?.data?.currency && (
                                              <>
                                                Currency: {log.data.currency}{" "}
                                              </>
                                            )}
                                          </>
                                        )}

                                        {/* CHARGEBACK UPDATE */}
                                        {log.type === "chargeback-update" && (
                                          <>
                                            {log?.data?.chargeAmount && (
                                              <>
                                                Charge Amount:{" "}
                                                {log.data.chargeAmount},{" "}
                                              </>
                                            )}
                                            {log?.data?.chargebackDate && (
                                              <>
                                                Chargeback Date:{" "}
                                                {log.data.chargebackDate},{" "}
                                              </>
                                            )}
                                            {log?.data?.reasonForChargeback && (
                                              <>
                                                Reason:{" "}
                                                {log.data.reasonForChargeback},{" "}
                                              </>
                                            )}
                                            {log?.data?.chargebackStatus && (
                                              <>
                                                Status:{" "}
                                                {log.data.chargebackStatus}
                                              </>
                                            )}
                                          </>
                                        )}

                                        {/* REFUND UPDATE */}
                                        {log.type === "refund-update" && (
                                          <>
                                            {log?.data?.amount && (
                                              <>
                                                Refund Amount: {log.data.amount}
                                                ,{" "}
                                              </>
                                            )}
                                            {log?.data?.refundRequestedOn && (
                                              <>
                                                Requested On:{" "}
                                                {log.data.refundRequestedOn},{" "}
                                              </>
                                            )}
                                            {log?.data?.reasonForRefund && (
                                              <>
                                                Reason:{" "}
                                                {log.data.reasonForRefund},{" "}
                                              </>
                                            )}
                                            {log?.data?.refundStatus && (
                                              <>
                                                Status: {log.data.refundStatus}
                                              </>
                                            )}
                                          </>
                                        )}

                                        {/* BILLING UPDATE */}
                                        {log.type === "billing-update" && (
                                          <>
                                            {log?.data?.cardType && (
                                              <>
                                                Card Type: {log.data.cardType},{" "}
                                              </>
                                            )}
                                            {log?.data?.cchName && (
                                              <>
                                                Card Holder: {log.data.cchName},{" "}
                                              </>
                                            )}
                                            {log?.data?.email && (
                                              <>Email: {log.data.email}, </>
                                            )}
                                            {(log?.data?.billingAddress1 ||
                                              log?.data?.billingAddress2) && (
                                              <>
                                                Billing Address:{" "}
                                                {log.data.billingAddress1 || ""}
                                                {log.data.billingAddress2
                                                  ? `, ${log.data.billingAddress2}`
                                                  : ""}
                                                ,{" "}
                                              </>
                                            )}
                                            {log?.data?.city && (
                                              <>City: {log.data.city}, </>
                                            )}
                                            {log?.data?.state && (
                                              <>State: {log.data.state}, </>
                                            )}
                                            {log?.data?.country && (
                                              <>Country: {log.data.country}, </>
                                            )}

                                            {log?.data?.zipCode && (
                                              <>ZipCode: {log.data.zipCode}</>
                                            )}
                                          </>
                                        )}

                                        {/* PROVIDER UPDATE */}
                                        {log.type === "provider-update" && (
                                          <>
                                            {log?.data?.provider && (
                                              <>
                                                Provider: {log.data.provider},{" "}
                                              </>
                                            )}
                                            {log?.data?.pnrStatus && (
                                              <>
                                                PNR Status: {log.data.pnrStatus}
                                              </>
                                            )}
                                          </>
                                        )}

                                        {/* CHARGING UPDATE */}
                                        {log.type === "charging-update" && (
                                          <>
                                            {log?.data?.chargingBaseFare && (
                                              <>
                                                Base Fare:{" "}
                                                {log.data.chargingBaseFare},{" "}
                                              </>
                                            )}
                                            {log?.data?.chargingTaxes && (
                                              <>
                                                Charging Taxes:{" "}
                                                {log.data.chargingTaxes},{" "}
                                              </>
                                            )}
                                            {log?.data?.chargingStatus && (
                                              <>
                                                Status:{" "}
                                                {log.data.chargingStatus},{" "}
                                              </>
                                            )}
                                            {log?.data?.chargedOn && (
                                              <>
                                                Charged On: {log.data.chargedOn}
                                                ,{" "}
                                              </>
                                            )}
                                            {log?.data?.chargedBy && (
                                              <>
                                                Charged By: {log.data.chargedBy}
                                              </>
                                            )}
                                          </>
                                        )}

                                        {/* PASSENGER UPDATE */}
                                        {log.type === "passenger-update" &&
                                          Array.isArray(log.data) && (
                                            <>
                                              {log.data.map(
                                                (passenger, idx) => (
                                                  <div
                                                    key={passenger._id || idx}
                                                    className="passenger_activity"
                                                  >
                                                    Passenger {idx + 1}:{" "}
                                                    {passenger?.detailsType && (
                                                      <>
                                                        Type:{" "}
                                                        {passenger.detailsType},{" "}
                                                      </>
                                                    )}
                                                    {(passenger?.firstName ||
                                                      passenger?.middleName ||
                                                      passenger?.lastName) && (
                                                      <>
                                                        Name:{" "}
                                                        {passenger.firstName ||
                                                          ""}{" "}
                                                        {passenger.middleName ||
                                                          ""}{" "}
                                                        {passenger.lastName ||
                                                          ""}
                                                        ,{" "}
                                                      </>
                                                    )}
                                                    {passenger?.gender && (
                                                      <>
                                                        Gender:{" "}
                                                        {passenger.gender},{" "}
                                                      </>
                                                    )}
                                                    {passenger?.dob && (
                                                      <>
                                                        DOB: {passenger.dob},{" "}
                                                      </>
                                                    )}
                                                    <>
                                                      Ticket Number:{" "}
                                                      {passenger.ticketNumber ||
                                                        "N/A"}
                                                    </>
                                                  </div>
                                                )
                                              )}
                                            </>
                                          )}

                                        {/* BID STATUS UPDATE */}
                                        {log.type === "bid-status-update" && (
                                          <>
                                            {log?.data?.ticketmco && (
                                              <>MCO: {log.data.ticketmco}, </>
                                            )}
                                            {log?.data?.bidStatus && (
                                              <>Status: {log.data.bidStatus}</>
                                            )}
                                          </>
                                        )}
                                        {/* SEND MAIL  UPDATE */}
                                        {log.type === "send-mail-update" && (
                                          <>
                                            {log?.data?.language && (
                                              <>
                                                Language: {log.data.language},{" "}
                                              </>
                                            )}
                                            {log?.data?.transactionType && (
                                              <>
                                                Requested On:{" "}
                                                {log.data.transactionType},{" "}
                                              </>
                                            )}
                                            {log?.data?.agentFigure && (
                                              <>
                                                Reason: {log.data.agentFigure},{" "}
                                              </>
                                            )}
                                            {log?.data?.refundStatus && (
                                              <>
                                                Status: {log.data.refundStatus}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </td>

                                      {/* DATE & TIME */}
                                      <td>
                                        {log?.updatedAt ? (
                                          <p>{formatEST(log.updatedAt)}</p>
                                        ) : (
                                          <p>Loading date...</p>
                                        )}
                                      </td>

                                      {/* EDITED BY */}
                                      <td className="edit_flex_b_p">
                                        {log?.logName}
                                        <span className="profile_box">
                                          {" "}
                                          {log?.logRole}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* modal end */}
              </div>
              <div className="table_responsive mt-3">
                <div className="table_custom row">
                  <div className="col-12">
                    <div className="">
                      <ul className="table_custom_header1">
                        <li>BID</li>
                        <li>{flightDetails.bookingId || "N/A"}</li>
                      </ul>
                      <ul className="table_custom_header1">
                        <li>Provider</li>
                        <li>
                          <div className="row">
                            <div className="col-8 pe-2">
                              <select
                                id="providerSelect"
                                className="form-select"
                                value={flightDetails.provider?._id || ""}
                                onChange={(e) => {
                                  const selectedProvider = providers.find(
                                    (prov) => prov._id === e.target.value
                                  );
                                  setFlightDetails((prev) => ({
                                    ...prev,
                                    provider: selectedProvider, // store full object
                                  }));
                                }}
                                required
                              >
                                <option value="">Select</option>
                                {providers
                                  .filter(
                                    (prov) => prov.providerStatus === "Active"
                                  )
                                  .map((prov) => (
                                    <option key={prov._id} value={prov._id}>
                                      {prov.provider}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="col-4 ps-2">
                              <button
                                className="submit_btn_provider"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (!flightDetails?.provider) {
                                    alert("Please select a provider!");
                                    return;
                                  }
                                  await handleProviderUpdate();
                                  // setIsProviderAuthorized(false);
                                }}
                              >
                                Submit Provider
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>

                      {/* <ul className="table_custom_header1">
                        <li>Transaction Type</li>
                        <li className="text_cap">
                          <div className="text_cap_highlight">
                            {flightDetails.transactionType || "N/A"}
                          </div>
                        </li>
                      </ul> */}

                      {flightDetails?.transactionType &&
                        transactionTypeLabels[
                          flightDetails.transactionType
                        ] && (
                          <ul className="table_custom_header1">
                            <li>Transaction Type</li>
                            <li className="text_cap">
                              <div className="text_cap_highlight">
                                {
                                  transactionTypeLabels[
                                    flightDetails.transactionType
                                  ]
                                }
                              </div>
                            </li>
                          </ul>
                        )}
                      <ul className="table_custom_header1">
                        <li>Date & Time Created</li>
                        <li>
                          {flightDetails?.createdAt ? (
                            <p>{formatEST(flightDetails.createdAt)}</p>
                          ) : (
                            <p>Loading date...</p>
                          )}
                        </li>
                      </ul>
                      <ul className="table_custom_header1">
                        <li>Auth Status</li>
                        <li>
                          {/* <div
                            className={`text-${
                              flightDetails.pnrStatus === "approved"
                                ? "success"
                                : "warning"
                            }`}
                          >
                            {flightDetails.pnrStatus
                              ?.replace(/([A-Z])/g, " $1")
                              ?.replace(/^\w/, (char) => char.toUpperCase())}
                          </div> */}
                          <td
                            className={`text-$${
                              flightDetails.pnrStatus === "approved"
                                ? "success"
                                : "warning"
                            }`}
                          >
                            {flightDetails.pnrStatus
                              ?.replace(/([A-Z])/g, " $1")
                              ?.replace(/^\\w/, (char) => char.toUpperCase())}
                            {flightDetails.pnrStatus === "approved" && (
                              <button
                                className="auth_btn_preview"
                                onClick={handleAuthorizePreview}
                              >
                                Auth Preview
                              </button>
                            )}
                          </td>
                        </li>
                      </ul>

                      <ul className="table_custom_header1">
                        <li>EDIT BID Status</li>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-4">
                              {flightDetails?.ticketmco ? (
                                flightDetails.ticketmco.toLowerCase() ===
                                "ticketmco" ? (
                                  <p>Ticketed & MCO Charged</p>
                                ) : (
                                  <p>
                                    {flightDetails.ticketmco
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^\w/, (char) =>
                                        char.toUpperCase()
                                      )}
                                  </p>
                                )
                              ) : (
                                <p>Pending</p>
                              )}
                            </div>
                            <div className="col-6 pe-2">
                              {/* <select
                                id="ticketmco"
                                className="form-select"
                                value={flightDetails?.ticketmco || ""}
                                onChange={(e) =>
                                  setFlightDetails((prev) => ({
                                    ...prev,
                                    ticketmco: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="underFollowUp">
                                  Under Follow up
                                </option>

                                {flightDetails?.chargingStatus === "charged" &&
                                  Array.isArray(
                                    flightDetails?.passengerDetails
                                  ) &&
                                  flightDetails.passengerDetails.length > 0 &&
                                  flightDetails.passengerDetails.every(
                                    (p) => (p.ticketNumber ?? "").trim() !== ""
                                  ) && (
                                    <option value="ticketMco">
                                      Ticketed & MCO Charged
                                    </option>
                                  )}
                              </select> */}

                              <select
                                id="ticketmco"
                                className="form-select"
                                defaultValue={flightDetails?.ticketmco || ""}
                                ref={ticketMcoRef}
                              >
                                <option value="">Select</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="underFollowUp">
                                  Under Follow up
                                </option>

                                {flightDetails?.chargingStatus === "charged" &&
                                  Array.isArray(
                                    flightDetails?.passengerDetails
                                  ) &&
                                  flightDetails.passengerDetails.length > 0 &&
                                  flightDetails.passengerDetails.every(
                                    (p) => (p.ticketNumber ?? "").trim() !== ""
                                  ) && (
                                    <option value="ticketMco">
                                      Ticketed & MCO Charged
                                    </option>
                                  )}
                              </select>
                            </div>

                            <div className="col-2 ps-2">
                              <button
                                className="submit_btn_provider"
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (!flightDetails?.ticketmco) {
                                    alert("Please filled a valid Bid status");
                                    return;
                                  }
                                  handleBidStatusUpdate();

                                  // if (
                                  //   flightDetails?.ticketmco === "ticketMco"
                                  // ) {
                                  //   handleTicketMcoCharged();
                                  // } else {
                                  //   if (!flightDetails?.ticketmco) {
                                  //   alert("Please filled a valid Bid status");
                                  //   return;
                                  // }
                                  //   handleBidStatusUpdate();
                                  // }
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ITINERARY DETAILS FOR FLIGHT ID */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Itinerary Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div className="flex_props gap-2">
                    {isIineraryUpdateEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        // disabled={!isSegmentChanged}
                        onClick={handleItineraryUpdate}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => setIsIineraryUpdateEditable(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div className={isIineraryUpdateEditable ? "" : "op_reduce"}>
                {/* Outbound Segments */}
                {flightDetails?.outboundSegments?.length > 0 && (
                  <div className="mt-2">
                    <p className="title_common_semi_main1">
                      <span>Outbound Segments</span>
                    </p>
                    {flightDetails.outboundSegments.map((seg, index) => (
                      <div
                        className={`outbound_segment_container outbound_segment_container${index}`}
                      >
                        <p className="title_common_semi1">
                          Outbound Flight {index + 1}
                        </p>
                        <div
                          key={`outbound-${index}`}
                          className="mt-2 flex_all form_box_auth"
                        >
                          <div className="width_control_in13 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Airlines</label>
                              <select
                                name="airline"
                                className="form-select box_crm_input_all"
                                disabled={!isIineraryUpdateEditable}
                                value={seg.airline}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "airline",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">select</option>
                                {ctmAirline.map((prov) => (
                                  <option
                                    key={prov._id}
                                    value={prov.ctmAirline}
                                  >
                                    {prov.ctmAirline}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="width_control_in13 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Flight Number</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.flight}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "flight",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in37 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Destination From</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.from}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "from",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in37 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Destination To</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.to}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "to",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Departure Date</label>
                              <input
                                type="datetime-local"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={new Date(seg.departure)
                                  .toISOString()
                                  .slice(0, 16)}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "departure",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Arrival Date</label>
                              <input
                                type="datetime-local"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={new Date(seg.arrival)
                                  .toISOString()
                                  .slice(0, 16)}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "arrival",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Class</label>
                              <select
                                className="form-control box_crm_input_all"
                                disabled={!isIineraryUpdateEditable}
                                value={seg.class}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "class",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select</option>
                                {classDrop?.map((item, idx) => (
                                  <option key={idx} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Al Locator</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.alLocator}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "outbound",
                                    index,
                                    "alLocator",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inbound Segments */}
                {flightDetails?.inboundSegments?.length > 0 && (
                  <>
                    <p className="title_common_semi_main1 mt-3">
                      <span>Inbound Segments</span>
                    </p>
                    {flightDetails.inboundSegments.map((seg, index) => (
                      <div
                        className={`outbound_segment_container outbound_segment_container${index}`}
                      >
                        <p className="title_common_semi1">
                          Inbound Flight {index + 1}
                        </p>
                        <div
                          className="mt-2 flex_all form_box_auth"
                          key={`inbound-${index}`}
                        >
                          <div className="width_control_in13 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Airlines</label>
                              <select
                                name="airline"
                                className="form-select box_crm_input_all"
                                disabled={!isIineraryUpdateEditable}
                                value={seg.airline}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "airline",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">select</option>
                                {ctmAirline.map((prov) => (
                                  <option
                                    key={prov._id}
                                    value={prov.ctmAirline}
                                  >
                                    {prov.ctmAirline}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="width_control_in13 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Flight Number</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.flight}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "flight",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in37 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Destination From</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.from}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "from",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in37 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Destination To</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.to}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "to",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Departure Date</label>
                              <input
                                type="datetime-local"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={new Date(seg.departure)
                                  .toISOString()
                                  .slice(0, 16)}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "departure",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Arrival Date</label>
                              <input
                                type="datetime-local"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={new Date(seg.arrival)
                                  .toISOString()
                                  .slice(0, 16)}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "arrival",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Class</label>
                              <select
                                className="form-control box_crm_input_all"
                                disabled={!isIineraryUpdateEditable}
                                value={seg.class}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "class",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select</option>
                                {classDrop?.map((item, idx) => (
                                  <option key={idx} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="width_control_in23 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Al Locator</label>
                              <input
                                type="text"
                                className="form-control box_crm_input_all"
                                readOnly={!isIineraryUpdateEditable}
                                value={seg.alLocator}
                                onChange={(e) =>
                                  handleSegmentChange(
                                    "inbound",
                                    index,
                                    "alLocator",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            {/* =============================================Cancellation For Refund start ===================================== */}
            {flightDetails?.transactionType &&
              flightDetails?.transactionType === "cancellationRefund" && (
                <>
                  <div className="box_crm_tr margin_box_tr">
                    <p className="title_common_semi flex_props justify-content-between">
                      Ticket Refund Details
                      {auth?.user?.role === "superadmin" ||
                      auth?.user?.role === "admin" ? (
                        <div className="flex_props gap-2">
                          {isRefundEditable ? (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={async () => {
                                try {
                                  const payload = {
                                    cancelRefAmount:
                                      flightDetails?.cancellationRefund
                                        ?.cancelRefAmount || undefined,
                                    cancelRefRequestOn:
                                      flightDetails?.cancellationRefund
                                        ?.cancelRefRequestOn || undefined,
                                    cancelRefReason:
                                      flightDetails?.cancellationRefund
                                        ?.cancelRefReason || undefined,
                                    cancelRefStatus:
                                      flightDetails?.cancellationRefund
                                        ?.cancelRefStatus || undefined,
                                  };

                                  await axios.patch(
                                    `/api/v1/ctmFlights/update-cancellation-refund-details/${flightId}`,
                                    payload
                                  );
                                  alert("Refund details updated!");

                                  setIsRefundEditable(false);
                                  // refresh details
                                  const { data } = await axios.get(
                                    `/api/v1/flights/get-single-flight/${flightId}`
                                  );
                                  if (data.success) setFlightDetails(data.data);
                                } catch (err) {
                                  console.error(err);
                                  alert("Failed to update refund details.");
                                }
                              }}
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={() => setIsRefundEditable(true)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      ) : null}
                    </p>
                    <div className="mt-2 flex_all form_box_auth">
                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Amount</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.cancellationRefund
                                ?.cancelRefAmount || ""
                            }
                            className="form-control box_crm_input_all"
                            readOnly={!isRefundEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                cancellationRefund: {
                                  ...(prev?.cancellationRefund || {}),
                                  cancelRefAmount: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Refund Requested On</label>

                          <DatePicker
                            selected={
                              flightDetails?.cancellationRefund
                                ?.cancelRefRequestOn
                                ? new Date(
                                    flightDetails.cancellationRefund.cancelRefRequestOn
                                  )
                                : null
                            }
                            onChange={(date) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                cancellationRefund: {
                                  ...(prev?.cancellationRefund || {}),
                                  cancelRefRequestOn: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              }));
                            }}
                            className="form-control box_crm_input_all"
                            dateFormat="yyyy-MM-dd"
                            disabled={!isRefundEditable}
                          />
                        </div>
                      </div>
                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Reason for Refund</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.cancellationRefund
                                ?.cancelRefReason || ""
                            }
                            className="form-control box_crm_input_all"
                            readOnly={!isRefundEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                cancellationRefund: {
                                  ...(prev?.cancellationRefund || {}),
                                  cancelRefReason: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="width_control_in25 box_sp">
                        {/* <div className="box_crm_input">
                        //   <label>Refund Status</label>
                        //   <input
                        //     type="text"
                        //     value={
                        //       flightDetails?.cancellationRefund
                        //         ?.cancelRefStatus || ""
                        //     }
                        //     className="form-control box_crm_input_all"
                        //     readOnly={!isRefundEditable}
                        //     onChange={(e) => {
                        //       setFlightDetails((prev) => ({
                        //         ...prev,
                        //         cancellationRefund: {
                        //           ...(prev?.cancellationRefund || {}),
                        //           cancelRefStatus: e.target.value,
                        //         },
                        //       }));
                        //     }}
                        //   />
                        // </div> */}
                      </div>
                    </div>
                  </div>
                </>
              )}
            {/* =============================================Cancellation For Refund end ===================================== */}
            {/* =============================================Cancellation For Future Credit start ===================================== */}
            {flightDetails?.transactionType &&
              flightDetails?.transactionType === "cancellationFutureCredit" && (
                <>
                  <div className="box_crm_tr margin_box_tr">
                    <p className="title_common_semi flex_props justify-content-between">
                      Future Credit Details
                      {auth?.user?.role === "superadmin" ||
                      auth?.user?.role === "admin" ? (
                        <div className="flex_props gap-2">
                          {isFutureCreditEditable ? (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={async () => {
                                try {
                                  const payload = {
                                    futureCreditAmount:
                                      flightDetails?.futureCredit
                                        ?.futureCreditAmount || undefined,
                                    futureCreditRequestedOn:
                                      flightDetails?.futureCredit
                                        ?.futureCreditRequestedOn || undefined,
                                    futureCreditValidity:
                                      flightDetails?.futureCredit
                                        ?.futureCreditValidity || undefined,
                                    reasonForFutureCredit:
                                      flightDetails?.futureCredit
                                        ?.reasonForFutureCredit || undefined,
                                  };

                                  await axios.patch(
                                    `/api/v1/ctmFlights/update-futureCredit-details/${flightId}`,
                                    payload
                                  );
                                  alert("Future credit details updated!");

                                  setIsFutureCreditEditable(false);
                                  // refresh details
                                  const { data } = await axios.get(
                                    `/api/v1/flights/get-single-flight/${flightId}`
                                  );
                                  if (data.success) setFlightDetails(data.data);
                                } catch (err) {
                                  console.error(err);
                                  alert(
                                    "Failed to update future credit details."
                                  );
                                }
                              }}
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={() => setIsFutureCreditEditable(true)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      ) : null}
                    </p>
                    <div className="mt-2 flex_all form_box_auth">
                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Amount</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.futureCredit?.futureCreditAmount ||
                              ""
                            }
                            className="form-control box_crm_input_all"
                            readOnly={!isFutureCreditEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                futureCredit: {
                                  ...(prev?.futureCredit || {}),
                                  futureCreditAmount: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Requested On</label>
                          <DatePicker
                            selected={
                              flightDetails?.futureCredit
                                ?.futureCreditRequestedOn
                                ? new Date(
                                    flightDetails.futureCredit.futureCreditRequestedOn
                                  )
                                : null
                            }
                            onChange={(date) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                futureCredit: {
                                  ...(prev?.futureCredit || {}),
                                  futureCreditRequestedOn: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              }));
                            }}
                            className="form-control box_crm_input_all"
                            dateFormat="yyyy-MM-dd"
                            disabled={!isFutureCreditEditable}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Validity</label>
                          <DatePicker
                            selected={
                              flightDetails?.futureCredit?.futureCreditValidity
                                ? new Date(
                                    flightDetails.futureCredit.futureCreditValidity
                                  )
                                : null
                            }
                            onChange={(date) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                futureCredit: {
                                  ...(prev?.futureCredit || {}),
                                  futureCreditValidity: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              }));
                            }}
                            className="form-control box_crm_input_all"
                            dateFormat="yyyy-MM-dd"
                            disabled={!isFutureCreditEditable}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Reason</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.futureCredit
                                ?.reasonForFutureCredit || ""
                            }
                            className="form-control box_crm_input_all"
                            readOnly={!isFutureCreditEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                futureCredit: {
                                  ...(prev?.futureCredit || {}),
                                  reasonForFutureCredit: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            {/* =============================================Cancellation For Future Credit end ===================================== */}
            {/* ============================================= Ticket Issue start ===================================== */}
            {flightDetails?.transactionType &&
              flightDetails?.transactionType === "ticketIssuance" && (
                <>
                  <div className="box_crm_tr margin_box_tr">
                    <p className="title_common_semi flex_props justify-content-between">
                      Ticket Issue Details
                      {auth?.user?.role === "superadmin" ||
                      auth?.user?.role === "admin" ? (
                        <div className="flex_props gap-2">
                          {isTicketIssueEditable ? (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={async () => {
                                try {
                                  const payload = {
                                    ticketIssueAmount:
                                      flightDetails?.ticketIssueDetails
                                        ?.ticketIssueAmount || undefined,
                                    ticketIssueRequestedOn:
                                      flightDetails?.ticketIssueDetails
                                        ?.ticketIssueRequestedOn || undefined,
                                    ticketIssueValidity:
                                      flightDetails?.ticketIssueDetails
                                        ?.ticketIssueValidity || undefined,
                                    ticketIssueReason:
                                      flightDetails?.ticketIssueDetails
                                        ?.ticketIssueReason || undefined,
                                  };

                                  await axios.patch(
                                    `/api/v1/ctmFlights/update-ticketIssue-details/${flightId}`,
                                    payload
                                  );
                                  alert(
                                    "Tiecket issuence details updated successfully"
                                  );

                                  setIsTicketIssueEditable(false);
                                  // refresh details
                                  const { data } = await axios.get(
                                    `/api/v1/flights/get-single-flight/${flightId}`
                                  );
                                  if (data.success) setFlightDetails(data.data);
                                } catch (err) {
                                  console.error(err);
                                  alert(
                                    "Failed to update future credit details."
                                  );
                                }
                              }}
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              className="send_auth_again color_btn_ch"
                              onClick={() => setIsTicketIssueEditable(true)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      ) : null}
                    </p>
                    <div className="mt-2 flex_all form_box_auth">
                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Amount</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.ticketIssueDetails
                                ?.ticketIssueAmount || ""
                            }
                            className="form-control box_crm_input_all"
                            disabled={!isTicketIssueEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                ticketIssueDetails: {
                                  ...(prev?.ticketIssueDetails || {}),
                                  ticketIssueAmount: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Requested On</label>
                          <DatePicker
                            selected={
                              flightDetails?.ticketIssueDetails
                                ?.ticketIssueRequestedOn
                                ? new Date(
                                    flightDetails.ticketIssueDetails.ticketIssueRequestedOn
                                  )
                                : null
                            }
                            onChange={(date) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                ticketIssueDetails: {
                                  ...(prev?.ticketIssueDetails || {}),
                                  ticketIssueRequestedOn: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              }));
                            }}
                            className="form-control box_crm_input_all"
                            dateFormat="yyyy-MM-dd"
                            disabled={!isTicketIssueEditable}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Validity</label>
                          <DatePicker
                            selected={
                              flightDetails?.ticketIssueDetails
                                ?.ticketIssueValidity
                                ? new Date(
                                    flightDetails.ticketIssueDetails.ticketIssueValidity
                                  )
                                : null
                            }
                            onChange={(date) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                ticketIssueDetails: {
                                  ...(prev?.ticketIssueDetails || {}),
                                  ticketIssueValidity: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              }));
                            }}
                            className="form-control box_crm_input_all"
                            dateFormat="yyyy-MM-dd"
                            disabled={!isTicketIssueEditable}
                          />
                        </div>
                      </div>

                      <div className="width_control_in25 box_sp">
                        <div className="box_crm_input">
                          <label>Reason</label>
                          <input
                            type="text"
                            value={
                              flightDetails?.ticketIssueDetails
                                ?.ticketIssueReason || ""
                            }
                            className="form-control box_crm_input_all"
                            readOnly={!isTicketIssueEditable}
                            onChange={(e) => {
                              setFlightDetails((prev) => ({
                                ...prev,
                                ticketIssueDetails: {
                                  ...(prev?.ticketIssueDetails || {}),
                                  ticketIssueReason: e.target.value,
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            {/* ============================================= Ticket Issue  end ===================================== */}
            {/* Price Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Price Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div class="flex_props gap-2">
                    {isPriceEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/v1/ctmFlights/update-price-details/${flightId}`,
                              {
                                baseFare: flightDetails.baseFare,
                                taxes: flightDetails.taxes,
                                totalAmount:
                                  Number(flightDetails.baseFare || 0) +
                                  Number(flightDetails.taxes || 0),
                                currency: flightDetails.currency,
                              }
                            );
                            alert("Price details updated!");

                            setIsPriceEditable(false);
                          } catch (err) {
                            alert("Failed to update price details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => {
                          setIsPriceEditable(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div
                className={
                  isPriceEditable
                    ? "mt-2 flex_all form_box_auth"
                    : "mt-2 flex_all form_box_auth op_reduce"
                }
              >
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Base Fare</label>
                    <input
                      type="number"
                      className="form-control box_crm_input_all"
                      value={flightDetails?.baseFare || ""}
                      readOnly={!isPriceEditable}
                      onChange={(e) => {
                        const baseFare = e.target.value;
                        const taxes = flightDetails?.taxes || 0;
                        setFlightDetails((prev) => ({
                          ...prev,
                          baseFare,
                          totalAmount: Number(baseFare || 0) + Number(taxes),
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Tax & Fees</label>
                    <input
                      type="number"
                      className="form-control box_crm_input_all"
                      value={flightDetails?.taxes || ""}
                      readOnly={!isPriceEditable}
                      onChange={(e) => {
                        const taxes = e.target.value;
                        const baseFare = flightDetails?.baseFare || 0;
                        setFlightDetails((prev) => ({
                          ...prev,
                          taxes,
                          totalAmount: Number(baseFare) + Number(taxes || 0),
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Total Amount</label>
                    <input
                      type="text"
                      className="form-control box_crm_input_all"
                      value={
                        isNaN(
                          Number(flightDetails?.baseFare) +
                            Number(flightDetails?.taxes)
                        )
                          ? ""
                          : (() => {
                              const baseFare =
                                flightDetails?.baseFare?.toString() || "0";
                              const taxes =
                                flightDetails?.taxes?.toString() || "0";
                              const total =
                                parseFloat(baseFare) + parseFloat(taxes);
                              const baseDecimals = (
                                baseFare.split(".")[1] || ""
                              ).length;
                              const taxDecimals = (taxes.split(".")[1] || "")
                                .length;
                              const maxDecimals = Math.max(
                                baseDecimals,
                                taxDecimals
                              );

                              return total.toFixed(maxDecimals);
                            })()
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label htmlFor="">Currency</label>
                    <select
                      className="form-control box_crm_input_all"
                      value={flightDetails?.currency || ""}
                      disabled={!isPriceEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }));
                      }}
                    >
                      {curDrop?.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Charging Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Charging Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div className="flex_props gap-2">
                    {isChargingEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            const field = {
                              baseFare: "Base Fare",
                              chargingStatus: "Charging Status",
                              chargedOn: "Charged On",
                              chargedBy: "Charged By",
                              taxes: "Charging Tax",
                              chargingTaxStatus: "Charging Tax Status",
                              chargingTaxchargedOn: "Charging Tax Charged On",
                              chargingTaxchargedBy: "Charging Tax Charged By",
                            };

                            for (const key in field) {
                              if (!flightDetails?.[key]) {
                                toast.error(`${field[key]} is required`);
                                return;
                              }
                            }

                            const res = await axios.patch(
                              `/api/v1/ctmFlights/update-charging-details/${flightId}`,
                              {
                                chargingBaseFare: flightDetails.baseFare,
                                chargingStatus: flightDetails.chargingStatus,
                                chargedOn: flightDetails.chargedOn,
                                chargedBy: flightDetails.chargedBy,
                                chargingTaxes: flightDetails.taxes,
                                chargingTaxStatus:
                                  flightDetails.chargingTaxStatus,
                                chargingTaxchargedOn:
                                  flightDetails.chargingTaxchargedOn,
                                chargingTaxchargedBy:
                                  flightDetails.chargingTaxchargedBy,
                              }
                            );

                            setIsChargingEditable(false);
                          } catch (err) {
                            alert("Failed to update charging details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => {
                          setIsChargingEditable(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div
                className={
                  isChargingEditable
                    ? "provide_table mt-3"
                    : "provide_table mt-3 op_reduce"
                }
              >
                <div className="table-responsive">
                  <table>
                    <thead>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Charged On</th>
                      <th>Charged By</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Base Fare</td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="number"
                              className="form-control box_crm_input_all"
                              value={flightDetails?.baseFare || ""}
                              readOnly={!isChargingEditable}
                              onChange={(e) => {
                                const baseFare = e.target.value;
                                const taxes = flightDetails?.taxes || 0;
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  baseFare,
                                  totalAmount:
                                    Number(baseFare || 0) + Number(taxes),
                                }));
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="box_crm_input">
                            <select
                              className="form-select box_crm_input_all"
                              disabled={!isChargingEditable}
                              value={flightDetails?.chargingStatus || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargingStatus: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              <option value="declined">Declined</option>
                              <option value="charged">Charged</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="text"
                              className="form-control box_crm_input_all"
                              readOnly={!isChargingEditable}
                              value={flightDetails?.chargedOn || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargedOn: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="text"
                              className="form-control box_crm_input_all"
                              readOnly={!isChargingEditable}
                              value={flightDetails?.chargedBy || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargedBy: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Taxes & Fees</td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="number"
                              className="form-control box_crm_input_all"
                              value={flightDetails?.taxes || ""}
                              readOnly={!isChargingEditable}
                              onChange={(e) => {
                                const taxes = e.target.value;
                                const baseFare = flightDetails?.baseFare || 0;
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  taxes,
                                  totalAmount:
                                    Number(baseFare) + Number(taxes || 0),
                                }));
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="box_crm_input">
                            <select
                              className="form-select box_crm_input_all"
                              disabled={!isChargingEditable}
                              value={flightDetails?.chargingTaxStatus || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargingTaxStatus: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              <option value="declined">Declined</option>
                              <option value="charged">Charged</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="text"
                              className="form-control box_crm_input_all"
                              readOnly={!isChargingEditable}
                              value={flightDetails?.chargingTaxchargedOn || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargingTaxchargedOn: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input_charging_de box_crm_input">
                            <input
                              type="text"
                              className="form-control box_crm_input_all"
                              readOnly={!isChargingEditable}
                              value={flightDetails?.chargingTaxchargedBy || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  chargingTaxchargedBy: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Passenger Details */}
            {/* Passenger Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Passengers Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div class="flex_props gap-2">
                    {isPassengerEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/v1/ctmflights/update-passenger-details/${flightId}`,
                              {
                                passengerDetails:
                                  flightDetails.passengerDetails,
                              }
                            );
                            alert("Passenger details updated!");
                            setIsPassengerEditable(false);
                          } catch (err) {
                            alert("Failed to update passenger details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => setIsPassengerEditable(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>

              {flightDetails?.passengerDetails?.map((passenger, idx) => (
                <div className={isPassengerEditable ? "" : "op_reduce"}>
                  <p className="title_common_semi1">Passenger {idx + 1}</p>
                  <div className="flex_all form_box_auth" key={idx}>
                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>Passenger Type</label>
                        <select
                          value={passenger.detailsType || ""}
                          className="form-control box_crm_input_all"
                          disabled={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              detailsType: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          <option value="adult">Adult</option>
                          <option value="infant">Infant</option>
                          <option value="child">Child</option>
                        </select>
                      </div>
                    </div>
                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>First Name</label>
                        <input
                          type="text"
                          value={passenger.firstName || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              firstName: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>Middle Name</label>
                        <input
                          type="text"
                          value={passenger.middleName || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              middleName: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          value={passenger.lastName || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              lastName: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>Gender</label>
                        <select
                          value={passenger.gender || ""}
                          className="form-control box_crm_input_all"
                          disabled={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              gender: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>Date of Birth (DOB)</label>
                        <input
                          type="text"
                          value={passenger.dob || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              dob: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="width_control_in25 box_sp">
                      <div className="box_crm_input">
                        <label>Ticket Number</label>
                        <input
                          type="text"
                          value={passenger.ticketNumber || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isPassengerEditable}
                          onChange={(e) => {
                            const updatedPassengers = [
                              ...flightDetails.passengerDetails,
                            ];
                            updatedPassengers[idx] = {
                              ...updatedPassengers[idx],
                              ticketNumber: e.target.value,
                            };
                            setFlightDetails((prev) => ({
                              ...prev,
                              passengerDetails: updatedPassengers,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Secondary Card Details */}
            {flightDetails?.secondCardDetails && (
              <>
                <div className="box_crm_tr margin_box_tr">
                  <p className="title_common_semi flex_props justify-content-between">
                    Secondary Card Details
                    {auth?.user?.role === "superadmin" ||
                    auth?.user?.role === "admin" ? (
                      <div className="flex_props gap-2">
                        {isBillingEditable2 ? (
                          <button
                            className="send_auth_again color_btn_ch"
                            onClick={async () => {
                              try {
                                await axios.patch(
                                  `/api/v1/ctmFlights/update-billing-details2/${flightId}`,
                                  {
                                    cardType2:
                                      flightDetails?.secondCardDetails
                                        ?.cardType2 || "",
                                    cchName2:
                                      flightDetails?.secondCardDetails
                                        ?.cchName2 || "",
                                    cardNumber2:
                                      flightDetails?.secondCardDetails
                                        ?.cardNumber2 || "",
                                    cvv2:
                                      flightDetails?.secondCardDetails?.cvv2 ||
                                      "",
                                    expiryMonth2:
                                      flightDetails?.secondCardDetails
                                        ?.expiryMonth2 || "",
                                    expiryYear2:
                                      flightDetails?.secondCardDetails
                                        ?.expiryYear2 || "",
                                  }
                                );
                                alert("Secondary billing details updated!");
                                setIsBillingEditable2(false);
                              } catch (err) {
                                console.error(err);
                                alert(
                                  "Failed to update secondary billing details."
                                );
                              }
                            }}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            className="send_auth_again color_btn_ch"
                            onClick={() => setIsBillingEditable2(true)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ) : null}
                  </p>

                  <div
                    className={
                      isBillingEditable2
                        ? "mt-2 flex_all form_box_auth"
                        : "mt-2 flex_all form_box_auth op_reduce"
                    }
                  >
                    {/* CARD TYPE */}
                    <div className="width_control_in15 box_sp">
                      <div className="box_crm_input">
                        <label>Card Type</label>
                        <select
                          value={
                            flightDetails?.secondCardDetails?.cardType2 || ""
                          }
                          className="form-select box_crm_input_all"
                          disabled={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                cardType2: e.target.value,
                              },
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          {cardDrop?.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* CCH NAME */}
                    <div className="width_control_in20 box_sp">
                      <div className="box_crm_input">
                        <label>C.C.H. Name</label>
                        <input
                          type="text"
                          value={
                            flightDetails?.secondCardDetails?.cchName2 || ""
                          }
                          className="form-control box_crm_input_all"
                          readOnly={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                cchName2: e.target.value,
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    {/* CARD NUMBER */}
                    <div className="width_control_in30 box_sp">
                      <div className="box_crm_input">
                        <label>Card Number</label>
                        <input
                          type={verifyMe ? "text" : "password"}
                          value={
                            flightDetails?.secondCardDetails?.cardNumber2 || ""
                          }
                          className="form-control box_crm_input_all"
                          readOnly={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                cardNumber2: e.target.value,
                              },
                            }));
                          }}
                          onClick={handleClickVerify}
                        />
                      </div>
                    </div>

                    {/* CVV */}
                    <div className="width_control_in15 box_sp">
                      <div className="box_crm_input">
                        <label>CVV</label>
                        <input
                          type={verifyMe ? "text" : "password"}
                          value={flightDetails?.secondCardDetails?.cvv2 || ""}
                          className="form-control box_crm_input_all"
                          readOnly={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                cvv2: e.target.value,
                              },
                            }));
                          }}
                          onClick={handleClickVerify}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    {/* EXPIRY MONTH */}
                    <div className="width_control_in10 box_sp">
                      <div className="box_crm_input">
                        <label>Expiry Month</label>
                        <input
                          type={verifyMe ? "text" : "password"}
                          value={
                            flightDetails?.secondCardDetails?.expiryMonth2 || ""
                          }
                          className="form-control box_crm_input_all"
                          readOnly={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                expiryMonth2: e.target.value,
                              },
                            }));
                          }}
                          onClick={handleClickVerify}
                          maxLength={2}
                        />
                      </div>
                    </div>

                    {/* EXPIRY YEAR */}
                    <div className="width_control_in10 box_sp">
                      <div className="box_crm_input">
                        <label>Expiry Year</label>
                        <input
                          type={verifyMe ? "text" : "password"}
                          value={
                            flightDetails?.secondCardDetails?.expiryYear2 || ""
                          }
                          className="form-control box_crm_input_all"
                          readOnly={!isBillingEditable2}
                          onChange={(e) => {
                            setFlightDetails((prev) => ({
                              ...prev,
                              secondCardDetails: {
                                ...(prev.secondCardDetails || {}),
                                expiryYear2: e.target.value,
                              },
                            }));
                          }}
                          onClick={handleClickVerify}
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Billing Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Billing Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div class="flex_props gap-2">
                    {isBillingEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `/api/v1/ctmFlights/update-billing-details/${flightId}`,
                              {
                                cardType: flightDetails?.cardType,
                                cchName: flightDetails?.cchName,
                                cardNumber: flightDetails?.cardNumber,
                                cvv: flightDetails?.cvv,
                                expiry: flightDetails?.expiry,
                                expiryMonth: flightDetails?.expiryMonth,
                                expiryYear: flightDetails?.expiryYear,
                                email: flightDetails?.email,
                                billingPhoneNumber:
                                  flightDetails?.billingPhoneNumber,
                                billingAddress1: flightDetails?.billingAddress1,
                                billingAddress2: flightDetails?.billingAddress2,
                                city: flightDetails?.city,
                                state: flightDetails?.state,
                                country: flightDetails?.country,
                                zipCode: flightDetails?.zipCode,
                              }
                            );
                            alert("Billing details updated!");

                            setIsBillingEditable(false);
                          } catch (err) {
                            alert("Failed to update billing details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => setIsBillingEditable(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div
                className={
                  isBillingEditable
                    ? "mt-2 flex_all form_box_auth"
                    : "mt-2 flex_all form_box_auth op_reduce"
                }
              >
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>Card Type</label>
                    <select
                      value={flightDetails?.cardType || ""}
                      className="form-select box_crm_input_all"
                      disabled={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          cardType: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      {cardDrop?.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="width_control_in20 box_sp">
                  <div className="box_crm_input">
                    <label>C.C.H. Name</label>
                    <input
                      type="text"
                      value={flightDetails?.cchName || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          cchName: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in30 box_sp">
                  <div className="box_crm_input">
                    <label>Card Number</label>
                    <input
                      type={verifyMe ? "text" : "password"}
                      value={flightDetails?.cardNumber || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }));
                      }}
                      onClick={handleClickVerify}
                    />
                  </div>
                </div>
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>CVV</label>
                    <input
                      type={verifyMe ? "text" : "password"}
                      value={flightDetails?.cvv || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }));
                      }}
                      onClick={handleClickVerify}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="width_control_in10 box_sp">
                  <div className="box_crm_input">
                    <label>Expiry Month</label>
                    <input
                      type={verifyMe ? "text" : "password"}
                      value={flightDetails?.expiryMonth || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          expiryMonth: e.target.value,
                        }));
                      }}
                      onClick={handleClickVerify}
                      maxLength={2}
                    />
                  </div>
                </div>
                <div className="width_control_in10 box_sp">
                  <div className="box_crm_input">
                    <label>Expiry Year</label>
                    <input
                      type={verifyMe ? "text" : "password"}
                      value={flightDetails?.expiryYear || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          expiryYear: e.target.value,
                        }));
                      }}
                      onClick={handleClickVerify}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="width_control_in33 box_sp">
                  <div className="box_crm_input">
                    <label>Email</label>
                    <input
                      type="email"
                      value={flightDetails?.email || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in33 box_sp">
                  <div className="box_crm_input">
                    <label>Billing Number</label>

                    <input
                      type="text"
                      value={flightDetails?.billingPhoneNumber || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          billingPhoneNumber: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in33 box_sp">
                  <div className="box_crm_input">
                    <label>Billing Address</label>
                    <input
                      type="text"
                      value={flightDetails?.billingAddress1 || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          billingAddress1: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in33 box_sp">
                  <div className="box_crm_input">
                    <label>Billing Address 2</label>
                    <input
                      type="text"
                      value={flightDetails?.billingAddress2 || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          billingAddress2: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>City</label>
                    <input
                      type="text"
                      value={flightDetails?.city || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>State</label>
                    <input
                      type="text"
                      value={flightDetails?.state || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>Country</label>
                    <input
                      type="text"
                      value={flightDetails?.country || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in15 box_sp">
                  <div className="box_crm_input">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={flightDetails?.zipCode || ""}
                      className="form-control box_crm_input_all"
                      readOnly={!isBillingEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Refund Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                Refund Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div className="flex_props gap-2">
                    {isRefundEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            const field = {
                              refundAmount: "Refund Amount",
                              refundRequestedOn: "Refund Request Date",
                              reasonForRefund: "Refund Reason",
                              refundStatus: "Refund Status",
                            };

                            // ✅ Loop Validation
                            for (const key in field) {
                              if (!flightDetails?.refund?.[key]) {
                                toast.error(`${field[key]} is required`);
                                return;
                              }
                            }

                            await axios.patch(
                              `/api/v1/ctmFlights/update-refund-details/${flightId}`,
                              {
                                refundAmount:
                                  flightDetails?.refund?.refundAmount,
                                refundRequestedOn:
                                  flightDetails?.refund?.refundRequestedOn,
                                reasonForRefund:
                                  flightDetails?.refund?.reasonForRefund,
                                refundStatus:
                                  flightDetails?.refund?.refundStatus,
                              }
                            );
                            alert("Refund details updated!");

                            setIsRefundEditable(false);
                          } catch (err) {
                            alert("Failed to update refund details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => setIsRefundEditable(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div
                className={
                  isRefundEditable
                    ? "mt-2 flex_all form_box_auth"
                    : "mt-2 flex_all form_box_auth op_reduce"
                }
              >
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Amount</label>
                    <input
                      type="text"
                      value={flightDetails?.refund?.refundAmount}
                      className="form-control box_crm_input_all"
                      readOnly={!isRefundEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     refundAmount: e.target.value,
                      //   }));
                      // }}

                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          refund: {
                            ...(prev?.refund || {}),
                            refundAmount: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Refund Requested On</label>
                    <input
                      type="text"
                      value={flightDetails?.refund?.refundRequestedOn}
                      className="form-control box_crm_input_all"
                      readOnly={!isRefundEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     refundRequestedOn: e.target.value,
                      //   }));
                      // }}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          refund: {
                            ...(prev?.refund || {}),
                            refundRequestedOn: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Reason for Refund</label>

                    <input
                      type="text"
                      value={flightDetails?.refund?.reasonForRefund}
                      className="form-control box_crm_input_all"
                      readOnly={!isRefundEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     reasonForRefund: e.target.value,
                      //   }));
                      // }}

                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          refund: {
                            ...(prev?.refund || {}),
                            reasonForRefund: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Refund Status</label>

                    {/* <select
                      value={flightDetails?.refund?.refundStatus}
                      className="form-control box_crm_input_all"
                      disabled={!isRefundEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          refund: {
                            ...(prev?.refund || {}),
                            refundStatus: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select> */}

                    <input
                      type="text"
                      value={flightDetails?.refund?.refundStatus}
                      className="form-control box_crm_input_all"
                      disabled={!isRefundEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          refund: {
                            ...(prev?.refund || {}),
                            refundStatus: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Refund Details */}
            {/* Chargeback Details */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi flex_props justify-content-between">
                ChargeBack Details
                {auth?.user?.role === "superadmin" ||
                auth?.user?.role === "admin" ? (
                  <div className="flex_props gap-2">
                    {isChargebackEditable ? (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={async () => {
                          try {
                            const fields = {
                              chargeAmount: "Charge Amount",
                              chargebackDate: "Chargeback Date",
                              reasonForChargeback: "Reason for Chargeback",
                              chargebackStatus: "Chargeback Status",
                            };

                            for (const key in fields) {
                              if (!flightDetails?.chargeBackDetails?.[key]) {
                                toast.error(`${fields[key]} is required!`);
                                return;
                              }
                            }
                            await axios.patch(
                              `/api/v1/ctmFlights/update-chargeBack-details/${flightId}`,
                              {
                                chargeAmount:
                                  flightDetails?.chargeBackDetails
                                    ?.chargeAmount,
                                chargebackDate:
                                  flightDetails?.chargeBackDetails
                                    ?.chargebackDate,
                                reasonForChargeback:
                                  flightDetails?.chargeBackDetails
                                    ?.reasonForChargeback,
                                chargebackStatus:
                                  flightDetails?.chargeBackDetails
                                    ?.chargebackStatus,
                              }
                            );
                            alert("Chargeback details updated!");

                            setIsChargebackEditable(false);
                          } catch (err) {
                            alert("Failed to update charging details.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="send_auth_again color_btn_ch"
                        onClick={() => setIsChargebackEditable(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ) : null}
              </p>
              <div
                className={
                  isChargebackEditable
                    ? "mt-2 flex_all form_box_auth"
                    : "mt-2 flex_all form_box_auth op_reduce"
                }
              >
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Amount</label>
                    <input
                      type="text"
                      value={flightDetails?.chargeBackDetails?.chargeAmount}
                      className="form-control box_crm_input_all"
                      readOnly={!isChargebackEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     chargeAmount: e.target.value,
                      //   }));
                      // }}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          chargeBackDetails: {
                            ...(prev?.chargeBackDetails || {}),
                            chargeAmount: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Chargeback Date</label>
                    <input
                      type="text"
                      value={flightDetails?.chargeBackDetails?.chargebackDate}
                      className="form-control box_crm_input_all"
                      readOnly={!isChargebackEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     chargebackDate: e.target.value,
                      //   }));
                      // }}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          chargeBackDetails: {
                            ...(prev?.chargeBackDetails || {}),
                            chargebackDate: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Reason for Chargeback</label>
                    <input
                      type="text"
                      value={
                        flightDetails?.chargeBackDetails?.reasonForChargeback
                      }
                      className="form-control box_crm_input_all"
                      readOnly={!isChargebackEditable}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          chargeBackDetails: {
                            ...(prev?.chargeBackDetails || {}),
                            reasonForChargeback: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Chargeback Status</label>
                    {/* <select
                      value={flightDetails?.chargeBackDetails?.chargebackStatus}
                      className="form-control box_crm_input_all"
                      disabled={!isChargebackEditable}
                     
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          chargeBackDetails: {
                            ...(prev?.chargeBackDetails || {}),
                            chargebackStatus: e.target.value,
                          },
                        }));
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select> */}

                    <input
                      type="text"
                      value={flightDetails?.chargeBackDetails?.chargebackStatus}
                      className="form-control box_crm_input_all"
                      disabled={!isChargebackEditable}
                      // onChange={(e) => {
                      //   setFlightDetails((prev) => ({
                      //     ...prev,
                      //     chargebackStatus: e.target.value,
                      //   }));
                      // }}
                      onChange={(e) => {
                        setFlightDetails((prev) => ({
                          ...prev,
                          chargeBackDetails: {
                            ...(prev?.chargeBackDetails || {}),
                            chargebackStatus: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Send Email */}
            <div className="box_crm_tr margin_box_tr">
              <p className="title_common_semi">Send Email</p>

              <div className="mt-2 flex_all form_box_auth">
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Language</label>
                    <select
                      value={flightDetails?.language}
                      className="form-select box_crm_input_all"
                      onChange={(e) =>
                        setFlightDetails((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Transaction Type</label>
                    <select
                      value={flightDetails?.transactionType}
                      className="form-select box_crm_input_all"
                      onChange={(e) =>
                        setFlightDetails((prev) => ({
                          ...prev,
                          transactionType: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="newBooking">New Booking</option>
                      <option value="exchange">Exchange</option>
                      <option value="seatAssignments">Seat Assignments</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="cancellationRefund">
                        Cancellation for Refund
                      </option>
                      <option value="cancellationFutureCredit">
                        Cancellation for Future Credit
                      </option>
                      <option value="extraAddOn">Extra Add On</option>
                      <option value="ticketIssuance">Ticket Issuance</option>
                    </select>
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <div className="box_crm_input">
                    <label>Mail Confirmation</label>

                    <select
                      value={
                        flightDetails.agentFigure
                          ? flightDetails.agentFigure
                          : "loading..."
                      }
                      className="form-select box_crm_input_all"
                      onChange={(e) =>
                        setFlightDetails((prev) => ({
                          ...prev,
                          agentFigure: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div className="width_control_in25 box_sp">
                  <button
                    className={
                      flightDetails?.agentFigure !== "yes"
                        ? "send_in_btn disabled"
                        : "send_in_btn"
                    }
                    onClick={handleRemarksConfirm}
                    // onClick={() =>
                    //   navigate("/astrivion/invoice-preview", {
                    //     state: { flightDetails },
                    //   })
                    // }
                    // disabled={
                    //   !(
                    //     flightDetails?.ticketmco === "ticketMco" &&
                    //     flightDetails?.chargingStatus === "charged" &&
                    //     flightDetails?.pnrStatus === "approved"
                    //   )
                    // }

                    title={
                      flightDetails?.ticketmco === "ticketMco" &&
                      flightDetails?.chargingStatus === "charged" &&
                      flightDetails?.pnrStatus === "approved"
                        ? ""
                        : "Send Email is only available when Bid Status is 'Ticketed & MCO', Charging Status is 'charged', and Auth Status is 'approved'."
                    }
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <div className="fixed_btns_all_pnr">
        <button className="btn_stick" onClick={() => setShowRemarksModal(true)}>
          View Remarks
        </button>

        <button
          className="btn_stick"
          onClick={() => setShowActivityModal(true)}
        >
          Check Activity
        </button>
        <button className="btn_stick" onClick={() => setShowUploadModal(true)}>
          Uploaded Docs
        </button>
      </div>
      {/* --------------------------start showUploaded moda---------------------- */}
      {showUploadModal && (
        <div className="log_all_pop">
          <div className="log_pop_semi">
            <p className="log_header flex_props justify-content-between">
              Uploaded Documents
              <button
                type="button"
                className="log_close"
                onClick={() => setShowUploadModal(false)}
              >
                {" "}
                <img src="/imgs/close-icon.png" />
              </button>
            </p>

            <div className="bid_table">
              {/* documents */}
              {flightDetails?.documents?.length === 0 ? (
                <p>No documents uploaded yet.</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>S. No</th>
                          <th>Name</th>
                          <th>Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightDetails.documents?.map((doc, index) => {
                          const fileUrl = `${
                            import.meta.env.VITE_REACT_APP_MAIN_URL
                          }uploads/${doc}`;
                          return (
                            <tr key={`doc-${index}`}>
                              <td>{index + 1}</td>
                              <td>{doc}</td>
                              <td>
                                <a
                                  href={fileUrl}
                                  download={doc}
                                  target="_blank"
                                >
                                  <img
                                    src={fileUrl}
                                    alt="document"
                                    style={{
                                      width: 60,
                                      height: 60,
                                      objectFit: "cover",
                                      borderRadius: 4,
                                      border: "1px solid #eee",
                                    }}
                                  />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --------------------------end showUploaded modal--------------- */}
    </Layout>
  );
};

export default DetailsPnrFlight;
