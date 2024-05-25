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
exports.findImageByPublicId = exports.deleteImageFromCloudinary = exports.getPublicIdFromUrlCloudinary = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (imageData, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const { filepath } = imageData;
    try {
        return yield cloudinary_1.v2.uploader.upload(filepath, {
            resource_type: "auto",
            folder
        });
    }
    catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
});
exports.uploadImage = uploadImage;
const getPublicIdFromUrlCloudinary = (imageUrl) => {
    var _a;
    try {
        return (_a = imageUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
    }
    catch (error) {
        console.error('Error getting public ID:', error);
        return null;
    }
};
exports.getPublicIdFromUrlCloudinary = getPublicIdFromUrlCloudinary;
const deleteImageFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("publicId : ", publicId);
        return yield cloudinary_1.v2.uploader.destroy('avstreamPosts/' + publicId);
    }
    catch (error) {
        console.error('Error deleting image:', error);
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const findImageByPublicId = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield cloudinary_1.v2.api.resources({
            type: 'upload',
            public_id: publicId
        });
        return res;
    }
    catch (error) {
        console.error(error);
    }
});
exports.findImageByPublicId = findImageByPublicId;
