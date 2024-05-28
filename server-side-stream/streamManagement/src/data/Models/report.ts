import mongoose, { Schema } from 'mongoose';
import { IReport } from '../interfaces/videoModelInterface';


const reportSchema: Schema<IReport> = new Schema({
    channelName: { type: String, default: "" },
    userId: { type: String, default: "" },
    Link: { type: String, default: "" },
    LinkId: { type: String, default: "" },
    Section: { type: String, default: "" },
    Reason: { type: String, default: "" },
    Responded: { type: Boolean, default: false },
    Blocked: { type: Boolean, default: false },
})

export const ReportModel = mongoose.model('reports', reportSchema)