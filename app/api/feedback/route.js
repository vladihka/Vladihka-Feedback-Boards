import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";

export async function POST(request){
    const jsonBody = await request.json();
    const {title, description, uploads} = jsonBody;
    const mongoUrl = process.env.MONGO_URL;
    mongoose.connect(mongoUrl);
    await Feedback.create({title, description, uploads});
    return Response.json(jsonBody);
}