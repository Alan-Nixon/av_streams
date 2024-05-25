import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user_Model_Interface";




const userSchema: Schema<IUser> = new Schema<IUser>({
    userName: { type: String, required: true },
    FullName: { type: String, required: true },
    RefreshToken: { type: String, required: false },
    Phone: { type: Number, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isBlocked: { type: Boolean, required: true, default: false }
});


export const UserModel = mongoose.model<IUser>('users', userSchema);
