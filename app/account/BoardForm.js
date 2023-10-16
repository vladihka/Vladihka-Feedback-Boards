import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios, {all} from "axios";

export default function BoardForm({name:defaultName,slug:defaultSlug,
                                      description:defaultDescription,buttonText='',
                                  onSubmit, visibility:defaultVisibility='public',
                                  allowedEmails:defaultAllowedEmails='',
                                  _id, archived:defaultArchived=false}){

    const [name, setName] = useState(defaultName || '');
    const [slug, setSlug] = useState(defaultSlug || '');
    const [description, setDescription] = useState(defaultDescription || '');
    const router = useRouter();
    const [visibility, setVisibility] = useState(defaultVisibility || 'public');
    const [allowedEmails, setAllowedEmails] = useState(defaultAllowedEmails.join("\n") || '');
    const [archived, setArchived] = useState(defaultArchived || false)

    function getBoardData(){
        return {
            name,
            slug,
            description,
            visibility,
            allowedEmails:allowedEmails.split("\n"),
        }
    }

    async function handleFormSubmit(ev){
        ev.preventDefault();
        onSubmit(getBoardData);
    }

    function handleArchiveButtonClick(ev){
        ev.preventDefault();
        axios.put('/api/board', {
            id:_id,
            archived: !archived,
            ...getBoardData(),
        }).then(() => {
            setArchived(prev => !prev);
        })
    }

    return(
        <>
            <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
                {archived && (
                    <div className="border border-orange-400 bg-orange-200 rounded-md p-4 my-4">
                        This board is archived
                    </div>
                )}
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
                <div>
                    Visibility:
                </div>
                <label className="block">
                    <input type="radio" name="visibility" value="public"
                           checked={visibility === 'public'}
                           onChange={() => setVisibility('public')}/>
                    Public
                </label>
                <label className="block">
                    <input type="radio" name="visibility" value="invite-only"
                           checked={visibility === 'invite-only'}
                           onChange={() => setVisibility('invite-only')}/>
                    Invite-only
                </label>
                {visibility === 'invite-only' && (
                    <div className="my-4">
                        <label>
                            <div>Who should be able to access the board?</div>
                            <div className="text-sm text-gray-600">
                                List all email addresses seperated by new line
                            </div>
                            <textarea
                                value={allowedEmails}
                                onChange={ev => setAllowedEmails(ev.target.value)}
                                className="block bg-white rounded-md w-full h-24 p-2"
                                placeholder={"user1@examole.com\nuser2@example.com\nuser3@example.com"}>
                            </textarea>
                        </label>
                    </div>
                )}
                <Button primary
                        disabled={name === '' || slug === ''}
                        className="bg-primary px-6 py-2 w-full justify-center my-4">
                    {buttonText}
                </Button>
                {!!_id && (
                   <Button
                       onClick={handleArchiveButtonClick}
                       className="w-full border-gray-400 border justify-center py-2 my-4">
                       {archived ? 'Unarchive' : 'Archive'} this board
                   </Button>
                )}
            </form>
        </>
    )
}