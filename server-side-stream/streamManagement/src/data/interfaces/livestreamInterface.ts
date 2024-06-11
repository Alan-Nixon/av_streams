import { Document, Types } from 'mongoose'


export interface ILive extends Document {
    _id:Types.ObjectId | string
    Title: String
    Description: String
    Thumbnail: String
    Uuid: String
}