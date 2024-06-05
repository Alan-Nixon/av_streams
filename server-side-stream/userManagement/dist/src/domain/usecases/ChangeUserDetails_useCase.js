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
exports.change_user_usecase = void 0;
const commonFunctions_1 = require("../../../utils/commonFunctions");
const bcryptjs_1 = require("bcryptjs");
const otpFunctions_1 = require("../../../utils/otpFunctions");
const Authentication_Repositary_1 = require("../../data/Repositary/Authentication_Repositary");
const ChangeUserDetails_Repositary_1 = require("../../data/Repositary/ChangeUserDetails_Repositary");
class changeUserDetails_usecase {
    forgetPassword(Email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield Authentication_Repositary_1.user_authentication_layer.findByEmail_Data(Email);
            if (userData) {
                (0, otpFunctions_1.forgetPasswordLink)(Email, userData._id.toString());
                return true;
            }
            else {
                return false;
            }
        });
    }
    changePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, commonFunctions_1.isValidObjectId)(userId)) {
                const userData = yield Authentication_Repositary_1.user_authentication_layer.findByUserId(userId);
                if (userData) {
                    if (yield (0, bcryptjs_1.compare)(password, userData.Password)) {
                        return { status: false, message: "new password cannot be same as old password" };
                    }
                    else {
                        const newPassword = yield (0, bcryptjs_1.hash)(password, 10);
                        yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.updateNewPassword(newPassword, userData._id.toString());
                        return { status: true, message: "success" };
                    }
                }
                else {
                    return { status: false, message: "userId not found" };
                }
            }
            else {
                return { status: false, message: "userId not found" };
            }
        });
    }
    changeUserDetails(userId, userName, FullName, Phone) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.updateUserDetails(userId, userName, FullName, Phone);
            return true;
        });
    }
    changeChannelName(channelName, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.checkChannelName(channelName);
            if (!data) {
                yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.changeChannelName(channelName, payload.id);
                return { status: true, message: "success" };
            }
            else {
                return { status: false, message: "user name is already taken" };
            }
        });
    }
    addMoneyToWallet(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.addMoneyToWallet(Data);
        });
    }
    withDrawMoneyToWallet(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.withDrawMoneyToWallet(Data);
        });
    }
    subscribeToPremium(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.subscribeToPremium(Data);
        });
    }
    isPremiumUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.isPremiumUser(userId);
        });
    }
    isFollowing(userId, channelUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getChannelByUserId(channelUserId);
            console.log(channel, userId, "this is the data");
            return {
                status: true, message: "success", data: {
                    profileLink: yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getProfileLinkByUserId(channelUserId),
                    isFollowing: channel.Followers.includes(userId)
                }
            };
        });
    }
    followChannel(userId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.followChannel(userId, channelId);
        });
    }
    getChannelById(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getChannelById(channelId);
        });
    }
    getChannelByUserId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getChannelByUserId(channelId);
        });
    }
    getfollowersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = JSON.parse(JSON.stringify(yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getfollowersByUserId(userId)));
            const followersDetails = yield Promise.all(response.data.Followers.map((item) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const userDetails = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getUserData(item);
                const channel = yield this.getChannelByUserId((_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails._id.toString()) !== null && _a !== void 0 ? _a : "");
                return {
                    _id: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id,
                    channelId: channel === null || channel === void 0 ? void 0 : channel._id.toString(),
                    userName: userDetails === null || userDetails === void 0 ? void 0 : userDetails.userName,
                    Email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.Email,
                    FullName: userDetails === null || userDetails === void 0 ? void 0 : userDetails.FullName,
                    profileImage: (_b = (yield this.getChannelByUserId(userId))) === null || _b === void 0 ? void 0 : _b.profileImage
                };
            })));
            response.data.Followers = followersDetails;
            return response;
        });
    }
    getPopularChannels(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getPopularChannels();
            response.data.sort((a, b) => b.Followers.length - a.Followers.length);
            response.data.splice(Math.min(response.data.length, limit));
            return response;
        });
    }
    getTrendingChannels(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getPopularChannels();
            response.data.sort((a, b) => b.Videos.length - a.Videos.length);
            response.data.splice(Math.min(response.data.length, limit));
            return response;
        });
    }
    getNewChats(notIn, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { data } = yield this.getfollowersByUserId(userId);
                const channels = yield Promise.all(data.Followers.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const chan = yield this.getChannelByUserId(item._id);
                    return {
                        userId: chan.userId,
                        archived: false,
                        personDetails: chan,
                        file: { fileType: "", Link: "" },
                        details: [],
                        personId: ""
                    };
                })));
                const newChats = channels.filter((item) => !notIn.includes(item.userId.toString()));
                return { status: true, message: "success", data: newChats };
            }
            catch (error) {
                console.error((_a = error.message) !== null && _a !== void 0 ? _a : "");
                return { status: false, message: "failed", data: [] };
            }
        });
    }
}
exports.change_user_usecase = new changeUserDetails_usecase();
