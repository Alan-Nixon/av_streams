import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || "").then(()=>{
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);    
})