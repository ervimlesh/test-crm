import mongoose from "mongoose";

const voiceRecordSchema = new mongoose.Schema(
  {
    date: { type: Date, },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    tfnNo: { type: String },
    customerNo: { type: String },
    airline: { type: String },
    bhAd: { type: String, enum: ["BH", "AD"] },
    language: { type: String, enum: ["EN", "SP"], default: "EN" },
    conversion: { type: String, enum: ["Yes", "No"], default: "No" },
    query: { type: String,  },
    linkedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CtmFlight",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VoiceRecord", voiceRecordSchema);
