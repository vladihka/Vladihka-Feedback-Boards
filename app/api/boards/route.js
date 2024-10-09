import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Board } from "@/app/models/Board";
import mongoose from "mongoose";

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
            query.name = { $regex: searchTerm, $options: 'i' }; // Поиск по имени с учетом регистра
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

    const searchTerm = url.searchParams.get('search'); // Получаем поисковый запрос

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

    return await getAllBoards(searchTerm); // Передаем поисковый запрос в функцию
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
