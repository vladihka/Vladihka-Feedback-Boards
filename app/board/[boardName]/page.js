'use client'

import Board from "@/app/components/Board"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";
import {useNarrowHeader} from "@/app/hooks/AppContext";

export default function BoardPage(){

    useNarrowHeader();

    return (
        <BoardInfoProvider>
            <Board></Board>
        </BoardInfoProvider>
    )
}