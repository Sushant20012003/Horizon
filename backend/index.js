import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';

dotenv.config({});

const app= express();
const PORT = process.env.PORT || 8000;


//middleware
app.use(express.json());
app.use(cookieParser());                      //used to store cookie
app.use(urlencoded({extended:true}));
app.use(cors());



//routing
app.use('/api/v1/user', userRoute);



app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running on the port ${PORT}...`);
    
});