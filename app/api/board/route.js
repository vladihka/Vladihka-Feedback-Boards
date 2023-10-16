import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {Board} from "@/app/models/Board";

async function getMyBoards(){
    const session = await getServerSession(authOptions);
    if(session?.user){
        return Response.json(
            await Board.find({adminEmail:session.user.email})
        )
    }
    else{
        return Response.json([]);
    }
}

export async function GET(request){
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(request.url);
    if(url.searchParams.get('id')){
        const board = await Board.findById(url.searchParams.get('id'))
        return Response.json(board);
    }
    if(url.searchParams.get('slug')){
        const board = await Board.findOne({slug:url.searchParams.get('slug')})
        return Response.json(board);
    }
    else {
        return await getMyBoards();
    }
}

export async function POST(request){
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const jsonBody = await  request.json();
    const {name, slug, description} = jsonBody;
    const boardDoc = await Board.create({
        name,
        slug,
        description,
        adminEmail: session.user.email,
    })
    return Response.json(boardDoc);
}

export async function PUT(request){
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const jsonBody = await request.json();
    const {id, name, slug, description} = jsonBody;
    const board = await Board.findById(id);
    if(session.user.email !== board.adminEmail){
        return Response.json(false);
    }
    return Response.json(
        await Board.findByIdAndUpdate(id, {name, slug, description})
    );
}