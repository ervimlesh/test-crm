import businessModel from "../models/businessModel.js";
import flightModel from "../models/flightModel.js";


export const BusinessQueryController = async (req, res) => {
    try {
        const businessQuery = await businessModel.find({}).sort({ createdAt: -1 });
        
        res.status(200).send({
            success: true,
            message: 'Business queries fetched successfully',
            businessQuery,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error fetching business queries',
            error: error.message,
        });
    }
}

export const BusinessDealsController = async (req, res) => {
    try {

        const businessDeals = await flightModel.find({ webUrl: "businessclassflyers.com" })
      

        res.status(200).send({
            success:true,
            message:"Business Deals fetched Successfully",
            businessDeals,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in fetching business deals",
            error: error.message,
        })
    }
}