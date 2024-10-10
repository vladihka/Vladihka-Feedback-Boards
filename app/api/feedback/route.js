// feedbackApi.js
import { Feedback } from "@/app/models/Feedback";
import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Board } from "@/app/models/Board";
import { canWeAccessThisBoard } from "@/app/libs/boardApiFunctions";

async function connectToDatabase() {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        const { title, description, uploads, boardName } = await request.json();
        const boardDoc = await Board.findOne({ slug: boardName });

        if (!canWeAccessThisBoard(userEmail, boardDoc)) {
            return new Response('Unauthorized', { status: 401 });
        }

        const feedbackDoc = await Feedback.create({ title, description, uploads, userEmail, boardName });
        return Response.json(feedbackDoc);
    } catch {
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return Response.json(false);
    }

    const jsonBody = await request.json();
    const { id, newName, newSlug, ...rest } = jsonBody;

    // Проверяем, существует ли новый feedback с таким же названием
    const existingFeedback = await Feedback.findOne({ title: newName });
    
    if (existingFeedback) {
        // Создаем новый feedback
        const newFeedback = new Feedback({
            ...rest,
            title: newName,
            boardId: existingFeedback.boardId, // Привязываем к новому ID доски
        });
        
        await newFeedback.save(); // Сохраняем новый feedback
    } else {
        // Обновляем существующий feedback
        await Feedback.findByIdAndUpdate(id, {
            name: newName,
            slug: newSlug,
            ...rest,
        });
    }

    return Response.json(true);
}


export async function GET(req) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const session = await getServerSession(authOptions);

        if (url.searchParams.has('id')) {
            const feedback = await Feedback.findById(url.searchParams.get('id'));
            return Response.json(feedback);
        }

        const boardName = url.searchParams.get('boardName');
        const board = await Board.findOne({ slug: boardName });

        if (!canWeAccessThisBoard(session?.user?.email, board)) {
            return new Response('Unauthorized', { status: 401 });
        }

        const sortOrFilter = url.searchParams.get('sortOrFilter');
        const loadedRows = parseInt(url.searchParams.get('loadedRows'), 10) || 0;
        const searchPhrase = url.searchParams.get('search');

        const filter = { boardName };
        let sortDef = {};

        if (sortOrFilter === 'latest') sortDef = { createdAt: -1 };
        if (sortOrFilter === 'oldest') sortDef = { createdAt: 1 };
        if (sortOrFilter === 'votes') sortDef = { votesCountCached: -1, createdAt: -1 };

        if (['planned', 'in_progress', 'complete', 'archived'].includes(sortOrFilter)) {
            filter.status = sortOrFilter;
        } else {
            filter.status = { $in: ['new', null] };
        }

        if (searchPhrase) {
            const comments = await Comment.find({ text: { $regex: `.*${searchPhrase}.*` } }, 'feedbackId', { limit: 10 });
            filter['$or'] = [
                { title: { $regex: `.*${searchPhrase}.*` } },
                { description: { $regex: `.*${searchPhrase}.*` } },
                { _id: comments.map(c => c.feedbackId) }
            ];
        }

        const feedbacks = await Feedback.find(filter, null, {
            sort: sortDef,
            skip: loadedRows,
            limit: 10,
        }).populate('user');

        return Response.json(feedbacks);
    } catch {
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        const { id } = await request.json();

        const feedbackDoc = await Feedback.findById(id);
        const boardName = feedbackDoc.boardName;

        const isAdmin = await Board.exists({ name: boardName, adminEmail: session.user.email });
        if (!isAdmin && feedbackDoc.userEmail !== session.user.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        await Feedback.findByIdAndDelete(id);
        return new Response('Feedback deleted', { status: 200 });
    } catch {
        return new Response('Internal Server Error', { status: 500 });
    }
}
