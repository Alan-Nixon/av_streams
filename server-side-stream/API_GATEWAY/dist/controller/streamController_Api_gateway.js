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
exports.streamPatchController = exports.streamDeleteController = exports.streamPostController = exports.streamGetController = void 0;
const axios_1 = __importDefault(require("axios"));
const formidable_1 = require("formidable");
const streamUrl = process.env.STREAMANAGEMENT || "";
const streamGetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== 'undefined') {
            const query = JSON.stringify(req.query);
            console.log(streamUrl + req.params.Route);
            const { data } = yield axios_1.default.get(streamUrl + req.params.Route + `?query=${query}`, {
                headers: { 'Authorization': req.headers.authorization }
            });
            res.status(200).json(data);
        }
        else {
            res.status(200).json({ status: false, message: "no token found sorry" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.streamGetController = streamGetController;
const streamPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (((_b = req.headers['content-type']) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) === "multipart/form-data;") {
            const form = new formidable_1.IncomingForm();
            form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return res.status(200).json({ status: false });
                }
                else {
                    try {
                        console.log(files, req.params.Route);
                        const { data } = yield axios_1.default.post(streamUrl + req.params.Route, { files, fields }, {
                            headers: {
                                "Authorization": req.headers.authorization
                            }
                        });
                        res.status(200).json(data);
                    }
                    catch (error) {
                        console.error('Error making POST request:', error);
                        res.status(500).json({ status: false, error: 'An error occurred while making the request' });
                    }
                }
            }));
        }
        else {
            const { data } = yield axios_1.default.post(streamUrl + req.params.Route, req.body, {
                headers: { 'Authorization': req.headers.authorization }
            });
            res.status(200).json(data);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.streamPostController = streamPostController;
const streamDeleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (((_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1]) !== 'undefined') {
            const query = JSON.stringify(req.query);
            const { data } = yield axios_1.default.delete(streamUrl + req.params.Route + `?query=${query}`, {
                headers: { 'Authorization': req.headers.authorization },
                data: req.body
            });
            res.status(200).json(data);
        }
        else {
            res.status(304).json({ status: false, message: "no token found sorry" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.streamDeleteController = streamDeleteController;
const streamPatchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.headers.authorization);
        if (req.headers.authorization) {
            const query = JSON.stringify(req.query);
            const { data } = yield axios_1.default.patch(streamUrl + req.params.Route + `?query=${query}`, req.body, {
                headers: { 'Authorization': req.headers.authorization }
            });
            res.status(200).json(data);
        }
        else {
            res.status(304).json({ status: false, message: "no token found sorry" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});
exports.streamPatchController = streamPatchController;
