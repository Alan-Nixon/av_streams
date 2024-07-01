import mongoose, { Schema } from "mongoose";

interface IBanner {
    imgUrl: string,
    location: string
}



const bannerSchema: Schema<IBanner> = new Schema<IBanner>({
    imgUrl: { type: String, required: true },
    location: { type: String, required: true },
});


export const BannerModel = mongoose.model<IBanner>('banners', bannerSchema);


