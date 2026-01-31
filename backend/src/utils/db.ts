import mongoose from "mongoose";



const connectDB= async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("MongoDB successfully connected")
    }
    catch(err){
        console.log("Error connecting to mongoDB server",err);
    }
}

export default  connectDB