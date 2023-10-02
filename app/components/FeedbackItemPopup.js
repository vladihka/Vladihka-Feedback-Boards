import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachment from "./Attachment";
import Edit from "./icons/Edit";
import AttachFilesButton from "./AttachFilesButton";
import Trash from "./icons/Trash";

export default function FeedbackItemPopup({_id, title, description, setShow, votes, onVotesChange, 
    uploads, user, onUpdate}){
    const [isvotesLoading, setIsVotesLoading] = useState(false);
    const {data:session} = useSession();
    const [isEditMode, setIsEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescriptiopn, setNewDescriptiopn] = useState(description);
    const [newUploads, setNewUploads] = useState(uploads);

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
                        className="block w-full mb-2 mt-2 border rounded-md"
                        value={newDescriptiopn}
                        onChange={ev => setNewDescriptiopn(ev.target.value)}
                    ></textarea>
                )}
                {!isEditMode && (
                    <p className="text-gray-600">
                        {description}
                    </p>
                )}                
                {uploads?.length > 0 && (
                    <div className="mt-4">
                        <span className="text-sm text-gray-">Attachments:</span>
                        <div className="flex gap-2">
                            {(isEditMode ? newUploads : uploads).map(link => (
                                <Attachment 
                                    key={link} 
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
                            primary 
                            onClick={handleSaveButton}>
                            Save chabnges
                        </Button>
                    </>
                )}
                {!isEditMode && user?.email && session?.user?.email === user?.email && (
                    <Button onClick={handleEditButtonClick}>
                        <Edit className="w-4 h-4"></Edit>
                        Edit
                    </Button>
                )}
                {!isEditMode && (
                    <Button primary onClick={handleVoteButtonClick}>
                        {isvotesLoading && (
                            <MoonLoader size={18}></MoonLoader>
                        )}
                        {!isvotesLoading && (
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