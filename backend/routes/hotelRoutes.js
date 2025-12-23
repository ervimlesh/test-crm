import express from "express";
import { getHotelController, getHotelStatusController } from "../controllers/hotelController.js";

const  router = express.Router();

router.get("/get-hotels", getHotelController);
router.patch("/status/:id", getHotelStatusController);

export default router