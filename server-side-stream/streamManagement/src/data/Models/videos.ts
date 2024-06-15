
import mongoose, { Schema } from 'mongoose'
import { IVideo } from '../interfaces/videoModelInterface'


const videoSchema: Schema<IVideo> = new Schema({
    Link: { type: String },
    userId: { type: String },
    Title: { type: String },
    Description: { type: String },
    shorts: { type: Boolean, default: false },
    channelName: { type: String },
    Thumbnail: { type: String },
    Visiblity: { type: Boolean, default: true },
    Views: { type: String, default: "0" },
    Premium: { type: Boolean, default: false },
    likes: { type: String },
    likesArray: { type: [String], default: [] },
    dislikes: { type: String, default: "0" },
    Category: { type: String, default: "Gaming" },
    Time: { type: String, default: new Date().toDateString() }
})

export const VideoModel = mongoose.model('videos', videoSchema) 