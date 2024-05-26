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
exports.adminRepositaryLayer = void 0;
const banner_1 = require("../../models/banner");
const channel_1 = require("../../models/channel");
const user_1 = require("../../models/user");
class admin_repositary_layer {
    createUserRepo(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            userData.Phone = Number(userData.Phone);
            if (!isNaN(userData.Phone)) {
                console.log(userData, "this is th the repositary layer");
                const ins = yield user_1.UserModel.insertMany(userData);
                return ins ? ins[0] : null;
            }
            return null;
        });
    }
    findAllUsersNiNAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_1.UserModel.find({ isAdmin: false });
            return users && users.length > 0 ? users : null;
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield user_1.UserModel.findById(userId);
                if (data) {
                    data.isBlocked = !(data === null || data === void 0 ? void 0 : data.isBlocked);
                    yield (data === null || data === void 0 ? void 0 : data.save());
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
    addBanner(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield banner_1.BannerModel.insertMany(Data);
            return { status: true, message: "success" };
        });
    }
    getBannerByLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield banner_1.BannerModel.find({ location }) };
        });
    }
    updateBanner(imageUrl, bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                status: true, message: "success", data: yield banner_1.BannerModel.findByIdAndUpdate(bannerId, {
                    imgUrl: imageUrl
                })
            };
        });
    }
    getPremiumUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: true, message: "success", data: yield channel_1.ChannelModel.find({ premiumCustomer: true }) };
        });
    }
    cancelSubscription(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = {
                amount: 0, email: "",
                expires: "", paymentId: "",
                section: "", userId: ""
            };
            yield channel_1.ChannelModel.findOneAndUpdate({ userId }, { subscription: obj });
            return { status: true, message: "success" };
        });
    }
}
exports.adminRepositaryLayer = new admin_repositary_layer();
