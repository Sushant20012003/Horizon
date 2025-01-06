import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js'
import {app, server } from './socket/socket.js';

dotenv.config({});


const PORT = process.env.PORT || 8000;


//middleware
app.use(express.json());
app.use(cookieParser());                      //used to store cookie
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true  // Allow cookies to be sent and received
}));



//routing
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);




server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running on the port ${PORT}...`);
    
});