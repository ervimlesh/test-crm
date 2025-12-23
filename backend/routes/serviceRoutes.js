import express from "express";
import { createMailController, deleteMailController, getMailsController, updateMailController } from "../controllers/serviceController.js";


const router = express.Router();

router.post("/create-auth-mails", createMailController);
router.get("/get-auth-mails", getMailsController);
router.put("/update-auth-mails/:mailId", updateMailController);
router.delete("/delete-auth-mails/:mailId", deleteMailController);


export default router;
