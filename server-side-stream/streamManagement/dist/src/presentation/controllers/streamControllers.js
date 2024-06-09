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
exports.getPostDongnutData = exports.addCategory = exports.blockcategory = exports.getCategory = exports.changeVisiblityContent = exports.blockContentVisiblity = exports.getBlockedVideos = exports.getReportsBySection = exports.addReportSubmit = exports.searchVideosAndProfile = exports.getPremiumVideos = exports.getMostWatchedVideoUser = exports.getVideosWithId = exports.getAllVideos = exports.getUserVideos = exports.getName = exports.getPostFromUser = exports.likePost = exports.getAllPosts = exports.deletePostFromCloudinary = exports.getAllpostOfUser = exports.uploadPost = exports.uploadVideo = exports.stopStream = void 0;
const video_post_usecase_1 = require("../../domain/usecases/video_post_use_cases/video_post_usecase");
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const user_random_name_generator_1 = require("user_random_name_generator");
const stopStream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({});
});
exports.stopStream = stopStream;
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.files) {
            res.status(200).json(yield video_post_usecase_1.videoPost.uploadVideo(req));
        }
        else {
            res.status(500).json({ status: false, message: "req.body not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.uploadVideo = uploadVideo;
const uploadPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.uploadPost(req.body, req.user));
    }
    catch (error) {
        console.error(error);
    }
});
exports.uploadPost = uploadPost;
const getAllpostOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getAllpostOfUser(req));
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllpostOfUser = getAllpostOfUser;
const deletePostFromCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.deletePostUseCase(req.body.link, req.body.postId));
    }
    catch (error) {
        console.error(error);
    }
});
exports.deletePostFromCloudinary = deletePostFromCloudinary;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Data = yield video_post_usecase_1.videoPost.getAllPosts();
        res.status(200).json(Data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false });
    }
});
exports.getAllPosts = getAllPosts;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = (0, userauthenticationforavstreams_1.getDataFromToken)((0, userauthenticationforavstreams_1.getTokenFromRequest)(req) || "");
        res.status(200).json(yield video_post_usecase_1.videoPost.likePost(req.body.postId, data.id));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.likePost = likePost;
const getPostFromUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const data = yield video_post_usecase_1.videoPost.getPostFromUser(userId);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.getPostFromUser = getPostFromUser;
const getName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ status: true, data: yield (0, user_random_name_generator_1.generateName)() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.getName = getName;
const getUserVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getUserVideos(req));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.getUserVideos = getUserVideos;
const getAllVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isShorts = req.query.shorts === "false" ? false : true;
        res.status(200).json(yield video_post_usecase_1.videoPost.getAllVideos(isShorts));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getAllVideos = getAllVideos;
const getVideosWithId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getVideosWithId(req));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getVideosWithId = getVideosWithId;
const getMostWatchedVideoUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        res.status(200).json(yield video_post_usecase_1.videoPost.getMostWatchedVideoUser(userId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getMostWatchedVideoUser = getMostWatchedVideoUser;
const getPremiumVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getPremiumVideos());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getPremiumVideos = getPremiumVideos;
const searchVideosAndProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        res.status(200).json(yield video_post_usecase_1.videoPost.searchVideosAndProfile(search));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.searchVideosAndProfile = searchVideosAndProfile;
const addReportSubmit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.addReportSubmit(req.body));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.addReportSubmit = addReportSubmit;
const getReportsBySection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const section = req.query.Section;
        res.status(200).json(yield video_post_usecase_1.videoPost.getReportsBySection(section));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getReportsBySection = getReportsBySection;
const getBlockedVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getBlockedVideos());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getBlockedVideos = getBlockedVideos;
const blockContentVisiblity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.blockContentVisiblity(req.body.LinkId, req.body.Section, req.body.reportId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.blockContentVisiblity = blockContentVisiblity;
const changeVisiblityContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.changeVisiblityContent(req.body.LinkId, req.body.Section));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.changeVisiblityContent = changeVisiblityContent;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.getCategory());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getCategory = getCategory;
const blockcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.blockcategory(req.body.cateId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.blockcategory = blockcategory;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield video_post_usecase_1.videoPost.addCategory(req.body));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.addCategory = addCategory;
const getPostDongnutData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = req.query.userCount;
        res.status(200).json(yield video_post_usecase_1.videoPost.getPostDongnutData(Number(count)));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getPostDongnutData = getPostDongnutData;
