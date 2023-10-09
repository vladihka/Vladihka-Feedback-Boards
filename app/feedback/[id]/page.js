'use client'

import Board from "@/app/components/Board"
import Header from "@/app/components/Header"
import { SessionProvider } from "next-auth/react"

export default function FeedbackPage(){
    return (
        <SessionProvider>
            <Header></Header>
            <Board></Board>
        </SessionProvider>
    )
}