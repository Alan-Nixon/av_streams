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
require("./presentation/Rabbitmq/consumer");
const socket_io_1 = require("socket.io");
const app = express.default();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
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
    ws.on('message', (data) => {
        console.log(data);
        wss.emit("message", data);
        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(data);
        //     }
        // });
    });
    // ws.on('close', () => {
    //     console.log('Client disconnected');
    // });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('stream', (data) => {
        console.log(data);
        socket.broadcast.emit('stream', data);
    });
    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });
});
app.use('/', streamRoutes_1.default);
server.listen(3001, () => {
    console.log('server started on port 3001');
});
