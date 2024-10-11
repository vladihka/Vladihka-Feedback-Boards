'use client';
import {useContext, useState} from "react";
import Popup from "./Popup";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import {BoardInfoContext} from "@/app/hooks/UseBoardInfo";

export default function FeedbackItem({onOpen, _id, status, title, description, votes, 
    onVotesChange, parentLoadingVotes = true}){
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const {data:session} = useSession();
    const [isVotesLoading, setIsVotesLoading] = useState(false);
    const isLoggedIn = !!session?.user?.email
    const {archived} = useContext(BoardInfoContext);

    function handleVoteButtonClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if(!isLoggedIn){
            localStorage.setItem('vote_after_login', _id);
            setShowLoginPopup(true);
        }
        else{
            setIsVotesLoading(true);
            axios.post('/api/vote', {feedbackId: _id}).then(async() => {
                await onVotesChange();
                setIsVotesLoading(false);
            });
        }
    }

    async function handleGoogleLoginClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
        await signIn('google');
    }

    const iVoted = !!votes.find(v => v.userEmail === session?.user?.email);
    const shortDesc = description.substring(0, 200);
    const statusLabel = status ? 
    (status[0].toUpperCase() + status.substring(1).replace('_', ' ')) :'new';
    let statusColor = 'bg-gray-400';
    if(status === 'planned') statusColor = 'bg-emerald-200';
    if(status === 'in_progress') statusColor = 'bg-amber-400';
    if(status === 'complete') statusColor = 'bg-green-600';
    if(status === 'archived') statusColor = 'bg-purple-400';
    return (
        <a 
            href="" 
            onClick={e => {e.preventDefault();onOpen();}} 
            className="my-8 flex gap-8 items-center">
            <div className="flex-grow">
                <h2 className="font-bold">{title}</h2>
                <p className="text-gray-400 text-sm">
                    {shortDesc}
                    {shortDesc.length < description.length ? '...' : ''}
                </p>
                <div>
                    {status !== 'new' && (
                        <div className= "inline-flex gap-1 items-center text-sm">
                            <div className={statusColor + " w-2 h-2 rounded-full"}></div>
                            {statusLabel}
                        </div>
                    )}
                </div>
            </div>
            <div>
                {showLoginPopup && (
                    <Popup title={'Confirm your vote!'} narrow setShow={setShowLoginPopup}>
                        <div className="p-4">
                            <Button primary={1} onClick={handleGoogleLoginClick}>Login with Google</Button>
                        </div>
                    </Popup>
                )}
            {!archived && (
                <Button
                    primary={iVoted ? 1 : undefined}
                    onClick={handleVoteButtonClick}
                    className="shadow-sm border">
                        {!isVotesLoading && (
                            <>
                                <span className="triangle-vote-up"></span>
                                {votes?.length || '0'}
                            </>
                        )}
                    {isVotesLoading && (
                        <MoonLoader size={18}></MoonLoader>
                    )}
                </Button>
            )}</div>
        </a>
    )
}