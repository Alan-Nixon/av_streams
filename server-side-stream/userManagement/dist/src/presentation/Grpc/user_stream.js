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
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const ChangeUserDetails_Repositary_1 = require("../../data/Repositary/ChangeUserDetails_Repositary");
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.resolve(__dirname, "../protos/user_stream.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const { UserStream } = grpc.loadPackageDefinition(packageDefinition);
;
const server = new grpc.Server();
const PORT = process.env.GRPC_PORT_NUMBER || "0.0.0.0:50051";
server.addService(UserStream.service, {
    GetChannelName: getChannelNameHandler,
    getUserByIdGRPC: getUserById,
    getProfileLink: getProfileLink,
    uploadVideoGRPC: uploadVideoGRPC,
    searchProfileGRPC: searchProfileGRPC
});
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Grpc Server running on port ${port}`);
});
//functions
function getChannelNameHandler(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const argument = call.request.argument;
        const userId = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getChannelNameByUserId(argument);
        callback(null, { userId });
    });
}
function getUserById(args, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDetails = {
            _id: "fjrobr",
            userName: "some data",
            FullName: "some data",
            Phone: "some data",
            Email: "some data",
            Password: "some data",
            isAdmin: true,
            isBlocked: true,
            RefreshToken: "jhcjh",
        };
        callback(null, userDetails);
    });
}
function getProfileLink(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = call.request.userId;
        const profileLink = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getProfileLinkByUserId(userId);
        callback(null, { profileLink });
    });
}
function uploadVideoGRPC(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.uploadVideo(call.request);
        callback(null, { status: true, message: "success" });
    });
}
function searchProfileGRPC(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getProfilesBySearch(call.request.search);
        callback(null, { status: true, message: "success", data });
    });
}
