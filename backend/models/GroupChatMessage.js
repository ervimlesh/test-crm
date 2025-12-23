import mongoose from 'mongoose';


const groupChatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  taggedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timestamp: { type: Date, default: Date.now },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of users who have seen this message
});

export default mongoose.model('GroupChatMessage', groupChatMessageSchema);