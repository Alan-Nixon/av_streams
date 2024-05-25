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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPatchController = exports.commentPostController = exports.commentGetController = void 0;
const axios_1 = __importDefault(require("axios"));
const commentGetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield makeAGetReqInDjango(req);
        res.status(200).json({ status: true, data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.commentGetController = commentGetController;
const commentPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield makeAPostReqInDjango(req);
        console.log(data);
        res.status(200).json({ status: true, data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false });
    }
});
exports.commentPostController = commentPostController;
const commentPatchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield makePatchRequest(req);
        console.log(data);
        res.status(200).json({ status: true, message: "success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "error occured" });
    }
});
exports.commentPatchController = commentPatchController;
// helper functions  
const makeAGetReqInDjango = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Route = req.params.Route;
        const query = JSON.stringify(req.query);
        const { data } = yield axios_1.default.get(process.env.COMMENTMANAGEMENT + Route + `/?query=${query}`, {
            headers: { "Authorization": req.headers.authorization }
        });
        data.data = JSON.parse(data.data);
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
const makeAPostReqInDjango = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.Route;
        const { data } = yield axios_1.default.post(process.env.COMMENTMANAGEMENT + query + "/", req.body, {
            headers: { "Authorization": req.headers.authorization }
        });
        return data;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
const makePatchRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.Route;
        const { data } = yield axios_1.default.patch(process.env.COMMENTMANAGEMENT + query + "/", req.body, {
            headers: { "Authorization": req.headers.authorization }
        });
        return data;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
