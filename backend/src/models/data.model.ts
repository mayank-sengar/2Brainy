import mongoose from "mongoose";
import { Schema } from "mongoose";
const dataSchema = new mongoose.Schema({
    dataType:{
        type: String,
        enum:['Youtube Video','Spotify Music','Text','Others'],
        required:true
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    tagId :{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    },
    content:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

export const Data = mongoose.model('Data',dataSchema)