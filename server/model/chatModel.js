import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true
    },
    room: {
      type: String,
      default: "general"
    },
    isAI: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
