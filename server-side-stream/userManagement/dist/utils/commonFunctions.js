"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatesOfCurrentYear = exports.getDate = exports.getLastMonths = exports.isValidObjectId = exports.getUserDetailsFromToken = void 0;
const userauthenticationforavstreams_1 = require("userauthenticationforavstreams");
const user_1 = require("../src/data/models/user");
function getUserDetailsFromToken(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = (0, userauthenticationforavstreams_1.getDataFromToken)((0, userauthenticationforavstreams_1.getTokenFromRequest)(req) || "");
        return yield user_1.UserModel.findById(payload.id);
    });
}
exports.getUserDetailsFromToken = getUserDetailsFromToken;
const isValidObjectId = (str) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(str);
};
exports.isValidObjectId = isValidObjectId;
const getLastMonths = (monthCount) => {
    let currentDate = new Date().getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const lastMonths = [];
    while (currentDate > -1) {
        lastMonths.push(monthNames[currentDate]);
        currentDate--;
    }
    return lastMonths.reverse();
};
exports.getLastMonths = getLastMonths;
const getDate = (date, inc, fullDay) => {
    let currentDate = (!fullDay) ? new Date() : new Date(fullDay);
    currentDate.setDate(currentDate.getDate() + (inc ? date : -date));
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${day}`;
};
exports.getDate = getDate;
const getDatesOfCurrentYear = (arrayOfDays) => {
    const currentYear = new Date().getFullYear();
    const filteredArray = arrayOfDays.filter(item => {
        let dateYear = new Date(item).getFullYear();
        return dateYear <= currentYear;
    });
    return filteredArray;
};
exports.getDatesOfCurrentYear = getDatesOfCurrentYear;
