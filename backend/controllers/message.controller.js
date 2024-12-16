import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async(req, res) =>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        if(!message) return res.status(404).json({message: "Messsage not found", success:false});

        let conversation = await Conversation.findOne({participents:{$all:[senderId, receiverId]}});
        //establish conversation if not started yet
        if(!conversation) {
            conversation = await Conversation.create({
                participents:[senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);

        await conversation.save();

        //implement socket io


        return res.status(201).json({newMessage, success:true});

    } catch (error) {
        console.log(error);
        
    }
}



export const getMessage = async(req, res) =>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({participents:{$all:[senderId, receiverId]}}).populate('messages');

        // findOne retrieve a single conversation document where the participants match. 
        // If you use find, it returns an array of documents,

        //so if using find , then also do this
        //const conversation = conversations[0]; // Access the first conversation document

        if(!conversation) return res.status(200).json({message:[], success:true});

        return res.status(200).json({success:true, messages:conversation.messages});
        
    } catch (error) {
        console.log(error);
        
    }
}