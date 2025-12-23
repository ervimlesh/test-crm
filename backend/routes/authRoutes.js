import express from "express";
import {  checkRoleController, getAllAdminContrller, getAllAgentRequestController, getAllUsersController, getOtpAgentController, getOtpAllControlller, loginController, moveToTrashController, registerController, sendOtpController, updateAgentOptController, updateStatusController,getProfileController, logoutController, sendForgotOtpController, verifyForgotOtpController, resetForgotPasswordController, addVoiceDetailController, getAllVoideRecordsController, updateRoleController, uploadProfileImageController, deleteProfileImageController} from "../controllers/authController.js";
import { protect, admin, superAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import { getAllAgentController } from "../controllers/flightController.js";

import multer from "multer";
import shortid from "shortid";
import path from "path";
import { fileURLToPath } from "url";

//ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/register",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "image" },
  ]),
  registerController
),
router.post("/login", loginController);
router.post("/logout", logoutController)
router.post("/check-role",checkRoleController)
router.post("/send-otp", sendOtpController);
router.get("/get-otp-agent",getOtpAgentController)
router.get("/get-otp-all", getOtpAllControlller)
router.post("/agent-otp-status/:id", updateAgentOptController)

router.get("/get-all-users", getAllUsersController)
router.get("/get-profile/:id",getProfileController)
router.patch("/status/:id", updateStatusController);

router.patch("/moveToTrash/:id", moveToTrashController);
//
router.post("/send-otp-forgot", sendForgotOtpController);
router.post("/verify-otp-forgot", verifyForgotOtpController);
router.post("/reset-password-forgot", resetForgotPasswordController);
// admins
router.get("/get-all-admins", getAllAdminContrller);

// agents
router.get("/get-all-agents", getAllAgentController);
router.get("/agent-request", getAllAgentRequestController)
router.post("/voice-detail",addVoiceDetailController)
router.get("/all-voice-records",getAllVoideRecordsController)

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-dashboard", requireSignIn, admin, (req, res) => {
  res.status(200).send({ ok: true });
  // res.status(200).json({ message: "Admin dashboard" });
});
// Route to get all admins
router.get("/superadmin-dashboard", requireSignIn,  superAdmin, (req, res) => {
  res.status(200).send({ ok: true });
  // res.status(200).json({ message: "Superadmin dashboard" });
});

router.get('/admins', superAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).send({
      success: true,
      message: 'Admins fetched successfully',
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching admins',
      error: error.message,
    });
  }
});

// Profile image management routes
router.post(
  "/upload-profile-image",
  requireSignIn,
  upload.single("profileImage"), 
  uploadProfileImageController
);

router.delete("/delete-profile-image", requireSignIn, deleteProfileImageController);

// =============================newly routes==============
router.patch("/update-role/:id", updateRoleController);

export default router;
