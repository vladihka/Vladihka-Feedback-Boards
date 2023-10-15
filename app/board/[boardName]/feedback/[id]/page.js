'use client'

import Board from "@/app/components/Board"
import useBoardName from "@/app/hooks/UseBoardName"
import {BoardInfoProvider} from "@/app/hooks/UseBoardInfo";
import {useContext, useEffect} from "react";
import {AppContext} from "@/app/hooks/AppContext";

export default function FeedbackPage(){

    const boardName = useBoardName();

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

