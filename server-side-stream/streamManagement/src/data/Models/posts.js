"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
var mongoose_1 = require("mongoose");
var postSchema = new mongoose_1.Schema({
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
});
exports.PostModel = mongoose_1.default.model('posts', postSchema);
