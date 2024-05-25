import { v2 as cloudinary } from 'cloudinary';
import { generateName } from 'user_random_name_generator'
import { ChannelModel } from '../src/data/models/channel';
import { ImageData } from '../src/core/interfaces';



export const createChannel = async (userId: string, userName: string, profileImage?: string) => {
    await ChannelModel.insertMany({
        userId, userName,
        channelName: await generateName(),
        profileImage: profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg"
    })
}



export const uploadImage = async (imageData: ImageData,folderName:string): Promise<any> => {
    console.log(imageData);

    const { filepath } = imageData;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const res = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto",
            folder: folderName,
        });

        return res;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}

