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
exports.userManagement_Patch = exports.userManagement_Post = exports.userManagement_get = void 0;
const axios_1 = __importDefault(require("axios"));
const formidable_1 = require("formidable");
const userUrl = process.env.USERMANAGEMENT || "";
const sendResponse = (res, statusCode, Data) => {
    return res.status(statusCode).json(Data);
};
const userManagement_get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== 'undefined') {
            makeGetRequest(req, res);
        }
        else {
            sendResponse(res, 304, { status: false, message: "no token found sorry" });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userManagement_get = userManagement_get;
const userManagement_Post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (((_b = req.headers['content-type']) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) === "multipart/form-data;") {
            const body = yield multipartFormSubmission(req);
            makePostRequest(req, res, body);
        }
        else {
            makePostRequest(req, res, req.body);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userManagement_Post = userManagement_Post;
const userManagement_Patch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (((_c = req.headers['content-type']) === null || _c === void 0 ? void 0 : _c.split(' ')[0]) === "multipart/form-data;") {
            const body = yield multipartFormSubmission(req);
            makePacthRequest(req, res, body);
        }
        else {
            makePacthRequest(req, res, req.body);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userManagement_Patch = userManagement_Patch;
//  helper functions
function makeGetRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = JSON.stringify(req.query);
            const response = yield axios_1.default.get(userUrl + req.params.Route + `?query=${query}`, {
                headers: { 'Authorization': req.headers.authorization }
            });
            if (response.status === 204) {
                console.log("blocked aanu");
                return res.status(204).json({ status: false, message: "Blocked" });
            }
            if (response.data.message === "access token expired") {
                console.log("user is not authenticated");
                const newTokenResponse = yield axios_1.default.post(userUrl + "regenerateToken", {}, {
                    headers: { 'Authorization': req.headers.authorization }
                });
                sendResponse(res, 403, newTokenResponse.data);
            }
            else {
                sendResponse(res, 200, response.data);
            }
        }
        catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                console.log("Unauthorized error occurre", req.params.Route);
                sendResponse(res, 204, { message: "Unauthorized", user: "isAdminAuth" ? false : true });
            }
            else {
                console.error("Error occurred:", error);
                sendResponse(res, 500, { message: "Internal Server Error" });
            }
        }
    });
}
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
function makePostRequest(req, res, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.post(userUrl + req.params.Route, body, {
                headers: { "Authorization": req.headers.authorization }
            });
            sendResponse(res, 200, data);
        }
        catch (error) {
            sendResponse(res, 500, { message: error.message || "internal server error" });
        }
    });
}
function makePacthRequest(req, res, body) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = "";
        if (req.query) {
            query = JSON.stringify(req.query);
        }
        const { data } = yield axios_1.default.patch(userUrl + req.params.Route + `?query=${query}`, body, {
            headers: { "Authorization": req.headers.authorization }
        });
        sendResponse(res, 200, data);
    });
}
