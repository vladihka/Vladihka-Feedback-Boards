'use client'
import BoardForm from "@/app/account/BoardForm";
import axios from "axios";
import {useRouter} from "next/navigation";


export default function NewBoardPage(){

    const router = useRouter();

    async  function handleFormSubmit({name, slug, description}){
        await axios.post('/api/board', {name, slug, description});
        router.push('/board/'+slug);
    }

    return(
        <>
            <h1 className="text-center text-4xl mb-8">New board</h1>
            <BoardForm buttonText={'Create Board'} onSubmit={handleFormSubmit}></BoardForm>
        </>
    )
}