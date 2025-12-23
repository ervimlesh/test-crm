import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'employee' },
  penalties: { type: Number, default: 0 }
});

export default mongoose.model('Employee', employeeSchema);
