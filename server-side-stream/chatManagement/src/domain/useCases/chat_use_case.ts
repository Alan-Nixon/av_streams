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
            console.log(data);
            
            return { status: true, message: "success", data }
        } catch (error) {
            return this.errorResponse(error)
        }
    }

}

export const chatUseCase: chat_use_case = new chat_use_case()