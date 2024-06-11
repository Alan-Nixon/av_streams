"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveModel = void 0;
const mongoose_1 = require("mongoose");
const liveSchema = new mongoose_1.Schema({
    Title: { type: String },
    Description: { type: String },
    Thumbnail: { type: String },
    Uuid: { type: String }
});
exports.LiveModel = (0, mongoose_1.model)('live', liveSchema);
