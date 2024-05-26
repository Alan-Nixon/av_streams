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
exports.changeUserRepositaryLayer = void 0;
const otpFunctions_1 = require("../../../utils/otpFunctions");
const channel_1 = require("../models/channel");
const user_1 = require("../models/user");
const wallet_1 = __importDefault(require("../models/wallet"));
class change_user_repositary_layer {
    updateNewPassword(password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.UserModel.findByIdAndUpdate(userId, {
                Password: password
            });
            return true;
        });
    }
    updateUserDetails(userId, userName, FullName, Phone) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.UserModel.findByIdAndUpdate(userId, {
                userName, FullName, Phone
            });
            return true;
        });
    }
    checkChannelName(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield channel_1.ChannelModel.findOne({ channelName });
        });
    }
    changeChannelName(channelName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield channel_1.ChannelModel.findOneAndUpdate({ userId }, { channelName });
            return null;
        });
    }
    getChannelNameByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield channel_1.ChannelModel.findOne({ userId });
            return (data === null || data === void 0 ? void 0 : data.channelName) || "not found";
        });
    }
    getProfileLinkByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield channel_1.ChannelModel.findOne({ userId });
            return (data === null || data === void 0 ? void 0 : data.profileImage) || "no Image";
        });
    }
    addMoneyToWallet(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield wallet_1.default.findById(Data.walletId);
                delete Data.walletId;
                delete Data.userId;
                if (data) {
                    data.Transactions.push(Data);
                    data.Balance += Data.amount;
                    yield data.save();
                    return { status: true, message: "success" };
                }
                else {
                    return { status: false, message: "cannot find the wallet" };
                }
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error occured" };
            }
        });
    }
    withDrawMoneyToWallet(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield wallet_1.default.findById(Data.walletId);
                delete Data.walletId;
                delete Data.userId;
                if (data) {
                    if (data.Balance > Data.amount) {
                        data.Transactions.push(Data);
                        data.Balance -= Data.amount;
                        yield data.save();
                        return { status: true, message: "success" };
                    }
                    else {
                        return { status: false, message: "you have not enough balance to withdraw" };
                    }
                }
                else {
                    return { status: false, message: "cannot find the wallet" };
                }
            }
            catch (error) {
                console.error(error);
                return { status: false, message: "error occured" };
            }
        });
    }
    subscribeToPremium(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield channel_1.ChannelModel.findOne({ userId: Data.userId });
                if (channel) {
                    channel.subscription = Data;
                    channel.premiumCustomer = true;
                    yield channel.save();
                    yield (0, otpFunctions_1.subscriptionSuccessEmail)(Data.email);
                    return { status: true, message: "success" };
                }
                else {
                    return { status: false, message: "channel not found correction in userId" };
                }
            }
            catch (error) {
                console.log(error);
                return { status: false, message: error.message || "error occured while updating subscription" };
            }
        });
    }
    isPremiumUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Data = yield channel_1.ChannelModel.findOne({ userId });
                return { status: (Data === null || Data === void 0 ? void 0 : Data.premiumCustomer) || false, message: "success" };
            }
            catch (error) {
                console.log(error);
                return { status: false, message: error.message || "error occured while fetching premium user" };
            }
        });
    }
    uploadVideo(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield channel_1.ChannelModel.findOne({ userId: Data.userId });
                if (channel) {
                    channel.Videos.push(Data);
                    yield channel.save();
                    return { status: true, message: "successfully uploded video" };
                }
                else {
                    return { status: false, message: "channel not found" };
                }
            }
            catch (error) {
                console.log(error);
                return { status: false, message: error.message || "error uploded video" };
            }
        });
    }
    getChannelByUserId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield channel_1.ChannelModel.findOne({ userId: channelId });
            }
            catch (error) {
                return { status: true, message: error.message || "error occured" };
            }
        });
    }
    followChannel(userId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield channel_1.ChannelModel.findOne({ userId: channelId });
                if (channel) {
                    if (channel.Followers.includes(userId)) {
                        const array = [...channel.Followers];
                        array.splice(array.indexOf(userId), 1);
                        channel.Followers = array;
                    }
                    else {
                        channel.Followers.push(userId);
                    }
                    yield channel.save();
                    return { status: true, message: "success" };
                }
                else {
                    return { status: false, message: "error updating follow" };
                }
            }
            catch (error) {
                return { status: true, message: error.message || "error occured" };
            }
        });
    }
    getChannelById(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return { status: true, message: "success", data: yield channel_1.ChannelModel.findById(channelId) };
            }
            catch (error) {
                return { status: true, message: error.message || "error occured" };
            }
        });
    }
    getfollowersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return { status: true, message: "success", data: yield channel_1.ChannelModel.findOne({ userId }) };
            }
            catch (error) {
                return { status: true, message: error.message || "error occured" };
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_1.UserModel.findById(userId);
            }
            catch (error) {
                return null;
            }
        });
    }
    getProfilesBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return JSON.stringify(yield channel_1.ChannelModel.find({ channelName: { $regex: search, $options: 'i' } }));
            }
            catch (error) {
                console.log(error);
                return "error while fetching data";
            }
        });
    }
    getPopularChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield channel_1.ChannelModel.find() };
        });
    }
}
exports.changeUserRepositaryLayer = new change_user_repositary_layer();
