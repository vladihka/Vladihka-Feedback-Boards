import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Board} from "@/app/models/Board";
import mongoose from "mongoose";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";

async function getAllBoards(){
    const session = await getServerSession(authOptions);
    if(session?.user){
        return Response.json(
            await Board.find({
                $or: [
                    { adminEmail: session.user.email },
                    { allowedEmails: session.user.email },
                    { visibility: "public"}
                ]
            })
        )
    }
}

export async function GET(request){

    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(request.url);
    const pathname = url.pathname;

    if(url.searchParams.get('id')){
        const board = await Board.findById(url.searchParams.get('id'))
        return Response.json(board);
    }

    if(url.searchParams.get('slug')){
        const board = await Board.findOne({slug:url.searchParams.get('slug')});
        const session = await getServerSession(authOptions);
        if(!canWeAccessThisBoard(session?.user?.email, board)){
            return new Response('Unauthorized', {status: 401});
        }
        return Response.json(board);
    }
    else {
        return await getAllBoards();
    }
}