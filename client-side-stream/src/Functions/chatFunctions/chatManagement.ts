import { axiosApiGateWay } from "../commonFunctions";
import { messageArray } from "../interfaces";



export const getChatOfUser = async (userId: string) => {
    try {
        const { data } = await axiosApiGateWay.get('/chatManagement/getChatOfUser?userId=' + userId)
        return data
    } catch (error) {
        console.log(error);
        return []
    }
}

export const saveAudio = async (audioBlob: Blob, message: messageArray) => {
    try {
        const form = new FormData()
        form.append('audioBuffer', audioBlob)
        form.append('message', JSON.stringify(message))
        const { data } = await axiosApiGateWay.post('/chatManagement/saveAudio', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data
    } catch (error) {
        console.log(error);
        return { data: "" }
    }
}