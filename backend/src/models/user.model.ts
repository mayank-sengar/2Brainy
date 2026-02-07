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

userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
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

