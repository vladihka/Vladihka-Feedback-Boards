import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {Board} from "@/app/models/Board";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";
import { Feedback } from "@/app/models/Feedback";
import { Comment } from "@/app/models/Comment";

async function getMyBoards(searchQuery = '') {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        const filter = { adminEmail: session.user.email };

        if (searchQuery) {
            filter.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        return Response.json(
            await Board.find(filter)
        );
    } else {
        return Response.json([]);
    }
}

export async function GET(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';

    if (url.searchParams.get('id')) {
        const board = await Board.findById(url.searchParams.get('id'));
        return Response.json(board);
    }

    if (url.searchParams.get('slug')) {
        const board = await Board.findOne({ slug: url.searchParams.get('slug') });
        const session = await getServerSession(authOptions);
        if (!canWeAccessThisBoard(session?.user?.email, board)) {
            return new Response('Unauthorized', { status: 401 });
        }
        return Response.json(board);
    } else {
        return await getMyBoards(searchQuery);
    }
}


export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json(false);
    }

    const jsonBody = await request.json();
    const { name, slug, description, visibility, allowedEmails, style } = jsonBody;

    const boardDoc = await Board.create({
      name,
      slug,
      description,
      visibility,
      style,
      allowedEmails,
      adminEmail: session.user.email,
    });

    return Response.json(boardDoc);

  } catch (error) {
    if (error.code === 11000) { 
      return Response.json({ error: 'Board with this slug already exists' }, { status: 400 });
    } else {
      return Response.json({ error: 'Server error' }, { status: 500 });
    }
  }
}

export async function PUT(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: 'Пользователь не авторизован' }, { status: 401 });
    }

    const jsonBody = await request.json();
    const {
        id, name, slug, description, visibility, allowedEmails, archived, style,
    } = jsonBody;

    const board = await Board.findById(id);
    
    if (!board) {
        return Response.json({ error: 'Доска не найдена' }, { status: 404 });
    }

    if (session.user.email !== board.adminEmail) {
        return Response.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    const existingBoard = await Board.findOne({ slug });
    if (existingBoard && existingBoard._id !== id) {
        return Response.json({ error: 'Доска с таким именем уже существует' }, { status: 400 });
    }

    const updatedBoard = await Board.findByIdAndUpdate(id, {
        name, slug, description, visibility, allowedEmails, archived, style,
    }, { new: true });

    if (updatedBoard) {
        await Feedback.updateMany({ boardName: board.name }, { boardName: updatedBoard.name });
    }

    return Response.json(updatedBoard);
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

    const feedbacks = await Feedback.find({ boardName: board.name });

    if (Array.isArray(feedbacks) && feedbacks.length > 0) {
        await Comment.deleteMany({ feedbackId: { $in: feedbacks.map(fb => fb._id) } });
    }

    await Feedback.deleteMany({ boardName: board.name });

    await Board.findByIdAndDelete(id);

    return new Response('Board, associated feedback, and comments deleted', { status: 200 });
}
