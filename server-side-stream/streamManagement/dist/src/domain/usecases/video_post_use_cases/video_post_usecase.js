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
exports.videoPost = void 0;
const cloudinary_1 = require("../../../data/Adapters/cloudinary");
const post_videos_Repositary_1 = require("../../../data/Repositary/post_videos_Repositary");
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const stream_user_1 = require("../../../presentation/Grpc/stream_user");
const videos_1 = require("../../../data/Models/videos");
class videoPostUseCase {
    uploadPost(Data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, cloudinary_1.uploadImage)(Data.files.PostImage[0], "avstreamPosts");
                const channelName = yield post_videos_Repositary_1.postVideosRepo.findChannelNameUsingId(user.id);
                console.log(channelName, "we got channelName");
                const sendData = {
                    Title: Data.fields.Title[0],
                    Description: Data.fields.Description[0],
                    postLink: data.url,
                    userId: user.id,
                    channelName,
                    Time: new Date().toString(),
                    likes: "0",
                    dislikes: "0"
                };
                const insertedData = yield post_videos_Repositary_1.postVideosRepo.uploadPostRepo(sendData);
                return insertedData ? { status: true, message: "successfully uploaded post" } : { status: false, message: "database not available" };
            }
            catch (error) {
                return { status: false, message: "error occured when uploading post" };
            }
        });
    }
    getAllpostOfUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, userauthenticationforavstreams_1.getDataFromToken)((0, userauthenticationforavstreams_1.getTokenFromRequest)(req) || "");
                const posts = yield post_videos_Repositary_1.postVideosRepo.postVideosRepo(data.id);
                return { status: true, message: "success", data: posts };
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error" };
            }
        });
    }
    deletePostUseCase(link, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageId = (0, cloudinary_1.getPublicIdFromUrlCloudinary)(link);
                yield (0, cloudinary_1.deleteImageFromCloudinary)(imageId + "");
                yield post_videos_Repositary_1.postVideosRepo.deletePostRepo(postId);
                return { status: true, message: "success" };
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error" };
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = JSON.parse(JSON.stringify(yield post_videos_Repositary_1.postVideosRepo.getAllPosts()));
                for (const item of posts) {
                    const profileLink = yield (0, stream_user_1.getProfileLink)(item.userId);
                    item.profileLink = profileLink;
                    item.clicked = false;
                    item.Comments = [];
                }
                return { status: true, message: "success", data: posts };
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error" };
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield post_videos_Repositary_1.postVideosRepo.likePost(postId, userId);
                return { status: true, message: "success" };
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error" };
            }
        });
    }
    getPostFromUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.getPostFromUser(userId);
        });
    }
    uploadVideo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const thumbnail = req.body.files.thumbnail[0];
                const videoData = JSON.parse((_a = req.body.fields) === null || _a === void 0 ? void 0 : _a.videoData[0]);
                const { url } = yield (0, cloudinary_1.uploadImage)(thumbnail, 'avstreamThumbnail');
                delete videoData._id;
                videoData.Thumbnail = url;
                videoData.likesArray = [];
                videoData.likes = "0";
                videoData.dislikes = "0";
                videoData.Time = new Date().toString();
                yield videos_1.VideoModel.insertMany(videoData);
                return yield (0, stream_user_1.uploadVideoGRPC)({
                    userId: videoData.userId,
                    Link: videoData.Link,
                    Thumbnail: videoData.Thumbnail,
                    shorts: videoData.shorts
                });
            }
            catch (error) {
                console.log(error);
                return { status: false, message: error.message };
            }
        });
    }
    getUserVideos(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, userauthenticationforavstreams_1.getDataFromToken)((0, userauthenticationforavstreams_1.getTokenFromRequest)(req) || "");
                const val = JSON.parse(req.query.query).shorts;
                return yield post_videos_Repositary_1.postVideosRepo.getUserVideos(data.id, val === "false" ? false : true);
            }
            catch (error) {
                console.log(error);
                return { status: false, message: error.message };
            }
        });
    }
    getAllVideos(shorts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_videos_Repositary_1.postVideosRepo.getAllVideos(shorts);
            }
            catch (error) {
                console.log(error);
                return { status: false, message: "error occured" };
            }
        });
    }
    getVideosWithId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videoId = JSON.parse(req.query.query).videoId;
                return yield post_videos_Repositary_1.postVideosRepo.getVideosWithId(videoId);
            }
            catch (error) {
                console.log(error);
                return { status: false, message: "error occured" };
            }
        });
    }
    getMostWatchedVideoUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return post_videos_Repositary_1.postVideosRepo.getMostWatchedVideoUser(userId);
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "failed" };
            }
        });
    }
    getPremiumVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return post_videos_Repositary_1.postVideosRepo.getPremiumVideos();
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "failed" };
            }
        });
    }
    searchVideosAndProfile(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return post_videos_Repositary_1.postVideosRepo.searchVideosAndProfile(search);
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "failed" };
            }
        });
    }
    addReportSubmit(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return post_videos_Repositary_1.postVideosRepo.addReportSubmit(Data);
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "failed" };
            }
        });
    }
    getReportsBySection(section) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return post_videos_Repositary_1.postVideosRepo.getReportsBySection(section);
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "failed" };
            }
        });
    }
    getBlockedVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.getBlockedVideos();
        });
    }
    blockContentVisiblity(LinkId, Section, reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.blockContentVisiblity(LinkId, Section, reportId);
        });
    }
    changeVisiblityContent(LinkId, Section) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.changeVisiblityContent(LinkId, Section);
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.getCategory();
        });
    }
    blockcategory(cateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.blockcategory(cateId);
        });
    }
    addCategory(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_videos_Repositary_1.postVideosRepo.addCategory(Object.assign(Object.assign({}, Data), { videosCount: [], postCount: [], Display: true }));
        });
    }
    getPostDongnutData(userCount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const postLength = ((_a = (yield post_videos_Repositary_1.postVideosRepo.getAllPosts())) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const data = {
                completeText: "users with post",
                remainingText: "users who don't have post",
                completedPercentage: Math.floor((postLength * 100) / userCount),
                get remainingPercentage() { return 100 - this.completedPercentage; }
            };
            return { status: true, message: "success", data };
        });
    }
}
exports.videoPost = new videoPostUseCase();
