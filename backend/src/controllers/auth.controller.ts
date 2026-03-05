import { User } from "../models/user.model";
import jwt from 'jsonwebtoken'
import { Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
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
        process.env.REFRESH_TOKEN_SECRET!,
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

        const user = await User.findById(userId).select("-password").lean();

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
   return res.status(400).json(new ApiResponse(400, null, err.message || "Error in signup API"));
    }


}

async function signIn(req:Request , res : Response) : Promise<any>{
    try{
        
        const {emailId, password} = req.body;
        if(!emailId || !password) { 
            return res.status(400).json(new ApiResponse(400,"Both the Fields are required"));
        }
       const user = await User.findOne({emailId : emailId}).select("+password");
       if(!user){
        return res.status(400).json(new ApiResponse(409,"User with given  credentials do not exist"))
       }

       //password is taken as string from input
       const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json(
                new ApiResponse(401, null, "Invalid credentials")
            );
        }

       const {accessToken , refreshToken}= await generateAccessRefreshToken(user._id.toString());

   const options = {
    httpOnly : true,
    secure : true,
    sameSite : "none" as const,
   }

   return res.status(201)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(new ApiResponse(201,{user: user},"User registered successfully"))

       
        
    }
    catch(err : any){
        console.log("SIGNIN Error", err);
        return res.status(400).json(new ApiResponse(400,err.message || "Error is signin API"))
    }
}

//used for refreshing access token using refresh token  , if access token is expired
//details-NOTION
async function tokenRefresh(req : Request, res: Response) : Promise<any>{
    try{
        const refreshToken = req.cookies.refreshToken;

        //logout handeled by frontend api interceptor 
        if(!refreshToken){
            throw new  ApiError(403,"Refresh Token not found")
        }

        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        }
        const decodedToken = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
        
        const user = await User.findById(decodedToken._id).select("-password").lean();

        if(!user){
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = await generateAccessToken(user);
        const options = {
            httpOnly : true,
            secure : true,
            sameSite : "none" as const,
        }

        return res.status(200).cookie("accessToken",newAccessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(201,null,"Token refreshed"));
    

    }
    catch(err : any){
        console.log("Error in refreshing token",err);
        return res.status(403).json(new ApiResponse(403,err.message || "Error in refreshing token"));
    }

}





export  {signUp,signIn,tokenRefresh}


