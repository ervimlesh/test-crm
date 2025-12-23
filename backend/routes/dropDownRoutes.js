// routes/dropdownRoutes.js
import express from 'express';
import { createDropdownController, DeleteDropDownController, getDropdownsByTypeController, UpdateDropDownController } from '../controllers/dropDownController.js';

const router = express.Router();

router.post('/add-dropdown', createDropdownController);
router.get('/get-dropdown', getDropdownsByTypeController);
// PUT /api/v1/dropdown/update-dropdown/:id
router.put('/update-dropdown/:id', UpdateDropDownController);

// DELETE /api/v1/dropdown/delete-dropdown/:id
router.delete('/delete-dropdown/:id', DeleteDropDownController);



export default router;
