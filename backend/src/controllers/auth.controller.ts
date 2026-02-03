import { User } from "../models/user.model.ts";
import jwt from 'jsonwebtoken'

async function generateAccessToken(user : any) : Promise<any> {
    const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
    );
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
    catch(err){
        throw new Error("Error in generating Access and Refresh Token ")
    }

    
}