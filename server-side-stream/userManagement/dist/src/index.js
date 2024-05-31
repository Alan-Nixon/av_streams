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
    origin: process.env.APIGATEWAY_URL,
    allowedHeaders: ['Authorization']
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/', Routes_1.default);
app.use('/', AdminRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});
exports.default = app;
