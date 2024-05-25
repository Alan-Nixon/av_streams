import { Request } from "express"
import { getDataFromToken, getTokenFromRequest } from "userauthenticationforavstreams"
import { UserModel } from "../src/data/models/user"
import { payload } from "../src/core/interfaces"


export async function getUserDetailsFromToken(req:Request) {
    const payload = getDataFromToken(getTokenFromRequest(req) || "") as payload
    return await UserModel.findById(payload.id)
}

export const isValidObjectId = (str:string) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(str);
  };

   