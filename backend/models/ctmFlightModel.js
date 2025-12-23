import mongoose from "mongoose";

// ---------------------------------------------
// Flight Segment Schema
// ---------------------------------------------
const flightSegmentSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  airlineImage: { type: String, required: true },
  flight: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  class: { type: String, required: true },
  alLocator: { type: String, required: true },
});

// ---------------------------------------------
// Passenger Schema
// ---------------------------------------------
const passengerSchema = new mongoose.Schema({
  detailsType: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  ticketNumber: { type: String },
});

// ---------------------------------------------
// Passenger Schema
// ---------------------------------------------
const secondCardDetailsSchema = new mongoose.Schema({
  cardType2: { type: String },
  cchName2: { type: String },
  cardNumber2: { type: String },
  cvv2: { type: String },
  expiryMonth2: { type: String },
  expiryYear2: { type: String },
});

// ---------------------------------------------
// chargeBackDetails Schema
// ---------------------------------------------
const chargeBackDetailsSchema = new mongoose.Schema({
  chargeAmount: { type: String },
  chargebackDate: { type: String },
  reasonForChargeback: { type: String },
  chargebackStatus: { type: String },
});

// ---------------------------------------------
// Refund Schema
// ---------------------------------------------
const refundSchema = new mongoose.Schema({
  refundAmount: { type: String },
  refundRequestedOn: { type: String },
  reasonForRefund: { type: String },
  refundStatus: { type: String },
});

// ---------------------------------------------
// Cancellation Refund Schema
// -------------------------------------------
const cancellationRefundSchema = new mongoose.Schema({
  cancelRefAmount: { type: Number },
  cancelRefRequestOn: { type: Date },
  cancelRefReason: { type: String },
  cancelRefStatus: {
    type: String,
  },
});

// ---------------------------------------------
// Future Credit Schema
// ---------------------------------------------
const futureCreditSchema = new mongoose.Schema({
  futureCreditAmount: { type: String },
  futureCreditRequestedOn: { type: Date },
  futureCreditValidity: { type: Date },
  reasonForFutureCredit: { type: String },
});

// ---------------------------------------------
// Ticket Issue Schema
// ---------------------------------------------
const ticketIssueSchema = new mongoose.Schema({
  ticketIssueAmount: { type: String },
  ticketIssueRequestedOn: { type: Date },
  ticketIssueValidity: { type: Date },
  ticketIssueReason: { type: String },
});

// ---------------------------------------------
// Main CTM Flight Schema
// ---------------------------------------------
const ctmFlightSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: [
        "newBooking",
        "exchange",
        "seatAssignments",
        "upgrade",
        "cancellationRefund",
        "cancellationFutureCredit",
        "extraAddOn",
        "ticketIssuance",
      ],
      required: true,
    },

    itineraryType: { type: String, required: true },
    passengers: { type: Number, required: true },
    // provider: { type: String, required: true },
    provider: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Flight Segments
    outboundFlight: { type: String },
    inboundFlight: { type: String },
    outboundSegments: [flightSegmentSchema],
    inboundSegments: [flightSegmentSchema],

    // Fare Details
    baseFare: { type: String, required: true },
    taxes: { type: String, required: true },
    totalAmount: { type: String },
    currency: { type: String, default: "USD" },

    // Passenger Info
    passengerDetails: [passengerSchema],

    // Billing Info
    cardType: { type: String, required: true },
    cchName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },

    secondCardDetails: secondCardDetailsSchema,

    expiry: { type: String },
    billingPhoneNumber: { type: String },
    contactNumber: { type: String },
    billingAddress1: { type: String },
    billingAddress2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String },
    email: { type: String, required: true },
    dnis: { type: String },
    // Admin and Status
    bookingId: { type: String },
    agentFigure: { type: String },
    remarks: { type: String },
    tollNumber: { type: String },
    pnrStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bidStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "approved", "rejected"],
      default: "pending",
    },
    ticketmco: { type: String, default: "pending" },
    adminAuthorize: { type: String },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authMail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthMails",
      default: null,
    },

    bookingConfirmed: { type: Boolean, default: false },

    // Optional Fields
    pinCode: { type: String },
    language: { type: String },
    ticketNumber: { type: String },

    // Refunds / Chargebacks
    chargingBaseFare: { type: String },
    chargingStatus: { type: String },
    chargedOn: { type: String },
    chargedBy: { type: String },
    chargingTaxes: { type: String },
    chargingTaxStatus: { type: String },
    chargingTaxchargedOn: { type: String },
    chargingTaxchargedBy: { type: String },

    // chargeAmount: { type: String },
    // chargebackDate: { type: String },
    // reasonForChargeback: { type: String },
    // chargebackStatus: { type: String },
    authorizedIp: { type: String },
    authorizedAt: { type: Date },

    documents: [{ type: String }],

    chargeBackDetails: chargeBackDetailsSchema,

    // Refund Section (single refund record)
    refund: refundSchema,

    // Cancellation Refund Section (single refund record)
    cancellationRefund: cancellationRefundSchema,

    // Future Credit Section (single future credit record)
    futureCredit: futureCreditSchema,
    // Ticket Issue Section (single ticket issue record)
    ticketIssueDetails: ticketIssueSchema,

    // PNR Remarks
    pnrRemarks: [
      {
        date: { type: Date, default: Date.now },
        remark: { type: String },
        agent: { type: String },
      },
    ],

    // Log Activity
    logActivity: [
      {
        type: { type: String }, // e.g., 'price-update' or 'charging-update'
        data: mongoose.Schema.Types.Mixed, // Flexible to hold any structure
        logRole: { type: String },
        logName: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    webUrl: {
      type: String,
      default: "crm.astrivionventures.co",
    },
    webMail: {
      type: String,
      default: "crmastrivionventures@gmail.com",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CtmFlight", ctmFlightSchema);
