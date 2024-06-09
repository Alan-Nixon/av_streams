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
const router = express_1.default.Router();
const controller = __importStar(require("../controllers/userController"));
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
//user get
router.get('/userDetails', userauthenticationforavstreams_1.isAuthenticated, controller.isBlocked, controller.userDetails);
router.get('/getWalletDetails', userauthenticationforavstreams_1.isAuthenticated, controller.getWalletDetails);
router.get('/isPremiumUser', userauthenticationforavstreams_1.isAuthenticated, controller.isPremiumUser);
router.get('/isFollowing', userauthenticationforavstreams_1.isAuthenticated, controller.isFollowing);
router.get('/followChannel', userauthenticationforavstreams_1.isAuthenticated, controller.followChannel);
router.get('/getChannelById', userauthenticationforavstreams_1.isAuthenticated, controller.getChannelById);
router.get('/getChannelByUserId', userauthenticationforavstreams_1.isAuthenticated, controller.getChannelByUserId);
router.get('/getfollowersByUserId', userauthenticationforavstreams_1.isAuthenticated, controller.getfollowersByUserId);
router.get('/getUserById', userauthenticationforavstreams_1.isAuthenticated, controller.getUserById);
router.get('/sendOtp', controller.sendOtp);
router.get('/isUserAuth', controller.authenticated);
router.get('/forgetPasswordOtpSend', controller.forgetPasswordOtpSend);
router.get('/getPopularChannels', controller.getPopularChannels);
router.get('/getTrendingChannels', controller.getTrendingChannels);
//user post
router.post('/regenerateToken', controller.regenerateToken);
router.post('/postSignup', controller.postSignup);
router.post('/postLogin', controller.postLogin);
router.post('/addMoneyToWallet', userauthenticationforavstreams_1.isAuthenticated, controller.addMoneyToWallet);
router.post('/withDrawMoneyToWallet', userauthenticationforavstreams_1.isAuthenticated, controller.withDrawMoneyToWallet);
router.post('/getNewChats', userauthenticationforavstreams_1.isAuthenticated, controller.getNewChats);
//user patch
router.patch('/changeChannelName', userauthenticationforavstreams_1.isAuthenticated, controller.isBlocked, controller.changeChannelName);
router.patch('/changePassword', controller.changePassword);
router.patch('/changeProfileData', userauthenticationforavstreams_1.isAuthenticated, controller.changeProfileData);
router.patch('/changeProfileImage', userauthenticationforavstreams_1.isAuthenticated, controller.changeProfileImage);
router.patch('/subscribeToPremium', userauthenticationforavstreams_1.isAuthenticated, controller.subscribeToPremium);
exports.default = router;
