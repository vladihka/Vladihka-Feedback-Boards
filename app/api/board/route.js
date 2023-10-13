import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {Board} from "@/app/models/Board";

export async function GET(){
    mongoose.connect(process.env.MONGO_URL);
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