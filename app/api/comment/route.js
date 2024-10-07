import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {Feedback} from "@/app/models/Feedback";
import {Board} from "@/app/models/Board";
import {Notification} from "@/app/models/Notification";

export async function POST(req){
    await mongoose.connect(process.env.MONGO_URL);
    const jsonBody = await req.json();
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const feedback = await Feedback.findById(jsonBody.feedbackId);
    const board = await Board.find({slug:feedback.boardName})
    if(board.archived){
        return new Response('Unauthorized', {status: 401});
    }
    const commentDoc = await Comment.create({
        text: jsonBody.text,
        uploads: jsonBody.uploads,
        userEmail: session.user.email,
        feedbackId: jsonBody.feedbackId,
    });
    await Notification.create({
        type:'comment',
        sourceUserName: session?.user?.name,
        destinationUserEmail: feedback.userEmail,
        feedbackId: feedback._id,
    })
    return Response.json(commentDoc);
}

export async function PUT(req){
    await mongoose.connect(process.env.MONGO_URL);
    const jsonBody = await req.json();
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const {id, text, uploads} = jsonBody;
    const comment = await Comment.findById(comment.feedbackId);
    const feedback = await Feedback.findById(jsonBody.feedbackId);
    const board = await Board.find({slug:feedback.boardName})
    if(board.archived){
        return new Response('Unauthorized', {status: 401});
    }
    const updatedCoometDoc = await Comment.findOneAndUpdate(
        {userEmail:session.user.email, _id: id},
        {text, uploads},
    )
    return Response.json(updatedCoometDoc);
}

export async function GET(req){
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    if(url.searchParams.get('feedbackId')){
        const result = await Comment
            .find({feedbackId:url.searchParams.get('feedbackId')})
            .populate('user')
        return Response.json(result)
    }
    return Response.json(false);
}