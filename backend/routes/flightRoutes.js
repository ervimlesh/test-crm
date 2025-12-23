import express from "express";
import {
  BookingMailsController,
  DeleteReductionReduceController,
  DeleteSrcDestController,
  getDetailsReduceReductionController,
  getDetailsReductionController,
  getFareswayController,
  getFlightController,
  getLocationsController,
  getReductionPercentageController,
  getSingleFlightController,
  getTravelowaysController,
  reductionPercentageController,
  srcDestRedController,
  updateDetailsReductionController,
  updateFlightStatusController,
  updateReduceDetailsReductionController,
  webUrlController,
} from "../controllers/flightController.js";

const router = express.Router();

router.get("/get-flight", getFlightController);
router.patch("/status/:id", updateFlightStatusController);
router.get("/get-booking-mails", BookingMailsController);
router.post("/webUrl", webUrlController);
router.get("/traveloways-booking", getTravelowaysController);
router.get("/faresway-booking", getFareswayController);
router.patch("/reduction-percentage", reductionPercentageController);
router.get("/get-reduction-percentage", getReductionPercentageController);
router.get("/get-single-flight/:id", getSingleFlightController);
router.get("/locations", getLocationsController);
router.patch("/reduction-percentage-srcDest",srcDestRedController)
router.get("/details-reduction-percentage/:id", getDetailsReductionController)
router.patch("/reduction-percentage-srcDest-update/:id",updateDetailsReductionController)
router.get("/detail-reduce-reduction-percentage/:id",getDetailsReduceReductionController)
router.patch("/reduce-reduction-percentage-srcDest-update/:id",updateReduceDetailsReductionController)
router.delete("/delete-reduce-reduction/:id",DeleteReductionReduceController)
router.delete("/delete-src-dest/:id",DeleteSrcDestController)

export default router;
