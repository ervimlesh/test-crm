import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    packages: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    message: {
      type: String,

    },
    webUrl: {
      type: String,
    },
    webMail: {
      type: String,
    },
  },
  {
    timestamps: true,

  }
)
export default mongoose.model("Packages", packageSchema);