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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetailsInstance = void 0;
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const Authentication_Repositary_1 = require("../../data/Repositary/Authentication_Repositary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const otpFunctions_1 = require("../../../utils/otpFunctions");
const HelperFunction_1 = require("../../../utils/HelperFunction");
class userDetails_useCase {
    postSignup(bodyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(bodyData.Password, 10);
                bodyData.Password = hashedPassword;
                bodyData.isAdmin = false;
                bodyData.isBlocked = false;
                const userData = yield Authentication_Repositary_1.user_authentication_layer.postLogin(bodyData);
                return {
                    userName: userData.userName,
                    FullName: userData.FullName,
                    Email: userData.Email,
                    Phone: userData.Phone,
                    Password: userData.Password,
                    isAdmin: userData.isAdmin,
                    isBlocked: userData.isBlocked,
                    profileImage: userData.profileImage,
                    token: (0, userauthenticationforavstreams_1.generateToken)(userData)
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    isBlocked(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Authentication_Repositary_1.user_authentication_layer.isBlocked(userId);
        });
    }
    findByEmail(Email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Authentication_Repositary_1.user_authentication_layer.findByEmail_Data(Email);
        });
    }
    isPasswordCorrect(bodyPassword, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield bcryptjs_1.default.compare(bodyPassword, userData.Password)) {
                const userId = userData._id instanceof mongoose_1.Types.ObjectId ? userData._id.toString() : userData._id;
                const Data = Object.assign(Object.assign({}, userData), { _id: userId });
                const token = (0, userauthenticationforavstreams_1.generateToken)(Data);
                return token;
            }
            else {
                return "unauthorized";
            }
        });
    }
    sendOtp(Email) {
        const otp = (0, otpFunctions_1.generateOtp)();
        (0, otpFunctions_1.sendOtpToEmail)(Email, Number(otp));
        return otp.toString();
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield JSON.parse(JSON.stringify(yield Authentication_Repositary_1.user_authentication_layer.findByUserId(userId)));
        });
    }
    findChannelByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Authentication_Repositary_1.user_authentication_layer.findChannelByUserId(userId);
        });
    }
    getUserDetails(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const Details = yield this.findByUserId(userData.id);
            const channelDetails = yield this.findChannelByUserId(userData.id);
            if (channelDetails) {
                Details.profileImage = channelDetails.profileImage;
                Details.channelName = channelDetails.channelName;
                return Details;
            }
            else {
                return null;
            }
        });
    }
    changeProfile(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, HelperFunction_1.uploadImage)(file, "avstreamProfileImages");
            yield Authentication_Repositary_1.user_authentication_layer.changeProfile(userId, result.url);
            return null;
        });
    }
    createTokenIfRefresh(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, userauthenticationforavstreams_1.getDataFromToken)((0, userauthenticationforavstreams_1.getTokenFromRequest)(req) || "");
            const userData = yield this.findByUserId(data.id);
            const res = yield (0, userauthenticationforavstreams_1.checkTokenValidity)(userData.RefreshToken, false);
            if (!res) {
                return { status: true, message: "refresh token expired", token: (0, userauthenticationforavstreams_1.generateToken)(userData) };
            }
            else {
                yield Authentication_Repositary_1.user_authentication_layer.newRefreshToken(data.id, (0, userauthenticationforavstreams_1.generateRefreshToken)(userData));
                return { status: false, message: "refresh token expired" };
            }
        });
    }
    getWalletDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletDetails = yield Authentication_Repositary_1.user_authentication_layer.getWalletDetails(userId);
            if (walletDetails) {
                return {
                    status: true,
                    message: "success",
                    Data: walletDetails
                };
            }
            else {
                return {
                    status: false,
                    message: "failed"
                };
            }
        });
    }
}
exports.userDetailsInstance = new userDetails_useCase();
