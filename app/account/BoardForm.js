import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function BoardForm({name:defaultName,slug:defaultSlug,
                                      description:defaultDescription,buttonText='',
                                  onSubmit}){

    const [name, setName] = useState(defaultName || '');
    const [slug, setSlug] = useState(defaultSlug || '');
    const [description, setDescription] = useState(defaultDescription || '');
    const router = useRouter();

    async function handleFormSubmit(ev){
        ev.preventDefault();
        onSubmit({name, slug, description});
    }

    return(
        <>
            <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
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
                        className="bg-primary px-6 py-2 w-full justify-center">
                    {buttonText}
                </Button>
            </form>
        </>
    )
}