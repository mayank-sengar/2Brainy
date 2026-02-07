import { User } from "../models/user.model.ts";
import jwt from 'jsonwebtoken'
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
async function generateAccessToken(user : any) : Promise<any> {
    const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
    );
     if(!accessToken){
        throw new ApiError(500,"ACCESS_TOKEN_SECRET issue")
    }
    return accessToken;
}

async function generateRefreshToken(user : any) : Promise<any> {
    const refreshToken = jwt.sign(
        user,
        process.env.ACCESS_REFRESH_SECRET!,
        {
            expiresIn: "1d"
        }
    );

    if(!refreshToken){
        throw new ApiError(500,"ACCESS_REFRESH_SECRET issue")
    }
    return refreshToken;
}



 async function generateAccessRefreshToken(userId :string) : Promise<any> {
    try{

        const user = await User.findById(userId).select("-password");

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        if(!accessToken){
            throw new Error("Error in creating access Token");
        }
        if(!refreshToken){
            throw new Error("Error in creating refresh Token");
        }

        return {
            accessToken: accessToken,
            refreshToken : refreshToken
        };

    }
    catch(err: any){
        console.error("Token generation error:", err);
        throw new Error(err.message || "Error in generating Access and Refresh Token ");
    }

}


async function signUp(req:Request ,res:Response ) : Promise<any>{
    try{
    const {userName,emailId,password} = req.body;

    const existingUser=await User.findOne({emailId})

    if(existingUser){
        throw new ApiError(409,"User with this EmailId already exists");
    };


    const newUser= await User.create({
        userName : userName,
        emailId: emailId,
        password: password,
    })


    if(!newUser){
        throw new ApiError(500,"Issue with signing User");
    }
    

   const {accessToken , refreshToken}= await generateAccessRefreshToken(newUser._id.toString());

   const options = {
    httpOnly : true,
    secure : true,
    sameSite : "none" as const,
   }

   return res.status(201)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(new ApiResponse(201,{user: newUser},"User registered successfully"))

    }
    catch(err: any){
   console.error("SIGNUP ERROR:", err);
   return res.status(500).json(new ApiResponse(500, null, err.message || "Error in signup API"));
    }


}


export default signUp


