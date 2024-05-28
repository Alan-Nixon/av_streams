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
const category_1 = require("../Models/category");
const posts_1 = require("../Models/posts");
const report_1 = require("../Models/report");
const videos_1 = require("../Models/videos");
class postVideosRepositary {
    uploadPostRepo(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_1.PostModel.insertMany(Data);
        });
    }
    returnErrorCatch(message) {
        return { status: false, message: message !== null && message !== void 0 ? message : "error occured" };
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
            const data = yield videos_1.VideoModel.find({ userId, shorts: shorts, Visiblity: true });
            return { status: true, message: "success", data };
        });
    }
    getAllVideos(isShorts) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({ shorts: isShorts, Visiblity: true });
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
            const data = yield videos_1.VideoModel.find({ userId, shorts: false, Visiblity: true });
            data.sort((a, b) => Number(b.Views) - Number((a.Views)));
            if (data.length > 8) {
                data.splice(0, 7);
            }
            return { status: true, message: "success", data };
        });
    }
    getPremiumVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield videos_1.VideoModel.find({ shorts: false, Premium: true, Visiblity: true }) };
        });
    }
    searchVideosAndProfile(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield videos_1.VideoModel.find({
                $or: [
                    { Title: { $regex: search, $options: 'i' } },
                    { Description: { $regex: search, $options: 'i' } }
                ], Visiblity: true
            });
            const profile = JSON.parse((yield (0, stream_user_1.searchProfileGRPC)(search)).data);
            return { status: true, message: "success", data: [data, profile] };
        });
    }
    addReportSubmit(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return { status: true, message: "success", data: yield report_1.ReportModel.insertMany(Data) };
            }
            catch (error) {
                return { status: false, message: (_a = error.messsage) !== null && _a !== void 0 ? _a : "" };
            }
        });
    }
    getReportsBySection(section) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return { status: true, message: "success", data: yield report_1.ReportModel.find({ Section: section }) };
            }
            catch (error) {
                return { status: false, message: (_a = error.messsage) !== null && _a !== void 0 ? _a : "" };
            }
        });
    }
    getBlockedVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield videos_1.VideoModel.find({ Visiblity: false }) };
        });
    }
    blockContentVisiblity(LinkId, Section, reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield report_1.ReportModel.findByIdAndUpdate(reportId, { Responded: true });
            if (Section === "video") {
                yield videos_1.VideoModel.findByIdAndUpdate(LinkId, {
                    Visiblity: false,
                });
            }
            else if (Section === "post") {
                yield posts_1.PostModel.findByIdAndUpdate(LinkId, {
                    Visiblity: false
                });
            }
            return { status: true, message: "success" };
        });
    }
    changeVisiblityContent(LinkId, Section) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Section === "video") {
                const video = yield videos_1.VideoModel.findById(LinkId);
                if (video) {
                    video.Visiblity = !video.Visiblity;
                    yield video.save();
                }
            }
            else if (Section === "post") {
                const post = yield posts_1.PostModel.findById(LinkId);
                if (post) {
                    post.Visiblity = !post.Visiblity;
                    yield post.save();
                }
            }
            return { status: true, message: "success" };
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield category_1.CategoryModel.find() };
        });
    }
    blockcategory(cateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cate = yield category_1.CategoryModel.findById(cateId);
            if (cate) {
                cate.Display = !cate.Display;
                yield cate.save();
                return { status: true, message: "successfully done the action", data: cate };
            }
            else {
                return { status: false, message: "error while updating", data: cate };
            }
        });
    }
    addCategory(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield category_1.CategoryModel.insertMany(Data);
                return { status: true, message: "success" };
            }
            catch (error) {
                return this.returnErrorCatch(error.message);
            }
        });
    }
}
exports.postVideosRepo = new postVideosRepositary();
