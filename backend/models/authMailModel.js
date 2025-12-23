import mongoose from "mongoose";

const authMailsSchema = new mongoose.Schema(
  {
    authMails: {
      type: String,
      required: true,
      
    },
    authPassword: {
      type: String,
      required: true,
    },
    mailStatus: {
      type: String,
      enum: ["auth-mail", "invoice-mail"],
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

  },
  { timestamps: true }
);

export default mongoose.model("AuthMails", authMailsSchema);
