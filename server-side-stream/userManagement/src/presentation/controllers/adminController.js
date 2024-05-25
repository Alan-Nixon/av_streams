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
exports.getBannerByLocation = exports.addBanner = exports.blockUser = exports.getAllUsers = exports.createUser = exports.isAdminAuth = exports.adminPostLogin = void 0;
const Admin_UseCase_1 = require("../../domain/usecases/Admin_usecase/Admin_UseCase");
const adminPostLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield Admin_UseCase_1.admin_useCase.post_admin_login(req.body.Email, req.body.Password);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.adminPostLogin = adminPostLogin;
const isAdminAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = JSON.parse(JSON.stringify(req.user)).id;
        const response = yield Admin_UseCase_1.admin_useCase.getAdminDetailsFromReq(userId);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.isAdminAuth = isAdminAuth;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield Admin_UseCase_1.admin_useCase.create_user_useCase(req.body);
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "error occured" });
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield Admin_UseCase_1.admin_useCase.findAllUsersNiNAdmin();
        if (usersData) {
            return res.status(200).json({ status: true, usersData });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false });
    }
});
exports.getAllUsers = getAllUsers;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = JSON.parse(req.query.query);
        yield Admin_UseCase_1.admin_useCase.blockUser(obj.userId);
        return res.status(200).json({ status: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false });
    }
});
exports.blockUser = blockUser;
const addBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Admin_UseCase_1.admin_useCase.addBanner(req);
        return res.status(200).json({ status: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false });
    }
});
exports.addBanner = addBanner;
const getBannerByLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = JSON.parse(req.query.query).location;
        return res.status(200).json(yield Admin_UseCase_1.admin_useCase.getBannerByLocation(location));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false });
    }
});
exports.getBannerByLocation = getBannerByLocation;
