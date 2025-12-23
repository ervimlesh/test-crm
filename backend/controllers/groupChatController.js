import GroupChatMessage from '../models/GroupChatMessage.js';

// Mark a message as seen by a user
export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) return res.status(400).json({ success: false, error: 'Missing userId' });
    const message = await GroupChatMessage.findById(id);
    if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
    if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
      await message.save();
    }
    res.json({ success: true, seenBy: message.seenBy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get the seenBy list for a message
export const getMessageSeenBy = async (req, res) => {
  try {
   
    const { id } = req.params;
    const message = await GroupChatMessage.findById(id).populate('seenBy', 'userName');
    if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
    res.json({ success: true, seenBy: message.seenBy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getGroupChatHistory = async (req, res) => {
  try {
    const messages = await GroupChatMessage.find({})
      .sort({ timestamp: 1 }).populate("taggedAgent","userName")
      .populate('senderId', 'userName')
      


    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const saveGroupChatMessage = async (msg) => {
  try {


    const {
      _id,
      text,
      senderId,
      senderName,
      taggedAgent,
      timestamp,
      __v
    } = msg;

    // Validate required fields
    if (!text || !senderId || !senderName) {
      throw new Error('Missing required fields');
    }

    // Sanitize taggedAgent: use null if empty string
    const sanitizedTaggedAgent =
      taggedAgent && taggedAgent.trim() !== "" ? taggedAgent : null;

    // Build message object
    const messageData = {
      text,
      senderId,
      senderName,
      timestamp: timestamp || new Date(),
      taggedAgent: sanitizedTaggedAgent
    };

    // Optionally include _id and __v if provided
    if (_id) messageData._id = _id;
    if (__v !== undefined) messageData.__v = __v;

    const message = new GroupChatMessage(messageData);
    await message.save();

    
  } catch (err) {
    console.error('Error saving group chat message:', err);
  }
};
