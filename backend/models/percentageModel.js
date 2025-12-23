import mongoose from "mongoose";

const percentageSchema = new mongoose.Schema(
  {
    reducePercentage: {
      type: Number,
     
      min: 0,
      max: 100,
    },
    reduceSrcDestPercentage: {
      type: String,
    },
    reduceUrl: {
      type: String,
      required: true,
    },
    reduceSrc: {
      type: String,
    },
    reduceDest: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Percentage", percentageSchema);
