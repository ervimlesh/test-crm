import mongoose from 'mongoose';

const searchFlightDataSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    rtnDate: {
        type: Date,
        required: true
    },
    trpType: {
        type: String,
        required: true
    },
    adults: {
        type: Number,
        required: true
    },
    children: {
        type: Number,
        required: true
    },
    infants: {
        type: Number,
        required: true
    },
    tpassenger: {
        type: Number,
        required: true
    },
    classType: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userMail: {
        type: String,
        required: true
    },
    userNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('SearchFlightData', searchFlightDataSchema);