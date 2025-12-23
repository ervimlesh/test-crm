import ctmFlightModel from "../models/ctmFlightModel.js";
import flightModel from "../models/flightModel.js";
import hotelModel from "../models/hotelModel.js";
import percentageModel from "../models/percentageModel.js";
import User from "../models/User.js";
import moment from "moment";
import nodemailer from "nodemailer";
import twilio from "twilio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

// Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD
//   },
// });
const adminEmailMapping = {
  webUrl1: {
    email: "vimleshkumarvimlesh63@gmail.com",
    password: "sinv xric rxoq mxju",
  },
  webUrl2: {
    email: "crmastrivionventures@gmail.com",
    password: "ojup bbup gglc hahq",
  },
  // "webUrl3": {
  //   email: "admin3@gmail.com",
  //   password: "app_password_3",
  // },
};

export const getFlightController = async (req, res) => {
  try {
    const { startDate, endDate, bookingId } = req.query;

    let filter = {};

    // Filter by date range
    if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) }; // Convert to Date object
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = {
        ...filter.createdAt,
        $lte: endOfDay,
      };
    }

    // Filter by booking ID
    if (bookingId) {
      filter.bookingId = bookingId;
    }

    const flightData = await flightModel.find(filter).sort({ createdAt: -1 });

    if (flightData.length === 0) {
      return res
        .status(404)
        .send({ message: "No flight data found for the given filters." });
    }

    res.status(200).send({
      success: true,
      message: "Flight data fetched successfully",
      data: flightData,
      totalCount: flightData.length,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching flight data." });
  }
};

export const getAllAgentController = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" });
    // const agents = await User.find({ role: 'agent' }).populate('flights');
    res.status(200).send({
      success: true,
      message: "Agents fetched successfully",
      data: agents,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching agents",
      error: error.message,
    });
  }
};

export const updateFlightStatusController = async (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;

  try {
    const flight = await flightModel.findByIdAndUpdate(
      id,
      { status, approvedBy },
      { new: true }
    );
    if (!flight) {
      return res
        .status(404)
        .json({ success: true, message: "Flight not found" });
    }
    res.status(200).send({
      success: true,
      message: "Flight status updated successfully",
      flight,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating flight status", error: error.message });
  }
};

// BookingMailsController

export const BookingMailsController = async (req, res) => {
  try {
    const ctmFlightMails = await ctmFlightModel
      .find({})
      .populate("agent", "userName");
    // console.log("ctmFlightMails", ctmFlightMails);

    res.status(200).send({
      success: true,
      message: "Booking mails fetched successfully",
      ctmFlightMails,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching booking mails",
      error: error.message,
    });
  }
};

// export const BookingMailsController = async (req, res) => {
//   try {
//     const flightMails = await flightModel.aggregate([
//       {
//         $project: {
//           email: 1,
//           mobile: 1,
//           webUrl: 1,
//           webMail: 1,
//           _id: 0,
//           type: { $literal: "Flight" },
//         },
//       },
//     ]);

//     const hotelMails = await hotelModel.aggregate([
//       {
//         $project: {
//           email: 1,
//           mobile: 1,
//           webUrl: 1,
//           webMail: 1,
//           _id: 0,
//           type: { $literal: "Hotel" },
//         },
//       },
//     ]);

//     // Combine results
//     const combinedData = [...flightMails, ...hotelMails];

//     res.status(200).send({
//       success: true,
//       message: "Booking mails fetched successfully",
//       combinedData,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error fetching booking mails",
//       error: error.message,
//     });
//   }
// };

// export const webUrlController = async (req, res) => {
//   try {
//     const { webUrl, webMail } = req.body;

//     // Find adminConfig by webMail
//     const adminConfig = Object.values(adminEmailMapping).find(
//       (config) => config.email === webMail
//     );

//     if (!adminConfig) {
//       return res.status(400).send({
//         success: false,
//         message: `Invalid webMail: ${webMail}. No matching configuration found.`,
//       });
//     }

//     // Create transporter with the specific admin email
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: adminConfig.email,
//         pass: adminConfig.password,
//       },
//     });

//     // Fetch flights and hotels
//     const flights = await flightModel.find({ webUrl });
//     const hotels = await hotelModel.find({ webUrl });

//     const emailSet = new Set();
//     flights.forEach((flight) => emailSet.add(flight.email));
//     hotels.forEach((hotel) => emailSet.add(hotel.email));

//     // Prepare email promises
//     const emailPromises = Array.from(emailSet).map(async (email) => {
//       const userFlights = flights.filter((flight) => flight.email === email);

//       const userHotels = hotels.filter((hotel) => hotel.email === email);

//       let emailContent = `Hello,\n\nHere are your booked deals:\n\n`;

//       if (userFlights.length) {
//         emailContent += `Flights:\n`;
//         userFlights.forEach((flight) => {
//           emailContent += `  - Flight Booking Details\n`;
//         });
//       } else {
//         emailContent += `No flights booked yet.\n`;
//       }

//       if (userHotels.length) {
//         emailContent += `\nHotels:\n`;
//         userHotels.forEach((hotel) => {
//           emailContent += `  - Hotel Booking Details\n`;
//         });
//       } else {
//         emailContent += `\nNo hotels booked yet.\n`;
//       }

//       emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

//       const mailOptions = {
//         from: adminConfig.email,
//         to: email,
//         subject: 'Update on Your Booked Deals',
//         text: emailContent,
//       };

//       return transporter.sendMail(mailOptions);
//     });

//     // Execute all email promises concurrently
//     await Promise.all(emailPromises);

//     res.status(200).send({
//       success: true,
//       message: "Emails sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in flight webUrlController",
//       error: error.message,
//     });
//   }
// };

export const webUrlController = async (req, res) => {
  try {
    console.log("webUrlController called", req.body);

    const { webUrl, webMail, fromDate, toDate, provider } = req.body;

   
    const adminConfig = Object.values(adminEmailMapping).find(
      (config) => config.email === webMail
    );

    if (!adminConfig) {
      return res.status(400).send({
        success: false,
        message: `Invalid webMail: ${webMail}. No matching configuration found.`,
      });
    }

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminConfig.email,
        pass: adminConfig.password,
      },
    });

    
    const flightFilter = { webUrl };
    const isAllFiltersFilled = fromDate && toDate && provider;

    if (isAllFiltersFilled) {
      console.log("its calling");

      const from = new Date(fromDate);
      const to = new Date(toDate);

    
      from.setHours(0, 0, 0, 0);y
      to.setHours(23, 59, 59, 999); 

      flightFilter.createdAt = { $gte: from, $lte: to };
      flightFilter["provider.provider"] = { $regex: provider, $options: "i" };
    }

    console.log("flightFilter:", flightFilter);

    //  Fetch filtered or all flights
    const flights = await ctmFlightModel
      .find(flightFilter)
      .populate("provider", "provider providerStatus");

    console.log(
      `✈️ Flights Found: ${flights.length} | Filters Applied: ${isAllFiltersFilled}`
    );

    if (!flights.length) {
      return res.status(404).send({
        success: false,
        message: "No flights found for the given criteria",
      });
    }

    //  Map user emails to flight details
    const userDetailsMap = new Map();

    flights.forEach((flight) => {
      if (!userDetailsMap.has(flight.email)) {
        userDetailsMap.set(flight.email, {
          mobile: flight.mobile,
          flights: [],
        });
      }
      userDetailsMap.get(flight.email).flights.push(flight);
    });

    //  Prepare email promises
    const emailPromises = [];

    userDetailsMap.forEach((details, email) => {
      const { flights } = details;

      let emailContent = `Hello,\n\nHere are your booked flight deals:\n\n`;

      if (flights.length) {
        flights.forEach((flight, index) => {
          emailContent += `  ✈️ Flight ${index + 1}:\n`;
          emailContent += `    Booking ID: ${flight.bookingId || "N/A"}\n`;
          emailContent += `    Passenger(s): ${flight.passengers || 0}\n`;
          emailContent += `    Provider: ${
            flight.provider?.provider || "Unknown"
          }\n`;
          emailContent += `    Date: ${new Date(
            flight.createdAt
          ).toLocaleString()}\n\n`;
        });
      } else {
        emailContent += `No flights booked yet.\n`;
      }

      emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

      const mailOptions = {
        from: adminConfig.email,
        to: email,
        subject: "Update on Your Booked Flights",
        text: emailContent,
      };

      emailPromises.push(transporter.sendMail(mailOptions));
    });

    //  Execute all email promises concurrently
    await Promise.all(emailPromises);

    res.status(200).send({
      success: true,
      message: `Emails sent successfully ${
        isAllFiltersFilled ? "(filtered)" : "(all data)"
      }`,
    });
  } catch (error) {
    console.error("❌ webUrlController Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in flight webUrlController",
      error: error.message,
    });
  }
};
export const getTravelowaysController = async (req, res) => {
  try {
    const data = await flightModel.find({ webUrl: "traveloways.com" });

    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong in get traveloways controller ",
      error,
    });
  }
};

export const getFareswayController = async (req, res) => {
  try {
    const data = await flightModel.find({ webUrl: "faresway.com" });

    res.status(200).send({
      success: true,
      message: "data fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error in getFaresWaysController",
        error,
      });
  }
};

export const reductionPercentageController = async (req, res) => {
  try {
    const { reducePercentage, reduceUrl } = req.body;

    // Validate input
    if (!reducePercentage || reducePercentage < 0 || reducePercentage > 100) {
      return res.status(400).send({
        success: false,
        message: "reducePercentage must be between 0 and 100",
      });
    }
    if (!reduceUrl) {
      return res.status(400).send({
        success: false,
        message: "reduceUrl is required",
      });
    }

    // Create or update the percentage document
    const percentage = await percentageModel.findOneAndUpdate(
      { reduceUrl }, // Match by reduceUrl
      { reducePercentage, reduceUrl }, // Update fields
      { new: true, upsert: true } // Create a new document if it doesn't exist
    );

    res.status(200).send({
      success: true,
      message: `Reduction percentage updated to ${reducePercentage}% for ${reduceUrl}`,
      data: percentage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating reduction percentage",
      error: error.message,
    });
  }
};

export const srcDestRedController = async (req, res) => {
  try {
    const { source, destination, reducePercentage, reduceUrl } = req.body;

    // Check for both direct and vice-versa combinations
    const existing = await percentageModel.findOne({
      $or: [
        { reduceSrc: source, reduceDest: destination, reduceUrl: reduceUrl },
        { reduceSrc: destination, reduceDest: source, reduceUrl: reduceUrl },
      ],
    });

    let data;
    if (existing) {
      // If the existing document is not the same direction, block update
      if (
        existing.reduceSrc !== source ||
        existing.reduceDest !== destination
      ) {
        return res.status(400).send({
          success: false,
          message: "A route with the vice-versa combination already exists.",
        });
      }

      // Update if same direction
      data = await percentageModel.findOneAndUpdate(
        {
          reduceSrc: source,
          reduceDest: destination,
          reduceUrl: reduceUrl,
        },
        {
          $set: {
            reduceSrc: source,
            reduceDest: destination,
            reduceSrcDestPercentage: reducePercentage,
            reduceUrl: reduceUrl,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        message: "Route updated successfully",
        data,
      });
    } else {
      // Insert new document
      data = await new percentageModel({
        reduceSrc: source,
        reduceDest: destination,
        reduceSrcDestPercentage: reducePercentage,
        reduceUrl: reduceUrl,
      }).save();
      return res.status(200).send({
        success: true,
        message: "Route inserted successfully",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const getReductionPercentageController = async (req, res) => {
  try {
    const percentage = await percentageModel.find({});

    if (!percentage) {
      return res.status(404).send({
        success: false,
        message: "No reduction percentage found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Reduction percentage fetched successfully",
      data: percentage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching reduction percentage",
      error: error.message,
    });
  }
};

export const getSingleFlightController = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await ctmFlightModel.findById(id).populate("agent").populate("authMail");

    if (!flight) {
      return res.status(404).send({
        success: false,
        message: "Flight not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Flight fetched successfully",
      data: flight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching flight",
      error: error.message,
    });
  }
};

export const getLocationsController = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required." });
    }

    // Corrected path to the JSON file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, "../helper/airport_data.json");

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, "utf8");

    const flightLocations = JSON.parse(fileContent);

    // Validate if flightLocations is an array
    if (!Array.isArray(flightLocations)) {
      return res
        .status(500)
        .json({ error: "Invalid data format in JSON file." });
    }

    const keywordRegex = new RegExp(`^${keyword}`, "i"); // Matches strings starting with the keyword
    const containsKeywordRegex = new RegExp(`${keyword}`, "i"); // Matches strings containing the keyword

    const startsWithMatches = [];
    const containsMatches = [];

    for (const location of flightLocations) {
      if (keywordRegex.test(location)) {
        // Matches starting from the beginning of the string
        startsWithMatches.push(location);
      } else if (containsKeywordRegex.test(location)) {
        // Matches containing the keyword anywhere
        containsMatches.push(location);
      }
    }

    // Combine results: matches starting with the keyword first, followed by others
    const filteredLocations = [...startsWithMatches, ...containsMatches];
    res.json(filteredLocations);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getDetailsReductionController = async (req, res) => {
  try {
    const data = await percentageModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "Data fetched  Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    {
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
};
export const updateDetailsReductionController = async (req, res) => {
  try {
    const data = await percentageModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Updated Successfully",
      data,
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

export const DeleteSrcDestController = async (req, res) => {
  try {
    const redData = await percentageModel.findById(req.params.id);

    let data;

    if (redData?.reducePercentage) {
      // Set the fields to null
      data = await percentageModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            reduceSrcDestPercentage: null,
            reduceSrc: null,
            reduceDest: null,
          },
        },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Fields cleared successfully",
        data,
      });
    } else {
      // Delete the document
      data = await percentageModel.findByIdAndDelete(req.params.id);

      res.status(200).send({
        success: true,
        message: "Deleted successfully",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const getDetailsReduceReductionController = async (req, res) => {
  try {
    const data = await percentageModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "Data fetched  Successfully",
      data,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateReduceDetailsReductionController = async (req, res) => {
  try {
    const data = await percentageModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Updated Successfully",
      data,
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

export const DeleteReductionReduceController = async (req, res) => {
  try {
    const redData = await percentageModel.findById(req.params.id);

    let data;

    if (redData?.reducePercentage) {
      // Set the fields to null
      data = await percentageModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            reducePercentage: null,
          },
        },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Fields cleared successfully",
        data,
      });
    } else {
      // Delete the document
      data = await percentageModel.findByIdAndDelete(req.params.id);

      res.status(200).send({
        success: true,
        message: "Deleted successfully",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
