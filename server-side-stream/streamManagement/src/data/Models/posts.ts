import mongoose, { Schema } from 'mongoose'
import { IPost } from '../interfaces/postModelInterface'


const postSchema: Schema<IPost> = new Schema({
    Title: { type: String },
    Description: { type: String },
    postLink: { type: String },
    userId: { type: String },
    channelName: { type: String },
    likes: { type: String },
    likesArray: { type: [String], default: [] },
    dislikes: { type: String },
    Visiblity: { type: Boolean, default: true },
    Time: { type: String }
})

export const PostModel = mongoose.model('posts', postSchema);


