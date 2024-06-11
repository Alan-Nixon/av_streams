"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModel = void 0;
var mongoose_1 = require("mongoose");
var videoSchema = new mongoose_1.Schema({
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
    Time: { type: String, default: new Date().toDateString() }
});
exports.VideoModel = mongoose_1.default.model('videos', videoSchema);
