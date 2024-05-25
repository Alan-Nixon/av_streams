"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamController_Api_gateway_1 = require("../controller/streamController_Api_gateway");
const streamRouter = express_1.default.Router();
streamRouter.get('/:Route', streamController_Api_gateway_1.streamGetController);
streamRouter.post("/:Route", streamController_Api_gateway_1.streamPostController);
streamRouter.patch('/:Route', streamController_Api_gateway_1.streamPatchController);
streamRouter.delete('/:Route', streamController_Api_gateway_1.streamDeleteController);
exports.default = streamRouter;
