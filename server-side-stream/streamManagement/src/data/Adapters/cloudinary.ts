import { v2 as cloudinary } from 'cloudinary';
import { ImageData } from '../interfaces/cloundinaryInterface';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imageData: ImageData, folder: string): Promise<any> => {
    const { filepath } = imageData;
    try {
        return await cloudinary.uploader.upload(filepath, {
            resource_type: "auto",
            folder
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}

export const getPublicIdFromUrlCloudinary = (imageUrl: string) => {
    try {
        return imageUrl.split('/').pop()?.split('.')[0];
    } catch (error) {
        console.error('Error getting public ID:', error);
        return null;
    }
}

export const deleteImageFromCloudinary = async (publicId: string) => {
    try {
        console.log("publicId : ", publicId);
        return await cloudinary.uploader.destroy('avstreamPosts/' + publicId);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

export const findImageByPublicId = async (publicId: string) => {
    try {
        const res = await cloudinary.api.resources({
            type: 'upload',
            public_id: publicId
        })
        return res
    } catch (error) {
        console.error(error)
    }
}

