import express from "express";
import * as videoConferenceController from "../controllers/videoConferenceController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes with auth middleware
// router.use(authMiddleware);

// ==================== CONFERENCE ROUTES ====================
router.post("/create", videoConferenceController.createConference);
router.get("/list", videoConferenceController.listConferences);
router.get("/:conferenceId", videoConferenceController.getConference);
router.put("/:conferenceId/update", videoConferenceController.updateConference);
router.post("/:conferenceId/end", videoConferenceController.endConference);
router.get("/:conferenceId/stats", videoConferenceController.getConferenceStats);

// ==================== RECORDING ROUTES ====================
router.post("/:conferenceId/recording/start", videoConferenceController.startRecording);
router.post("/:recordingId/recording/stop", videoConferenceController.stopRecording);
router.get("/:conferenceId/recordings", videoConferenceController.getRecordings);
router.delete("/:recordingId/recording/delete", videoConferenceController.deleteRecording);

// ==================== CHAT ROUTES ====================
router.post("/:conferenceId/messages/send", videoConferenceController.sendMessage);
router.get("/:conferenceId/messages", videoConferenceController.getMessages);
router.delete("/:messageId/messages/delete", videoConferenceController.deleteMessage);

// ==================== PARTICIPANT MANAGEMENT ====================
router.post("/:conferenceId/invite", videoConferenceController.inviteParticipants);
router.delete("/:conferenceId/participant/:participantId", videoConferenceController.removeParticipant);

export default router;
