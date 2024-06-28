import { IChat, messageArray } from "./chatSchema";

export type responseInterface = {
    status: boolean,
    message: string,
    data?: any
}


export type chat_repo_interface = {
    getChatOfUser(userId: string): Promise<IChat[] | []>;
    addChat(message: messageArray): Promise<any>;
    setAllMessageSeen(userId: string, personId: string): Promise<responseInterface>;
}