import cluster from "cluster";
import os from "os";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import ctmFlightRoutes from "./routes/ctmFlightRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
import dropDownRoutes from "./routes/dropDownRoutes.js";
import setupRealTime from "./services/realTime.js";
import { setupVideoConferencing } from "./services/videoConferencing.js";
import path from "path";
import { fileURLToPath } from "url";
import { checkIP } from "./middlewares/checkIP.js";
import groupChatRoutes from "./routes/groupChatRoutes.js";
import videoConferenceRoutes from "./routes/videoConferenceRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import { initProducer } from "./kafka/producer.js";
import { createTopics } from "./kafka/adminInit.js";

dotenv.config();

const app = express();
// app.use(checkIP);

//  Wrap in async startup
const startServer = async () => {
  try {
    (async () => {
      try {
        // Connect to DB first
        await connectDB();

        // Create Kafka topics once at startup
        try {
          await createTopics();
          console.log("🚀 Kafka topics ensured");
        } catch (err) {
          console.error("❌ Kafka topic create error:", err.message);
        }

        // Init Kafka in background
        initProducer().then((p) => {
          if (!p)
            console.warn(
              "⚠️ Kafka producer not connected — running without Kafka."
            );
        });

        // Start server & socket.io ...
      } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
      }
    })();

    // ES module fix
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    const buildpath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(buildpath));

    // Middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(cookieParser());
    // app.set("trust proxy", "loopback")

    // Routes
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/otp", otpRoutes);
    app.use("/api/v1/flights", flightRoutes);
    app.use("/api/v1/hotels", hotelRoutes);
    app.use("/api/v1/package", packageRoutes);
    app.use("/api/v1/business", businessRoutes);
    app.use("/api/v1/ctmFlights", ctmFlightRoutes);
    app.use("/api/v1/management", managementRoutes);
    app.use("/api/v1/dropdown", dropDownRoutes);
    app.use("/api/v1/groupchat", groupChatRoutes);
    app.use("/api/v1/video-conference", videoConferenceRoutes);
    app.use("/api/v1/service", serviceRoutes);

    app.use("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });

    app.use("/", (req, res) => {
      res.send("welcome");
    });

    // HTTP + Socket.IO
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*", // adjust for production
        methods: ["GET", "POST"],
      },
    });

    app.set("io", io);
    setupRealTime(io);
    setupVideoConferencing(io);

    const PORT = process.env.PORT || 8080;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`.bgCyan.white);
    });
  } catch (err) {
    console.error(`❌ Failed to start server: ${err.message}`.bgRed.white);
    process.exit(1);
  }
};

startServer();

// Global Error Handlers
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`.bgRed.white);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log(`Server shutting down gracefully.`.bgYellow.white);
  process.exit(0);
});
