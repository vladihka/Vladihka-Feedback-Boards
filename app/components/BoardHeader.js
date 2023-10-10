import { useContext, useState } from "react";
import Button from "./Button";
import Search from "./icons/Search";
import { FeedbacksFetchContext } from "../hooks/FeedbackFetchContext";
import FeedbackFormPopup from "./FeedbackFormPopup";

export default function BoardHeader({onNewFeedback}){

    const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
    const {sortOrFilter, searchPhrase, setSortOrFilter, setSearchPhrase} = useContext(FeedbacksFetchContext);

    function openFeedbackPopupForm(){
        setShowFeedbackPopupForm(true);
    }
    
    return(
        <>
            {showFeedbackPopupForm && (
                <FeedbackFormPopup 
                    onCreate={onNewFeedback}
                    setShow={setShowFeedbackPopupForm}></FeedbackFormPopup>
                )}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
                <h1 className="font-bold text-xl">Coding with vladihka</h1>
                <p className="text-opacity-90 text-slate-700">Help me decide what should I build next or how can i improve</p>
            </div>
            <div className="bg-gray-100 px-8 py-4 flex border-b items-center">
                <div className="grow flex items-center gap-4 text-gray-400">
                    <select 
                        value={sortOrFilter}
                        onChange={ev => {setSortOrFilter(ev.target.value)}}
                        className="bg-transparent py-2">
                        <option value="votes">Most voted</option>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="planned">Planned</option>
                        <option value="in_progress">In progress</option>
                        <option value="complete">Complete</option>
                        <option value="archived">Archived</option>
                    </select>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute top-3 left-2 pointer-events-none"></Search>
                        <input 
                            type="text" 
                            value={searchPhrase}
                            onChange={ev => setSearchPhrase(ev.target.value)}
                            className="bg-transparent p-2 pl-7"
                            placeholder="Search"></input>
                    </div>
                </div>
                <div>
                    <Button primary={1} onClick={openFeedbackPopupForm}>Make a suggestion</Button>
                </div>
            </div>
        </>
    )
}