import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    packages: {
      type: String,
      
    },
    userName: {
      type: String,
      
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
export default mongoose.model("Cars", carSchema);