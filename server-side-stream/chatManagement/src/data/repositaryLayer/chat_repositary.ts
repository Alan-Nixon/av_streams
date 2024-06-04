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

}


export const chatRepoLayer: chat_repo_interface = new chat_repositary_layer()