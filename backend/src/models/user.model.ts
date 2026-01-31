import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },


},{
    timestamps:true
})

export const User = mongoose.model('User',userSchema)