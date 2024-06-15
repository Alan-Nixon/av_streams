import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAudio = async (Data: any, folder: string): Promise<any> => {
    const { filepath } = Data;
    try {
        return await cloudinary.uploader.upload(filepath, {
            resource_type: "auto",
            folder
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
    }
}