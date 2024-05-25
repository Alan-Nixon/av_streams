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
exports.user_authentication_layer = void 0;
const user_random_name_generator_1 = require("user_random_name_generator");
const channel_1 = require("../models/channel");
const user_1 = require("../models/user");
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const wallet_1 = __importDefault(require("../models/wallet"));
class Authentication_Data_Layer {
    postLogin(bodyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDataArray = yield user_1.UserModel.insertMany(bodyData);
            const userData = userDataArray[0];
            if (!userData) {
                throw new Error('No user data inserted');
            }
            const userId = userData._id.toString();
            const passByvalue = JSON.parse(JSON.stringify(userData));
            passByvalue._id = passByvalue._id.toString();
            userData.RefreshToken = (0, userauthenticationforavstreams_1.generateRefreshToken)(passByvalue);
            yield userData.save();
            yield channel_1.ChannelModel.insertMany({
                userId: userId,
                userName: userData.userName,
                channelName: yield (0, user_random_name_generator_1.generateName)(),
                profileImage: userData.profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg"
            });
            yield wallet_1.default.insertMany({
                userId: userId,
                userName: userData.userName,
                balance: 0,
                Transactions: []
            });
            userData.profileImage = userData.profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg";
            return userData;
        });
    }
    isBlocked(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(userId);
            if (!user) {
                return "no user";
            }
            else if (user.isBlocked) {
                return "blocked";
            }
            else {
                return "success";
            }
        });
    }
    findByEmail_Data(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findOne({ Email: email });
            if (!user) {
                return null;
            }
            return user.toObject();
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(JSON.stringify(yield user_1.UserModel.findById(userId)));
        });
    }
    findChannelByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield channel_1.ChannelModel.findOne({ userId });
        });
    }
    changeProfile(userId, profileImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.findChannelByUserId(userId);
                if (data) {
                    data.profileImage = profileImage;
                    yield data.save();
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    saveDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Details = new user_1.UserModel(document);
                yield Details.save();
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    newRefreshToken(userId, Token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.UserModel.findByIdAndUpdate(userId, {
                RefreshToken: Token
            });
            return null;
        });
    }
    getWalletDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_1.default.findOne({ userId });
        });
    }
}
exports.user_authentication_layer = new Authentication_Data_Layer();
