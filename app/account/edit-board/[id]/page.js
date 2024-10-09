'use client'
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import BoardForm from "@/app/account/BoardForm";

export default function EditBoardPage(){

    const {id} = useParams();
    const [board, setBoard] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if(id){
            axios.get('/api/board?id='+id).then(res => {
                setBoard(res.data);
            });
        }
    }, [id]);

    async function handleBoardSubmit(boardData){
        await axios.put('/api/board', {
            id:board._id, ...boardData,
        });

        router.push('/account');
    }

    return (
        <>
            <h1 className="text-center text-4xl mb-8">Edit board</h1>
            {board && (
                <BoardForm {...board} buttonText={"Update Board"} onSubmit={handleBoardSubmit}></BoardForm>
            )}
        </>
    )
}