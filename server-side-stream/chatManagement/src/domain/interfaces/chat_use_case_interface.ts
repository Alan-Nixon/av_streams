import { messageArray } from "../../data/interfaces/chatSchema";

export type responseInterface = {
    status: boolean,
    message: string,
    data?: any
}

export type chat_use_case_interface = {
    errorResponse(error: any): responseInterface;
    successResponse(data: any): responseInterface;
    getChatOfUser(userId: string): Promise<responseInterface>;
    saveAudio(message: messageArray, audioBuffer: any): Promise<responseInterface>;
    setAllMessageSeen(userId: string, personId: string): Promise<responseInterface>;
}