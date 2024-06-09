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
exports.getUserById = exports.getNewChats = exports.getTrendingChannels = exports.getPopularChannels = exports.getfollowersByUserId = exports.getChannelByUserId = exports.getChannelById = exports.followChannel = exports.isFollowing = exports.isPremiumUser = exports.subscribeToPremium = exports.withDrawMoneyToWallet = exports.addMoneyToWallet = exports.changeChannelName = exports.changeProfileData = exports.changePassword = exports.forgetPasswordOtpSend = exports.authenticated = exports.changeProfileImage = exports.getWalletDetails = exports.regenerateToken = exports.userDetails = exports.sendOtp = exports.postLogin = exports.isBlocked = exports.postSignup = void 0;
const formidable_1 = require("formidable");
//usecase
const Authentication_1 = require("../../domain/usecases/Authentication");
const ChangeUserDetails_useCase_1 = require("../../domain/usecases/ChangeUserDetails_useCase");
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield Authentication_1.userDetailsInstance.findByEmail(req.body.Email)) {
            res.status(200).json({ status: false, message: "Email already Exists, try login" });
        }
        else {
            const userData = yield Authentication_1.userDetailsInstance.postSignup(req.body);
            res.status(200).json({ status: true, userData, message: "success", token: userData.token });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal error occured" });
    }
});
exports.postSignup = postSignup;
const isBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign({}, req.user);
        if (payload) {
            const blocked = yield Authentication_1.userDetailsInstance.isBlocked(payload.id);
            if (blocked === "blocked") {
                return res.status(204).json({ status: false, message: "Blocked" });
            }
            else if (blocked === "no user") {
                return res.status(204).json({ status: false, message: "token expired" });
            }
            next();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "error occured in the block middleware" });
    }
});
exports.isBlocked = isBlocked;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield Authentication_1.userDetailsInstance.findByEmail(req.body.Email);
        if (userData) {
            if (userData.isBlocked) {
                res.status(201).json({ status: 201 });
            }
            else {
                const token = yield Authentication_1.userDetailsInstance.isPasswordCorrect(req.body.Password, userData);
                if (token !== "unauthorized") {
                    res.status(200).json({ status: 200, userData, token });
                }
                else {
                    res.status(202).json({ status: 202 });
                }
            }
        }
        else {
            res.status(203).json({ status: 203 });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json();
    }
});
exports.postLogin = postLogin;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = req.query;
        const otp = Authentication_1.userDetailsInstance.sendOtp(obj.Email);
        res.status(200).json({ status: true, otp });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.sendOtp = sendOtp;
const userDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const userDetails = JSON.parse(JSON.stringify(req.user));
            const userData = yield Authentication_1.userDetailsInstance.getUserDetails(userDetails);
            res.status(200).json({ status: true, userData });
        }
        else {
            throw new Error("req user not found");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false });
    }
});
exports.userDetails = userDetails;
const regenerateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Authentication_1.userDetailsInstance.createTokenIfRefresh(req);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.regenerateToken = regenerateToken;
const getWalletDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = req.query;
        res.status(200).json(yield Authentication_1.userDetailsInstance.getWalletDetails(obj.userId));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: error });
    }
});
exports.getWalletDetails = getWalletDetails;
//change use case
const changeProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield multipartFormSubmission(req);
        const payload = JSON.parse(JSON.stringify(req.user));
        if (payload) {
            yield Authentication_1.userDetailsInstance.changeProfile(payload.id, form.files.file[0]);
            res.status(200).json({ status: true, message: "changed successfully" });
        }
        else {
            throw new Error("payload not found");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false });
    }
});
exports.changeProfileImage = changeProfileImage;
const authenticated = (req, res) => {
    res.status(200).json({ status: true, message: "authenticated" });
};
exports.authenticated = authenticated;
const forgetPasswordOtpSend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const isSuccess = yield ChangeUserDetails_useCase_1.change_user_usecase.forgetPassword(query.Email);
        if (isSuccess) {
            res.status(200).json({ status: true, message: "An email has sent to your email" });
        }
        else {
            res.status(200).json({ status: false, message: "email is not registered" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "some error occured " });
    }
});
exports.forgetPasswordOtpSend = forgetPasswordOtpSend;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield ChangeUserDetails_useCase_1.change_user_usecase.changePassword(req.body.userId, req.body.Password);
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "some error occured " });
    }
});
exports.changePassword = changePassword;
const changeProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ChangeUserDetails_useCase_1.change_user_usecase.changeUserDetails(req.body.userId, req.body.userName, req.body.FullName, Number(req.body.Phone));
        res.status(200).json({ status: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.changeProfileData = changeProfileData;
const changeChannelName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = req.query;
        const payload = JSON.parse(JSON.stringify(req.user));
        const data = yield ChangeUserDetails_useCase_1.change_user_usecase.changeChannelName(obj.channelName, payload);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ status: false });
    }
});
exports.changeChannelName = changeChannelName;
const addMoneyToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield ChangeUserDetails_useCase_1.change_user_usecase.addMoneyToWallet(req.body);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.addMoneyToWallet = addMoneyToWallet;
const withDrawMoneyToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield ChangeUserDetails_useCase_1.change_user_usecase.withDrawMoneyToWallet(req.body);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.withDrawMoneyToWallet = withDrawMoneyToWallet;
const subscribeToPremium = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.subscribeToPremium(req.body));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.subscribeToPremium = subscribeToPremium;
const isPremiumUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.isPremiumUser(userId));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" });
    }
});
exports.isPremiumUser = isPremiumUser;
const isFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.query;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.isFollowing(payload.userId, payload.channelUserId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.isFollowing = isFollowing;
const followChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = JSON.parse(JSON.stringify(req.user));
        const channelId = req.query.channelId;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.followChannel(payload.id || "", channelId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.followChannel = followChannel;
const getChannelById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channelId = req.query.channelId;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getChannelById(channelId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getChannelById = getChannelById;
const getChannelByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channelId = req.query.channelId;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getChannelByUserId(channelId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getChannelByUserId = getChannelByUserId;
const getfollowersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getfollowersByUserId(userId));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getfollowersByUserId = getfollowersByUserId;
const getPopularChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getPopularChannels(limit));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getPopularChannels = getPopularChannels;
const getTrendingChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit;
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getTrendingChannels(limit));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" });
    }
});
exports.getTrendingChannels = getTrendingChannels;
const getNewChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const { id } = Object.assign({}, req.user);
        console.log(id);
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getNewChats(req.body, id));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: (error === null || error === void 0 ? void 0 : error.message) || "internal server error" });
    }
});
exports.getNewChats = getNewChats;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        console.log(userId);
        res.status(200).json(yield ChangeUserDetails_useCase_1.change_user_usecase.getUserById(userId));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: (error === null || error === void 0 ? void 0 : error.message) || "internal server error" });
    }
});
exports.getUserById = getUserById;
function multipartFormSubmission(req) {
    return new Promise((resolve, reject) => {
        const form = new formidable_1.IncomingForm();
        form.parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve({ files, fields });
            }
        }));
    });
}
