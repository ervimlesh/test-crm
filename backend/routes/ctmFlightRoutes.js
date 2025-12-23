import express from "express";
import {
  confirmCtmBookingController,
  createCtmFlightController,
  getLastBookingIdController,
  updateCtmFlightController,
  generatePnrFlightController,
  updateProviderController,
  updateBidStatusController,
  updateItineraryController,
  updatePriceController,
  updateChargingController,
  updatePassengerController,
  updateBillingController,
  updateRefundController,
  updateChargeBackController,
  updateSendMailInvoiceController,
  getCtmFlightPnr,
  getProvider,
  deleteProvider,
  updateProvider,
  createProvider,
  createCtmProivderController,
  getAirlineController,
  deleteAirlineContrller,
  updateCtmAirlineController,
  updateCtmSegmentController,
  updatePnrCtmFlightController,
  serveUploadPageController,
  uploadDocumentController,
  updateCancellationRefundController,
  updateFutureCreditController,
  updateBillingController2,
  filterChargeRefundsController,
  updateTicketIssueController, 
} from "../controllers/ctmFlightController.js";
 
import multer from "multer";
import shortid from "shortid";
import path from "path";
import { fileURLToPath } from "url";
import { requireSignIn } from "../middlewares/authMiddleware.js";
 
//ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const router = express.Router();
 
router.post("/create-ctm-flight", createCtmFlightController);
router.get("/last-booking-id", getLastBookingIdController);
router.patch("/update-auth-flight/:flightId",requireSignIn, updateCtmFlightController);
router.patch("/update-pnrRemark-flight/:flightId",requireSignIn, updatePnrCtmFlightController);
router.get("/confirm-ctm-booking/:flightId", confirmCtmBookingController);
// router.post("/upload-documents/:bookingId", uploadDocumentController);
// Serve HTML form
// router.get("/upload-documents/:bookingId",requireSignIn, serveUploadPageController);
// Handle upload
// Serve HTML form
router.get("/upload-documents/:bookingId", serveUploadPageController);
router.post("/upload-documents/:bookingId", uploadDocumentController);
 
// Handle upload
// router.post("/upload-documents/:bookingId",requireSignIn, uploadDocumentController);
router.get("/generatePnrFlight",requireSignIn, generatePnrFlightController);
 
// details-pnr-flight
router.patch("/update-provider/:flightId",requireSignIn, updateProviderController);
router.patch("/update-bid-status/:flightId",requireSignIn, updateBidStatusController);
router.patch("/update-itinerary-details/:flightId",requireSignIn, updateItineraryController);
router.patch("/update-price-details/:flightId",requireSignIn, updatePriceController);
router.patch("/update-charging-details/:flightId",requireSignIn, updateChargingController);
router.patch("/update-passenger-details/:flightId",requireSignIn, updatePassengerController);
router.patch("/update-billing-details/:flightId",requireSignIn, updateBillingController);
router.patch("/update-billing-details2/:flightId",requireSignIn, updateBillingController2);
router.patch("/update-refund-details/:flightId",requireSignIn, updateRefundController);
router.patch("/update-cancellation-refund-details/:flightId",requireSignIn, updateCancellationRefundController);
router.patch("/update-futureCredit-details/:flightId", requireSignIn, updateFutureCreditController);
router.patch("/update-ticketIssue-details/:flightId", requireSignIn, updateTicketIssueController);
router.patch(
  "/update-chargeBack-details/:flightId",requireSignIn,
  updateChargeBackController
);
router.get(
  "/update-send-mail-invoice-details/:flightId",requireSignIn,
  updateSendMailInvoiceController
);
// router.get(
//   "/update-send-auth-mail-invoice-details/:flightId",
//   updateSendMailAuthInvoiceController
// );
router.get("/get-ctm-pnr" ,getCtmFlightPnr);
 
// provider routes
 
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
  "/create-provider",requireSignIn,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "providerImages" },
  ]),
  createProvider
);
  // router.post("/create-provider", createProvider)
  router.get("/get-provider", getProvider);
router.delete("/delete-provider/:flightId",requireSignIn, deleteProvider);
router.put("/update-provider/:flightId",requireSignIn, updateProvider);
 
//airline routes
router.post(
  "/create-ctmAirline",requireSignIn,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "ctmAirlineImages" },
  ]),
  createCtmProivderController
)
router.get("/get-ctmAirline", getAirlineController);
router.delete("/delete-ctmAirline/:flightId",requireSignIn, deleteAirlineContrller);
router.put("/update-ctmAirline/:flightId",requireSignIn, updateCtmAirlineController);
 
router.patch("/update-segments/:id",requireSignIn, updateCtmSegmentController)
router.post("/filter-charge-refunds", filterChargeRefundsController);

 
export default router;