import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.ts'

const app = express();
dotenv.config();

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 8000
app.listen(PORT ,()=>
{
 console.log(`Server running on  PORT ${PORT}`);
});

