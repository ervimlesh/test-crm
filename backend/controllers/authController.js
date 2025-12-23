import { comparePassword, hashPassword } from "../helper/authHelper.js";
import hotelModel from "../models/hotelModel.js";
import flightModel from "../models/flightModel.js";
import User from "../models/User.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { sendMail } from "../utils/sendMail.js";
import voiceRecordModel from "../models/voiceRecordModel.js";
import fs from "fs/promises";
import authMailModel from "../models/authMailModel.js";
import { sendEvent } from "../kafka/producer.js";

// STEP 1: Send OTP

export const sendForgotOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("your otp is :", otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Save OTP in DB
    user.otp = { value: otp, expiresAt };
    await user.save();

    //  Send email in background (non-blocking)
    sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    //  Respond immediately (<1s)
    res.status(200).send({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// STEP 2: Verify OTP
export const verifyForgotOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (
      !user.otp ||
      user.otp.value !== parseInt(otp) ||
      new Date() > new Date(user.otp.expiresAt)
    ) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid or expired OTP" });
    }

    // Remove OTP after success
    user.otp = null;

    res
      .status(200)
      .send({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// STEP 3: Reset Password
// export const resetForgotPasswordController = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // const salt = await bcrypt.genSalt(10);
//     // user.password = await bcrypt.hash(newPassword, salt);
//     const hashed = await hashPassword(newPassword); //code to in Hash  form
//     await User.findByIdAndUpdate(user._id, { password: hashed });

//     await user?.save();

//     res.json({ success: true, message: "Password reset successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const resetForgotPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // your reset logic

    const user = {}; // after finding and updating the user

    sendEvent("user.events", "PASSWORD_RESET", {
      userId: user._id?.toString(),
      email: user.email,
    }).catch((e) => console.error("Kafka publish failed", e));

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// export const registerController = async (req, res) => {
//   const { userName, email, password, role, number } = req.body;

//   let userPictures = [];
//   const { image } = req.files;

//   if (image && image.length > 0) {
//     userPictures = image.map((file) => {
//       return { img: file.filename };
//     });
//   }

//   if (!image || image === 0) {
//     return res.send({ message: "one image is required" });
//   }

//   let status = "pending";

//   try {
//     //validations
//     if (!userName) {
//       return res.send({ message: "UserName is Required" });
//     }
//     if (!number) {
//       return res.send({ message: "Number  is Required" });
//     }
//     if (!email) {
//       return res.send({ message: "Email is Required" });
//     }
//     if (!password) {
//       return res.send({ message: "Password is Required" });
//     }

//     //check user
//     const existingUser = await User.findOne({ email });

//     console.log("existing user is ", existingUser);

//     if (existingUser) {
//       if (!existingUser.isTrashed) {
//         return res.status(200).send({
//           success: false,
//           message: "Already registered, please login",
//         });
//       } else {
//         await User.deleteOne({ _id: existingUser._id });
//       }
//     }

//     if (role === "") {
//       status = "approved";
//     }

//     //register user
//     const hashedPassword = await hashPassword(password);
//     //save
//     const user = await new User({
//       userName: userName.toLowerCase(),
//       number,
//       email,
//       password: hashedPassword,
//       role,
//       status,
//       userPictures,
//     }).save();

//     res.status(200).send({
//       success: true,
//       message: `${user.role} Registered successfully`,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in registration ",
//       error,
//     });
//   }
// };

export const registerController = async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    // your validation & user creation logic here
    const user = new User({ email, password, userName });
    await user.save();

    // Publish event (non-blocking catch)
    sendEvent("user.events", "USER_REGISTERED", {
      userId: user._id.toString(),
      email: user.email,
      userName: user.userName,
      role: user.role || "user",
    }).catch((e) => console.error("Kafka publish failed", e));

    return res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
};
const otpStore = {}; // Global object to store OTPs with expiration logic

// get-otp-agent
export const getOtpAgentController = async (req, res) => {
  try {
    const otpAgent = await User.find({ role: "agent" }).sort({ created: -1 });

    res.status(200).send({
      success: true,
      message: "otpAgent fetched successfully",
      data: otpAgent,
    });
  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all otpAgent",
      error,
    });
  }
};

// get-otp-all
export const getOtpAllControlller = async (req, res) => {
  try {
    const otpAgent = await User.find().sort({ "otp.expiresAt": -1 });

    res.status(200).send({
      success: true,
      message: "all otp  fetched successfully",
      data: otpAgent,
    });
  } catch (error) {
    console.log(error);
    res.status(5000).send({
      success: false,
      message: "Error in getting all otpAgent",
      error,
    });
  }
};
export const updateAgentOptController = async (req, res) => {
  try {
    const { otpEmail, otpStatus } = req.body;
    // console.log(req.body);
    // console.log(req.params.id);

    if (!otpEmail) {
      return res
        .status(200)
        .send({ success: false, message: "Email is required" });
    }

    const user = await User.findById(req.params.id);
    // console.log(user);

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: `${user.role}  not found` });
    }
    if (otpEmail == !user) {
      return res
        .status(200)
        .send({ success: false, message: "This is Email is not matched " });
    }

    if (user.status !== "approved" && user.status !== "rejectedAgain") {
      return res
        .status(200)
        .send({ success: false, message: `This ${user.role} is not approved` });
    }

    // Generate OTP
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in the database
    // user.otp = { value: otp, expiresAt };
    // console.log('OTP before saving:', user.otp);
    // await user.save();
    // console.log('OTP after saving:', user.otp);

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: otpEmail,
      subject: "Your OTP",
      text: `Your OTP is ${otpStatus}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ success: true, message: "OTP sent to user email" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error generating OTP", error });
  }
};

export const checkRoleController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "This email is not registered" });
    }
    return res.status(200).send({ success: true, role: user.role });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// export const sendOtpController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email) {
//       return res
//         .status(200)
//         .send({ success: false, message: "Email is required" });
//     }
//     if (!password) {
//       return res
//         .status(200)
//         .send({ success: false, message: "password is required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(200)
//         .send({ success: false, message: "Email is not registered" });
//     }

//     if (user.userName.toLowerCase() !== req.body.userName.toLowerCase()) {
//       return res
//         .status(200)
//         .send({ success: false, message: "UserName is not matched" });
//     }
//     // Validate password
//     const match = await comparePassword(password, user.password);
//     if (!match) {
//       return res
//         .status(200)
//         .send({ success: false, message: "Invalid password" });
//     }

//     if (user.status !== "approved" && user.status !== "rejectedAgain") {
//       return res.status(200).send({
//         success: false,
//         message: `This ${user.role} is not approved`,
//         user,
//       });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     console.log("your otp is:", otp);
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

//     // Save OTP in the database
//     user.otp = { value: otp, expiresAt };

//     await user.save();

//     // Nodemailer configuration
//     // const transporter = nodemailer.createTransport({
//     //   service: "gmail",
//     //   auth: {
//     //     user: process.env.EMAIL,
//     //     pass: process.env.PASSWORD,
//     //   },
//     // });
//     // const mailOptions = {
//     //   from: process.env.EMAIL,
//     //   to: [process.env.EMAIL, email],
//     //   subject: "Your OTP",
//     //   text: `${user?.userName} OTP is ${otp}. It is valid for 5 minutes.`,
//     // };

//     // await transporter.sendMail(mailOptions);
//     const adminMail = await authMailModel.findOne({
//       mailStatus: "auth-mail",
//       status: "active",
//     });
//     console.log("adminMail is", adminMail);
//     sendMail(
//       req.body.email,
//       "Your OTP",
//       `Your OTP is ${otp}. It is valid for 5 minutes.`,
//       adminMail
//     );
//     res
//       .status(200)
//       .send({ success: true, message: `OTP sent to the admin email address` });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, message: "Error generating OTP", error });
//   }
// };

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("upcoming body is ", req.body);

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Persist OTP in database if needed
    // Example: await User.updateOne({ email }, { otp: { value: otp, expiresAt } });

    // 1️⃣ Publish to Kafka
    sendEvent("user.events", "OTP_SENT", {
      email,
      otp,
      otpExpiresAt: expiresAt,
    }).catch((e) => console.error("Kafka publish failed", e));

    // 2️⃣ Send email directly
    const adminMail = await authMailModel.findOne({
      mailStatus: "auth-mail",
      status: "active",
    });

    if (adminMail) {
      await sendMail(
        email,
        "Your OTP",
        `Your OTP is ${otp}. It is valid for 5 minutes.`,
        adminMail
      );
    } else {
      console.warn("No active adminMail found, email not sent.");
    }

    // Respond success
    return res.status(200).send({
      success: true,
      message: `OTP sent to the admin email address`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// export const loginController = async (req, res) => {
//   try {
//     const { email, password, otp } = req.body;

//     if (!email || !password) {
//       return res.status(200).send({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(200)
//         .send({ success: false, message: "This email is not registered" });
//     }
//     if (user.userName !== req.body.userName) {
//       return res
//         .status(200)
//         .send({ success: false, message: "This userName is not matched" });
//     }
//     user.isOnline = true;
//     await user.save();

//     // Validate password
//     const match = await comparePassword(password, user.password);
//     if (!match) {
//       return res
//         .status(200)
//         .send({ success: false, message: "Invalid password" });
//     }

//     // If user is not an employee, require and validate OTP
//     if (user.role !== "employee") {
//       if (!otp) {
//         return res.status(200).send({
//           success: false,
//           message: "OTP is required for this user",
//         });
//       }

//       if (
//         !user.otp ||
//         user.otp.value !== parseInt(otp) ||
//         new Date() > new Date(user.otp.expiresAt)
//       ) {
//         return res
//           .status(200)
//           .send({ success: false, message: "Invalid or expired OTP" });
//       }

//       // Clear OTP after successful validation
//       user.otp = null;
//       await user.save();
//     }

//     // Generate JWT token
//     const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "2d",
//     });

//     res.status(200).send({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         userName: user.userName,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, message: "Error logging in", error });
//   }
// };

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Validate password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid password" });
    }

    //     // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // publish
    sendEvent("user.events", "USER_LOGGED_IN", {
      userId: user._id.toString(),
      email: user.email,
      correlationId: req.headers["x-correlation-id"] || null,
    }).catch((e) => console.error("Kafka publish failed", e));

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// export const logoutController = async (req, res) => {
//   try {
//     const agentId = req?.body?.userId ? req?.body?.userId : req.user._id;
//     await User.findByIdAndUpdate(agentId, { isOnline: false });
//     res.status(200).send({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "internal server eror in logout",
//       error,
//     });
//   }
// };

// export const loginController = async (req, res) => {
//   try {
//     const { email, password, otp } = req.body;

//     if (!email || !password || !otp) {
//       return res.status(400).send({
//         success: false,
//         message: "Email, password, and OTP are required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     if (
//       !user.otp ||
//       user.otp.value !== parseInt(otp) ||
//       new Date() > new Date(user.otp.expiresAt)
//     ) {
//       return res
//         .status(200)
//         .send({ success: false, message: "Invalid or expired OTP" });
//     }

//     const match = await comparePassword(password, user.password);

//     if (!match) {
//       return res
//         .status(401)
//         .send({ success: false, message: "Invalid password" });
//     }

//     const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     user.otp = null;
//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         userName: user.userName,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, message: "Error logging in", error });
//   }
// };

// getAllUsersController

export const logoutController = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    // your logout logic (invalidate token etc.)

    sendEvent("user.events", "USER_LOGGED_OUT", {
      userId: userId?.toString(),
    }).catch((e) => console.error("Kafka publish failed", e));

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const roleOrder = ["superadmin", "admin", "agent", "user"]; // Define the role hierarchy
    const getAllusers = await User.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt first
      .then((users) =>
        users.sort(
          (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role) // Custom role sorting
        )
      );

    res.status(200).send({
      success: true,
      message: "Users Data Fetched Successfully",
      getAllusers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all users",
      error,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { status, approvedBy } = req.body;
    console.log("upcmong body 8s ", req.body);

    // Update both status and approvedBy fields
    const result = await User.findByIdAndUpdate(req.params.id, {
      status,
      approvedBy,
    });
    console.log("result is", result);
    res.status(200).send({
      success: true,
      message: "User status and approvedBy updated successfully",
      result: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating status and approvedBy",
      error,
    });
  }
};

// getAllAdminContrller
export const getAllAdminContrller = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// getAllAgentRequestController
export const getAllAgentRequestController = async (req, res) => {
  try {
    const admins = await User.find({ role: "agent" }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};
export const addVoiceDetailController = async (req, res) => {
  try {
    console.log("upcoming body is ", req.body);
    const record = new voiceRecordModel(req.body);
    const saved = await record.save();

    res.status(200).send({
      success: true,
      message: "voice Record successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "inter server error in add vocie controller ",
      error: error.message,
    });
  }
};

export const getAllVoideRecordsController = async (req, res) => {
  try {
    const saved = await voiceRecordModel
      .find()
      .populate("agent")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "voice Record successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Use an App Password
  },
});

// Function to send emails
const sendEmails = async () => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return;
    }

    const flights = await flightModel.find({});

    const hotels = await hotelModel.find({});

    for (const user of users) {
      const userFlights = flights.filter(
        (flight) => flight.email === user.email
      );
      const userHotels = hotels.filter((hotel) => hotel.email === user.email);

      let emailContent = `Hello ${user.userName},\n\nHere are your booked deals:\n\n`;

      if (userFlights.length) {
        emailContent += `Flights:\n`;
        userFlights.forEach((flight) => {
          emailContent += ` - Booking ID: ${flight.bookingId}\n   Status: ${
            flight.status
          }\n   Total Amount: ${flight.totalAmount} ${
            flight.currency
          }\n   Created At: ${new Date(flight.createdAt).toLocaleString()}\n\n`;
        });
      } else {
        emailContent += `No flights booked.\n`;
      }

      if (userHotels.length) {
        emailContent += `\nHotels:\n`;
        userHotels.forEach((hotel) => {
          emailContent += ` - Organization: ${hotel.org}\n   Rooms: ${
            hotel.rooms
          }\n   Status: ${hotel.status}\n   Updated At: ${new Date(
            hotel.updatedAt
          ).toLocaleString()}\n\n`;
        });
      } else {
        emailContent += `\nNo hotels booked.\n`;
      }

      emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Update on Your Booked Deals",
        text: emailContent,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error("Error sending emails:", err);
  }
};

// cron.schedule('*/2 * * * *', () => {
//     console.log('Cron job triggered...');
//     sendEmails().catch(err => console.error('Error in scheduled job:', err));
// });

// Controller
export const moveToTrashController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.isTrashed = true; // Mark the user as trashed

    user.status = "pending";

    await user.save();

    res.status(200).send({
      success: true,
      message: "User moved to Trash successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
export const getProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "User moved to Trash successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const updateRoleController = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.status(200).send({
      success: true,
      updatedUser,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const uploadProfileImageController = async (req, res) => {
  try {
    console.log("upcoming id is", req.user);
    console.log("upcoming image is", req.file);

    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No image file provided",
      });
    }

    const image = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image if exists
    if (user.userPictures && user.userPictures.length > 0) {
      // const oldImagePath = `uploads/${user.userPictures[0].img}`;
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.log("Error deleting old image:", err);
      }
    }

    // Save new image
    const imageName = `${Date.now()}-${image.originalname}`;
    const oldPath = image.path;
    const newPath = `uploads/${imageName}`;
    await fs.rename(oldPath, newPath);

    user.userPictures = [{ img: imageName }];
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile image updated successfully",
      image: imageName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error uploading profile image",
      error,
    });
  }
};

// Delete profile image
export const deleteProfileImageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.userPictures && user.userPictures.length > 0) {
      const imagePath = `uploads/${user.userPictures[0].img}`;
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log("Error deleting image file:", err);
      }
    }

    user.userPictures = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting profile image",
      error,
    });
  }
};
