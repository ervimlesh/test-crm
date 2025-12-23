import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "agent", "admin", "superadmin","marketing","user","account","hr"],
      default: "employee",
    },
    status: {
      type: String,
      enum: ["pending", "approved","rejectedAgain", "rejected"],
      default: "pending",
    },
    otp: {
      value: { type: Number },
      expiresAt: { type: Date },
    },
    isTrashed: { type: Boolean, default: false },
    // approvedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   default: null,
    // },
    approvedBy: {
      type: String,
      default: null,
    },
    userPictures: [{ img: { type: String } }],
    penalties: { type: Number, default: 0 },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
