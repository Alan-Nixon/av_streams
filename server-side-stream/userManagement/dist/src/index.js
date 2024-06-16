"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("../config/Database");
const Routes_1 = __importDefault(require("./presentation/Routes/Routes"));
const AdminRoutes_1 = __importDefault(require("./presentation/Routes/AdminRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("../src/presentation/Grpc/user_stream");
require("./presentation/RabbitMq/producer");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    allowedHeaders: ['Authorization']
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Route handling
app.use('/', Routes_1.default);
app.use('/', AdminRoutes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});
// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
// Server startup
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
exports.default = app;
