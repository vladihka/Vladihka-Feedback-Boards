'use client'
import Board from "@/app/components/Board"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";

export default function FeedbackPage(){

    return (
        <BoardInfoProvider>
            <Board></Board>
        </BoardInfoProvider>
    )
}

