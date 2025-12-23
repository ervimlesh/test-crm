import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    cardHolderName: {
      type: String, // Changed from Number to String
      required: true,
    },
    cardNumber: {
      type: String, // Changed from Number to String (to preserve leading zeros)
      required: true,
    },
    cardDetails: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String, // Added missing field
      required: true,
    },
    flight: {
      flyFrom: { type: String, required: true },
      flyTo: { type: String, required: true },
      cityFrom: { type: String, required: true },
      cityTo: { type: String, required: true },
      price: { type: Number, required: true }, // Added missing price field
    },
    adt: {
      type: Number, // Changed from String to Number
      required: true,
    },
    ift: {
      type: Number, // Changed from String to Number
      required: true,
    },
    chd: {
      type: Number, // Changed from String to Number
      required: true,
    },
    totalAmount: {
      type: Number, // Added missing field
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
   webUrl: {
      type: String,
      default: "traveloways.com",
    },
    webMail: {
      type: String,
      default: "crmastrivionventures@gmail.com",
    },
    status: {
      type: String,
      enum: ["newBooking", "approved", "rejected"],
      default: "newBooking"

    },
    approvedBy: {
      type: String,
     
    },
    

  },
  { timestamps: true }
);

export default mongoose.model("Flights", flightSchema);
