import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import cardValidator from "card-validator";
import { useNavigate, useLocation } from "react-router-dom";
// import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const CreateCtmFlight = () => {
  const initialFormData = {
    transactionType: "",
    itineraryType: "",
    passengers: "",
    provider: "",
    airline: "",
    airlineImage: "",
    flight: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    class: "",
    alLocator: "",
    baseFare: "",
    taxes: "",
    totalAmount: "",
    currency: "USD",
    detailsType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    cardType: "",
    cchName: "",
    cardNumber: "",
    cvv: "",
    dnis: "",
    expiryMonth: "",
    expiryYear: "",

    cardType2: "",
    cchName2: "",
    cardNumber2: "",
    cvv2: "",
    expiryMonth2: "",
    expiryYear2: "",

    billingPhoneNumber: "",
    contactNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    email: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    outboundFlight: "",
    inboundFlight: "",

    refundAmount: "",
    refundRequestedOn: "",
    refundReason: "",
    refundStatus: "",

    futureCreditAmount: "",
    futureCreditRequestedOn: "",
    futureCreditValidity: "",
    futureCreditReason: "",

    ticketIssueAmount: "",
    ticketIssueRequestedOn: "",
    ticketIssueValidity: "",
    ticketIssueReason: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [cardType, setCardType] = useState("");

  const [providers, setProviders] = useState([]);
  const [ctmAirline, setCtmAirline] = useState([]);
  const [curDrop, setCurDrop] = useState([]);
  const [classDrop, setClassDrop] = useState([]);
  const [cardDrop, setCardDrop] = useState([]);

  const [outboundSegments, setOutboundSegments] = useState([]);
  const [inboundSegments, setInboundSegments] = useState([]);

  const [passengerDetails, setPassengerDetails] = useState([]);
  const [secondaryCardType, setSecondaryCardType] = useState(false);

  // Single refund/future-credit fields
  // We'll bind these to `formData` for a single record

  // ḍropdown code
  const type = "currency";
  const classType = "class";
  const carDropDown = "cardType";
  const fetchDropdownItems = async () => {
    try {
      const res = await axios.get(`/api/v1/dropdown/get-dropdown?type=${type}`);
      setCurDrop(res?.data?.items);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dropdown items");
    }
  };
  const fetchDropdownClass = async () => {
    try {
      const res = await axios.get(
        `/api/v1/dropdown/get-dropdown?type=${classType}`
      );
      setClassDrop(res?.data?.items);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dropdown items");
    }
  };

  const fetchDropdownCardyType = async () => {
    try {
      const res = await axios.get(
        `/api/v1/dropdown/get-dropdown?type=${carDropDown}`
      );
      setCardDrop(res?.data?.items);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dropdown items");
    }
  };

  useEffect(() => {
    fetchDropdownClass();
    fetchDropdownItems();
    fetchDropdownCardyType();
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-provider");
        if (res.data.success) {
          setProviders(res.data.booking); // 'booking' is the array of providers
        }
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchCtmAirline = async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/get-ctmAirline");

        console.log("resi s", res.data);
        if (res.data.success) {
          setCtmAirline(res.data.booking);
        }
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };
    fetchCtmAirline();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const cardInfo = cardValidator.number(value);
      if (cardInfo.card) {
        setCardType(cardInfo.card.niceType); // e.g. Visa, MasterCard
        // console.log("cardType",cardType)
      } else {
        setCardType("");
      }
    }

    if (name === "passengers") {
      const count = parseInt(value, 10) || 0;
      const newPassengers = Array.from(
        { length: count },
        (_, i) =>
          passengerDetails[i] || {
            detailsType: "",
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            dob: "",
          }
      );

      setPassengerDetails(newPassengers);
      setFormData({
        ...formData,
        passengers: value,
        passengerDetails: newPassengers,
      });
    }

    setFormData({ ...formData, [name]: value });

    // Handle outbound/inbound segment array creation on flight count selection
    if (name === "outboundFlight") {
      const count = parseInt(value.replace("outbound", "")) || 0;
      setOutboundSegments(Array(count).fill({}));
    }

    if (name === "inboundFlight") {
      const count = parseInt(value.replace("inbound", "")) || 0;
      setInboundSegments(Array(count).fill({}));
    }
  };

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...passengerDetails];
    updated[index][name] = value;

    setPassengerDetails(updated);
    setFormData({ ...formData, passengerDetails: updated });
  };

  // const handleSegmentChange = (type, index, field, value) => {
  //   const segments =
  //     type === "outbound" ? [...outboundSegments] : [...inboundSegments];
  //   segments[index] = { ...segments[index], [field]: value };

  //   type === "outbound"
  //     ? setOutboundSegments(segments)
  //     : setInboundSegments(segments);
  // };

  const handleSegmentChange = (type, index, field, value) => {
    if (type === "outbound") {
      setOutboundSegments((prev) => {
        const segments = [...prev];
        segments[index] = { ...segments[index], [field]: value };
        return segments;
      });
    } else {
      setInboundSegments((prev) => {
        const segments = [...prev];
        segments[index] = { ...segments[index], [field]: value };
        return segments;
      });
    }
  };

  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    const requiredFields = [
      "transactionType",
      "itineraryType",
      "passengers",
      "provider",
      "outboundFlight",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldLabel = field
          .replace(/([A-Z])/g, " $1") // add space before capital letters
          .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
        toast.error(`Please select ${fieldLabel}`);
        return false;
      }
    }

    if (formData.itineraryType === "roundTrip") {
      if (
        !formData.inboundFlight ||
        !formData.inboundFlight.toString().trim()
      ) {
        toast.error("Please fill the Inbound Flight");
        return false;
      }

      // if (!validateSegments(inboundSegments, "inbound")) return false;
    }

    return true;
  };

  const backondetailsec = () => {
    setStep(1);
  };
  const forwardToBillingSection = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const userRole = localStorage.getItem("auth");
  const parsedUserRole = JSON.parse(userRole);

  const agentId = parsedUserRole?.user?._id;

  const handleShowRemarksModal = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowRemarksModal(true);
  };

  const validateForm = () => {
    const requiredMainFields = [
      "transactionType",
      "itineraryType",
      "passengers",
      "provider",
      "baseFare",
      "taxes",
      "currency",
      "cardType",
      "cchName",
      "cardNumber",
      "cvv",
      "expiryMonth",
      "expiryYear",
      "billingPhoneNumber",
      "contactNumber",
      "billingAddress1",
      "billingAddress2",
      "email",
      "city",
      "dnis",
      "state",
      "country",
      "zipCode",
      "outboundFlight",
    ];

    // Validate top-level fields
    for (let field of requiredMainFields) {
      if (!formData[field] || !formData[field].toString().trim()) {
        toast.error(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }

    // Validate passengers
    if (!formData.passengerDetails || formData.passengerDetails.length === 0) {
      toast.error("Please add at least one passenger");
      return false;
    }

    for (let i = 0; i < formData.passengerDetails.length; i++) {
      const p = formData.passengerDetails[i];
      if (
        !p.detailsType ||
        !p.firstName ||
        !p.lastName ||
        !p.gender ||
        !p.dob
      ) {
        toast.error(`Please fill all required fields for passenger ${i + 1}`);
        return false;
      }
    }

    // Validate segments
    if (!validateSegments(outboundSegments, "outbound")) return false;
    if (formData.itineraryType === "roundTrip") {
      if (!validateSegments(inboundSegments, "inbound")) return false;
    }

    return true;
  };

  const requiredSegmentFields = [
    "airline",
    "flight",
    "from",
    "to",
    "departure",
    "arrival",
    "class",
    "alLocator",
  ];
  const validateSegments = (segments, type) => {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      for (const field of requiredSegmentFields) {
        if (!segment[field] || segment[field].toString().trim() === "") {
          toast.error(
            `Please fill ${field} for ${type} flight segment ${i + 1}`
          );
          return false;
        }
      }
    }
    return true;
  };
  const navigate = useNavigate();
  const location = useLocation();
  // Update handleRemarksConfirm to use validation
  const handleRemarksConfirm = () => {
    if (!validateForm()) return;

    if (!remarks.trim()) {
      toast.error("Please enter remarks.");
      return false;
    }

    setShowRemarksModal(false);

    const flightDetails = {
      ...formData,
      tollFreeNumber: providers,
      outboundSegments,
      inboundSegments,
      remarks,
      refundDetails: {
        amount: formData.refundAmount,
        refundRequestedOn: formData.refundRequestedOn,
        reasonForRefund: formData.refundReason,
        refundStatus: formData.refundStatus,
      },
      futureCreditDetails: {
        amount: formData.futureCreditAmount,
        futureCreditRequestedOn: formData.futureCreditRequestedOn,
        futureCreditValidity: formData.futureCreditValidity,
        reasonForFutureCredit: formData.futureCreditReason,
      },
      ticketIssueDetails: {
        ticketIssueAmount: formData.ticketIssueAmount,
        ticketIssueRequestedOn: formData.ticketIssueRequestedOn,
        ticketIssueValidity: formData.ticketIssueValidity,
        ticketIssueReason: formData.ticketIssueReason,
      },
      agent: agentId,
    };

    console.log("flightDetails", flightDetails);

    // persist to sessionStorage so that if user navigates back via browser
    // or the preview route doesn't pass state, we can restore the form.
    try {
      sessionStorage.setItem(
        "ctm_flightDetails",
        JSON.stringify({ flightDetails, step })
      );
    } catch (e) {
      console.warn("Could not persist flightDetails to sessionStorage", e);
    }

    if (formData.transactionType === "cancellationRefund") {
      navigate("/astrivion/auth-refund-invoice-preview", {
        state: { flightDetails, isAuthFlow: false },
      });
    } else if (formData.transactionType === "cancellationFutureCredit") {
      navigate("/astrivion/auth-future-credit-invoice-preview", {
        state: { flightDetails, isAuthFlow: false },
      });
    }else if (flightDetails.transactionType === "ticketIssuance") {
      navigate("/astrivion/auth-invoice-preview-ticket-issuance", {
        state: { flightDetails, isAuthFlow: true },
      });
    }  else {
      navigate("/astrivion/auth-invoice-preview", {
        state: { flightDetails, isAuthFlow: false },
      });
    }
  };

  // Handler for modal cancel
  const handleRemarksCancel = () => {
    setShowRemarksModal(false);
    setRemarks("");
  };
  useEffect(() => {
    // Try to restore flight details either from location.state (when coming
    // back explicitly with state) or from sessionStorage (fallback).
    console.log("attempting to restore saved flight details");

    const restoreFromLocation = () => {
      if (location.state?.flightDetails) {
        const { flightDetails } = location.state;
        console.log("restoring from location.state", location.state);

        setFormData((prev) => ({ ...prev, ...flightDetails }));
        setOutboundSegments(flightDetails.outboundSegments || []);
        setInboundSegments(flightDetails.inboundSegments || []);
        setPassengerDetails(flightDetails.passengerDetails || []);
        // If segments were present previously, ensure we return to step 2
        if (
          location.state.step ||
          (flightDetails.outboundSegments &&
            flightDetails.outboundSegments.length > 0) ||
          (flightDetails.inboundSegments &&
            flightDetails.inboundSegments.length > 0)
        ) {
          setStep(location.state.step || 2);
        }
        return true;
      }
      return false;
    };

    const restoreFromSession = () => {
      try {
        const raw = sessionStorage.getItem("ctm_flightDetails");
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        const { flightDetails: fd, step: savedStep } = parsed || {};
        if (!fd) return false;
        console.log("restoring from sessionStorage", parsed);
        setFormData((prev) => ({ ...prev, ...fd }));
        setOutboundSegments(fd.outboundSegments || []);
        setInboundSegments(fd.inboundSegments || []);
        setPassengerDetails(fd.passengerDetails || []);
        // If saved step exists use it, otherwise if segments exist move to step 2
        if (savedStep) setStep(savedStep);
        else if (
          (fd.outboundSegments && fd.outboundSegments.length > 0) ||
          (fd.inboundSegments && fd.inboundSegments.length > 0)
        ) {
          setStep(2);
        }
        return true;
      } catch (e) {
        console.warn("failed to parse session ctm_flightDetails", e);
        return false;
      }
    };

    // Priority: location.state then sessionStorage
    // if (!restoreFromLocation()) {
    //   restoreFromSession();
    // }
    restoreFromLocation();
  }, [location]);
  const handleRefreshClick = () => {
    sessionStorage.removeItem("ctm_flightDetails");
    window.location.reload();
  };

  const handleSecondaryCardAdd = () => {
    const requiredFields = [
      "cardType2",
      "cchName2",
      "cardNumber2",
      "cvv2",
      "expiryMonth2",
      "expiryYear2",
    ];

    // check for empty fields
    const emptyFields = requiredFields.filter(
      (field) => !formData[field]?.trim()
    );

    if (emptyFields.length > 0) {
      alert("Please fill all required fields.");
      return;
    }

    // setFormData((prev) => ({
    //   ...prev,
    //   cardType2: "",
    //   cchName2: "",
    //   cardNumber2: "",
    //   cvv2: "",
    //   expiryMonth2: "",
    //   expiryYear2: "",
    // }));

    setSecondaryCardType(false);
  };

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />

        <div className="crm_right relative">
          <section className="">
            <form className="travel_details_cont">
              <div className="queryparent">
                {step === 1 ? (
                  <div className="">
                    <div className="header_crm flex_props justify-content-between">
                      <p className="crm_title">Traveller Details</p>
                      <button
                        className="refresh_btn"
                        onClick={handleRefreshClick}
                      >
                        <img src="/imgs/refresh-icon.png" />
                        Refresh
                      </button>
                    </div>
                    <div className="row">
                      {/* Transaction Type */}
                      <div className="col-12">
                        <div className="form_travel">
                          <label
                            htmlFor="transactionType"
                            className="form-label"
                          >
                            Transaction Type
                          </label>
                          <select
                            name="transactionType"
                            className="form-select form_all"
                            value={formData.transactionType}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            <option value="newBooking">New Booking</option>
                            <option value="exchange">Exchange</option>
                            <option value="seatAssignments">
                              Seat Assignments
                            </option>
                            <option value="upgrade">Upgrade</option>
                            <option value="cancellationRefund">
                              Cancellation for Refund
                            </option>
                            <option value="cancellationFutureCredit">
                              Cancellation for Future Credit
                            </option>
                            <option value="extraAddOn">Extra Add On</option>
                            <option value="ticketIssuance">
                              Ticket Issuance
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Itinerary Type */}
                      <div className="col-12 mt-4">
                        <div className="form_travel">
                          <label htmlFor="itineraryType">Itinerary Type</label>
                          <select
                            name="itineraryType"
                            className="form-select form_all"
                            value={formData.itineraryType}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            <option value="oneWay">One-Way</option>
                            <option value="roundTrip">Round-Trip</option>
                            <option value="multiCity">Multi-City</option>
                            <option value="dynamicItinerary">
                              Dynamic Itinerary
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Outbound Flight Stop Count */}
                      {(formData.itineraryType === "oneWay" ||
                        formData.itineraryType === "roundTrip") && (
                        <div className="col-12 mt-4">
                          <div className="form_travel">
                            <label htmlFor="outboundFlight">
                              Outbound Flight
                            </label>
                            <select
                              name="outboundFlight"
                              className="form-select form_all"
                              value={formData.outboundFlight}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="outbound1">1</option>
                              <option value="outbound2">2</option>
                              <option value="outbound3">3</option>
                              <option value="outbound4">4</option>
                              <option value="outbound5">5</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Inbound Flight Stop Count */}
                      {formData.itineraryType === "roundTrip" && (
                        <div className="col-12 mt-4">
                          <div className="form_travel">
                            <label htmlFor="inboundFlight">
                              Inbound Flight
                            </label>
                            <select
                              name="inboundFlight"
                              className="form-select form_all"
                              value={formData.inboundFlight}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="inbound1">1</option>
                              <option value="inbound2">2</option>
                              <option value="inbound3">3</option>
                              <option value="inbound4">4</option>
                              <option value="inbound5">5</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Number of Passengers */}
                      {/* <div className="col-md-9 mb-3">
                        <label htmlFor="passengers" className="form-label">
                          Number of Passengers
                        </label>
                        <input
                          name="passengers"
                          className="form-select"
                          value={formData.passengers}
                          onChange={handleChange}
                        ></input>
                      </div> */}

                      {/* Number of Passengers */}
                      <div className="col-12 mt-4">
                        <div className="form_travel">
                          <label htmlFor="passengers">
                            Number of Passengers
                          </label>
                          <input
                            type="number"
                            name="passengers"
                            className="form-select form_all"
                            value={formData.passengers}
                            onChange={handleChange}
                            min={1}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.keyCode === 189) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Provider */}
                      <div className="col-12 mt-4">
                        <div className="form_travel">
                          <label htmlFor="provider">Select Provider</label>
                          <select
                            name="provider"
                            className="form-select form_all"
                            value={formData.provider}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            {providers
                              .filter(
                                (prov) => prov.providerStatus === "Active"
                              )
                              .map((prov) => (
                                <option key={prov._id} value={prov.provider}>
                                  {prov.provider}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="col-12 mt-4">
                      <button
                        type="button"
                        className="create_bid"
                        onClick={forwardToBillingSection}
                      >
                        Continue Ahead
                      </button>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <>
                    {" "}
                    <button onClick={backondetailsec} className="back_btn">
                      <img src="/imgs/arrow-back.png" />
                      Back
                    </button>
                    <div>
                      <div className="header_crm flex_props justify-content-between">
                        <p className="crm_title">
                          Send Authentication to Customer
                        </p>
                      </div>
                      <div className="box_crm_tr">
                        <p className="title_common_semi">Itinerary Details</p>

                        {/* Outbound Segments */}
                        <p className="title_common_semi_main1">
                          <span>Outbound Segment</span>
                        </p>

                        {outboundSegments.map((segment, index) => (
                          <div
                            className={`outbound_segment_container outbound_segment_container${index}`}
                          >
                            <p className="title_common_semi1">
                              {`Outbound Flight ${index + 1}`}
                            </p>
                            <div key={index} className="flex_all form_box_auth">
                              <div className="width_control_in13 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`airlines_auth${index}`}>
                                    Airlines
                                  </label>
                                  <select
                                    className="form-select box_crm_input_all"
                                    id={`airlines_auth${index}`}
                                    value={segment.airline || ""}
                                    onChange={(e) => {
                                      const selectedAirline = e.target.value;
                                      const airlineObj = ctmAirline.find(
                                        (prov) =>
                                          prov.ctmAirline === selectedAirline
                                      );
                                      const airlineImage =
                                        airlineObj?.ctmAirlinePictures?.[0]
                                          ?.img || "";
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "airline",
                                        selectedAirline
                                      );
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "airlineImage",
                                        airlineImage
                                      );
                                    }}
                                  >
                                    <option value="">Select Airline</option>
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
                              {/* Airline Image Preview/Input */}
                              <div className="width_control_in13 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor="">Airline Image</label>
                                  {segment.airlineImage ? (
                                    <>
                                      <img
                                        src={`${
                                          import.meta.env
                                            .VITE_REACT_APP_MAIN_URL
                                        }uploads/${segment.airlineImage}`}
                                        alt="Airline"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <span>No image selected</span>
                                  )}
                                </div>
                              </div>
                              <div className="width_control_in13 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`flightno_send${index}`}>
                                    Flight No.
                                  </label>
                                  <input
                                    placeholder="Flight"
                                    id={`flightno_send${index}`}
                                    value={segment.flight || ""}
                                    onChange={(e) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "flight",
                                        e.target.value
                                      )
                                    }
                                    className="form-control box_crm_input_all"
                                  />
                                </div>
                              </div>
                              <div className="width_control_in23 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`desti_from${index}`}>
                                    Destination From
                                  </label>
                                  <input
                                    placeholder="From"
                                    id={`desti_from${index}`}
                                    value={segment.from || ""}
                                    onChange={(e) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "from",
                                        e.target.value
                                      )
                                    }
                                    className="form-control box_crm_input_all"
                                  />
                                </div>
                              </div>
                              <div className="width_control_in23 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`desti_to${index}`}>
                                    Destination To
                                  </label>
                                  <input
                                    placeholder="To"
                                    id={`desti_to${index}`}
                                    value={segment.to || ""}
                                    onChange={(e) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "to",
                                        e.target.value
                                      )
                                    }
                                    className="box_crm_input_all form-control"
                                  />
                                </div>
                              </div>
                              <div className="width_control_in13 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`depart_d${index}`}>
                                    Departure Date
                                  </label>

                                  <DatePicker
                                    selected={
                                      segment.departure
                                        ? new Date(segment.departure)
                                        : null
                                    }
                                    onChange={(date) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "departure",
                                        date
                                      )
                                    }
                                    showTimeSelect
                                    timeIntervals={1}
                                    dateFormat="Pp"
                                    className="form-control box_crm_input_all"
                                  />
                                </div>
                              </div>
                              <div className="width_control_in13 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`return_d${index}`}>
                                    Arrival Date
                                  </label>

                                  <DatePicker
                                    selected={
                                      segment.arrival
                                        ? new Date(segment.arrival)
                                        : null
                                    }
                                    onChange={(date) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "arrival",
                                        date
                                      )
                                    }
                                    showTimeSelect
                                    timeIntervals={1}
                                    dateFormat="Pp"
                                    className="form-control box_crm_input_all"
                                  />
                                </div>
                              </div>
                              <div className="width_control_in23 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`class_air${index}`}>
                                    Class
                                  </label>
                                  <select
                                    id={`class_air${index}`}
                                    value={segment.class || ""}
                                    onChange={(e) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "class",
                                        e.target.value
                                      )
                                    }
                                    className="form-select box_crm_input_all"
                                  >
                                    <option value="">Select Class</option>
                                    {classDrop.map((item, i) => (
                                      <option key={i} value={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="width_control_in23 box_sp">
                                <div className="box_crm_input">
                                  <label htmlFor={`ai_loc${index}`}>
                                    Al Locator
                                  </label>
                                  <input
                                    placeholder="AL Locator"
                                    id={`ai_loc${index}`}
                                    value={segment.alLocator || ""}
                                    onChange={(e) =>
                                      handleSegmentChange(
                                        "outbound",
                                        index,
                                        "alLocator",
                                        e.target.value
                                      )
                                    }
                                    className="form-control box_crm_input_all"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Inbound Segments */}
                        {/* Inbound Segments */}
                        {formData.itineraryType === "roundTrip" && (
                          <>
                            <p className="title_common_semi_main1 mt-3">
                              <span>Inbound Segment</span>
                            </p>

                            {inboundSegments.map((segment, index) => (
                              <div
                                key={index}
                                className={`outbound_segment_container inbound_segment_container${index}`}
                              >
                                <p className="title_common_semi1">
                                  {`Inbound Flight ${index + 1}`}
                                </p>

                                <div className="flex_all form_box_auth">
                                  {/* Airline Selection */}
                                  <div className="width_control_in13 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`airlines_inbound${index}`}
                                      >
                                        Airlines
                                      </label>
                                      <select
                                        className="form-select box_crm_input_all"
                                        id={`airlines_inbound${index}`}
                                        value={segment.airline || ""}
                                        onChange={(e) => {
                                          const selectedAirline =
                                            e.target.value;
                                          const airlineObj = ctmAirline.find(
                                            (prov) =>
                                              prov.ctmAirline ===
                                              selectedAirline
                                          );
                                          const airlineImage =
                                            airlineObj?.ctmAirlinePictures?.[0]
                                              ?.img || "";

                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "airline",
                                            selectedAirline
                                          );
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "airlineImage",
                                            airlineImage
                                          );
                                        }}
                                      >
                                        <option value="">Select Airline</option>
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

                                  {/* Airline Image Preview */}
                                  <div className="width_control_in13 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor="">Airline Image</label>
                                      {segment.airlineImage ? (
                                        <img
                                          src={`${
                                            import.meta.env
                                              .VITE_REACT_APP_MAIN_URL
                                          }uploads/${segment.airlineImage}`}
                                          alt="Airline"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <span>No image selected</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Flight No. */}
                                  <div className="width_control_in13 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`flightno_inbound${index}`}
                                      >
                                        Flight No.
                                      </label>
                                      <input
                                        placeholder="Flight"
                                        id={`flightno_inbound${index}`}
                                        value={segment.flight || ""}
                                        onChange={(e) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "flight",
                                            e.target.value
                                          )
                                        }
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>

                                  {/* Destination From */}
                                  <div className="width_control_in23 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`desti_from_inbound${index}`}
                                      >
                                        Destination From
                                      </label>
                                      <input
                                        placeholder="From"
                                        id={`desti_from_inbound${index}`}
                                        value={segment.from || ""}
                                        onChange={(e) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "from",
                                            e.target.value
                                          )
                                        }
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>

                                  {/* Destination To */}
                                  <div className="width_control_in23 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`desti_to_inbound${index}`}
                                      >
                                        Destination To
                                      </label>
                                      <input
                                        placeholder="To"
                                        id={`desti_to_inbound${index}`}
                                        value={segment.to || ""}
                                        onChange={(e) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "to",
                                            e.target.value
                                          )
                                        }
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>

                                  {/* Departure Date */}
                                  <div className="width_control_in13 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor={`depart_inbound${index}`}>
                                        Departure Date
                                      </label>
                                      <DatePicker
                                        selected={
                                          segment.departure
                                            ? new Date(segment.departure)
                                            : null
                                        }
                                        onChange={(date) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "departure",
                                            date
                                          )
                                        }
                                        showTimeSelect
                                        timeIntervals={1}
                                        dateFormat="Pp"
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>

                                  {/* Arrival Date */}
                                  <div className="width_control_in13 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`arrival_inbound${index}`}
                                      >
                                        Arrival Date
                                      </label>
                                      <DatePicker
                                        selected={
                                          segment.arrival
                                            ? new Date(segment.arrival)
                                            : null
                                        }
                                        onChange={(date) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "arrival",
                                            date
                                          )
                                        }
                                        showTimeSelect
                                        timeIntervals={1}
                                        dateFormat="Pp"
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>

                                  {/* Class */}
                                  <div className="width_control_in23 box_sp">
                                    <div className="box_crm_input">
                                      <label
                                        htmlFor={`class_air_inbound${index}`}
                                      >
                                        Class
                                      </label>
                                      <select
                                        id={`class_air_inbound${index}`}
                                        value={segment.class || ""}
                                        onChange={(e) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "class",
                                            e.target.value
                                          )
                                        }
                                        className="form-select box_crm_input_all"
                                      >
                                        <option value="">Select Class</option>
                                        {classDrop.map((item, i) => (
                                          <option key={i} value={item.value}>
                                            {item.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Al Locator */}
                                  <div className="width_control_in23 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor={`ai_loc_inbound${index}`}>
                                        Al Locator
                                      </label>
                                      <input
                                        placeholder="AL Locator"
                                        id={`ai_loc_inbound${index}`}
                                        value={segment.alLocator || ""}
                                        onChange={(e) =>
                                          handleSegmentChange(
                                            "inbound",
                                            index,
                                            "alLocator",
                                            e.target.value
                                          )
                                        }
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* -------------------------------- */}

                      {/* Cancellation for refund */}
                      {/* Show Refund Section if transactionType = cancellationRefund */}
                      {formData.transactionType === "cancellationRefund" && (
                        <div className="box_crm_tr margin_box_tr">
                          <p className="title_common_semi">
                            Ticket Refund Details
                          </p>
                          <div className="flex_all form_box_auth mt-2">
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Amount</label>
                                <input
                                  type="number"
                                  className="form-control box_crm_input_all"
                                  name="refundAmount"
                                  value={formData.refundAmount || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      refundAmount: e.target.value,
                                    })
                                  }
                                  placeholder="Amount"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Refund Requested On</label>
                                <DatePicker
                                  selected={
                                    formData.refundRequestedOn
                                      ? new Date(formData.refundRequestedOn)
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData({
                                      ...formData,
                                      refundRequestedOn: date,
                                    })
                                  }
                                  className="form-control box_crm_input_all"
                                  placeholderText="mm/dd/yyyy"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Reason for Refund</label>
                                <input
                                  type="text"
                                  className="form-control box_crm_input_all"
                                  name="refundReason"
                                  value={formData.refundReason || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      refundReason: e.target.value,
                                    })
                                  }
                                  placeholder="Reason"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Status</label>
                                <input
                                  className="form-control box_crm_input_all"
                                  name="refundStatus"
                                  value={formData.refundStatus}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      refundStatus: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* ----------------------------------------- cancellationFutureCredit -------------------------- */}
                      {formData.transactionType ===
                        "cancellationFutureCredit" && (
                        <div className="box_crm_tr margin_box_tr">
                          <p className="title_common_semi">
                            Future Credit Details
                          </p>

                          <div className="mt-2 flex_all form_box_auth">
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Amount</label>
                                <input
                                  type="number"
                                  className="form-control box_crm_input_all"
                                  name="futureCreditAmount"
                                  value={formData.futureCreditAmount || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      futureCreditAmount: e.target.value,
                                    })
                                  }
                                  placeholder="Amount"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Requested On</label>
                                <DatePicker
                                  selected={
                                    formData.futureCreditRequestedOn
                                      ? new Date(
                                          formData.futureCreditRequestedOn
                                        )
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData({
                                      ...formData,
                                      futureCreditRequestedOn: date,
                                    })
                                  }
                                  className="form-control box_crm_input_all"
                                  placeholderText="mm/dd/yyyy"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Validity</label>
                                <DatePicker
                                  selected={
                                    formData.futureCreditValidity
                                      ? new Date(formData.futureCreditValidity)
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData({
                                      ...formData,
                                      futureCreditValidity: date,
                                    })
                                  }
                                  className="form-control box_crm_input_all"
                                  placeholderText="mm/dd/yyyy"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Reason</label>
                                <input
                                  type="text"
                                  className="form-control box_crm_input_all"
                                  name="futureCreditReason"
                                  value={formData.futureCreditReason || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      futureCreditReason: e.target.value,
                                    })
                                  }
                                  placeholder="Reason"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/*===================================    Ticket Issuance========================================  */}

                      {formData.transactionType ===
                        "ticketIssuance" && (
                        <div className="box_crm_tr margin_box_tr">
                          <p className="title_common_semi">
                          Ticket Issuance Details
                          </p>

                          <div className="mt-2 flex_all form_box_auth">
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Amount</label>
                                <input
                                  type="number"
                                  className="form-control box_crm_input_all"
                                  name="ticketIssueAmount"
                                  value={formData.ticketIssueAmount || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      ticketIssueAmount: e.target.value,
                                    })
                                  }
                                  placeholder="Amount"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Requested On</label>
                                <DatePicker
                                  selected={
                                    formData.ticketIssueRequestedOn
                                      ? new Date(
                                          formData.ticketIssueRequestedOn
                                        )
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData({
                                      ...formData,
                                      ticketIssueRequestedOn: date,
                                    })
                                  }
                                  className="form-control box_crm_input_all"
                                  placeholderText="mm/dd/yyyy"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Validity</label>
                                <DatePicker
                                  selected={
                                    formData.ticketIssueValidity
                                      ? new Date(formData.ticketIssueValidity)
                                      : null
                                  }
                                  onChange={(date) =>
                                    setFormData({
                                      ...formData,
                                      ticketIssueValidity: date,
                                    })
                                  }
                                  className="form-control box_crm_input_all"
                                  placeholderText="mm/dd/yyyy"
                                />
                              </div>
                            </div>
                            <div className="width_control_in25 box_sp">
                              <div className="box_crm_input">
                                <label>Reason</label>
                                <input
                                  type="text"
                                  className="form-control box_crm_input_all"
                                  name="ticketIssueReason"
                                  value={formData.ticketIssueReason || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      ticketIssueReason: e.target.value,
                                    })
                                  }
                                  placeholder="Reason"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="box_crm_tr margin_box_tr">
                        <p className="title_common_semi">Price Details</p>
                        <div className="mt-2 flex_all form_box_auth">
                          <div className="width_control_in25 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Base Fare</label>
                              <input
                                name="baseFare"
                                placeholder="Base Fare"
                                value={formData.baseFare}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in25 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Taxes & Fees</label>
                              <input
                                name="taxes"
                                placeholder="Taxes & Fees"
                                value={formData.taxes}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in25 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Total Amount</label>
                              <input
                                name="totalAmount"
                                placeholder="Total Amount"
                                // value={formData.totalAmount}
                                
                                readOnly
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          {/* <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select> */}
                          <div className="width_control_in25 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Currency</label>
                              <select
                                name="currency"
                                className="form-select box_crm_input_all"
                                value={formData.currency}
                                onChange={handleChange}
                              >
                                <option value="">Select </option>
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


                      
                      {/* passenger details */}
                      {/* <h2 className="text-xl font-bold">Passenger Details</h2>
                        <div className="grid grid-cols-5 gap-4">
                          <select
                            name="detailsType"
                            value={formData.detailsType}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="">select</option>
                            <option value="adult">Adult</option>
                            <option value="infant">Infant</option>
                            <option value="child">Child</option>
                          </select>
                          <input
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="middleName"
                            placeholder="Middle Name"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <select
                            name="gender"
                            placeholder="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="">Select </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                        </div> */}

                      {/* Passenger Details */}
                      <div className="box_crm_tr margin_box_tr">
                        {passengerDetails.length > 0 && (
                          <div>
                            <p className="title_common_semi">
                              Passenger Details
                            </p>
                            {passengerDetails.map((passenger, index) => (
                              <div
                                className={`outbound_segment_container outbound_segment_container${index}`}
                              >
                                <p className="title_common_semi1">
                                  {`Passenger Detail ${index + 1}`}
                                </p>
                                <div
                                  key={index}
                                  className="mt-2 flex_all form_box_auth"
                                >
                                  <div className="width_control_in25 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor="">Passenger Type</label>
                                      <select
                                        name="detailsType"
                                        value={passenger.detailsType}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-select box_crm_input_all"
                                        required
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
                                      <label htmlFor="">First Name</label>
                                      <input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={passenger.firstName}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-control box_crm_input_all"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="width_control_in25 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor="">Middle Name</label>
                                      <input
                                        name="middleName"
                                        placeholder="Middle Name"
                                        value={passenger.middleName}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>
                                  <div className="width_control_in25 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor="">Last Name</label>
                                      <input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={passenger.lastName}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-control box_crm_input_all"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="width_control_in25 box_sp">
                                    <div className="box_crm_input">
                                      <label htmlFor="">Gender</label>
                                      <select
                                        name="gender"
                                        value={passenger.gender}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-select box_crm_input_all"
                                        required
                                      >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="width_control_in25 box_sp">
                                    <div className="box_crm_input">
                                      <label className="w-100">
                                        Date Of Birth
                                      </label>
                                      {/* <input
                                        type="date"
                                        name="dob"
                                        value={passenger.dob}
                                        onChange={(e) =>
                                          handlePassengerChange(index, e)
                                        }
                                        className="form-control box_crm_input_all"
                                        required
                                      /> */}
                                      <DatePicker
                                        selected={
                                          passenger.dob
                                            ? new Date(passenger.dob)
                                            : null
                                        }
                                        onChange={(date) =>
                                          handlePassengerChange(index, {
                                            target: {
                                              name: "dob",
                                              value: date
                                                .toISOString()
                                                .split("T")[0],
                                            }, // formatted as YYYY-MM-DD
                                          })
                                        }
                                        dateFormat="MM-dd-yyyy"
                                        className="form-control box_crm_input_all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="box_crm_tr margin_box_tr">
                        <p className="title_common_semi">Billing Details</p>

                        <p
                          onClick={() => setSecondaryCardType(true)}
                          className="provider_btnn"
                        >
                          <img src="/imgs/add.png" />
                          Add Secondary Card
                        </p>

                        {/* Add Modal */}
                        {/* Add Modal */}
                        {secondaryCardType && (
                          <div>
                            <h4 className="add_pr_title">ADD Secondary Card</h4>
                            <hr className="my-3" />

                            <form>
                              <div className="mt-2 flex_all form_box_auth">
                                <div className="width_control_in50 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">Card Type</label>
                                    <select
                                      name="cardType2"
                                      value={formData.cardType2}
                                      onChange={handleChange}
                                      className="form-select box_crm_input_all"
                                      required
                                    >
                                      <option value="">Select </option>
                                      {cardDrop?.map((item, index) => (
                                        <option key={index} value={item.value}>
                                          {item.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="width_control_in50 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">C.C.H.Name</label>
                                    <input
                                      name="cchName2"
                                      placeholder="C.C.H Name"
                                      value={formData.cchName2}
                                      onChange={handleChange}
                                      className="form-control box_crm_input_all"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="width_control_in50 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">Card Number</label>
                                    <input
                                      name="cardNumber2"
                                      placeholder="Card Number"
                                      value={formData.cardNumber2}
                                      onChange={handleChange}
                                      className="form-control box_crm_input_all"
                                      required
                                    />
                                    <span className="card_type">
                                      {cardType}
                                    </span>
                                  </div>
                                </div>

                                <div className="width_control_in15 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">CVV</label>
                                    <input
                                      name="cvv2"
                                      placeholder="CVV"
                                      value={formData.cvv2}
                                      onChange={handleChange}
                                      className="form-control box_crm_input_all"
                                      maxLength={4}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="width_control_in15 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">Expiry Month</label>
                                    <input
                                      name="expiryMonth2"
                                      placeholder="MM"
                                      value={formData.expiryMonth2}
                                      onChange={handleChange}
                                      className="form-control box_crm_input_all"
                                      maxLength={2}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="width_control_in15 box_sp">
                                  <div className="box_crm_input">
                                    <label htmlFor="">Expiry Year</label>
                                    <input
                                      name="expiryYear2"
                                      placeholder="YY"
                                      value={formData.expiryYear2}
                                      onChange={handleChange}
                                      className="form-control box_crm_input_all"
                                      maxLength={2}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex_props gap-2 mt-3 justify-content-end">
                                  <button
                                    type="button"
                                    className="btn_provider_pop btn_provider_pop_add"
                                    onClick={handleSecondaryCardAdd} 
                                  >
                                    Add
                                  </button>

                                  <button
                                    type="button"
                                    className="btn_provider_pop"
                                    onClick={() => setSecondaryCardType(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        )}

                        <hr className="my-3" />

                        <div className="mt-2 flex_all form_box_auth">
                          {/* ------------------------------------------------------------------ */}

                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Card Type</label>
                              <select
                                name="cardType"
                                value={formData.cardType}
                                onChange={handleChange}
                                className="form-select box_crm_input_all"
                                required
                              >
                                <option value="">Select </option>
                                {cardDrop?.map((item, index) => (
                                  <option key={index} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">C.C.H.Name</label>
                              <input
                                name="cchName"
                                placeholder="C.C.H Name"
                                value={formData.cchName}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Card Number</label>
                              <input
                                name="cardNumber"
                                placeholder="Card Number"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                              <span className="card_type"> {cardType} </span>
                            </div>
                          </div>
                          <div className="width_control_in15 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">CVV</label>
                              <input
                                name="cvv"
                                placeholder="CVV"
                                value={formData.cvv}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in15 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Expiry Month</label>
                              <input
                                name="expiryMonth"
                                placeholder="MM"
                                value={formData.expiryMonth}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                maxLength={2}
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in15 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Expiry Year</label>
                              <input
                                name="expiryYear"
                                placeholder="YY"
                                value={formData.expiryYear}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                maxLength={2}
                                required
                              />
                            </div>
                          </div>

                          {/* -------------------------------------------------------------------- */}
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Billing Phone Number</label>
                              <input
                                name="billingPhoneNumber"
                                placeholder="Billing Phone Number"
                                value={formData.billingPhoneNumber}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Contact Phone Number</label>
                              <input
                                name="contactNumber"
                                placeholder="Contact Number"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Billing Address</label>
                              <input
                                name="billingAddress1"
                                placeholder="Billing Address 1"
                                value={formData.billingAddress1}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Billing Address 2</label>
                              <input
                                name="billingAddress2"
                                placeholder="Billing Address 2"
                                value={formData.billingAddress2}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in20 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Email Address</label>
                              <input
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in20 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">City</label>
                              <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in20 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">State</label>
                              <input
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in20 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Country</label>
                              <input
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                          <div className="width_control_in20 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">ZIP Code</label>
                              <input
                                name="zipCode"
                                placeholder="Zip Code"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box_crm_tr margin_box_tr">
                        <p className="title_common_semi">DNIS</p>
                        <div className="mt-2 flex_all form_box_auth">
                          <div className="width_control_in50 box_sp">
                            <div className="box_crm_input">
                              <label htmlFor="">Dnis </label>
                              <input
                                name="dnis"
                                placeholder="Enter Dnis "
                                value={formData.dnis}
                                onChange={handleChange}
                                className="form-control box_crm_input_all"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <button
                          type="button"
                          className="create_bid"
                          onClick={handleShowRemarksModal}
                        >
                          Send Auth
                        </button>
                      </div>
                      {/* Remarks Modal */}
                      {showRemarksModal && (
                        <div className="log_all_pop">
                          <div className="log_pop_semi">
                            <p className="log_header flex_props justify-content-between">
                              Add Remarks{" "}
                              <button
                                className="log_close"
                                onClick={() => handleRemarksCancel(false)}
                              >
                                <img src="/imgs/close-icon.png" />
                              </button>
                            </p>
                            <div className="box_crm_input">
                              <textarea
                                className="form-control box_crm_input_all"
                                rows={4}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks here..."
                                required
                              />
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                              <button
                                type="button"
                                className="create_bid"
                                onClick={handleRemarksConfirm}
                                disabled={!remarks.trim()}
                              >
                                Confirm & Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default CreateCtmFlight;
