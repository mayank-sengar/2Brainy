import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db';
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

connectDB();


app.use('/auth',authRoutes);
app.use('/user',userRoutes)


//global error handler middleware 
app.use((err :any ,req :any,res :any,next :any)=>{
    console.error(err.stack);
    res.status(500).json({
        error:'Internal Server Error'
    })

})
const PORT = process.env.PORT || 8000
app.listen(PORT ,()=>
{
 console.log(`Server running on  PORT ${PORT}`);
});

