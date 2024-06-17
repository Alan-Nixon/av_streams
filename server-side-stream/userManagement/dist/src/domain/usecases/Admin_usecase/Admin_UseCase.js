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
exports.admin_useCase = void 0;
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const Authentication_1 = require("../Authentication");
const bcryptjs_1 = require("bcryptjs");
const HelperFunction_1 = require("../../../../utils/HelperFunction");
const Admin_Repositary_1 = require("../../../data/Repositary/Admin/Admin_Repositary");
const ChangeUserDetails_Repositary_1 = require("../../../data/Repositary/ChangeUserDetails_Repositary");
const Authentication_Repositary_1 = require("../../../data/Repositary/Authentication_Repositary");
const commonFunctions_1 = require("../../../../utils/commonFunctions");
const formidable_1 = require("formidable");
class Admin_useCase {
    errorResponse(error) {
        var _a;
        return { status: true, message: (_a = error.message) !== null && _a !== void 0 ? _a : "failed" };
    }
    post_admin_login(Email, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = JSON.parse(JSON.stringify(yield Authentication_1.userDetailsInstance.findByEmail(Email)));
                if (adminData) {
                    if (yield (0, bcryptjs_1.compare)(Password, adminData.Password)) {
                        if (adminData.isAdmin) {
                            adminData._id = adminData._id.toString();
                            const token = (0, userauthenticationforavstreams_1.generateToken)(adminData);
                            console.log(token);
                            return { status: true, token, message: "success" };
                        }
                        else {
                            return { status: false, message: "unauthorized entry" };
                        }
                    }
                    else {
                        return { status: false, message: "Password do not match" };
                    }
                }
                else {
                    return { status: false, message: "email of admin not found" };
                }
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    getAdminDetailsFromReq(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield Authentication_1.userDetailsInstance.findByUserId(userId);
                if (data === null || data === void 0 ? void 0 : data.isAdmin) {
                    return { status: true, message: "authorized" };
                }
                else {
                    return { status: true, message: "unauthorized" };
                }
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    create_user_useCase(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield Authentication_1.userDetailsInstance.findByEmail(userData.Email);
                if (!data) {
                    const Password = yield (0, bcryptjs_1.hash)(userData.Password, 10);
                    userData.Password = Password;
                    userData.isBlocked = false;
                    userData.Phone = Number(userData.Phone);
                    const ins = yield Admin_Repositary_1.adminRepositaryLayer.createUserRepo(userData);
                    if (ins)
                        (0, HelperFunction_1.createChannel)(ins._id + "", ins.userName);
                    return { status: true, message: "success" };
                }
                else {
                    return { status: false, message: "user already exist" };
                }
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    findAllUsersNiNAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Admin_Repositary_1.adminRepositaryLayer.findAllUsersNiNAdmin();
            }
            catch (error) {
                return [];
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Admin_Repositary_1.adminRepositaryLayer.blockUser(userId);
            }
            catch (error) {
                return false;
            }
        });
    }
    addBanner(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const form = yield multipartFormSubmission(req);
                const imageData = form.files.imageData[0];
                const location = form.fields.location[0];
                const result = yield (0, HelperFunction_1.uploadImage)(imageData, "avstreamBannerImages");
                return yield Admin_Repositary_1.adminRepositaryLayer.addBanner({ imgUrl: result.url, location });
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    getBannerByLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Admin_Repositary_1.adminRepositaryLayer.getBannerByLocation(location);
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    updateBanner(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const form = yield multipartFormSubmission(req);
                const file = form.files.file[0];
                const bannerId = form.fields.bannerId[0];
                const result = yield (0, HelperFunction_1.uploadImage)(file, "avstreamBannerImages");
                return yield Admin_Repositary_1.adminRepositaryLayer.updateBanner(result.url, bannerId);
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    getPremiumUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Admin_Repositary_1.adminRepositaryLayer.getPremiumUsers();
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    cancelSubscription(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const time = Math.floor((new Date(Data.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                let refund = 1;
                if (Data.section === "Yearly Subscription") {
                    refund = time * 7;
                }
                else if (Data.section === "Monthly Subscription") {
                    refund = time * 17;
                }
                else if (Data.section === "Weekly Subscription") {
                    refund = time * 28;
                }
                else {
                    refund = refund * 0;
                }
                const wallet = yield Authentication_Repositary_1.user_authentication_layer.getWalletDetails(Data.userId);
                const Transactions = {
                    amount: refund, createdTime: new Date().toString(),
                    credited: true, transactionId: "BY ADMIN", userId: Data.userId,
                    walletId: wallet === null || wallet === void 0 ? void 0 : wallet._id
                };
                console.log(Data.userId);
                yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.addMoneyToWallet(Transactions);
                return yield Admin_Repositary_1.adminRepositaryLayer.cancelSubscription(Data.userId);
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    getDoungnutData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const channels = yield Admin_Repositary_1.adminRepositaryLayer.getChannels();
                const users = (_b = (_a = (yield Admin_Repositary_1.adminRepositaryLayer.findAllUsersNiNAdmin())) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                const data = [{
                        completeText: "Total users have streams",
                        remainingText: "Total users dont have streams",
                        completedPercentage: 0,
                        remainingPercentage: 0,
                        count: 0
                    }, {
                        completeText: "Total users have video",
                        remainingText: "Total users dont have video",
                        completedPercentage: 0,
                        remainingPercentage: 0,
                        count: 0
                    }, {
                        completeText: "Total users have shorts",
                        remainingText: "Total users dont have shorts",
                        completedPercentage: 0,
                        remainingPercentage: 0,
                        count: 0
                    }];
                const allVideo = channels === null || channels === void 0 ? void 0 : channels.map(item => item.Videos).flat(Infinity);
                const allStream = channels === null || channels === void 0 ? void 0 : channels.map(item => item.Streams).flat(Infinity);
                data[0].count = (_c = allStream === null || allStream === void 0 ? void 0 : allStream.length) !== null && _c !== void 0 ? _c : 0;
                allVideo === null || allVideo === void 0 ? void 0 : allVideo.forEach((item, index) => {
                    if (item.shorts) {
                        data[2].count++;
                    }
                    else if (!item.shorts) {
                        data[1].count++;
                    }
                });
                data.forEach(item => {
                    var _a;
                    item.completedPercentage = Math.floor(((_a = item.count / users) !== null && _a !== void 0 ? _a : 1) * 100);
                    item.remainingPercentage = Math.floor(((users - item.count) / users) * 100);
                });
                return { status: true, message: "success", data };
            }
            catch (error) {
                console.log(error);
                return this.errorResponse(error);
            }
        });
    }
    getLastSubscriptions(monthCount) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const months = (0, commonFunctions_1.getLastMonths)(monthCount);
                const data = months.map(item => 0);
                const channels = (_a = (yield Admin_Repositary_1.adminRepositaryLayer.getChannels())) === null || _a === void 0 ? void 0 : _a.filter(item => item.subscription.expires !== "");
                let expiryDates = [];
                if (channels) {
                    for (const chan of channels) {
                        let exp = chan.subscription.expires;
                        let days = exp === "Yearly Subscription" ? 365 : exp === "Montly Subscription" ? 28 : 7;
                        expiryDates.push((0, commonFunctions_1.getDate)(days, false, chan.subscription.expires));
                    }
                }
                expiryDates = (0, commonFunctions_1.getDatesOfCurrentYear)(expiryDates);
                expiryDates.map((item) => {
                    const month = new Date(item).getMonth();
                    if (data[month] !== undefined)
                        data[month] += 1;
                });
                return { status: true, message: "success", data: { months, data } };
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
}
exports.admin_useCase = new Admin_useCase();
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
