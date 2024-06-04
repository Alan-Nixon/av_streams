import { axiosApiGateWay } from "../commonFunctions";



export const getChatOfUser = async (userId: string) => {
    try {
        const { data } = await axiosApiGateWay.get('/chatManagement/getChatOfUser?userId=' + userId)
        return data
    } catch (error) {
        console.log(error);
        return []
    }
}