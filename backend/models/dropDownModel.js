
import mongoose from 'mongoose';

const dropdownSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['airlines', 'class', 'currency', 'gender', 'passengerType', 'cardType']
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { timestamps: true });

const dropDownModel = mongoose.model('Dropdown', dropdownSchema);
export default dropDownModel;
