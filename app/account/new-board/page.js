'use client'
import Button from "@/app/components/Button";
import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";


export default function NewBoardPage(){

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    async function handleFormSubmit(ev){
        ev.preventDefault();
        await axios.post('/api/board', {name, slug, description});
        router.push('/board/'+slug);
    }

    return(
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
            <h1 className="text-center text-4xl mb-8">New board</h1>
            <label>
                <div>Board name:</div>
            </label>
            <input type="text"
                   placeholder="Board name"
                   value={name}
                   onChange={ev => setName(ev.target.value)}
                   className="block mb-4 p-2 rounded-md w-full"/>
            <div className="flex items-center mb-4">
                <label className="w-full">
                    <div>URL slug:</div>
                    <div className="bg-white rounded-md flex">
                        <span className="py-2 pl-2">
                            feedbackboard.com/board/
                        </span>
                        <input type="text"
                               placeholder="board-name"
                               value={slug}
                               onChange={ev => setSlug(ev.target.value)}
                               className="py-2 bg-transparent flex grow"/>
                    </div>
                </label>
            </div>
            <label>
                <div>Description:</div>
                <input type="text"
                       placeholder="Board description"
                       value={description}
                       onChange={ev => setDescription(ev.target.value)}
                       className="block mb-4 p-2 rounded-md w-full"/>
            </label>
            <Button primary
                    disabled={name === '' || slug === ''}
                    className="bg-primary px-6 py-2 w-full justify-center">Create board</Button>
        </form>
    )
}