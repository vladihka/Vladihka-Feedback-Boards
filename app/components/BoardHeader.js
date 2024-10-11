import { useContext, useState } from "react";
import Button from "./Button";
import Search from "./icons/Search";
import { FeedbacksFetchContext } from "../hooks/FeedbackFetchContext";
import FeedbackFormPopup from "./FeedbackFormPopup";
import { BoardInfoContext, useBoardSlug } from "@/app/hooks/UseBoardInfo";
import BoardHeaderGradient from "@/app/components/BoardHeaderGradient";

export default function BoardHeader({ onNewFeedback }) {
    const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
    const { sortOrFilter, searchPhrase, setSortOrFilter, setSearchPhrase } = useContext(FeedbacksFetchContext);
    const slug = useBoardSlug();
    const {
        name: boardName,
        description,
        archived,
        style,
    } = useContext(BoardInfoContext);

    function openFeedbackPopupForm() {
        setShowFeedbackPopupForm(true);
    }

    return (
        <>
            {showFeedbackPopupForm && (
                <FeedbackFormPopup
                    onCreate={onNewFeedback}
                    setShow={setShowFeedbackPopupForm}></FeedbackFormPopup>
            )}
            <BoardHeaderGradient
                name={boardName}
                description={description}
                style={style}></BoardHeaderGradient>
            <div className="bg-gray-100 px-8 py-4 flex flex-col sm:flex-row items-center justify-between border-b">
                <div className="flex gap-4 text-gray-400 w-full sm:w-auto">
                    <select 
                        value={sortOrFilter}
                        onChange={ev => { setSortOrFilter(ev.target.value); }}
                        className="bg-transparent py-2">
                        <option value="votes">Most voted</option>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="planned">Planned</option>
                        <option value="in_progress">In progress</option>
                        <option value="complete">Complete</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div className="relative w-full sm:w-auto flex items-center mt-4 sm:mt-0">
                    <Search className="w-4 h-4 absolute left-2 pointer-events-none"></Search>
                    <input
                        type="text"
                        value={searchPhrase}
                        onChange={ev => setSearchPhrase(ev.target.value)}
                        className="bg-transparent p-2 pl-7 w-full"
                        placeholder="Search"></input>
                </div>
                <div className="mt-4 sm:mt-0 flex  w-full sm:w-auto">
                    {!archived && (
                        <Button primary={1} onClick={openFeedbackPopupForm}>
                            Make a suggestion
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
