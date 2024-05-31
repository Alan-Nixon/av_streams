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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProfileGRPC = exports.uploadVideoGRPC = exports.getProfileLink = exports.getUserByIdGRPC = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path = __importStar(require("path"));
const PROTO_PATH = path.resolve(__dirname, "../protos/user_stream.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const { UserStream } = grpcObject;
const PORT = process.env.GRPC_PORT || "undefined";
const client = new UserStream(PORT, grpc.credentials.createInsecure());
const GetChannelNameFunction = (userId) => {
    return new Promise((resolve, reject) => {
        const argument = userId;
        client.GetChannelName({ argument }, function (err, response) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            }
            else {
                resolve(response.userId);
            }
        });
    });
};
const getUserByIdGRPC = (userId) => {
    return new Promise((resolve, reject) => {
        const argument = userId;
        client.getUserByIdGRPC({ argument }, function (err, response) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            }
            else {
                console.log(response);
                resolve(response);
            }
        });
    });
};
exports.getUserByIdGRPC = getUserByIdGRPC;
const getProfileLink = (userId) => {
    return new Promise((resolve, reject) => {
        const request = { userId: userId };
        client.getProfileLink(request, function (err, response) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            }
            else {
                resolve(response.profileLink);
            }
        });
    });
};
exports.getProfileLink = getProfileLink;
const uploadVideoGRPC = (Data) => {
    return new Promise((resolve, reject) => {
        const request = Data;
        client.uploadVideoGRPC(request, function (err, response) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.uploadVideoGRPC = uploadVideoGRPC;
const searchProfileGRPC = (search) => {
    return new Promise((resolve, reject) => {
        client.searchProfileGRPC({ search }, function (err, response) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.searchProfileGRPC = searchProfileGRPC;
