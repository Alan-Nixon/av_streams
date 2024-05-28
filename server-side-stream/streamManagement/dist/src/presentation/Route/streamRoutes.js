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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const controller = __importStar(require("../controllers/streamControllers"));
const router = express_1.default.Router();
router.get('/stopStream', userauthenticationforavstreams_1.isAuthenticated, controller.stopStream);
router.get('/getAllpostOfUser', userauthenticationforavstreams_1.isAuthenticated, controller.getAllpostOfUser);
router.get('/getAllPosts', userauthenticationforavstreams_1.isAuthenticated, controller.getAllPosts);
router.get('/getPostFromUser', controller.getPostFromUser);
router.get('/getName', userauthenticationforavstreams_1.isAuthenticated, controller.getName);
router.get('/getUserVideos', userauthenticationforavstreams_1.isAuthenticated, controller.getUserVideos);
router.get('/getAllVideos', userauthenticationforavstreams_1.isAuthenticated, controller.getAllVideos);
router.get('/getVideosWithId', userauthenticationforavstreams_1.isAuthenticated, controller.getVideosWithId);
router.get('/getMostWatchedVideoUser', userauthenticationforavstreams_1.isAuthenticated, controller.getMostWatchedVideoUser);
router.get('/searchVideosAndProfile', userauthenticationforavstreams_1.isAuthenticated, controller.searchVideosAndProfile);
router.get('/getPremiumVideos', controller.getPremiumVideos);
router.post('/uploadPost', userauthenticationforavstreams_1.isAuthenticated, controller.uploadPost);
router.post('/uploadVideo', userauthenticationforavstreams_1.isAuthenticated, controller.uploadVideo);
router.post('/addReportSubmit', userauthenticationforavstreams_1.isAuthenticated, controller.addReportSubmit);
router.patch('/likePost', userauthenticationforavstreams_1.isAuthenticated, controller.likePost);
router.delete('/deletePostFromCloudinary', userauthenticationforavstreams_1.isAuthenticated, controller.deletePostFromCloudinary);
// admin routes
router.get('/getReportsBySection', userauthenticationforavstreams_1.isAdminAuthenticated, controller.getReportsBySection);
router.get('/getBlockedVideos', userauthenticationforavstreams_1.isAdminAuthenticated, controller.getBlockedVideos);
router.get('/getCategory', userauthenticationforavstreams_1.isAdminAuthenticated, controller.getCategory);
router.patch('/blockcategory', userauthenticationforavstreams_1.isAdminAuthenticated, controller.blockcategory);
router.patch('/blockContentVisiblity', userauthenticationforavstreams_1.isAdminAuthenticated, controller.blockContentVisiblity);
router.patch('/ChangeVisiblityContent', userauthenticationforavstreams_1.isAdminAuthenticated, controller.changeVisiblityContent);
router.post('/addCategory', userauthenticationforavstreams_1.isAdminAuthenticated, controller.addCategory);
exports.default = router;
