import { text } from "express";
import mongoose from "mongoose";

const commnetSchema = new mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', require:true},
    text:{type:String, require:true},
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post', require:true}
});

export const Comment= mongoose.model('Comment', commnetSchema);