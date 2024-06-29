"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const routes_1 = __importDefault(require("./presentation/routes/routes"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const socketCode_1 = require("./data/socket/socketCode");
require("../config/database");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Authorization', 'Content-Type'],
    optionsSuccessStatus: 200
}));
const io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
(0, socketCode_1.connectSocket)(io);
const port = process.env.PORT || "3000";
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/', routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: false, message: 'no Route found!' });
});
exports.server.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
exports.default = app;
