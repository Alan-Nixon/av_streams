"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGO_URL || "";
mongoose_1.default.connect(uri).then(() => {
    console.log("mongodb connected successfully");
})
    .catch(err => console.error(err));
