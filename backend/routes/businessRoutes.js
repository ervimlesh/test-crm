import express from 'express';
import { BusinessDealsController, BusinessQueryController } from '../controllers/businessController.js';


const router = express.Router();

router.get("/get-business-query", BusinessQueryController);
router.get("/get-business-deals", BusinessDealsController)


export default router;