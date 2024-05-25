import { Document, Types } from 'mongoose'

export interface IVideo extends Document {
    _id: Types.ObjectId | string,
    Title: string,
    Thumbnail:string;
    Description: string,
    Premium:boolean;
    Link: string,
    shorts: boolean,
    channelName: string,
    userId: string,
    likes: string,
    likesArray: string[],
    Views:string,
    dislikes: string,
    Time: string
}