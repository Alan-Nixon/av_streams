import { IChat, messageArray } from "./chatSchema";


export type chat_repo_interface = {
    getChatOfUser(userId: string): Promise<IChat[] | []>;
    addChat(message: messageArray): Promise<any>;
}