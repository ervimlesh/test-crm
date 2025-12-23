import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ctmFlightModel from "../models/ctmFlightModel.js";
import htmlDocx from "html-docx-js";
import providerModel from "../models/providerModel.js";
import airlineModel from "../models/airlineModel.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendMail } from "../utils/sendMail.js";
import {
  htmlTemplateEs,
  htmlTemplateEn,
  htmlTemplateCancellationEs,
  htmlTemplateRefundEs,
  htmlTemplateCancellationEn,
  htmlTemplateRefundEn,
  generateEmailTemplate,
  generateEmailTemplateFutureCredit,
  generateEmailTemplateCancellationRefund,
  htmlTemplateAuthEs,
  htmlTemplateAuthEn,
  htmlTemplateCancellationAuthEs,
  htmlTemplateCancellationAuthEn,
  htmlTemplateRefundAuthEs,
  htmlTemplateRefundAuthEn,
} from "../utils/template.js";
// import { getProviderTemplate } from "../utils/getProviderTemplate.js";
dotenv.config();
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_URL
    : process.env.LOCAL_URL;
const generateItineraryHTML = (outboundSegments, inboundSegments, language) => {
  // ----------Auth Provider ENGLISH TEMPLATE ----------
  const renderSegmentEN = (segment, label = "") => {
    if (!segment) return "";
    const departureDate = segment.departure
      ? new Date(segment.departure)
      : null;
    const arrivalDate = segment.arrival ? new Date(segment.arrival) : null;

    return `
      <div style="margin-bottom: 20px;">
        ${
          label
            ? `<p style="font-size: 12px; margin-top: 12px; font-weight: 500; font-style: italic; color: grey;">${label}</p>`
            : ""
        }
        <table style="border-spacing: 0;width: 100%;margin-top:10px;background-color: white;">
          <thead style="background-color: #f1f1f1;">
            <tr>
              <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Airline</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Code</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">From</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">To</th>

                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Class</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Locator</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                  segment?.airline
                }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.flight
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.from
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.to
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.class
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.alLocator
                  }</td>
            </tr>
          </tbody>
        </table>
  <table style="border-spacing: 0;width: 100%;margin-top:10px;background-color: white;">
          <thead style="background-color: #f1f1f1;">
                <tr>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Departure Date & Timea</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Arrival Date & Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">
                  ${departureDate ? departureDate.toLocaleDateString() : ""} |
                ${departureDate ? departureDate.toLocaleTimeString() : ""}
                  </td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">
                     ${arrivalDate ? arrivalDate.toLocaleDateString() : ""} |
                ${arrivalDate ? arrivalDate.toLocaleTimeString() : ""}
                  </td>
                </tr>
              </tbody>
            </table>
         
 
       
      </div>
    `;
  };

  // ----------Auth Provider SPANISH TEMPLATE ----------
  const renderSegmentES = (segment, label = "") => {
    if (!segment) return "";
    const departureDate = segment.departure
      ? new Date(segment.departure)
      : null;
    const arrivalDate = segment.arrival ? new Date(segment.arrival) : null;

    return `
      <div style="margin-bottom: 20px;">
        ${
          label
            ? `<p style="font-size: 12px; margin-top: 12px; font-weight: 500; font-style: italic; color: grey;">${label}</p>`
            : ""
        }
        <table style="border-spacing: 0;width: 100%;margin-top:10px;background-color: white;">
          <thead style="background-color: #f1f1f1;">
            <tr>
                <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Aerolínea</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Código</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">De</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">A</th>

                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Clase</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Locadora</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                segment?.airline
              }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.flight
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.from
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.to
                  }</td>

                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.class
                  }</td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">${
                    segment?.alLocator
                  }</td>
            </tr>
          </tbody>
        </table>
  <table style="border-spacing: 0;width: 100%;margin-top:10px;background-color: white;">
          <thead style="background-color: #f1f1f1;">
                <tr>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Fecha y hora de salida</th>
                  <th style="font-size: 12px;text-align: center; padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1)">Fecha y hora de llegada</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">
                    ${departureDate ? departureDate.toLocaleDateString() : ""} |
                ${departureDate ? departureDate.toLocaleTimeString() : ""}
                  </td>
                  <td style="font-size: 12px;text-align: center;padding: 8px 5px;border: 1px solid rgba(196, 196, 196, 0.1);">
                    ${arrivalDate ? arrivalDate.toLocaleDateString() : ""} |
                ${arrivalDate ? arrivalDate.toLocaleTimeString() : ""}
                  </td>
                </tr>
              </tbody>
            </table>
        
  
      </div>
    `;
  };

  // ---------- SELECT TEMPLATE BASED ON LANGUAGE ----------
  const renderSegment = language === "es" ? renderSegmentES : renderSegmentEN;

  const outboundHTML = (outboundSegments || [])
    .filter((segment) => segment && segment.airline)
    .map((segment, index) => {
      const label = `${
        language === "es" ? "Outbound Vuelo" : "Outbound Flight"
      } ${index + 1}`;
      return renderSegment(segment, label);
    })
    .join("");

  const inboundHTML = (inboundSegments || [])
    .filter((segment) => segment && segment.airline)
    .map((segment, index) => {
      const label = `${
        language === "es" ? "Inbound Vuelo" : "Inbound Flight"
      } ${index + 1}`;
      return renderSegment(segment, label);
    })
    .join("");

  // ---------- RETURN FINAL TEMPLATE ----------
  if (language === "es") {
    return `
      <div style="margin-top: 25px;">
        <h4 style="font-size: 20px;margin: 12px 0px">Detalles del Itinerario</h4>
      </div>
      <div>
        <h5 style="font-size: 16px; margin: 10px 0;">Outbound Segmento de vuelo</h5>
        ${outboundHTML}
        ${
          inboundHTML.length > 0
            ? `<h5 style="font-size: 16px; margin: 20px 0 10px;">Inbound Segmento de vuelo</h5>
             ${inboundHTML}`
            : ""
        }
       
      </div>
    `;
  } else {
    return `
      <div style="margin-top: 25px;">
        <h4 style="font-size: 20px;margin: 12px 0px">Itinerary Details</h4>
      </div>
      <div>
        <h5 style="font-size: 16px; margin: 10px 0;">Outbound Flights Segment</h5>
        ${outboundHTML}
        ${
          inboundHTML.length > 0
            ? `<h5 style="font-size: 16px; margin: 20px 0 10px;">Inbound Flights Segment</h5>
             ${inboundHTML}`
            : ""
        }  
      </div>
    `;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const createCtmFlightController = async (req, res) => {
  try {
    // upcoming outbound flight
    console.log("upcoming body is", req.body);

    const {
      transactionType,
      itineraryType,
      passengers, // number of passengers or array
      provider,
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      class: flightClass,
      alLocator,
      baseFare,
      taxes,
      totalAmount,
      currency,
      passengerDetails, // array of passenger objects
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      billingPhoneNumber,
      contactNumber,
      billingAddress1,
      billingAddress2,
      email,
      city,
      state,
      country,
      zipCode,
      remarks,
      agent,
      dnis,
      outboundFlight,
      inboundFlight,
      outboundSegments,
      inboundSegments,
      bookingId,
      language,
      tollNumber,
      agentFigure,
      // second card fields
      cardType2,
      cchName2,
      cardNumber2,
      cvv2,
      expiryMonth2,
      expiryYear2,
    } = req.body;

    const secondCardDetails =
      cardType2 ||
      cchName2 ||
      cardNumber2 ||
      cvv2 ||
      expiryMonth2 ||
      expiryYear2
        ? {
            cardType2,
            cchName2,
            cardNumber2,
            cvv2,
            expiryMonth2,
            expiryYear2,
          }
        : undefined;

    const newBooking = new ctmFlightModel({
      transactionType,
      itineraryType,
      passengers,
      provider,
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      class: flightClass,
      alLocator,
      baseFare,
      taxes,
      totalAmount,
      currency,
      passengerDetails: Array.isArray(passengerDetails) ? passengerDetails : [],
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      billingPhoneNumber,
      contactNumber,
      billingAddress1,
      billingAddress2,
      email,
      city,
      state,
      country,
      zipCode,
      remarks,
      agent: agent,
      authMail: req.body.authCredentials?._id,
      dnis,
      bookingId,
      outboundFlight,
      inboundFlight,
      outboundSegments,
      inboundSegments,
      language,
      agentFigure,
      secondCardDetails,
      // accept single objects provided from frontend
      cancellationRefund: {
        cancelRefAmount: req.body.refundDetails?.amount || undefined,
        cancelRefRequestOn:
          req.body.refundDetails?.refundRequestedOn || undefined,
        cancelRefReason: req.body.refundDetails?.reasonForRefund || undefined,
        cancelRefStatus: req.body.refundDetails?.refundStatus || undefined,
      },

      futureCredit: {
        futureCreditAmount: req.body.futureCreditDetails?.amount || undefined,
        futureCreditRequestedOn:
          req.body.futureCreditDetails?.futureCreditRequestedOn || undefined,
        futureCreditValidity:
          req.body.futureCreditDetails?.futureCreditValidity || undefined,
        reasonForFutureCredit:
          req.body.futureCreditDetails?.reasonForFutureCredit || undefined,
      },
      ticketIssueDetails: {
        ticketIssueAmount:
          req.body?.ticketIssueDetails?.ticketIssueAmount || undefined,
        ticketIssueRequestedOn:
          req.body?.ticketIssueDetails?.ticketIssueRequestedOn || undefined,
        ticketIssueValidity:
          req.body?.ticketIssueDetails?.ticketIssueValidity || undefined,
        ticketIssueReason:
          req.body?.ticketIssueDetails?.ticketIssueReason || undefined,
      },
    });

   const data  =  await newBooking.save();

   console.log("saving data is ",data)

    // console.log("newBooking", newBooking);

    const itineraryHTML = generateItineraryHTML(
      outboundSegments,
      inboundSegments,
      language
    );

    // Use centralized templates: build data object and render the correct language template
    const templateData = {
      bookingId,
      email,
      passengerDetails,
      itineraryHTML,
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      billingPhoneNumber,
      billingAddress1,
      billingAddress2,
      city,
      state,
      country,
      zipCode,
      baseFare,
      dnis,
      taxes,
      currency,
      transactionType,
      provider,
      bookingObjectId: newBooking?._id,
    };

    const htmlBody =
      language === "es"
        ? htmlTemplateEs(templateData)
        : htmlTemplateEn(templateData);

    const htmlBody1 =
      language === "es"
        ? htmlTemplateCancellationEs(templateData)
        : htmlTemplateCancellationEn(templateData);
    const htmlBody2 =
      language === "es"
        ? htmlTemplateRefundEs(templateData)
        : htmlTemplateRefundEn(templateData);

    const mainHtmlBody =
      req.body.transactionType &&
      req.body.transactionType === "cancellationRefund"
        ? htmlBody1
        : req.body.transactionType &&
          req.body.transactionType === "cancellationFutureCredit"
        ? htmlBody2
        : htmlBody;

    // sendMail(
    //   email,
    //   "Booking Confirmation Required",
    //   mainHtmlBody,
    //   process.env.AUTH_EMAIL
    // );

    await sendMail(
      email,
      "Booking Confirmation Required",
      mainHtmlBody,
      req.body.authCredentials
    );

    // const htmlBody =
    //   language === "es"
    //     ? htmlTemplateEs(templateData)
    //     : htmlTemplateEn(templateData);

    // const htmlBody1 =
    //   language === "es"
    //     ? htmlTemplateCancellationEs(templateData)
    //     : htmlTemplateCancellationEn(templateData);

    // const htmlBody2 =
    //   language === "es"
    //     ? htmlTemplateRefundEs(templateData)
    //     : htmlTemplateRefundEn(templateData);

    // const htmlBody3 =
    //   language === "es"
    //     ? htmlTemplateTicketIssuanceEs(templateData)
    //     : htmlTemplateTicketIssuanceEn(templateData);

    // const mainHtmlBody =
    //   req.body.transactionType === "cancellationRefund"
    //     ? htmlBody1
    //     : req.body.transactionType === "cancellationFutureCredit"
    //     ? htmlBody2
    //     : req.body.transactionType === "ticketIssuance"
    //     ? htmlBody3
    //     : htmlBody;

    return res.status(200).send({
      message: "Booking created successfully. Confirmation email sent.",
      bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET latest bookingId
export const getLastBookingIdController = async (req, res) => {
  try {
    // Find the most recent booking that has a bookingId (sorted by creation time)
    const last = await ctmFlightModel
      .findOne({ bookingId: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .select("bookingId")
      .lean();

    if (!last || !last.bookingId) {
      return res.status(200).send({ bookingId: null });
    }

    return res.status(200).send({ bookingId: last.bookingId });
  } catch (error) {
    console.error("Error fetching last bookingId:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCtmFlightController = async (req, res) => {
  try {
    console.log("calling controller...................");
    const { flightId } = req.params;
    const { pnrRemark } = req.body;
    const singleBooking = await ctmFlightModel.findByIdAndUpdate(
      flightId,
      {
        $push: { pnrRemarks: pnrRemark },
        $set: { pnrRemark: pnrRemark.remark, agent: pnrRemark.userRoleName }, // Latest remark string
        pnrStatus: "pending",
      },
      { new: true }
    );

    const itineraryHTML = generateItineraryHTML(
      singleBooking?.outboundSegments,
      singleBooking?.inboundSegments,
      singleBooking?.language
    );

    const getTime = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      // Format as HH:mm (24-hour)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const departureTime = getTime(singleBooking?.departure);
    const arrivalTime = getTime(singleBooking?.arrival);
    //Provider Detail Auth Again
    const htmlBody =
      singleBooking?.language === "es"
        ? htmlTemplateAuthEs(singleBooking, itineraryHTML)
        : htmlTemplateAuthEn(singleBooking, itineraryHTML);
    const htmlBody1 =
      singleBooking?.language === "es"
        ? htmlTemplateCancellationAuthEs(singleBooking, itineraryHTML)
        : htmlTemplateCancellationAuthEn(singleBooking, itineraryHTML);
    const htmlBody2 =
      singleBooking?.language === "es"
        ? htmlTemplateRefundAuthEs(singleBooking, itineraryHTML)
        : htmlTemplateRefundAuthEn(singleBooking, itineraryHTML);

    const mainHtmlBody =
      singleBooking.transactionType &&
      singleBooking.transactionType === "cancellationRefund"
        ? htmlBody1
        : singleBooking.transactionType &&
          singleBooking.transactionType === "cancellationFutureCredit"
        ? htmlBody2
        : htmlBody;

    sendMail(
      singleBooking?.email,
      "Booking Confirmation Required",
      mainHtmlBody
    );

    return res.status(200).send({
      message: "Booking created successfully. Confirmation email sent.",
      bookingId: singleBooking?.bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Confirm Booking Controller
export const confirmCtmBookingController = async (req, res) => {
  try {
    const { flightId } = req.params;
    //  Capture IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    //  Update booking
    const booking = await ctmFlightModel.findByIdAndUpdate(
      flightId,
      {
        authorizedIp: ip,
        authorizedAt: new Date(),
        bookingConfirmed: true,
        pnrStatus: "approved",
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send("<h2>Booking not found</h2>");
    }

    // HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CREDIT CARD AUTHORIZATION</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
        <link rel = "stylesheet" href = "https://www.astrivionventures.co/css2/new.css">
      </head>
      <body>
       <main className="thankyou_main" style = "background-color: #fffcf8;height: 100vh;display: flex;align-items: center;justify-content: center;flex-direction: column;padding: 20px 10px">
       <div style = "text-align:center;display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%; margin: auto">
              <div>
                <img src="https://www.astrivionventures.co/css2/secure-icon.png" style="height: 150px;width: auto;margin:auto"/>
              </div>
              <p className="thankyou_title" style="font-size: 64px;font-weight: 700;font-family:'Courier New', Courier, monospace;color: #33bca3;">CREDIT CARD AUTHORIZATION</p>
              <p className="thanks_auth_title" style = "text-transform: uppercase;font-size: 26px;font-weight: 700;margin-top: 10px;">
                Dear Traveller, Thanks for Authorization
              </p>

              <div style = "margin-top: 20px;">
                <div>
                  <p style="font-size: 18px;line-height: 20px;color: grey;">
                    For your protection, our Authorized Payment Verification
                    department may require additional documentation. Please
                    check your email for a notification from 
                    <a
                      href="mailto:support@myreservationdetail.com."
                      className="support_cont_auth" style="color: blue;margin-top: 15px;font-size: 22px;display: inline-flex;"
                    >
                      support@myreservationdetail.com.
                    </a>
                  </p>

                  <p style = "text-transform: uppercase;font-size: 26px;font-weight: 700;margin-top: 40px;">
                    We may also contact you via the phone number on file.
                  </p>
                </div>
              </div>
            </div>
        
      
        <footer>
          
          <p>©2025 support@myreservationdetail.com All rights reserved.</p>
        </footer>
      </main>
         
      </body>
      </html>
    `;

    return res.status(200).send(htmlTemplate);

    // return res
    //   .status(200)
    //   .send({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @route   PATCH /api/v1/ctmFlights/update-pnrRemark-flight/:flightId
// @access  Private/Admin
export const updatePnrCtmFlightController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { pnrRemark } = req.body;

    if (
      !pnrRemark ||
      !pnrRemark.remark ||
      !pnrRemark.agent ||
      !pnrRemark.date
    ) {
      return res.status(400).send({
        success: false,
        message: "pnrRemark must include remark, agent, and date.",
      });
    }

    // Update booking: push to pnrRemarks and overwrite latest pnrRemark string
    const booking = await ctmFlightModel.findByIdAndUpdate(
      flightId,
      {
        $push: { pnrRemarks: pnrRemark },
        $set: { pnrRemark: pnrRemark.remark }, // Latest remark string
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "pnrRemark updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating pnrRemark:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const generatePnrFlightController = async (req, res) => {
  try {
    const pnrs = await ctmFlightModel.find();

    if (!pnrs || pnrs.length === 0) {
      return res.statu(200).send({ message: "No PNRs found" });
    }

    res.status(200).send({
      success: true,
      message: "PNRs generated successfully",
      pnrs,
    });
  } catch (error) {
    console.error("Error generating PNRs:", error);
    res.status(200).send({ message: "Internal server error" });
  }
};

export const updateProviderController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { provider } = req.body;

    // const booking = await ctmFlightModel.findById(flightId);
    const booking = await ctmFlightModel.findByIdAndUpdate(
      flightId,
      { provider, pnrStatus: "pending" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    // booking.provider = provider;
    booking.pnrStatus = "pending";

    booking.logActivity.push({
      type: "provider-update",
      data: {
        provider: booking.provider.provider,
        pnrStatus: booking.pnrStatus,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Provider updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateBidStatusController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { ticketmco, adminAuthorize } = req.body;

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    let bStatus;

    if (ticketmco === "cancelled") {
      bStatus = "cancelled";
    } else if (ticketmco === "underFollowUp") {
      bStatus = "confirmed";
    } else if (ticketmco === "ticketMco") {
      bStatus = "approved";
    }

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    // Update the booking fields
    booking.ticketmco = ticketmco;
    booking.adminAuthorize = adminAuthorize;
    booking.bidStatus = bStatus;

    // Log the update to logActivity
    booking.logActivity.push({
      type: "bid-status-update",
      data: {
        ticketmco: booking.ticketmco,
        adminAuthorize: booking.adminAuthorize,
        bidStatus: booking.bidStatus,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateItineraryController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      cabinClass,
      alLocator,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.airline = airline;
    booking.flight = flight;
    booking.from = from;
    booking.to = to;
    booking.departure = departure;
    booking.arrival = arrival;
    booking.class = cabinClass;
    booking.alLocator = alLocator;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updatePriceController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { baseFare, taxes, currency } = req.body;
    console.log("req.body is ", req.body);

    // Convert to numbers safely
    const total = parseFloat(baseFare) + parseFloat(taxes);
    console.log("Calculated total is ", total);

    const baseDecimals = (baseFare.split(".")[1] || "").length;
    const taxDecimals = (taxes.split(".")[1] || "").length;
    const maxDecimals = Math.max(baseDecimals, taxDecimals);

    // Format total using the same max decimal places
    const totalAmount = total.toFixed(maxDecimals);

    console.log("Final totalAmount is ", totalAmount);

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    const booking = await ctmFlightModel.findById(flightId);

    // Update original fields
    booking.baseFare = baseFare;
    booking.taxes = taxes;
    booking.totalAmount = totalAmount;
    booking.currency = currency;

    // Push to logActivity using updated model values
    booking.logActivity.push({
      type: "price-update",
      data: {
        baseFare: booking.baseFare,
        taxes: booking.taxes,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    console.log("Updated booking is ", booking);

    res.status(200).send({
      success: true,
      message: "Price updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateChargingController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      chargingBaseFare,
      chargingStatus,
      chargedOn,
      chargedBy,
      chargingTaxes,
      chargingTaxStatus,
      chargingTaxchargedOn,
      chargingTaxchargedBy,
    } = req.body;
    console.log("body is ", req.body);

    const total = parseFloat(chargingBaseFare) + parseFloat(chargingTaxes);
    console.log("Calculated total is ", total);
    const baseDecimals = (chargingBaseFare.split(".")[1] || "").length;
    const taxDecimals = (chargingTaxes.split(".")[1] || "").length;
    const maxDecimals = Math.max(baseDecimals, taxDecimals);

    // Format total using the same max decimal places
    const totalAmount = total.toFixed(maxDecimals);

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    const booking = await ctmFlightModel.findById(flightId);

    // Update original fields
    booking.totalAmount = totalAmount;
    booking.chargingBaseFare = chargingBaseFare;
    booking.chargingStatus = chargingStatus;
    booking.chargedOn = chargedOn;
    booking.chargedBy = chargedBy;
    booking.chargingTaxes = chargingTaxes;
    booking.chargingTaxStatus = chargingTaxStatus;
    booking.chargingTaxchargedOn = chargingTaxchargedOn;
    booking.chargingTaxchargedBy = chargingTaxchargedBy;

    // Push to logActivity using updated model values
    booking.logActivity.push({
      type: "charging-update",
      data: {
        totalAmount: booking.totalAmount,
        chargingBaseFare: booking.chargingBaseFare,
        chargingStatus: booking.chargingStatus,
        chargedOn: booking.chargedOn,
        chargedBy: booking.chargedBy,
        chargingTaxes: booking.chargingTaxes,
        chargingTaxStatus: booking.chargingTaxStatus,
        chargingTaxchargedOn: booking.chargingTaxchargedOn,
        chargingTaxchargedBy: booking.chargingTaxchargedBy,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Charging info updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updatePassengerController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { passengerDetails } = req.body;

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found",
      });
    }

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    // Replace passengerDetails with updated array
    booking.passengerDetails = passengerDetails;

    // Log activity
    booking.logActivity.push({
      type: "passenger-update",
      data: passengerDetails,
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Passenger details updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateBillingController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    const {
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiry,
      email,
      billingNumber,
      billingAddress1,
      billingAddress2,
      city,
      state,
      country,
      pinCode,
      zipCode,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.cardType = cardType;
    booking.cchName = cchName;
    booking.cardNumber = cardNumber;
    booking.cvv = cvv;
    booking.expiry = expiry;
    booking.email = email;
    booking.billingPhoneNumber = billingNumber;
    booking.billingAddress1 = billingAddress1;
    booking.billingAddress2 = billingAddress2;
    booking.city = city;
    booking.state = state;
    booking.pinCode = pinCode;
    booking.zipCode = zipCode;
    booking.country = country;

    // Push to logActivity using updated model values
    booking.logActivity.push({
      type: "billing-update",
      data: {
        cardType: booking.cardType,
        cchName: booking.cchName,
        cardNumber: booking.cardNumber,
        cvv: booking.cvv,
        expiry: booking.expiry,
        email: booking.email,
        billingNumber: booking.billingPhoneNumber,
        billingAddress1: booking.billingAddress1,
        billingAddress2: booking.billingAddress2,
        city: booking.city,
        state: booking.state,
        pinCode: booking.pinCode,
        zipCode: booking.zipCode,
        country: booking.country,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateBillingController2 = async (req, res) => {
  try {
    const { flightId } = req.params;
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    const {
      cardType2,
      cchName2,
      cardNumber2,
      cvv2,
      expiryMonth2,
      expiryYear2,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);
    if (!booking.secondCardDetails) {
      booking.secondCardDetails = {};
    }

    (booking.secondCardDetails.cardType2 = cardType2),
      (booking.secondCardDetails.cchName2 = cchName2),
      (booking.secondCardDetails.cardNumber2 = cardNumber2),
      (booking.secondCardDetails.cvv2 = cvv2),
      (booking.secondCardDetails.expiryMonth2 = expiryMonth2),
      (booking.secondCardDetails.expiryYear2 = expiryYear2),
      console.log("booking.secondCardDetails", booking);

    // Push to logActivity using updated model values
    // booking.logActivity.push({
    //   type: "billing-update",
    //   data: {
    //     cardType: booking.cardType,
    //     cchName: booking.cchName,
    //     cardNumber: booking.cardNumber,
    //     cvv: booking.cvv,
    //     expiry: booking.expiry,
    //     email: booking.email,
    //     billingNumber: booking.billingPhoneNumber,
    //     billingAddress1: booking.billingAddress1,
    //     billingAddress2: booking.billingAddress2,
    //     city: booking.city,
    //     state: booking.state,
    //     pinCode: booking.pinCode,
    //     zipCode: booking.zipCode,
    //     country: booking.country,
    //   },
    //   logRole: user?.role,
    //   logName: user?.userName,
    //   updatedAt: new Date(),
    // });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateChargeBackController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      chargeAmount,
      chargebackDate,
      reasonForChargeback,
      chargebackStatus,
    } = req.body;

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    const chargeback = {
      chargeAmount,
      chargebackDate,
      reasonForChargeback,
      chargebackStatus,
    };

    booking.chargeBackDetails = chargeback;
    // Add to logActivity
    booking.logActivity.push({
      type: "chargeback-update",
      data: chargeback,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Chargeback info updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
export const updateRefundController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { refundAmount, refundRequestedOn, reasonForRefund, refundStatus } =
      req.body;

    console.log("Refund request body:", req.body);

    // Step 1: Find Booking
    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Step 2: Verify user
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3: Store refund as an object
    const refundEntry = {
      refundAmount,
      refundRequestedOn,
      reasonForRefund,
      refundStatus,
    };

    booking.refund = refundEntry;

    // Step 4: Log the update
    booking.logActivity.push({
      type: "refund-update",
      data: refundEntry,
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    // Step 5: Save updated booking
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Refund info updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Refund update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateCancellationRefundController = async (req, res) => {
  try {
    const { flightId } = req.params;

    const {
      cancelRefAmount,
      cancelRefRequestOn,
      cancelRefReason,
      cancelRefStatus,
    } = req.body;

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }
    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    // Replace single cancellationRefund subdocument
    const refundEntry = {
      cancelRefAmount,
      cancelRefRequestOn,
      cancelRefReason,
      cancelRefStatus,
    };

    booking.cancellationRefund = refundEntry;

    // Add to logActivity using updated values
    booking.logActivity.push({
      type: "refund-update",
      data: refundEntry,
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Refund info updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
export const updateFutureCreditController = async (req, res) => {
  try {
    console.log("upcoming body is ", req.body);
    const { flightId } = req.params;
    const {
      futureCreditAmount,
      futureCreditRequestedOn,
      futureCreditValidity,
      reasonForFutureCredit,
    } = req.body;

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res
        .status(404)
        .send({ success: false, message: "Booking not found" });
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "This user is not found " });
    }

    const futureCreditEntry = {
      futureCreditAmount,
      futureCreditRequestedOn,
      futureCreditValidity,
      reasonForFutureCredit,
    };

    // Replace single futureCredit subdocument
    booking.futureCredit = futureCreditEntry;

    booking.logActivity.push({
      type: "futureCredit-update",
      data: futureCreditEntry,
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });
    await booking.save();

    res.status(200).send({
      success: true,
      message: "Future credit info updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};
export const updateTicketIssueController = async (req, res) => {
  try {
    console.log(" updateTicketIssueController upcoming body is ", req.body);
    const { flightId } = req.params;
    const {
      ticketIssueAmount,
      ticketIssueRequestedOn,
      ticketIssueValidity,
      ticketIssueReason,
    } = req.body;

    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res
        .status(404)
        .send({ success: false, message: "Booking not found" });
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "This user is not found " });
    }

    const futureCreditEntry = {
      ticketIssueAmount,
      ticketIssueRequestedOn,
      ticketIssueValidity,
      ticketIssueReason,
    };

    // Replace single futureCredit subdocument
    booking.ticketIssueDetails = futureCreditEntry;

    booking.logActivity.push({
      type: "futureCredit-update",
      data: futureCreditEntry,
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });
    await booking.save();

    res.status(200).send({
      success: true,
      message: "Future credit info updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};
const translations = {
  en: {
    greeting: "Dear",
    thanks:
      "Thank you for choosing Couper Travels for your flight ticket change.",
    review: "Please take a moment to review your booking details.",
    team: "Best Regards, Your Couper Travels Team",
    congrats: "Congratulations! Your flight has been changed.",
    airlineLocator: "Airline Locator",
    bookingReference: "Booking Reference",
    bookingDate: "Booking Date",
    billingDetails: "Billing Details",
    holderName: "Card Holder Name",
    cardType: "Card Type",
    monthYear: "Month/Year",
    cvv: "CVV",
    email: "Email",
    phone: "Phone",
    card: "Card",
    flightSummary: "Itinerary Details",
    outbound: "Outbound Flight Segment",
    inbound: "Inbound Flight Segment",
    airline: "Airline",
    from: "From",
    to: "To",
    departure: "Departure",
    arrival: "Arrival",

    passengerDetails: "Passenger Details",
    serialNo: "S.No.",
    name: "Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    gender: "Gender",
    type: "Type",
    dob: "DOB",

    footer:
      "© Couper Travels. All rights reserved. For more information, visit our website or contact us at",
    translate: "Translate to Spanish",
  },
  es: {
    greeting: "Estimado",
    thanks:
      "Gracias por elegir a Couper Travels para cambiar su boleto de avión.",
    review:
      "Por favor, tómese un momento para revisar el resumen de su reserva.",
    team: "Gracias, Equipo de Couper Travels",
    congrats: "¡Felicidades! Su vuelo ha sido cambiado.",
    airlineLocator: "Localizador de Aerolínea",
    bookingReference: "Referencia de Reserva",
    bookingDate: "Fecha de Reserva",
    billingDetails: "Detalles de Facturación",
    holderName: "Nombre del titular",
    cardType: "Tipo de tarjeta",
    monthYear: "Mes/Año",
    cvv: "CVV",
    email: "Correo Electrónico",
    phone: "Teléfono",
    card: "Tarjeta",
    flightSummary: "Resumen del Vuelo",
    outbound: "Outbound flights span",
    inbound: "Inbound flights span",
    airline: "Aerolínea",
    from: "Desde",
    to: "Hasta",
    departure: "Salida",
    arrival: "Llegada",

    passengerDetails: "Detalles del Pasajero",
    serialNo: "N.º",
    name: "Nombre",
    middleName: "Segundo nombre",
    lastName: "Apellido",
    gender: "Género",

    type: "Tipo",
    dob: "Fecha de Nacimiento",

    footer:
      "© Couper Travels. Todos los derechos reservados. Para más información, visite nuestro sitio web o contáctenos en",
    translate: "Traducir al inglés",
  },
};

// const translateContent = (language, key) =>
//   translations[language][key] || translations["en"][key];
const translateContent = (language = "en", key) => {
  if (!translations[language]) language = "en"; // fallback
  return translations[language][key] || translations["en"][key];
};

const generateEmailTemplate1 = (flightDetails, language) => {
  const itineraryHTML = generateItineraryHTML(
    flightDetails.outboundSegments || [],
    flightDetails.inboundSegments || [],
    language
  );

  // English Invoice template
  const englishTemplate = `
     <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.astrivionventures.co/image-crm/traveloplans.png"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Book
                        online or call us 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Reservation Reference ${flightDetails.bookingId}
                    </div>
                    <div style="margin-top:8px;color: white;font-size: 13px;">
                      ${flightDetails.provider.provider} Team
                    </div>
                    <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;">

                        <li style="list-style: none;"><a href="tel:+1-888-209-3035" style="font-size: 14px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: white; 
            text-align: end;
            width: 194px;
            margin-left: auto;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                                    style="width:auto;height:12px;margin-right: 2px;margin-bottom: -1.6px;">
                                Call Us At: +1-888-209-3035</a></li>
                    </ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;">
            <div style="font-size: 26px;">
                Dear Traveler,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Thank you for choosing 
            <span style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</span>  for 
                  <span style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</span> .</p>
             <p style="fontSize: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  Please take a moment to review your reservation summary
                </p>
        </div>
        <div class="">
            <p style="font-size: 22px;text-align: center;margin-top: 5px;"><span
                    style="font-size: 26px;color: #125B88;font-weight: 550;">Congratulations!</span> Your flight service request has been successfully processed
                  for  <span style = "text-transform: capitalize;">
                    ${flightDetails.transactionType}
                  </span></p>
        </div>
        <div style="margin-top: 10px;">
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Airline Locator</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Reference</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Date</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">We recommend that you save a copy of this email
            for future reference or consultation.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Billing Details</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Email</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Billing Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Reference</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Date</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 10px;font-weight: 700">Traveler Details</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Name</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Type</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Ticket No.</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "N/A"} ${p.middleName || "N/A"} 
                            ${p.lastName || "N/A"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "N/A"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "N/A"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 10px">Flight Summary</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Outbound Flights Segment
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 172px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             
   <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Inbound Flights Segment
                </p>
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 172px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p>Baggage: Please note that many airlines (especially low-cost airlines) do not allow free baggage.
                    Please check the airline's website for the most up-to-date information.</p>
                <p>Online Check-in: Some airlines require passengers to check in online and print boarding passes;
                    otherwise, they charge a fee for airport check-in. For more information, visit the airline's
                    website.</p>
                <p>Fees: The total charge (as stated above) may be reflected in your account in multiple transactions,
                    adding up to the amount shown.</p>
                <p>All times mentioned above are local times for that particular city/country.
                    Make sure you have all valid documents before beginning your trip. Contact your local consulate or
                    airline for more details.</p>
                <p>Because airlines have frequent schedule changes, please call the airline 72 hours prior to departure
                    to reconfirm your flight details.</p>
                <p>Please note that tickets, once issued, are completely non-refundable and non-transferable. For any
                    changes to dates or route, please call us at +1-888-209-3035. Changes are subject to airline rules
                    and regulations and may incur penalties, fare differences, and fees. Some flights may be completely
                    non-changeable. No fare is guaranteed until tickets are issued.</p>
            </div>
            <p style="font-size: 18px;font-weight: 700;margin-top: 20px;margin-bottom: 10px">Price Details (USD $)</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                           <th style="font-size: 14px;padding: 7px;font-weight: 500;">Base Price</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Taxes & Fees</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style="font-size: 14px;padding: 7px;"> $${
                              flightDetails?.baseFare
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.taxes
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.baseFare + flightDetails?.taxes
                            }</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                style="background-color: #125B88;display: flex;justify-content: space-between;padding: 15px 20px;color: white;">
               <div style = "width: 180px; margin-left: auto; text-align:end;display: flex;align-items:center;justify-content:end">
                <p style="margin: 0px;font-weight: 500;font-size: 20px">Total Price</p>
                <span style = "margin: 0px 10px;">-</span>
                <p style="margin: 0px;font-weight: 600; font-size: 20px"> $${
                  flightDetails?.baseFare + flightDetails?.taxes
                }</p>
               </div>
            </div>
            <div style="margin: auto;width: 90%">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;border-radius: 0px 0px 10px 10px">
                    <tbody>
                        <tr>
                            <td style="font-size: 14px;padding: 7px;">Loaded on Card :  
                          ${"x"
                            .repeat(flightDetails?.cardNumber.length)
                            .slice(0, -4)}
                          ${flightDetails?.cardNumber.slice(-4)}</td>
                            <td style="font-size: 14px;padding: 7px;">Payment Card: 
                            ${flightDetails?.cardType}</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Please Note:</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">All fares are quoted
                in USD. Your credit card may be billed in multiple charges totaling the total amount mentioned. Some
                airlines may charge baggage fees.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Terms and Conditions</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Airline fees and
                service fees may be reflected in two different charges on your account.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">The agency service fee
                for all new bookings, changes, refunds, cancellations, and future credits will be charged per passenger,
                per ticket.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b>The agency service
                    fee on all new reservations, changes, refunds, cancellations, and future credits is
                    non-refundable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Like our service fees
                (booking fees), all post-ticket service fees are nonrefundable and subject to change without notice. Our
                fees are in addition to any fees and/or charges imposed by the airline and/or other suppliers.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Important Note: All
                service fees are subject to change without notice. You will be charged the final total price as quoted,
                regardless of any changes or variations in service fees. Please review the final total price carefully.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTE: If this is a
                third-party credit card, you may receive a phone call and email from our credit card verification
                department requesting verification of this transaction before the ticket is issued. A third-party credit
                card is a card that the traveler is not the cardholder.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Customer Support</p>
            <p>Reservation Number: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">If you have questions
                about your reservation, please contact us at <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> and we will respond
                within 24 hours.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">For immediate
                assistance, call: <b>+1-888-209-3035</b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Rules of Change</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes are subject to
                the following rules/penalties in addition to any difference in airfare at the time the changes are made.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes (before or
                after departure): Depending on airline policy. Cancellation/Refund (before or after departure): Not
                allowed on most airlines/depending on airline policy.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Important, Please Read</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers must
                reconfirm flights 72 (seventy-two) hours prior to departure with the airline they are traveling with.
                Passengers must arrive at the gate 3 (three) hours prior to departure for international travel and 2
                (two) hours prior to departure for domestic travel. We are not responsible or liable for flight changes
                made by the airline. If a passenger misses or does not show up for their flight and does not notify the
                airline prior to missing or not showing up for the flight, the passenger assumes full responsibility for
                any change fees or penalties and/or possible loss of ticket value. This no-show policy is a rule imposed
                by the airline and is at its discretion to determine how it will be handled. However, most airlines
                consider no-shows a violation of their ticket policies, meaning any and all funds paid for that ticket
                are forfeited. Frequent flyer mileage may be accrued on some carriers. Please contact your airline to
                report your mileage number. Fares are not guaranteed until tickets are issued.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers are
                responsible for all required travel documents. If a passenger attempts to fly without proper
                documentation and is turned away at the airport or needs to cancel or change their tickets due to a lack
                of proper travel documentation, the passenger assumes full responsibility for any and all change or
                cancellation fees, if applicable, and/or the loss of purchased tickets.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visas: Please check
                with your local embassy regarding visa requirements, as we do not handle visa/travel documents.
                Passports: It is recommended that your passport be valid for at least six months from the return date.
                Travel Protection: Helps protect your travel arrangements, your belongings, and most importantly, you,
                in case of unforeseen circumstances that arise before or during your trip.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">For
                more information, please visit our website or contact us at</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // Spanish Invoice template
  const spanishTemplate = `
      <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.astrivionventures.co/image-crm/traveloplans.png"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Reserva online o llámanos 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Referencia de reserva ${flightDetails.bookingId}
                    </div>
                    <div style="margin-top:8px;color: white;font-size: 13px;">
                      ${flightDetails.provider.provider} Team
                    </div>
                    <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;">

                        <li style="list-style: none;"><a href="tel:+1-888-209-3035" style="font-size: 14px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: white; 
            text-align: end;
            width: 194px;
            margin-left: auto;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                                    style="width:auto;height:12px;margin-right: 2px;margin-bottom: -1.6px;">
                                 Llámanos al : +1-888-209-3035</a></li>
                    </ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;">
            <div style="font-size: 26px;">
                 Querido viajero,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Gracias por elegirnos 
            <span style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</span>  Equipo para 
                  <span style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</span> .</p>
             <p style="fontSize: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  Tómese un momento para revisar el resumen de su reserva.
                </p>
        </div>
        <div class="">
            <p style="font-size: 22px;text-align: center;margin-top: 5px;"><span
                    style="font-size: 26px;color: #125B88;font-weight: 550;">Felicidades!</span> Su solicitud de servicio de vuelo ha sido procesada
                      exitosamente para  <span style = "text-transform: capitalize;">
                    ${flightDetails.transactionType}
                  </span></p>
        </div>
        <div style="margin-top: 10px;">
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Localizadora de aerolineas</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Referencia de reserva</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Fecha de reserva</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;"> Le recomendamos que guarde una copia de este correo
                    electrónico para futuras referencias o consultas.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Detalles de facturación</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Correo electrónico</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de facturación</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Referencia de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Fecha de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 10px;font-weight: 700">Detalles del viajero</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Nombre</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Tipo</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Número de billete</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "N/A"} ${p.middleName || "N/A"} 
                            ${p.lastName || "N/A"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "N/A"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "N/A"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 10px">Resumen del vuelo</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de salida
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 172px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             
   <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Inbound Flights Segment
                </p>
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 172px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p>Equipaje: Tenga en cuenta que muchas aerolíneas (especialmente las de bajo coste) no permiten equipaje gratuito. Consulte el sitio web de la aerolínea para obtener la información más actualizada.</p>
                <p> Facturación en línea: Algunas aerolíneas exigen que los
                        pasajeros facturen en línea e impriman sus tarjetas de
                        embarque; de ​​lo contrario, cobran una tarifa por la
                        facturación en el aeropuerto. Para más información,
                        visite el sitio web de la aerolínea.</p>
               <p>
                        Comisiones: El cargo total (como se indica arriba) puede
                        reflejarse en su cuenta en múltiples transacciones,
                        hasta alcanzar el importe mostrado.
                      </p>
                      <p>
                        Todas las horas mencionadas corresponden a la hora local
                        de esa ciudad o país. Asegúrese de tener todos los
                        documentos válidos antes de emprender su viaje. Para más
                        información, contacte con su consulado o aerolínea
                        local.
                      </p>
                      <p>
                        Debido a que las aerolíneas cambian sus horarios con
                        frecuencia, por favor llame a la aerolínea 72 horas
                        antes de la salida para confirmar los detalles de su
                        vuelo.
                      </p>
                      <p>
                        Tenga en cuenta que los boletos, una vez emitidos, no
                        son reembolsables ni transferibles. Para cualquier
                        cambio de fecha o ruta, llámenos al +1-888-209-3035. Los
                        cambios están sujetos a las normas y regulaciones de la
                        aerolínea y pueden generar penalizaciones, diferencias
                        de tarifa y cargos. Algunos vuelos pueden no admitir
                        cambios. No se garantiza ninguna tarifa hasta que se
                        emitan los boletos.
                      </p>
            </div>
            <p style="font-size: 18px;font-weight: 700;margin-top: 20px;margin-bottom: 10px">Detalles de precios (USD $)</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                           <th style="font-size: 14px;padding: 7px;font-weight: 500;">Precio base</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Impuestos y tasas</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Total parcial</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style="font-size: 14px;padding: 7px;"> $${
                              flightDetails?.baseFare
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.taxes
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.baseFare + flightDetails?.taxes
                            }</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                style="background-color: #125B88;display: flex;justify-content: space-between;padding: 15px 20px;color: white;">
               <div style = "width: 180px; margin-left: auto; text-align:end;display: flex;align-items:center;justify-content:end">
                <p style="margin: 0px;font-weight: 500;font-size: 20px">Total Price</p>
                <span style = "margin: 0px 10px;">-</span>
                <p style="margin: 0px;font-weight: 600; font-size: 20px"> $${
                  flightDetails?.baseFare + flightDetails?.taxes
                }</p>
               </div>
            </div>
            <div style="margin: auto;width: 90%">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;border-radius: 0px 0px 10px 10px">
                    <tbody>
                        <tr>
                            <td style="font-size: 14px;padding: 7px;">Loaded on Card :  
                          ${"x"
                            .repeat(flightDetails?.cardNumber.length)
                            .slice(0, -4)}
                          ${flightDetails?.cardNumber.slice(-4)}</td>
                            <td style="font-size: 14px;padding: 7px;">Payment Card: 
                            ${flightDetails?.cardType}</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Tenga en cuenta:</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Todas las tarifas están expresadas en dólares
                      estadounidenses. Su tarjeta de crédito podría recibir
                      varios cargos por el importe total mencionado. Algunas
                      aerolíneas pueden cobrar cargos por equipaje.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Términos y condiciones</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Las tarifas de las aerolíneas y los cargos por servicio
                      pueden reflejarse en dos cargos diferentes en su cuenta.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> La tarifa de servicio de la agencia para todas las nuevas
                      reservas, cambios, reembolsos, cancelaciones y futuros
                      créditos se cobrará por pasajero y por billete.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> La tarifa de servicio de la agencia para todas las
                        nuevas reservas, cambios, reembolsos, cancelaciones y
                        futuros créditos no es reembolsable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Al igual que nuestras tarifas de servicio (tarifas de
                      reserva), todas las tarifas de servicio posteriores a la
                      emisión del billete no son reembolsables y están sujetas a
                      cambios sin previo aviso. Nuestras tarifas se suman a
                      cualquier cargo o comisión impuesta por la aerolínea u
                      otros proveedores.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Nota importante: Todas las tarifas de servicio están
                      sujetas a cambios sin previo aviso. Se le cobrará el
                      precio total final cotizado, independientemente de
                      cualquier cambio o variación en las tarifas de servicio.
                      Por favor, revise atentamente el precio total final.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTA: Si se trata de una tarjeta de crédito de terceros,
                      es posible que reciba una llamada telefónica y un correo
                      electrónico de nuestro departamento de verificación de
                      tarjetas de crédito solicitando la verificación de esta
                      transacción antes de emitir el billete. Una tarjeta de
                      crédito de terceros es una tarjeta de la cual el viajero
                      no es el titular.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Atención al cliente</p>
            <p>Número de reserva: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Si tiene alguna pregunta sobre su reserva, por favor
                      contáctenos en <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> y le responderemos en 24 horas.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Para obtener asistencia inmediata, llame al: <b>+1-888-209-3035</b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Reglas del cambio</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los cambios están sujetos a las siguientes
                      reglas/penalizaciones, además de cualquier diferencia en
                      la tarifa aérea vigente al momento de realizar los
                      cambios.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Cambios (antes o después de la salida): Según la política
                      de la aerolínea. </p>
                        <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Cancelación/Reembolso (antes o después de
                      la salida): No permitido en la mayoría de las
                      aerolíneas/según la política de la aerolínea.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Importante, por favor lea</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros deben reconfirmar sus vuelos 72 (setenta y
                      dos) horas antes de la salida con la aerolínea con la que
                      viajan. Los pasajeros deben llegar a la puerta de embarque
                      3 (tres) horas antes de la salida para viajes
                      internacionales y 2 (dos) horas antes de la salida para
                      viajes nacionales. No nos hacemos responsables de los
                      cambios de vuelo realizados por la aerolínea. Si un
                      pasajero pierde o no se presenta a su vuelo y no notifica
                      a la aerolínea antes de hacerlo, el pasajero asume toda la
                      responsabilidad por cualquier cargo o penalización por
                      cambio y/o la posible pérdida del valor del boleto. Esta
                      política de no presentación es una norma impuesta por la
                      aerolínea y queda a su discreción determinar cómo se
                      gestionará. Sin embargo, la mayoría de las aerolíneas
                      consideran las no presentaciones como una violación de sus
                      políticas de boletos, lo que significa que se pierde la
                      totalidad del dinero pagado por ese boleto. Se pueden
                      acumular millas de viajero frecuente en algunas
                      aerolíneas. Comuníquese con su aerolínea para informar su
                      número de millas. Las tarifas no están garantizadas hasta
                      que se emitan los billetes.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros son responsables de todos los documentos de viaje necesarios. Si un pasajero intenta volar sin la documentación adecuada y es rechazado en el aeropuerto o necesita cancelar o cambiar sus billetes por falta de la documentación de viaje adecuada, el pasajero asume la plena responsabilidad por cualquier cargo por cambio o cancelación, si corresponde, y/o por la pérdida de los billetes adquiridos.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los requisitos de visado, ya que no gestionamos visados ​​ni documentos de viaje.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los
                      requisitos de visado, ya que no gestionamos visados ​​ni
                      documentos de viaje. Pasaportes: Se recomienda que su
                      pasaporte tenga una validez mínima de seis meses a partir
                      de la fecha de regreso. Protección de viaje: Le ayuda a
                      proteger sus planes de viaje, sus pertenencias y, sobre
                      todo, a usted mismo, en caso de imprevistos que surjan
                      antes o durante su viaje.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">Para obtener más información, visite nuestro sitio web o
                      contáctenos en</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // return based on language
  return language === "es" ? spanishTemplate : englishTemplate;
};
export const updateSendMailInvoiceController = async (req, res) => {
  try {
    console.log("req.body data is:", req.query);

    const authData = JSON.parse(req.query.authCredentials);
    console.log("upcoming ss is", authData);

    const { flightId } = req.params;

    const { agentFigure, language = "en", transactionType } = req.query;

    const currentUserId = req.user;

    const currentUserData = await User.findById(currentUserId);

    const booking = await ctmFlightModel
      .findById(flightId)
      .populate("provider")
      .populate("agent")
      .populate("authMail");

    console.log("find booking is", booking);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.language = language;
    booking.agentFigure = agentFigure || "";
    booking.transactionType = transactionType;
    booking.authMail = authData[0]._id;
    booking.logActivity.push({
      type: "send-mail-update",
      data: {
        language: booking.language,
        transactionType: booking.transactionType,
        agentFigure: booking.agentFigure,
      },
      logRole: currentUserData?.role,
      logName: currentUserData?.userName,
      updatedAt: new Date(),
    });
    await booking.save();

    const itineraryHTML = generateItineraryHTML(
      booking.outboundSegments || [],
      booking.inboundSegments || [],
      language // add this!
    );

    let emailContent;

    // if (booking.provider?.toLowerCase() === "faresway") {
    //   emailContent = `...Faresway content here...` + itineraryHTML;
    // } else if (booking.provider?.toLowerCase() === "travelpro") {
    //   emailContent = `...TravelPro content here...` + itineraryHTML;
    // } else {

    //   emailContent = generateEmailTemplate(booking, language);
    // }

    // const htmlBody = generateEmailTemplate(booking, language);

    // const htmlBody1 = generateEmailTemplateFutureCredit(booking, language);

    // const htmlBody2 = generateEmailTemplateCancellationRefund(
    //   booking,
    //   language
    // );

    // const mainHtmlBody =
    //   booking.transactionType &&
    //   booking.transactionType === "cancellationRefund"
    //     ? htmlBody2
    //     : booking.transactionType &&
    //       booking.transactionType === "cancellationFutureCredit"
    //     ? htmlBody1
    //     : htmlBody;

    // sendMail(
    //   booking.email,
    //   "E-ticket Confirmation",
    //   mainHtmlBody,
    //   process.env.AUTH_EMAIL
    // );

    const htmlBody = generateEmailTemplate(booking, language);

    const htmlBody1 = generateEmailTemplateFutureCredit(booking, language);

    const htmlBody2 = generateEmailTemplateCancellationRefund(
      booking,
      language
    );

    // NEW: Ticket Issuance
    // const htmlBody3 = generateEmailTemplateTicketIssuance(booking, language);

    const mainHtmlBody =
      booking.transactionType === "cancellationRefund"
        ? htmlBody2
        : booking.transactionType === "cancellationFutureCredit"
        ? htmlBody1
        : htmlBody;

    console.log("req.query.authCredentials", authData);
    sendMail(booking.email, "E-ticket Confirmation", mainHtmlBody, authData[0]);

    // sendMail( booking.email , "E-ticket Confirmation", emailContent);

    return res.status(200).json({
      success: true,
      message: "Booking updated and email sent successfully",
      booking,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error for ticketIssuence",
      error,
    });
  }
};

export const getCtmFlightPnr = async (req, res) => {
  try {
    const data = await ctmFlightModel.find().populate("agent");

    res.status(200).send({
      success: "true",
      message: "data fetched successfully",
      ctmPnr: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Internal Server Error",
      error,
    });
  }
};

// Provider
export const createProvider = async (req, res) => {
  try {
    const {
      provider,
      status,
      tollFreePrimary,
      tollFreeSecondary,
      providerAddress,
    } = req.body;

    let providerPictures = [];
    const { providerImages } = req.files;

    if (providerImages && providerImages.length > 0) {
      providerPictures = providerImages.map((file) => {
        return { img: file.filename };
      });
    }

    if (!providerImages || providerImages.length === 0) {
      return res.send({ message: "At least one image is required" });
    }

    const providerData = new providerModel({
      provider,
      providerAddress,
      providerStatus: status,
      tollFreePrimary,
      tollFreeSecondary,
      providerPictures,
    });

    console.log("providre dqarte is ", providerData);

    await providerData.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      providerData,
    });
  } catch (error) {
    console.log(error),
      res.status(400).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const getProvider = async (req, res) => {
  try {
    const booking = await providerModel.find({});

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const { flightId } = req.params;
    const booking = await providerModel.findByIdAndDelete(flightId);
    res.status(200).send({
      success: true,
      message: "Provider field deleted successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      provider,
      status,
      tollFreePrimary,
      tollFreeSecondary,
      providerAddress,
    } = req.body;

    // Find and update the provider document
    const updatedProvider = await providerModel.findByIdAndUpdate(
      flightId,
      {
        provider: provider,
        providerAddress: providerAddress,
        tollFreePrimary: tollFreePrimary,
        tollFreeSecondary: tollFreeSecondary,
        providerStatus: status,
      },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).send({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Provider updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// airline
export const createCtmProivderController = async (req, res) => {
  try {
    const { ctmAirline, status } = req.body;

    let ctmAirlinePictures = [];
    const { ctmAirlineImages } = req.files;

    if (ctmAirlineImages && ctmAirlineImages.length > 0) {
      ctmAirlinePictures = ctmAirlineImages.map((file) => {
        return { img: file.filename };
      });
    }

    if (!ctmAirlineImages || ctmAirlineImages.length === 0) {
      return res.send({ message: "At least one image is required" });
    }

    const ctmAirlineData = new airlineModel({
      ctmAirline,
      ctmAirlineStatus: status,
      ctmAirlinePictures,
    });

    await ctmAirlineData.save();

    res.status(200).send({
      success: true,
      message: "Airline inserted successfully",
      ctmAirlineData,
    });
  } catch (error) {
    console.log(error),
      res.status(400).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};
export const getAirlineController = async (req, res) => {
  try {
    const booking = await airlineModel.find({});

    res.status(200).send({
      success: true,
      message: "airline fetched  successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateCtmAirlineController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { ctmAirline, status } = req.body;

    // Find and update the provider document
    const updateCtmAirline = await airlineModel.findByIdAndUpdate(
      flightId,
      {
        ctmAirline: ctmAirline,
        ctmAirlineStatus: status,
      },
      { new: true }
    );

    if (!updateCtmAirline) {
      return res.status(404).send({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Provider updated successfully",
      provider: updateCtmAirline,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const deleteAirlineContrller = async (req, res) => {
  try {
    const { flightId } = req.params;
    const booking = await airlineModel.findByIdAndDelete(flightId);
    res.status(200).send({
      success: true,
      message: "Airline field deleted successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateCtmSegmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { outboundSegments, inboundSegments } = req.body;

    const booking = await ctmFlightModel.findById(id);
    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This user is not found ",
      });
    }

    // Assign new segment data
    booking.outboundSegments = outboundSegments;
    booking.inboundSegments = inboundSegments;

    // Push to logActivity with model values
    booking.logActivity.push({
      type: "segment-update",
      data: {
        outboundSegments: booking.outboundSegments,
        inboundSegments: booking.inboundSegments,
      },
      logRole: user?.role,
      logName: user?.userName,
      updatedAt: new Date(),
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Segment updated successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
/*Upload Auth Doc*/
// ===== Multer Storage =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    // if (allowed.test(ext)) {
    //   cb(null, true);
    // } else {
    //   cb(new Error("Only Photo & PDF files are allowed"));
    // }
    cb(null, true);
  },
}).array("documents", 5);

// ===== Serve Upload Page =====
export const serveUploadPageController = (req, res) => {
  const { bookingId } = req.params;

  const html = `

    <!DOCTYPE html>
    <html>
    <head>
      <title>Upload Documents</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    </head>
    <body>
      <div class="container" style="max-width: 600px; margin-top: 50px;">
        <div class="panel panel-info">
          <div class="panel-heading"><h3 class="panel-title">Upload Your Documents</h3></div>
          <div class="panel-body">
            <form action="/api/v1/ctmFlights/upload-documents/${bookingId}" method="POST" enctype="multipart/form-data">
              <div class="form-group">
                <input type="file" name="documents" class="form-control" />
              </div>
              <div class="form-group">
               
                <input type="file" name="documents" class="form-control" />
              </div>
              <div class="form-group">
               
                <input type="file" name="documents" class="form-control" />
              </div>
              <div class="form-group">
               
                <input type="file" name="documents" class="form-control" />
              </div>
              <div class="form-group">
             
                <input type="file" name="documents" class="form-control" />
              </div>
              <div class="checkbox">
                <label><input type="checkbox" checked disabled /> Only Photo & PDF files are allowed / Maximum Size 15 MB.</label>
              </div>
              <button type="submit" class="btn btn-success">Upload Now</button>
            </form>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
};

// ===== Upload Documents =====
export const uploadDocumentController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(`<p style="color:red;">${err.message}</p>`);
    }

    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res
          .status(400)
          .send("<p style='color:red;'>Booking ID is required</p>");
      }

      const fileNames = req.files.map((file) => file.filename);

      // Save filenames into DB
      await ctmFlightModel.findByIdAndUpdate(
        bookingId,
        { $push: { documents: { $each: fileNames } } },
        { new: true }
      );

      res.send(`
  <script>
    alert("Files uploaded successfully!");
    window.location.href = "/api/v1/ctmFlights/upload-documents/${bookingId}";
  </script>
`);
    } catch (error) {
      console.error("Upload error:", error);
      return res
        .status(500)
        .send("<p style='color:red;'>Internal Server Error</p>");
    }
  });
};

export const filterChargeRefundsController = async (req, res) => {
  try {
    console.log("calling controller is");
    const { agent, fromDate, toDate, transactionType, provider } = req.body;

    console.log("coming body is ", req.body);

    const filter = {};

    if (agent) {
      filter.agent = agent;
    }

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    } else if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: start };
    } else if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $lte: end };
    }

    if (transactionType) {
      // if (transactionType === "refund") {
      //   filter["refund.refundStatus"] = "approved";
      // } else if (transactionType === "chargeBackDetails") {
      //   filter["chargeBackDetails.chargebackStatus"] = "approved";
      // }

      if (transactionType === "refund") {
        filter.refund = { $exists: true };
      } else if (transactionType === "chargeBackDetails") {
        filter.chargeBackDetails = { $exists: true };
      }
    }


    if (provider) {
      filter["provider._id"] = provider;
    }

    const data = await ctmFlightModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("agent", "userName")
      .populate("provider");

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error filtering refunds:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
