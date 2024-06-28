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
exports.setAllMessageSeen = exports.saveAudio = exports.getChatOfUser = void 0;
const chat_use_case_1 = require("../../domain/useCases/chat_use_case");
const formidable_1 = require("formidable");
const errorResponse = (error, res) => {
    var _a;
    res.status(200).json({ status: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "some error occured" });
};
const successResponse = (res, data) => {
    res.status(200).json(data);
};
const getChatOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        successResponse(res, yield chat_use_case_1.chatUseCase.getChatOfUser(req.query.userId));
    }
    catch (error) {
        console.error(error);
        errorResponse(error, res);
    }
});
exports.getChatOfUser = getChatOfUser;
const saveAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield multipartFormSubmission(req);
        const message = data.fields.message ? JSON.parse(data.fields.message[0]) : null;
        const audioBuffer = data.files.audioBuffer;
        if (message && data.files.audioBuffer) {
            successResponse(res, yield chat_use_case_1.chatUseCase.saveAudio(message, audioBuffer));
        }
        else {
            errorResponse({ message: "not enough data" }, res);
        }
    }
    catch (error) {
        console.error(error);
        errorResponse(error, res);
    }
});
exports.saveAudio = saveAudio;
const setAllMessageSeen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId + "";
        const personId = req.query.personId + "";
        successResponse(res, yield chat_use_case_1.chatUseCase.setAllMessageSeen(userId, personId));
    }
    catch (error) {
        errorResponse(error, res);
    }
});
exports.setAllMessageSeen = setAllMessageSeen;
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
