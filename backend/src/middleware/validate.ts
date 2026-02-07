import jwt from "jsonwebtoken"
import { User } from "../models/user.model";
export const verifyJWT = async (req :any, res :any,next:any) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new Error("Unauthorized request")
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;
        
        const user = await User.findById(decodedToken._id).select("-password");

        if(!user){
            throw new Error("Invalid access token");
        }

        req.user=user;
        next();
    }
    catch(err :any){
        throw new Error(err)
    }
}


