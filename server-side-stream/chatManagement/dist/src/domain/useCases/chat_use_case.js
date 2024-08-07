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
exports.chatUseCase = void 0;
const cloudinary_1 = require("../../data/adapters/cloudinary");
const chat_repositary_1 = require("../../data/repositaryLayer/chat_repositary");
class chat_use_case {
    errorResponse(error) {
        var _a;
        return { status: false, message: (_a = error.message) !== null && _a !== void 0 ? _a : "error occured" };
    }
    successResponse(data) {
        return { status: false, message: "success", data };
    }
    getChatOfUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield chat_repositary_1.chatRepoLayer.getChatOfUser(userId);
                return { status: true, message: "success", data };
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    saveAudio(message, audioBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = yield (0, cloudinary_1.uploadAudio)(audioBuffer[0], "chat_audio");
                message.file.Link = url;
                message.message = "AUDIO_MESSAGE";
                const data = yield chat_repositary_1.chatRepoLayer.addChat(message);
                return { status: true, message: "success", data: message };
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
    setAllMessageSeen(userId, personId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield chat_repositary_1.chatRepoLayer.setAllMessageSeen(userId, personId);
            }
            catch (error) {
                return this.errorResponse(error);
            }
        });
    }
}
exports.chatUseCase = new chat_use_case();
