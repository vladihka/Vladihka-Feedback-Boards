'use client'

import Board from "@/app/components/Board"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";
import {AppContext, useNarrowHeader} from "@/app/hooks/AppContext";
import {useContext, useEffect} from "react";

export default function BoardPage(){

    useNarrowHeader();

    return (
        <BoardInfoProvider>
            <Board></Board>
        </BoardInfoProvider>
    )
}