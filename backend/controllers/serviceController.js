import authMailModel from "../models/authMailModel.js";

// Helper Function: Ensure at least one active mail exists per category
const ensureOneActiveMail = async (mailStatus) => {
  const activeCount = await authMailModel.countDocuments({
    mailStatus,
    status: "active",
  });

  // If none active → activate one automatically
  if (activeCount === 0) {
    const anyMail = await authMailModel.findOne({ mailStatus });
    if (anyMail) {
      await authMailModel.findByIdAndUpdate(anyMail._id, { status: "active" });
    }
  }
};

// CREATE AUTH MAIL
export const createMailController = async (req, res) => {
  try {
    const { authMails, authPassword, mailStatus, status } = req.body;

    // If user sets this mail as active → deactivate others in same category
    if (status === "active" && mailStatus) {
      await authMailModel.updateMany(
        { mailStatus, status: "active" },
        { $set: { status: "inactive" } }
      );
    }

    const newMail = await authMailModel.create({
      authMails,
      authPassword,
      mailStatus,
      status,
    });

    // Ensure one mail ACTIVE per category
    await ensureOneActiveMail(mailStatus);

    res.status(200).send({
      success: true,
      message: "Mail added successfully",
      data: newMail,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL AUTH MAILS
export const getMailsController = async (req, res) => {
  try {
    const data = await authMailModel.find({});

    res.status(200).send({
      success: true,
      message: "Fetched Auth Mails successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// DELETE AUTH MAIL
export const deleteMailController = async (req, res) => {
  try {
    const { mailId } = req.params;

    const deletedMail = await authMailModel.findByIdAndDelete(mailId);

    if (!deletedMail) {
      return res.status(404).json({ success: false, message: "Mail not found" });
    }

    // After deletion → ensure one active per group
    await ensureOneActiveMail(deletedMail.mailStatus);

    res.status(200).send({
      success: true,
      message: "Auth Mail deleted successfully",
      data: deletedMail,
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

// UPDATE AUTH MAIL
export const updateMailController = async (req, res) => {
  try {
    const { mailId } = req.params;

    const { mailStatus, status, authMails, authPassword } = req.body;
    console.log("hei guys", req.body);

    const currentMail = await authMailModel.findById(mailId);

    console.log("current mail is",currentMail);

    if (!currentMail) {
      return res.status(404).json({ success: false, message: "Mail not found" });
    }

    const finalMailStatus = mailStatus || currentMail.mailStatus;

    // If admin sets this mail as ACTIVE → deactivate others in this category
    if (status === "active") {
      await authMailModel.updateMany(
        { mailStatus: finalMailStatus, status: "active", _id: { $ne: mailId } },
        { $set: { status: "inactive" } }
      );
    }

    const updatedMail = await authMailModel.findByIdAndUpdate(
      mailId,
      { mailStatus: finalMailStatus, status, authMails, authPassword },
      { new: true }
    );
    console.log("updateMail is",updatedMail);

    // If user deactivated this mail → ensure one active exists in this category
    const data = await ensureOneActiveMail(finalMailStatus);

    console.log("data is",data);

    res.status(200).send({
      success: true,
      message: "Mail updated successfully",
      data: updatedMail,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
