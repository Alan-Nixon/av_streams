import mongoose, { Document, Schema } from "mongoose";

interface IVideos extends Document {
  Thumbnail: string;
  Link: string;
  shorts: boolean
}

const VideoSchema: Schema<IVideos> = new Schema<IVideos>({
  Link: { type: String, required: true },
  Thumbnail: { type: String, required: true },
  shorts: { type: Boolean, required: true }
});


export interface SubscriptionInterface {
  expires: string,
  section: string,
  paymentId: string,
  userId: string,
  email: string,
  amount: number
}


export interface IChannel extends Document {
  userId: string;
  userName: string;
  channelName: string;
  profileImage: string;
  Followers: string[]
  Streams: IVideos[]
  Videos: IVideos[]
  Shorts: IVideos[]
  premiumCustomer: boolean;
  subscription: SubscriptionInterface;
}


const subscriptionDefault = (): SubscriptionInterface => ({
  expires: "",
  section: "",
  userId: "",
  email: "",
  paymentId: "",
  amount: 0
});


const channelSchema: Schema<IChannel> = new Schema<IChannel>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  channelName: { type: String, required: true },
  profileImage: { type: String, required: true, default: "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg" },
  Followers: { type: [String], default: [], required: true },
  Streams: { type: [VideoSchema], default: [], required: true },
  Videos: { type: [VideoSchema], default: [], required: true },
  Shorts: { type: [VideoSchema], default: [], required: true },
  premiumCustomer: { type: Boolean, default: false, required: true },
  subscription: { type: Object, default: subscriptionDefault, required: true }
});


channelSchema.post('findOne', async function (data, next) {
  try {
    if (data && data.subscription && data.subscription.expires !== "") {
      const expiringDate = new Date(data.subscription.expires).getTime();
      const currentDate = new Date().getTime();
      const balance = Math.ceil((expiringDate - currentDate) / (1000 * 60 * 60 * 24));

      if (balance < 0) { await removeSub(data._id + "") }
      
    }
  } catch (error) {
    console.error('Error in post findOne middleware:', error);
  }
  next();
});


export const ChannelModel = mongoose.model<IChannel>('channel', channelSchema);



async function removeSub(id: string) {
  await ChannelModel.findByIdAndUpdate(id, {
    subscription: subscriptionDefault,
    premiumCustomer: false
  })
}


