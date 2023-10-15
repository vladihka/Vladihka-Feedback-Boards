'use client'

import Board from "@/app/components/Board"
import Header from "@/app/components/Header"
import useBoardName from "@/app/hooks/UseBoardName"
import { SessionProvider } from "next-auth/react"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";

export default function FeedbackPage(){
    const boardName = useBoardName();
    return (
        <SessionProvider>
            <BoardInfoProvider>
                <Header></Header>
                <Board></Board>
            </BoardInfoProvider>
        </SessionProvider>
    )
}