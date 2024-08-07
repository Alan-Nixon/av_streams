"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_io_1 = require("socket.io");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app = (0, express_1.default)();
const clientSideUrl = process.env.CLIENT_SIDE_URL || 'http://localhost:3000';
const port = process.env.PORT || '8000';
if (!process.env.CHATMANAGEMENT || !process.env.USERMANAGEMENT || !process.env.STREAMMANAGEMENT || !process.env.COMMENTMANAGEMENT) {
    console.error('Some required environment variables are missing!');
    process.exit(1);
}
app.use((0, cors_1.default)({
    origin: clientSideUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}));
app.use((0, morgan_1.default)('dev'));
const proxyConfig = {
    '/chatManagement': {
        target: process.env.CHATMANAGEMENT,
        changeOrigin: true,
        pathRewrite: { '^/chatManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/userManagement': {
        target: process.env.USERMANAGEMENT,
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/streamManagement': {
        target: process.env.STREAMMANAGEMENT,
        changeOrigin: true,
        pathRewrite: { '^/streamManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/commentManagement': {
        target: process.env.COMMENTMANAGEMENT,
        changeOrigin: true,
        pathRewrite: { '^/commentManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    }
};
Object.keys(proxyConfig).forEach((path) => {
    app.use(path, (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: proxyConfig[path].target,
        changeOrigin: proxyConfig[path].changeOrigin,
        pathRewrite: proxyConfig[path].pathRewrite,
        timeout: proxyConfig[path].timeout,
        proxyTimeout: proxyConfig[path].proxyTimeout
    }));
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: clientSideUrl,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log("Socket connected");
    socket.on('join', (data) => {
        socket.join(data);
    });
    socket.on('followChannel', ({ data, userId }) => {
        io.to(userId).emit('showFollowMessage', data);
    });
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
    socket.on("message", (message) => {
        console.log(message);
        socket.broadcast.emit("message", message);
    });
});
app.use('*', (req, res) => res.status(404).json({ status: false, message: "Service not specified" }));
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
exports.default = app;
