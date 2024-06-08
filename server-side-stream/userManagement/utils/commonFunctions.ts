import { Request } from "express"
import { getDataFromToken, getTokenFromRequest } from "userauthenticationforavstreams"
import { UserModel } from "../src/data/models/user"
import { payload } from "../src/core/interfaces"


export async function getUserDetailsFromToken(req: Request) {
    const payload = getDataFromToken(getTokenFromRequest(req) || "") as payload
    return await UserModel.findById(payload.id)
}

export const isValidObjectId = (str: string) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(str);
};

export const getLastMonths = (monthCount: number) => {
    let currentDate = new Date().getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const lastMonths = []
    while (currentDate > -1) {
        lastMonths.push(monthNames[currentDate]);
        currentDate--
    }
    return lastMonths.reverse()
}

export const getDate = (date: number, inc: boolean, fullDay?: string) => {

    let currentDate = (!fullDay) ? new Date() : new Date(fullDay);
    currentDate.setDate(currentDate.getDate() + (inc ? date : -date));
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${day}`;

}

export const getDatesOfCurrentYear = (arrayOfDays: string[]) => {
    const currentYear = new Date().getFullYear()
    const filteredArray = arrayOfDays.filter(item => {
        let dateYear = new Date(item).getFullYear()
        return dateYear <= currentYear
    })
    return filteredArray
}