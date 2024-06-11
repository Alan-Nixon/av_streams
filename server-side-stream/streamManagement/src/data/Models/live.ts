import { Schema,model } from 'mongoose'
import { ILive } from '../interfaces/livestreamInterface'


const liveSchema: Schema<ILive> = new Schema({
    Title: { type: String },
    Description: { type: String },
    Thumbnail: { type: String },
    Uuid: { type: String }
})

export const LiveModel = model('live', liveSchema) 