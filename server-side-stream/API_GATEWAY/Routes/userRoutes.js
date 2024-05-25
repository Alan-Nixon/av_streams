"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_Api_gateway_1 = require("../controller/userController_Api_gateway");
const router = express_1.default.Router();
router.get("/:Route", userController_Api_gateway_1.userManagement_get);
router.post("/:Route", userController_Api_gateway_1.userManagement_Post);
router.patch("/:Route", userController_Api_gateway_1.userManagement_Patch);
exports.default = router;
