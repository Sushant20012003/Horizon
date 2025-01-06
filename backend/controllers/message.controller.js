import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const findParticipents = async (req, res) => {
    try {
        const {userId} = req.body;
        const participantIds = new Set();

        const conversations = await Conversation.find({ participents: userId });
        
        conversations.forEach(conversation => {
            // Add all participants to the set
            conversation.participents.forEach(participantId => {
                participantIds.add(participantId.toString());
            });
        });

        participantIds.delete(userId);

        const participants = await User.find({
            _id: { $in: [...participantIds] }
        }).select('username profilePicture');
    
        

        return res.status(200).json({success:true, participants});
    
    } catch (error) {
        console.log(error);

    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) return res.status(404).json({ message: "Messsage not found", success: false });

        let conversation = await Conversation.findOne({ participents: { $all: [senderId, receiverId] } });
        //establish conversation if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participents: [senderId, receiverId]
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

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }


        return res.status(201).json({ newMessage, success: true });

    } catch (error) {
        console.log(error);

    }
}



export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({ participents: { $all: [senderId, receiverId] } }).populate('messages');

        // findOne retrieve a single conversation document where the participants match. 
        // If you use find, it returns an array of documents,

        //so if using find , then also do this
        //const conversation = conversations[0]; // Access the first conversation document

        if (!conversation) return res.status(200).json({ messages: [], success: true });

        return res.status(200).json({ success: true, messages: conversation.messages });

    } catch (error) {
        console.log(error);

    }
}