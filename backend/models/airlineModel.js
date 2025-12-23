import mongoose from "mongoose";

const ctmAirlineSchema = new mongoose.Schema(
  {
    ctmAirline: {
      type: String,
      required: true,
    },
     ctmAirlineStatus: {
      type: String,
      required: true,
    },
    ctmAirlinePictures: [{ img: { type: String } }],
   
  },
  { timestamps: true }
);

export default mongoose.model("CtmAirline", ctmAirlineSchema);
