import axios from "axios";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import Popup from "./Popup";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import Tick from "./icons/Tick";
import Attachment from "./Attachment";

export default function FeedbackItemPopup({_id, title, description, setShow, votes, onVotesChange, uploads}){
    const [isvotesLoading, setIsVotesLoading] = useState(false);
    const {data:session} = useSession();

    function handleVoteButtonClick(){
        setIsVotesLoading(true);
        axios.post('/api/vote', {feedbackId:_id}).then(async() => {
            await onVotesChange();
            setIsVotesLoading(false);
        })
    }

    const iVoted = votes.find(v => v.userEmail === session?.user?.email)

    return (
        <Popup title={''} setShow={setShow}>
            <div className="p-8 pb-2">
                <h2 className="text-lg font-bold mb-2">
                    {title}
                </h2>
                <p className="text-gray-600">
                    {description}
                </p>
                {uploads?.length > 0 && (
                    <div className="mt-4">
                        <span className="text-sm text-gray-">Attachments:</span>
                        <div className="flex gap-2">
                            {uploads.map(link => (
                                <Attachment link={link}></Attachment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-end px-8 py-2 border-b">
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
            </div>
            <div>
                <FeedbackItemPopupComments feedbackId={_id}></FeedbackItemPopupComments>
            </div>
        </Popup>    
    )
}