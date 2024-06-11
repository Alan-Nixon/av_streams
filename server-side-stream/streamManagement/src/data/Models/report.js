"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
var mongoose_1 = require("mongoose");
var reportSchema = new mongoose_1.Schema({
    channelName: { type: String, default: "" },
    userId: { type: String, default: "" },
    Link: { type: String, default: "" },
    LinkId: { type: String, default: "" },
    Section: { type: String, default: "" },
    Reason: { type: String, default: "" },
    Responded: { type: Boolean, default: false },
    Blocked: { type: Boolean, default: false },
});
exports.ReportModel = mongoose_1.default.model('reports', reportSchema);
