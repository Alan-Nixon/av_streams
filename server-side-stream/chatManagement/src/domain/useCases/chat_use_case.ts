import { uploadAudio } from "../../data/adapters/cloudinary";
import { messageArray } from "../../data/interfaces/chatSchema";
import { chatRepoLayer } from "../../data/repositaryLayer/chat_repositary";
import { chat_use_case_interface } from "../interfaces/chat_use_case_interface";


class chat_use_case implements chat_use_case_interface {

    errorResponse(error: any) {
        return { status: false, message: error.message ?? "error occured" }
    }

    successResponse(data?: any) {
        return { status: false, message: "success", data }
    }

    async getChatOfUser(userId: string) {
        try {
            const data = await chatRepoLayer.getChatOfUser(userId)
            return { status: true, message: "success", data }
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async saveAudio(message: messageArray, audioBuffer: any) {
        try {
            const { url } = await uploadAudio(audioBuffer[0], "chat_audio")
            message.file.Link = url; message.message = "AUDIO_MESSAGE"
            const data = await chatRepoLayer.addChat(message)
            return { status: true, message: "success", data: message }
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async setAllMessageSeen(userId: string, personId: string) {
        try {
            return await chatRepoLayer.setAllMessageSeen(userId, personId)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

}

export const chatUseCase: chat_use_case_interface = new chat_use_case()