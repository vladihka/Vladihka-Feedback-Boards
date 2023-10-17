import Button from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios from "axios";
import {BoardInfoContext} from "@/app/hooks/UseBoardInfo";
import BoardHeaderGradient from "@/app/components/BoardHeaderGradient";
import Popup from "@/app/components/Popup";
import Tick from "@/app/components/icons/Tick";
import Edit from "../components/icons/Edit"

export default function BoardForm({
                                      name:defaultName,
                                      slug:defaultSlug,
                                      description:defaultDescription,
                                      buttonText='',
                                      onSubmit,
                                      visibility:defaultVisibility='public',
                                      allowedEmails:defaultAllowedEmails='',
                                      _id,
                                      archived:defaultArchived=false,
                                      style:defaultStyle='hyper',
                                  }){

    const [name, setName] = useState(defaultName || '');
    const [slug, setSlug] = useState(defaultSlug || '');
    const [description, setDescription] = useState(defaultDescription || '');
    const router = useRouter();
    const [visibility, setVisibility] = useState(defaultVisibility || 'public');
    const [allowedEmails, setAllowedEmails] = useState(defaultAllowedEmails.join("\n") || '');
    const [archived, setArchived] = useState(defaultArchived || false)
    const [showGradientsPopup, setShowGradientsPopup] = useState(false);
    const [style, setStyle] = useState(defaultStyle || 'hyper')

    function getBoardData(){
        return {
            name,
            slug,
            description,
            visibility,
            style,
            allowedEmails:allowedEmails.split("\n"),
        }
    }

    async function handleFormSubmit(ev){
        ev.preventDefault();
        onSubmit(getBoardData());
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

    function handleChangeGradientButtonClick(ev){
        ev.preventDefault();
        setShowGradientsPopup(true);
    }

    return(
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
            {archived && (
                <div className="border border-orange-400 bg-orange-200 rounded-md p-4 my-4">
                    This board is archived
                </div>
            )}
            <label>
                <div>Board name:</div>
            <input type="text"
                   placeholder="Board name"
                   value={name}
                   onChange={ev => setName(ev.target.value)}
                   className="block mb-4 p-2 rounded-md w-full"/>
            </label>
            <div className="flex items-center mb-4">
                <label className="w-full">
                    <div>URL slug:</div>
                    <div className="bg-white rounded-md flex">
                        <span
                            className="py-2 pl-2">
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
            <div className="my-4">
                <div className={"grow p-2 bg-gray-200 rounded-md"}>
                    <div className="flex gap-2 mb-2 items-center">
                        <div className={"uppercase text-sm text-gray-600"}>
                            style preview:
                        </div>
                        <div className={"grow flex justify-end"}>
                            <BoardInfoContext.Provider value={{style}}>
                                <Button primary
                                        className="text-sm"
                                        onClick={handleChangeGradientButtonClick}>
                                    <Edit className={"w-4 h-4"}/>Change header gradient
                                </Button>
                            </BoardInfoContext.Provider>
                        </div>
                    </div>
                    <div className={"rounded-t-lg overflow-hidden"}>
                        <BoardHeaderGradient
                            name={name}
                            description={description}
                            style={style}>
                        </BoardHeaderGradient>
                    </div>
                </div>
            </div>
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
            {showGradientsPopup && (
                <Popup
                    setShow={setShowGradientsPopup}
                    title={'Choose your gradient styling'}>
                    <div className="p-4 grid gap-4 grid-cols-2">
                        {['hyper', 'oceanic', 'cotton-candy', 'gotham', 'sunset', 'mojave'].map(styleOptionName => (
                            <label onClick={() => {
                                setStyle(styleOptionName);
                                setShowGradientsPopup(false);
                            }} key={style}
                                   className="flex gap-1 cursor-pointer relative">
                                <input className="hidden" type="radio" name="gradient" value={style}/>
                                <BoardHeaderGradient
                                    style={styleOptionName}
                                    name={name}
                                    description={description}></BoardHeaderGradient>
                                {style === styleOptionName && (
                                    <div className="absolute bg-white bg-opacity-60 inset-0 flex">
                                        <div className="flex items-center justify-center w-full">
                                            <div className="border-8 border-green-600 text-green-600
                                                       rounded-full">
                                                <Tick className={"w-24 h-24"}></Tick>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </Popup>
            )}
        </form>
    )
}