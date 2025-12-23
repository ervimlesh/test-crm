import carModel from "../models/carModel.js";
import packageModel from "../models/packageModel.js";


export const packageQueryController = async (req, res) => {
    const { formData } = req.body;
    const { packages, userName, email, phone, message } = formData;
    console.log(packages, userName, email, phone, message);

    try {
        if (!packages) {
            return res.send({ success: false, message: "Enter Packages Name !" });
        }
        if (!userName) {
            return res.send({ success: false, message: "Username required !" });
        }
        if (!email) {
            return res.send({ success: false, message: "Email is required." });
        }
        if (!phone) {
            return res.send({ success: false, message: "Please enter a valid phone number !" });
        }

        const packageQuery = new packageModel({
            packages,
            userName,
            email,
            phone,
            message
        })
        await packageQuery.save();


        return res.status(200).send({ success: true, message: "Package query submitted successfully." });
    } catch (error) {
        console.error("Error processing package query:", error);
        return res.status(500).json({ success: false, message: "An error occurred while processing your request." });
    }
};

export const getAllPackageQuery = async (req, res) => {
    try {
        const packageQuery = await packageModel.find({});
        console.log(packageQuery);
        return res.status(200).send({ success: true,  packageQuery, message: "All package queries" });

    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting package queries",
            error: error.message


        })
    }
}

export const getAllCarQuery = async (req, res) => {
    try {
        const packageQuery = await  carModel.find({});
        console.log(packageQuery);
        return res.status(200).send({ success: true,  packageQuery, message: "All package queries" });

    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting package queries",
            error: error.message


        })
    }
}