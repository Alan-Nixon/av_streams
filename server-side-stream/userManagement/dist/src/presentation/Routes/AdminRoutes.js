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
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const adminController = __importStar(require("../controllers/adminController"));
const router = express_1.default.Router();
router.get('/isAdminAuth', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.isAdminAuth);
router.get('/getAllUsers', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.getAllUsers);
router.get('/blockUser', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.blockUser);
router.get('/getPremiumUsers', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.getPremiumUsers);
router.get('/getDoungnutData', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.getDoungnutData);
router.get('/getLastSubscriptions', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.getLastSubscriptions);
router.get('/getBannerByLocation', adminController.getBannerByLocation);
router.post('/addbanner', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.addBanner);
router.post('/adminPostLogin', adminController.adminPostLogin);
router.post('/createUser', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.createUser);
router.post('/updateBanner', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.updateBanner);
router.patch('/cancelSubscription', userauthenticationforavstreams_1.isAdminAuthenticated, adminController.cancelSubscription);
exports.default = router;
