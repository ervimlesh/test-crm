import hotelModel from "../models/hotelModel.js";


export const getHotelController = async (req, res) => {
    try {
      
        //get all flights model data
        const hotelData = await  hotelModel.find({});
         
        res.status(200).send({
            success: true,
            message: 'Hotel data fetched successfully',
            data: hotelData,
            totalCount: hotelData.length,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'An error occurred while fetching hotel data.'});
    }
};

export const getHotelStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the hotel by ID and update its status
        const updatedHotel = await hotelModel.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedHotel) {
            return res.status(404).send({ success: false, message: 'Hotel not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Hotel status updated successfully',
            data: updatedHotel,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'An error occurred while updating hotel status.' });
    }
}