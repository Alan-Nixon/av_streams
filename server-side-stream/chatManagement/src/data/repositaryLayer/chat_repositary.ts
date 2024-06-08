import { IChat, messageArray } from "../interfaces/chatSchema";
import { chat_repo_interface } from "../interfaces/repositaryInterface";
import { ChatModel } from "../models/chat";


class chat_repositary_layer implements chat_repo_interface {

    async getChatOfUser(userId: string) {
        try {
            return await ChatModel.find({ userId })
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async addChat(message: messageArray) {
        try {
            const chat = await ChatModel.findOne({ userId: { $all: [message.sender, message.to] } })
            if (chat) {
                chat.details.push(message)
                await chat.save()
            } else {
                await ChatModel.insertMany({
                    userId: [message.sender, message.to],
                    archived: false,
                    details: [message]
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

}


export const chatRepoLayer: chat_repo_interface = new chat_repositary_layer()