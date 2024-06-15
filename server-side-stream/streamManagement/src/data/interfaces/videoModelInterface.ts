import { Document, Types } from 'mongoose'

export interface IVideo extends Document {
    _id: Types.ObjectId | string,
    Title: string,
    Thumbnail: string;
    Description: string,
    Premium: boolean;
    Link: string,
    shorts: boolean,
    Visiblity: boolean,
    channelName: string,
    userId: string,
    likes: string,
    likesArray: string[],
    Views: string,
    dislikes: string,
    Category: string,
    Time: string
}

export interface IReport extends Document {
    channelName: string,
    userId: string,
    Link: string,
    LinkId: string
    Section: string,
    Reason: string,
    Responded: boolean
    Blocked: boolean
}