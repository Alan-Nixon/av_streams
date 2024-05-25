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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const express = __importStar(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http = __importStar(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const streamRoutes_1 = __importDefault(require("./presentation/Route/streamRoutes"));
require("../config/Database");
require("./presentation/Grpc/stream_user");
const stream_1 = require("stream");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    region: 'eu-north-1', credentials: {
        accessKeyId: (_a = process.env.AWS_ACCESS_KEY) !== null && _a !== void 0 ? _a : "",
        secretAccessKey: (_b = process.env.AWS_SECRET_KEY) !== null && _b !== void 0 ? _b : ""
    }
});
const s3 = new aws_sdk_1.default.S3();
const BUCKET_NAME = 'avstreams';
const app = express.default();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use((0, cors_1.default)({
    origin: process.env.APIGATEWAY_URL,
    credentials: true,
    allowedHeaders: ["Session", "Cookie"]
}));
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json());
app.use((0, morgan_1.default)('dev'));
wss.on('connection', (ws) => {
    console.log("WebSocket connected");
    const passThroughStream = new stream_1.PassThrough();
    const uploadKey = `livestreams/video-${Date.now()}.mp4`;
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: uploadKey,
        Body: passThroughStream,
        ContentType: 'video/mp4',
    };
    const upload = s3.upload(uploadParams);
    upload.send((err, data) => {
        if (err) {
            console.error('S3 upload error:', err);
            ws.send(JSON.stringify({ status: 'error', message: 'Upload failed' }));
        }
        else {
            console.log('S3 upload success:', data);
            const videoUrl = data.Location;
            ws.send(JSON.stringify({ status: 'success', videoUrl }));
        }
    });
    ws.on('message', (data) => {
        passThroughStream.write(data);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        passThroughStream.end();
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        passThroughStream.end();
    });
});
app.use('/', streamRoutes_1.default);
server.listen(3001, () => {
    console.log('server started on port 3001');
});
