import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { getAttendanceByEmployeeController, getAllEmployeeController, getAllLoginAttendance, getTodayRecord, punchIn, punchOut, sendSlipController, pdfSlipController } from "../controllers/managementController.js";
import User from "../models/User.js";

const router = express.Router();


router.post("/punch-in", requireSignIn, punchIn);
router.put("/punch-out", requireSignIn, punchOut);
router.get("/today", requireSignIn, getTodayRecord);
router.get("/login-attendance", requireSignIn, getAllLoginAttendance); 
router.get("/employee-data",requireSignIn,getAllEmployeeController)
router.get("/attendance-data/:id",requireSignIn,getAttendanceByEmployeeController)

// ----------------------slips----------------
router.post("/account-slip", sendSlipController)
router.post("/account-pdf",pdfSlipController)

// ----------------------Screen Sharing / Agent Routes----------------
/**
 * GET /api/v1/management/agents
 * Fetch all approved agents for admin/superadmin screen sharing
 */
router.get("/agents", requireSignIn, async (req, res) => {
  try {
    const agents = await User.find(
      { role: "agent", status: "approved" },
      { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1, createdAt: 1 }
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Agents list fetched successfully",
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/management/agents/:id
 * Fetch a single agent by ID
 */
router.get("/agents/:id", requireSignIn, async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await User.findOne(
      { _id: id, role: "agent", status: "approved" },
      { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1, number: 1, userPictures: 1 }
    ).lean();

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agent fetched successfully",
      data: agent,
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch agent",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/management/agents/online
 * Fetch only online agents
 */
router.get("/agents-online", requireSignIn, async (req, res) => {
  try {
    const agents = await User.find(
      { role: "agent", status: "approved", isOnline: true },
      { _id: 1, userName: 1, email: 1, role: 1, isOnline: 1 }
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Online agents fetched successfully",
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching online agents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch online agents",
      error: error.message,
    });
  }
});

export default router;
