"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const streamRoutes_1 = __importDefault(require("./Routes/streamRoutes"));
const commentRoutes_1 = __importDefault(require("./Routes/commentRoutes"));
const socket_io_1 = require("socket.io");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
    optionsSuccessStatus: 200
}));
app.use((0, morgan_1.default)('dev'));
app.use('/userManagement', userRoutes_1.default);
app.use('/streamManagement', streamRoutes_1.default);
app.use('/commentManagement', commentRoutes_1.default);
const proxyConfig = {
    '/chatManagement': {
        target: (_a = process.env.CHATMANAGEMENT) !== null && _a !== void 0 ? _a : '',
        changeOrigin: true,
        pathRewrite: { '^/chatManagement': '' },
    },
};
Object.keys(proxyConfig).forEach(context => {
    app.use(context, (0, http_proxy_middleware_1.createProxyMiddleware)(Object.assign(Object.assign({}, proxyConfig[context]), { timeout: 5000, proxyTimeout: 5000 })));
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log("scoket connected");
    socket.on('join', (Data) => { socket.join(Data); });
    socket.on('followChannel', ({ data, userId }) => {
        io.to(userId).emit('showFollowMessage', data);
    });
});
const PORT = process.env.PORT || "";
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
