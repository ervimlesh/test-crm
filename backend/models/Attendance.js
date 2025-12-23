import mongoose from "mongoose";

// Single work session schema
const sessionSchema = new mongoose.Schema({
  in: { type: String, default: null },
  out: { type: String, default: null },
  duration: { type: Number, default: 0 } // in seconds
});

// Single break session schema
const breakSessionSchema = new mongoose.Schema({
  in: { type: String, default: null },
  out: { type: String, default: null },
  duration: { type: Number, default: 0 }
});

// **Global history schema**
const punchHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  in: { type: String, default: null },
  out: { type: String, default: null },
  duration: { type: Number, default: 0 }
});

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: { type: Date, default: Date.now },

    // Array of all shift sessions for the day
    sessions: { type: [sessionSchema], default: [] },

    // Total shift duration in seconds
    totalShiftDuration: { type: Number, default: 0 },

    // Arrays for each break type
    teaBreak1: { type: [breakSessionSchema], default: [] },
    lunchBreak: { type: [breakSessionSchema], default: [] },
    teaBreak2: { type: [breakSessionSchema], default: [] },

    // **Overall punch in/out history**
    punchHistory: { type: [punchHistorySchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);

