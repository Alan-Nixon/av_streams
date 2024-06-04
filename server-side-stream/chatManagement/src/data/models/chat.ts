import mongoose, { Schema } from "mongoose";
import { IChat, messageArray, messageSchema } from "../interfaces/chatSchema";



const chatSchema: Schema<IChat> = new Schema<IChat>({
    userId: { type: [String], default: [], required: true },
    archived: { type: Boolean, default: false, required: true },
    details: { type: [messageSchema], default: [], required: true }
});



export const ChatModel = mongoose.model<IChat>('chats', chatSchema)