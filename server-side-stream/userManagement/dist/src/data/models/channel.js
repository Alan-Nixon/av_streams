"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VideoSchema = new mongoose_1.Schema({
    Link: { type: String, required: true },
    Thumbnail: { type: String, required: true },
    shorts: { type: Boolean, required: true }
});
const subscriptionDefault = () => ({
    expires: "",
    section: "",
    userId: "",
    email: "",
    paymentId: "",
    amount: 0
});
const channelSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    channelName: { type: String, required: true },
    profileImage: { type: String, required: true, default: "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg" },
    Followers: { type: [String], default: [], required: true },
    Streams: { type: [VideoSchema], default: [], required: true },
    Videos: { type: [VideoSchema], default: [], required: true },
    Shorts: { type: [VideoSchema], default: [], required: true },
    premiumCustomer: { type: Boolean, default: false, required: true },
    subscription: { type: Object, default: subscriptionDefault, required: true }
});
exports.ChannelModel = mongoose_1.default.model('channel', channelSchema);
