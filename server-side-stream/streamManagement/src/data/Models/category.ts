import mongoose, { Schema, Document } from 'mongoose'

interface ICategory extends Document {
    categoryName: string,
    Description: string
    videosCount: string[],
    postCount: string[],
    Display: boolean,
}

const categorySchema: Schema<ICategory> = new Schema({
    categoryName: { type: String, default: "" },
    Description: { type: String, default: "" },
    videosCount: { type: [String], default: [] },
    postCount: { type: [String], default: [] },
    Display: { type: Boolean, default: true },
})

export const CategoryModel = mongoose.model('categorys', categorySchema);

