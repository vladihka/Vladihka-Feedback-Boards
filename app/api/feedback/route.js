import { Feedback } from "@/app/models/Feedback";
import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request){
    const jsonBody = await request.json();
    const {title, description, uploads} = jsonBody;
    const mongoUrl = process.env.MONGO_URL;
    mongoose.connect(mongoUrl);
    const session = await getServerSession(authOptions);
    const userEmail = session.user.email;
    const feedbackDoc = await Feedback.create({title, description, uploads, userEmail});
    return Response.json(feedbackDoc);
}

export async function PUT(request){
        const jsonBody = await request.json();
        const {title, description, uploads, id, status} = jsonBody;
        const mongoUrl = process.env.MONGO_URL;
        mongoose.connect(mongoUrl);
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json(false);
        }
        const isAdmin = session.user.email === 'vladihka58@gmail.com';
        const updateData = status ? {status} : {title, description, uploads};
        const filter = {_id:id};
        if(!isAdmin) {
            filter.userEmail = session.user.email;
        }
        const newFeedbackDoc = await Feedback.updateOne(
            filter, 
            updateData,
        );
        return Response.json(newFeedbackDoc);
}

export async function GET(req){
    const mongoUrl = process.env.MONGO_URL;
    mongoose.connect(mongoUrl);
    const url = new URL(req.url);
    if(url.searchParams.get('id')){
        return Response.json(
            await Feedback.findById(url.searchParams.get('id'))
        )
    }
    else{
        const sortOrFilter = url.searchParams.get('sortOrFilter');
        const loadedRows = url.searchParams.get('loadedRows');
        const searchPhrase = url.searchParams.get('search');
        let sortDef = {};
        let filter = {};
        if(sortOrFilter === 'latest'){
            sortDef = {createdAt: -1};
        }
        if(sortOrFilter === 'oldest'){
            sortDef = {createdAt: 1};
        }
        if(sortOrFilter === 'votes'){
            sortDef = {votesCountCached: -1};
        }

        if(['planned', 'in_progress', 'complete', 'archived'].includes(sortOrFilter)){
            filter.status = sortOrFilter;
        } else{
            filter.status = {$in:['new', null]}
        }

        if(searchPhrase){
            const comments = await Comment.find({text:{$regex:'.*'+searchPhrase+'.*'}}, 'feedbackId', {limit:10})
            filter = {
                $or:[
                    {title:{$regex:'.*'+searchPhrase+'.*'}},
                    {description:{$regex:'.*'+searchPhrase+'.*'}},
                    {_id:comments.map(c => c.feedbackId)}
                ]
            }
        }

        return Response.json(
            await Feedback.find(filter,null,{
                sort: sortDef,
                skip: loadedRows,
                limit: 10,
            }).populate('user')
        );
    }

}