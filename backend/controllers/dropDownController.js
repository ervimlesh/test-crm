import dropDownModel from "../models/dropDownModel.js";

// Create new dropdown item
export const createDropdownController = async (req, res) => {
  try {
   
    const { type, label, value } = req.body;

    const exists = await dropDownModel.findOne({ type, value });
    if (exists) {
      return res
        .status(200)
        .send({ success: false, message: "Dropdown item already exists" });
    }

    const newDropdown = new dropDownModel({ type, label, value });
    await newDropdown.save();
    res.status(200).send({
      success: true,
      message: "dropwon added successfully",
      newDropdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dropdowns by type
export const getDropdownsByTypeController = async (req, res) => {
  try {
   
    const { type } = req.query;
    const items = await dropDownModel.find({ type }).sort("label");

   
    res.status(200).send({
      successs: true,
      message: "drowpdown data is fetched successfully",
      items,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const UpdateDropDownController = async (req, res) => {
  try {
    const { label, value } = req.body;
    const updated = await dropDownModel.findByIdAndUpdate(
      req.params.id,
      { label, value },
      { new: true }
    );
    res.status(200).send({
      success: "true",
      message: "message updated successfully",
      updated,
    });
  } catch (err) {
    res.status(500).send({
      success: "false",
      message: "something went wrong ",
      error,
    });
  }
};

export const DeleteDropDownController = async (req, res) => {
  try {
    await dropDownModel.findByIdAndDelete(req.params.id);
    
    res.status(200).send({
      success: "true",
      message: "message  deleted successfully",
      
    });
  } catch (err) {
    res.status(500).send({
      success: "false",
      message: "something went wrong ",
      err,
    });
  }
};
