"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    categoryName: { type: String, default: "" },
    Description: { type: String, default: "" },
    videosCount: { type: [String], default: [] },
    postCount: { type: [String], default: [] },
    Display: { type: Boolean, default: true },
});
exports.CategoryModel = mongoose_1.default.model('categorys', categorySchema);
