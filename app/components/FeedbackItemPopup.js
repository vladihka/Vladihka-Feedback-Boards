import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import {useContext, useEffect, useState} from "react";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachment from "./Attachment";
import Edit from "./icons/Edit";
import AttachFilesButton from "./AttachFilesButton";
import Trash from "./icons/Trash";
import {BoardInfoContext, isBoardAdmin, useBoardSlug} from "@/app/hooks/UseBoardInfo";

export default function FeedbackItemPopup({_id, title, description, status, setShow, votes, onVotesChange, 
    uploads, user, onUpdate}){
    const [isVotesLoading, setIsVotesLoading] = useState(false);
    const {data:session} = useSession();
    const [isEditMode, setIsEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescriptiopn, setNewDescriptiopn] = useState(description);
    const [newUploads, setNewUploads] = useState(uploads);
    const [newStatus, setNewStatus] = useState(status || 'new');
    const boardSlug = useBoardSlug();
    const [isAdmin, setIsAdmin] = useState(undefined);
    const {archived} = useContext(BoardInfoContext);

    useEffect(() => {
        if(boardSlug){
            isBoardAdmin(boardSlug).then(resultIsAdmin => {
                setIsAdmin(resultIsAdmin);
            })
        }
    }, [boardSlug]);
    
    useEffect(() => {
        if(newStatus === status){
            return;
        }
        const data = {id: _id, title, description, status:newStatus, uploads};
        axios.put('/api/feedback', data).then(() => {
            onUpdate({status:newStatus});
        })
    }, [newStatus]);

    function handleVoteButtonClick(){
        setIsVotesLoading(true);
        axios.post('/api/vote', {feedbackId:_id}).then(async() => {
            await onVotesChange();
            setIsVotesLoading(false);
        })
    }

    const iVoted = votes.find(v => v.userEmail === session?.user?.email)

    function handleEditButtonClick(){
        setIsEditMode(true);
    }

    function handleVoteButtonClick(ev, linkToRemove){
        ev.preventDefault();
        setNewUploads(prevNewUploads => prevNewUploads.filter(l => l !== linkToRemove))
    }

    function handleCancelButtonClick(){
        setIsEditMode(false);
        setNewTitle(title);
        setNewDescriptiopn(description);
        setNewUploads(uploads);
    }

    function handleNewUploads(newLinks){
        setNewUploads(prevUploads => [...prevUploads, ...newLinks]);
    }

    function handleSaveButton(){
        axios.put('/api/feedback', {
            id:_id, 
            title: newTitle, 
            description: newDescriptiopn,
            uploads: newUploads,
        }).then(() => {
            setIsEditMode(false);
            onUpdate({
                title: newTitle, 
                description: newDescriptiopn,
                uploads: newUploads,
            });
        });

    }

    return (
        <Popup title={''} setShow={setShow}>
            <div className="p-8 pb-2">
                {isEditMode && (
                    <input 
                        className="block w-full mb-2 mt-2 border rounded-md"
                        value={newTitle}
                        onChange={ev => setNewTitle(ev.target.value)}
                    ></input>
                )}
                {!isEditMode && (
                    <h2 className="text-lg font-bold mb-2">
                        {title}
                    </h2>
                )}
                {isEditMode && (
                    <textarea 
                        className="block w-full mb-2 mt-2 border rounded-md h-36"
                        value={newDescriptiopn}
                        onChange={ev => setNewDescriptiopn(ev.target.value)}
                    ></textarea>
                )}
                {!isEditMode && (
                    <p 
                        className="text-gray-600" 
                        dangerouslySetInnerHTML={{__html:(description || '').replace(/\n/gi, "<br />")}}>
                    </p>
                )}                
                {uploads?.length > 0 && (
                    <div className="mt-4">
                        <span className="text-sm text-gray-">Attachments:</span>
                        <div className="flex gap-2">
                            {(isEditMode ? newUploads : uploads).map(link => (
                                <Attachment 
                                    key={_id+link} 
                                    link={link} 
                                    showRemoveButton={isEditMode}
                                    handleRemoveFileButtonClick={handleVoteButtonClick}>
                                </Attachment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end px-8 py-2 border-b gap-2">
                {isEditMode && (
                    <>
                        <AttachFilesButton onNewFiles={handleNewUploads}></AttachFilesButton>
                        <Button onClick={handleCancelButtonClick}>
                            <Trash className="w-4 h-4"></Trash>
                            Cancel
                        </Button>
                        <Button 
                            primary={1}
                            onClick={handleSaveButton}>
                            Save chabnges
                        </Button>
                    </>
                )}
                {!isEditMode && !archived && user?.email && session?.user?.email === user?.email && (
                    <Button onClick={handleEditButtonClick}>
                        <Edit className="w-4 h-4"></Edit>
                        Edit
                    </Button>
                )}
                {!isEditMode && isAdmin && (
                    <select 
                        value={newStatus} 
                        onChange={ev => setNewStatus(ev.target.value)} 
                        className="bg-gray-200 rounded-md">
                        <option value="new">new</option>
                        <option value="planned">planned</option>
                        <option value="in_progress">in progress</option>
                        <option value="complete">complete</option>
                        <option value="archived">archived</option>
                    </select>
                )}
                {!isEditMode && !archived && (
                    <Button primary={1} onClick={handleVoteButtonClick}>
                        {isVotesLoading && (
                            <MoonLoader size={18}></MoonLoader>
                        )}
                        {!isVotesLoading && (
                            <>
                                {iVoted && (
                                    <>
                                        <Tick className="w-5 h-5"></Tick>
                                        Upvoted {votes?.length || '0'}
                                    </>
                                )}
                                {!iVoted && (
                                    <>
                                        <span className="triangle-vote-up"></span>
                                        Upvote {votes?.length || '0'}
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                )}
            </div>
            <div>
                <FeedbackItemPopupComments feedbackId={_id}></FeedbackItemPopupComments>
            </div>
        </Popup>    
    )
}