import mongoose, { Schema } from "mongoose";
import { IChat } from "../interfaces/chatSchema";

const chatSchema: Schema<IChat> = new Schema<IChat>({
    userId: { type: [String], default: [], required: true },
    archived: { type: Boolean, default: false, required: true },
    details: { type: [String], default: [], required: true }
})

export const Chat = mongoose.model<IChat>('chats',chatSchema)