"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const routes_1 = __importDefault(require("./presentation/routes/routes"));
const morgan_1 = __importDefault(require("morgan"));
require("../config/database");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || "";
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.APIGATEWAY_URL,
    allowedHeaders: ['Authorization']
}));
app.use('/', routes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
