import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import getDataUri from "../utils/datauri.js";

export const addNewPost = async(req, res)=>{
    try {
        const {caption}  = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image || !image.buffer) {
            return res.status(400).json({ message: "Invalid image data", success: false });
        }

        // Determine the file extension to adjust the format accordingly
        const extName = image.originalname.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';

        // Optimize the image using sharp
         const optimizedImageBuffer = await sharp(image.buffer)
         .resize({ width: 800, height: 800, fit: "inside" })
         .toFormat(extName, { quality: 80 })
         .toBuffer();


        //Method 1

        // // Create a mock file object for getDataUri
        // const optimizedFile = {
        //     originalname: `image.${extName}`, // Provide a mock file name
        //     buffer: optimizedImageBuffer,
        // };

        // // Convert buffer to Data URI
        // const fileUri = getDataUri(optimizedFile);


        //Method 2

        // Convert the buffer to Data URI with proper MIME type
        const fileUri = `data:image/${extName};base64,${optimizedImageBuffer.toString('base64')}`;       //here file extention name should be correct


        //upload to cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "ig-clone/posts",
        }).catch(err => {
            console.error("Cloudinary Upload Error: ", err);
            return res.status(500).json({ message: "Image upload failed", success: false });
        });

        //Creating post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            imagePublicId:cloudResponse.public_id,
            author: authorId
        });

        //updating user posts
        const user = await User.findById(authorId);
        if(user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:'-password'})

        // populate is used to replace the author field (which currently holds only the author's ID) 
        // with the complete user document, excluding the password field.

        return res.status(201).json({message:"New post added", success:true, post});

    } catch (error) {
        console.log(error);
        
    }
}


export const getAllPost = async(req, res)=> {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username, profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username, profilePicture'
            }
        });

        return res.status(200).json({posts, success:true});

    } catch (error) {
        console.log(error);
        
    }
}

export const getUserPost = async(req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({path:'author', select:'username, profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username, profilePicture'
            }
        });
    
        return res.status(200).json({posts, success:true}); 

    } catch (error) {
        console.log(error);
        
    }
}



export const likePost = async(req, res)=>{
    try {
        const authorId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({message:'Post not found', success:false});
        }

        //like and dislike logic
        const isLiked = post.likes.includes(authorId);
        
        if(isLiked) {
            await Post.updateOne({_id:postId}, {$pull:{likes:authorId}});
            return res.status(200).json({message:"Post unliked", success:true});
        }
        else {
            await Post.updateOne({_id:postId}, {$push:{likes:authorId}});
            return res.status(200).json({message:'Post liked', success:true});
        }
        
    } catch (error) {
        console.log(error);
        
    }
}


export const addComment = async(req, res)=>{
    try {
        const authorId = req.id;
        const postId = req.params.id;
        const {text} = req.body;

        if(!text) return res.status(400).json({message:"Text is required", success:false});

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:"Post not found", success:false});

        //creating comment
        let comment = await Comment.create({
            author:authorId,
            text,
            post:postId
        });                      //can not populate during creation 

        comment.author = (await comment.populate({path:'author', select:'username profilePicture'})).author;
        

        //adding comment to post
        post.comments.push(comment._id);          //Modify document in memory 
        await post.save();                        //Save changes in database

        return res.status(200).json({message:'Comment added', success:true, comment});

    } catch (error) {
        console.log(error);
        
    }
}



export const getCommentsOfPost = async(req, res)=>{
    try {
        const postId= req.params.id;

        const comments = await Comment.find({post:postId})
        .populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({message:'Not commented yet', success:false});

        return res.status(200).json({comments, success:true});

    } catch (error) {
        console.log(error);
        
    }
}


export const deletePost = async(req, res)=>{
    try {
        const authorId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:'Post not found'});

        //checking post author authentication 
        if(post.author.toString() != authorId) {
            return res.status(403).json({message:'Can not delete, unauthorized user', success:false});
        }
        
    
        //updating user post 
        // const user = await User.findById(authorId);
        // user.posts.pull(postId);
        // await user.save();
        await User.findByIdAndUpdate(authorId, {$pull:{posts:postId}});


        //delete associated comment
        await Comment.deleteMany({post:postId});

        //deleting post image from cloudinary
        if(post.imagePublicId) {
            await cloudinary.uploader.destroy(post.imagePublicId);
        }

        //delete post
        await Post.findByIdAndDelete(postId);
        
        return res.status(200).json({message:'Post deleted successfully'});
        
        
    } catch (error) {
        console.log(error);
        
    }
}



export const bookmarkPost = async(req, res)=>{
    try {
        const authorId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post not found", success:false});

        const user = await User.findById(authorId);

        //bookmarks logic(save or unsave)
        const isBookmarked = user.bookmarks.includes(postId);
        if(isBookmarked) {
            // await User.findByIdAndUpdate(authorId, {$pull:{bookmarks:postId}});
            await user.updateOne({$pull:{bookmarks:postId}});   //directly update in database
            return res.status(200).json({message:'Post unsaved', success:true});
        }
        else {
            // await User.findByIdAndUpdate(authorId, {$push:{bookmarks:postId}});
            await user.updateOne({$push:{bookmarks:postId}});
            return res.status(200).json({message:'Post saved', success:true});

        }
        
        
    } catch (error) {
        console.log(error);
        
    }
}