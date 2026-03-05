import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt';

// Define the interface for User document
interface IUser extends Document {
    userName: string;
    emailId: string;
    password: string;
    isValidPassword(password: string): Promise<boolean>;
}

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

userSchema.methods.isValidPassword = async function (password :string ): Promise<boolean> {
    try{
        return await bcrypt.compare(password, this.password as string);
    }
    catch(err){
        return false;
    }
}



export const User = mongoose.model<IUser>('User',userSchema)

