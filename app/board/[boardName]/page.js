'use client'

import Board from "@/app/components/Board"
import Header from "@/app/components/Header"
import { SessionProvider } from "next-auth/react"
import {BoardInfoProvider, useBoardSlug} from "@/app/hooks/UseBoardInfo";

export default function BoardPage(){
    const boardName = useBoardSlug();
    return (
        <SessionProvider>
            <BoardInfoProvider>
                <Header></Header>
                <Board></Board>
            </BoardInfoProvider>
        </SessionProvider>
    )
}