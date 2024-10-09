import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import {Board} from "@/app/models/Board";
import {canWeAccessThisBoard} from "@/app/libs/boardApiFunctions";

async function getMyBoards(searchQuery = '') {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        const filter = { adminEmail: session.user.email };

        // Если передан поисковый запрос, фильтруем по имени и описанию
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


export async function POST(request){
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const jsonBody = await  request.json();
    const {name, slug, description, visibility, allowedEmails, style} = jsonBody;
    const boardDoc = await Board.create({
        name,
        slug,
        description,
        visibility,
        style,
        allowedEmails,
        adminEmail: session.user.email,
    })
    return Response.json(boardDoc);
}

export async function PUT(request){
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json(false);
    }
    const jsonBody = await request.json();
    const {
        id, name, slug, description, visibility, allowedEmails, archived, style,
    } = jsonBody;
    const board = await Board.findById(id);
    if(session.user.email !== board.adminEmail){
        return Response.json(false);
    }
    return Response.json(
        await Board.findByIdAndUpdate(id, {
            name, slug, description, visibility, allowedEmails, archived, style,
        })
    );
}

export async function DELETE(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Проверяем, есть ли ID и находится ли он в базе данных
    const board = await Board.findById(id);
    if (!board) {
        return new Response('Board not found', { status: 404 });
    }

    // Проверяем, является ли текущий пользователь администратором доски
    if (session.user.email !== board.adminEmail) {
        return new Response('Unauthorized', { status: 403 });
    }

    // Удаляем доску
    await Board.findByIdAndDelete(id);
    return new Response('Board deleted', { status: 200 });
}
