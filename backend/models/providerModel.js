import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
     providerStatus: {
      type: String,
      required: true,
    },
    providerPictures: [{ img: { type: String } }],
    tollFreePrimary: {
      type: String,
      required: true,
    },
     tollFreeSecondary: {
      type: String,
     
    },
    providerAddress:{
      type:String,
      
    }
   
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
