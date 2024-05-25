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
exports.postVideosRepo = void 0;
const stream_user_1 = require("../../presentation/Grpc/stream_user");
const posts_1 = require("../Models/posts");
const videos_1 = require("../Models/videos");
class postVideosRepositary {
    uploadPostRepo(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_1.PostModel.insertMany(Data);
        });
    }
    findChannelNameUsingId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, stream_user_1.GetChannelNameFunction)(userId);
        });
    }
    postVideosRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_1.PostModel.find({ userId });
        });
    }
    deletePostRepo(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield posts_1.PostModel.findByIdAndDelete(postID);
            return null;
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_1.PostModel.find();
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield posts_1.PostModel.findById(postId);
                if (post) {
                    if (!post.likesArray.includes(userId)) {
                        post.likesArray.push(userId);
                        post.likes = (parseInt(post.likes) + 1).toString();
                        yield post.save();
                    }
                    else {
                        post.likesArray.splice(post.likesArray.indexOf(userId), 1);
                        post.likes = (parseInt(post.likes) - 1).toString();
                        yield post.save();
                    }
                }
                return null;
            }
            catch (error) {
                console.error("Error liking post:", error);
                throw error;
            }
        });
    }
    getPostFromUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield posts_1.PostModel.find({ userId });
            return { status: true, message: "success", data };
        });
    }
    getUserVideos(userId, shorts) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({ userId, shorts: shorts });
            return { status: true, message: "success", data };
        });
    }
    getAllVideos(isShorts) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({ shorts: isShorts });
            return { status: true, message: "success", data };
        });
    }
    getVideosWithId(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield videos_1.VideoModel.findById(videoId) };
        });
    }
    getMostWatchedVideoUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({ userId, shorts: false });
            data.sort((a, b) => Number(b.Views) - Number((a.Views)));
            if (data.length > 8) {
                data.splice(0, 7);
            }
            return { status: true, message: "success", data };
        });
    }
    getPremiumVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield videos_1.VideoModel.find({ shorts: false, Premium: true }) };
        });
    }
    searchVideosAndProfile(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({
                $or: [
                    { Title: { $regex: search, $options: 'i' } },
                    { Description: { $regex: search, $options: 'i' } }
                ]
            });
            const profile = JSON.parse((yield (0, stream_user_1.searchProfileGRPC)(search)).data);
            return { status: true, message: "success", data: [data, profile] };
        });
    }
}
exports.postVideosRepo = new postVideosRepositary();
