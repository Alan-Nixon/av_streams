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
class Admin_useCase {
    post_admin_login(Email, Password) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getAdminDetailsFromReq(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Authentication_1.userDetailsInstance.findByUserId(userId);
            if (data === null || data === void 0 ? void 0 : data.isAdmin) {
                return { status: true, message: "authorized" };
            }
            else {
                return { status: true, message: "unauthorized" };
            }
        });
    }
    create_user_useCase(userData) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    findAllUsersNiNAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin_Repositary_1.adminRepositaryLayer.findAllUsersNiNAdmin();
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin_Repositary_1.adminRepositaryLayer.blockUser(userId);
        });
    }
    addBanner(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageData = req.body.files.imageData[0];
            const location = req.body.fields.location[0];
            const result = yield (0, HelperFunction_1.uploadImage)(imageData, "avstreamBannerImages");
            return yield Admin_Repositary_1.adminRepositaryLayer.addBanner({ imgUrl: result.url, location });
        });
    }
    getBannerByLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin_Repositary_1.adminRepositaryLayer.getBannerByLocation(location);
        });
    }
}
exports.admin_useCase = new Admin_useCase();
