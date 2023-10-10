'use client'

import Board from "@/app/components/Board"
import Header from "@/app/components/Header"
import useBoardName from "@/app/hooks/UseBoardName"
import { SessionProvider } from "next-auth/react"

export default function FeedbackPage(){
    const boardName = useBoardName();
    return (
        <SessionProvider>
            <Header></Header>
            <Board name={boardName}></Board>
        </SessionProvider>
    )
}