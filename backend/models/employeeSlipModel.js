// models/employeeSlipModel.js
import mongoose from "mongoose";

const employeeSlipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
    },
    month: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeSlip", employeeSlipSchema);
