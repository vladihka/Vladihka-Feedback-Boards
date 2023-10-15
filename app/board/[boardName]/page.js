'use client'

import Board from "@/app/components/Board"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";
import {AppContext, useNarrowHeader} from "@/app/hooks/AppContext";
import {useContext, useEffect} from "react";

export default function BoardPage(){
    
    const {setNarrowHeader} = useContext(AppContext);

    useEffect(() => {
        setNarrowHeader(true);
    }, []);

    return (
        <BoardInfoProvider>
            <Board></Board>
        </BoardInfoProvider>
    )
}