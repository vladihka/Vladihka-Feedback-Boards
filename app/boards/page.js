'use client'
import {useNarrowHeader} from "@/app/hooks/AppContext";
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";
import Board from "@/app/components/Board";

export default function BoardsPage(){
    useNarrowHeader();

    return (
        <BoardInfoProvider>
            <Board></Board>
        </BoardInfoProvider>
    )
}