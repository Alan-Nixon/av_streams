import { Document, Types } from 'mongoose'

export interface IPost extends Document {
    _id: Types.ObjectId | string,
    Title: string,
    Description:string,
    postLink:string,
    channelName:string,
    userId:string,
    likes:string,
    Visiblity:boolean,
    likesArray:string[],
    dislikes:string,
    Time:string
}

