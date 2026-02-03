import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

userSchema.pre('save',async function(next :any){
    try{
        if(!this.isModified('password')) return next();
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
    catch(error){
        next(error);
    }
});

 userSchema.methods.isValidPassword = async function (password :string ){
    try{
        return await bcrypt.compare(password,this.password);

    }
    catch(err){
        throw new Error("Invalid Password")
    }
}



export const User = mongoose.model('User',userSchema)

