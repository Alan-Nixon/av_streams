import { IChat } from "./chatSchema";


export type chat_repo_interface = {
    getChatOfUser(userId: string): Promise<IChat[] | []>;
}