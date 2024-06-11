"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
mongoose_1.default.connect(process.env.MONGO_URL || "").then(function () {
    console.log("connected to mongodb");
}).catch(function (err) {
    console.log(err);
});
