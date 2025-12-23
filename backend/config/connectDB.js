import mongoose from "mongoose";
import colors from "colors";
 
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing MongoDB connection".yellow);
      return;
    }
 
    const conn = await mongoose.connect(process.env.MONGO_URL);
 
    console.log(` MongoDB connected: ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`❌ Error in MongoDB connection: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};
 
export default connectDB;