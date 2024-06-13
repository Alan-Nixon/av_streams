import { uploadImage, uploadImageBuffer } from "../Adapters/cloudinary";
import { LiveModel } from "../Models/live";
import { liveDataInteface, livestreamInterface } from "../interfaces/liveStreamRepoInt";



class streamRepositaryLayerClass implements livestreamInterface {

    async insertLiveStreamData(data: liveDataInteface) {
        const url = await uploadImageBuffer(data.Thumbnail as Buffer , "liveThumbnails")
        await LiveModel.insertMany(data)
        console.log(url);
        
    }

}

export const streamRepositaryLayer: livestreamInterface = new streamRepositaryLayerClass()