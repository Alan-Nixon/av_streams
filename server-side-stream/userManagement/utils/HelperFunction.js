"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.createChannel = void 0;
const cloudinary_1 = require("cloudinary");
const user_random_name_generator_1 = require("user_random_name_generator");
const channel_1 = require("../src/data/models/channel");
const createChannel = (userId, userName, profileImage) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel_1.ChannelModel.insertMany({
        userId, userName,
        channelName: yield (0, user_random_name_generator_1.generateName)(),
        profileImage: profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg"
    });
});
exports.createChannel = createChannel;
const uploadImage = (imageData, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(imageData);
    const { filepath } = imageData;
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        const res = yield cloudinary_1.v2.uploader.upload(filepath, {
            resource_type: "auto",
            folder: folderName,
        });
        return res;
    }
    catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
});
exports.uploadImage = uploadImage;
