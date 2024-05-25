"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_Api_gateway_1 = require("../controller/commentController_Api_gateway");
const commentRouter = express_1.default.Router();
commentRouter.post("/:Route", commentController_Api_gateway_1.commentPostController);
commentRouter.patch("/:Route", commentController_Api_gateway_1.commentPatchController);
commentRouter.get("/:Route", commentController_Api_gateway_1.commentGetController);
exports.default = commentRouter;
