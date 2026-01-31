import mongoose from "mongoose";
import { Schema } from "mongoose";

const tagSchema=new mongoose.Schema({
    tagName :{
        type:String,
        required:true
    },
    dataName:{
        type:Schema.Types.ObjectId,
        ref:'Data'
    }
    
    
},{
    timestamps:true
})


export const Tag = mongoose.model('Tag',tagSchema);