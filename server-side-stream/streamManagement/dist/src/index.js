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
const express = __importStar(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http = __importStar(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const streamRoutes_1 = __importDefault(require("./presentation/Route/streamRoutes"));
require("../config/Database");
require("./presentation/Grpc/stream_user");
require("./presentation/Rabbitmq/consumer");
const app = express.default();
const server = http.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
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
// connectToSocket(io);
let broadcaster = null;
io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);
    socket.on('broadcaster', () => {
        console.log('Broadcaster connected');
        broadcaster = socket.id;
        socket.broadcast.emit('broadcaster');
    });
    socket.on('watcher', () => {
        console.log('Watcher connected');
        if (broadcaster) {
            io.to(broadcaster).emit('watcher', socket.id);
        }
    });
    socket.on('offer', (id, message) => {
        console.log('Offer received');
        io.to(id).emit('offer', socket.id, message);
    });
    socket.on('answer', (id, message) => {
        console.log('Answer received');
        io.to(id).emit('answer', socket.id, message);
    });
    socket.on('candidate', (id, message) => {
        console.log('Candidate received');
        io.to(id).emit('candidate', socket.id, message);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnectPeer', socket.id);
    });
});
app.use('/', streamRoutes_1.default);
server.listen(3001, () => {
    console.log('server started on port 3001');
});
