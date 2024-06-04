import { Document } from "mongoose"

export interface IChat extends Document {
    userId: string[] | [],
    details: messageArray[] | [],
    archived:boolean
}

type messageArray = {
    to: string,
    time: string,
    sender: string,
    message: string,
    file: {
        fileType: string,
        Link: string,
    },
    seen: boolean
}