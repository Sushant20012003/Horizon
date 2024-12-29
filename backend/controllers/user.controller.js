import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(401).send({message:"Something is missing, please ckeck!", success:false});
        }

        let user= await User.findOne({email});
        if(user) {
            return res.status(401).send({message:"User already exits, try another email", success:false});
        }

        const hashedPassword  = await bcrypt.hash(password, 10);
        user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        user.password = undefined;

        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
        return res.cookie('token', token, {httpOnly:true, sameSite:'strict',secure:false ,maxAge: 1*24*60*60*1000})
        .send({
            message: `Account created successfully`,
            success:true, 
            user
        });

    } catch (error) {
        console.log(error);
        
    }
}


export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(401).send({message:"Something is missing, please check!", success:false})
        }

        let user = await User.findOne({email}).populate({path:'posts'});
        if(!user) {
            return res.status(401).send({message:"Incorrect email or password!", success:false});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(401).send({message:"Incorrect email or password!", success:false});
        }

        user.password = undefined;

        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
        return res.cookie('token', token, {httpOnly:true, sameSite:'strict',secure:false ,maxAge: 1*24*60*60*1000})
        .send({
            message: `Welcome back ${user.username}`,
            success:true, 
            user
        });

    } catch (error) {
        console.log(error);
        
    }
}



export const logout= async(req, res)=>{
    try {
        return res.cookie("token","", {maxAge:0}).json({message:"Logged out successfully", success:true})
    } catch (error) {
        console.log(error);
        
    }
}



export const getProfile= async(req, res)=>{
    try {
        const userId= req.params.id;
        let user= await User.findById(userId).select('-password');
        return res.status(200).json({user, success:true});

    } catch (error) {
        console.log(error);
        
    }
}

export const editProfile = async(req, res)=> {
    try {
        const userId = req.id;
        let user = await User.findById(userId).select('-password');
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;


        //upload to cloudinary
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);           //this is basically image path
            cloudResponse = await cloudinary.uploader.upload(fileUri, {
                folder: "ig-clone/profilePictures"
            });
        }

        //updating user
        if(bio) user.bio = bio;
        if(gender) user.gender= gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();       //*** save updated user in database

        return res.status(200).json({message:"Profile udpated successfully!", success:true, user});

    } catch (error) {
        console.log(error);
        
    }
    
}


export const getSuggestedUsers = async(req, res)=>{
    try {
        const users = await User.find({_id:{$ne:req.id}});          //$ne -> not equal to
        if(!users) {
            return res.status(400).json({message: "Currently no suggested users!", success:false});
        }
        return res.status(200).json({
            success:true,
            users
        });
    } catch (error) {
        console.log(error);
        
    }
}


export const followOrUnfollow = async(req, res) =>{
    
    try {
        const userId = req.id;
        const targetUserId = req.params.id;

        if(userId == targetUserId) {
            return res.status(400).json({message: "You can't follow or unfollow youself!"});
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if(!user || !targetUser) {
            return res.status(400).json({message:"User not found!", success:false});
        }

        const isFollowing = user.following.includes(targetUserId);

        if(isFollowing) {
            await Promise.all([          //use when handling more than one document of mongodb
                User.updateOne({_id:userId}, {$pull:{following:targetUserId}}),
                User.updateOne({_id:targetUserId}, {$pull:{followers: userId}})
            ]);
            return res.status(200).json({message:"Unfollowed successfully", success:true});
        }
        else {
            await Promise.all([
                User.updateOne({_id:userId}, {$push:{following:targetUserId}}),
                User.updateOne({_id:targetUserId}, {$push:{followers:userId}})
            ]);
            return res.status(200).json({message:"Followed successfully", success:true});
        }

    } catch (error) {
        console.log(error);
        
    }

}