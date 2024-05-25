import mongoose from "mongoose";


const uri: string = process.env.MONGO_URL || ""

mongoose.connect(uri).then(() => {
    console.log("mongodb connected successfully")
})
.catch(err => console.error(err));


