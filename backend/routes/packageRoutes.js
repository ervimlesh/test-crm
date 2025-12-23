import express from 'express';
import { getAllCarQuery, getAllPackageQuery } from '../controllers/packageController.js';

const router = express.Router();

router.get("/get-packages-query", getAllPackageQuery);
router.get("/get-cars-query", getAllCarQuery);


export  default router;