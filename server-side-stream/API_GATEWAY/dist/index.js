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
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}));
app.use((0, morgan_1.default)('dev'));
// app.use('/userManagement', router);
// app.use('/streamManagement', streamRouter);
// app.use('/commentManagement', commentRouter);
const proxyConfig = {
    '/chatManagement': {
        target: process.env.CHATMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/chatManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/userManagement': {
        target: process.env.USERMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/streamManagement': {
        target: process.env.STREAMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/commentManagement': {
        target: process.env.COMMENTMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/commentManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    }
};
Object.keys(proxyConfig).forEach(context => {
    app.use(context, (0, http_proxy_middleware_1.createProxyMiddleware)(proxyConfig[context]));
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
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
});
const PORT = process.env.PORT || "8000";
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
exports.default = app;
