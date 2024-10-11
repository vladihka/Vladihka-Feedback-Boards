import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Board } from "@/app/models/Board";
import mongoose from "mongoose";
import { Comment } from "@/app/models/Comment";
import { Feedback } from "@/app/models/Feedback";

async function getAllBoards(searchTerm) {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        const query = {
            $or: [
                { adminEmail: session.user.email },
                { allowedEmails: session.user.email },
                { visibility: "public" },
            ],
        };

        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' }; 
        }

        const boards = await Board.find(query);
        return new Response(JSON.stringify(boards), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        return new Response('Unauthorized', { status: 401 });
    }
}

export async function GET(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('search');

    if (url.searchParams.get('id')) {
        const board = await Board.findById(url.searchParams.get('id'));
        return new Response(JSON.stringify(board), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    if (url.searchParams.get('slug')) {
        const board = await Board.findOne({ slug: url.searchParams.get('slug') });
        const session = await getServerSession(authOptions);

        if (!canWeAccessThisBoard(session?.user?.email, board)) {
            return new Response('Unauthorized', { status: 401 });
        }

        return new Response(JSON.stringify(board), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return await getAllBoards(searchTerm); 
}

export async function DELETE(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const board = await Board.findById(id);
    if (!board) {
        return new Response('Board not found', { status: 404 });
    }

    if (session.user.email !== board.adminEmail) {
        return new Response('Unauthorized', { status: 403 });
    }

    if (Array.isArray(feedbacks) && feedbacks.length > 0) {
        await Comment.deleteMany({ feedbackId: { $in: feedbacks.map(fb => fb._id) } });
    }

    await Feedback.deleteMany({ boardName: board.name });

    await Board.findByIdAndDelete(id);
    return new Response('Board and associated feedback deleted', { status: 200 });
}