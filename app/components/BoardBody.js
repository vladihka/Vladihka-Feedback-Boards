import { MoonLoader } from "react-spinners";
import FeedbackItem from "./FeedbackItem";

export default function BoardBody({feedbacks, votes, votesLoading, fetchingFeedbacks, 
    waiting, onVotesChange, onFeedbackClick}){
    return(
        <>
            {feedbacks?.length === 0 && !fetchingFeedbacks && !waiting &&  (
                <div className="py-8 text-4xl text-gray-200">
                    Nothing found:(
                </div>
            )}
            {feedbacks.map(feedback => (
                <FeedbackItem
                    key={feedback._id} 
                    {...feedback} 
                    onVotesChange={onVotesChange}
                    votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())}
                    parentLoadingVotes={votesLoading}
                    onOpen={() => onFeedbackClick(feedback)}></FeedbackItem>
            ))}
            {(fetchingFeedbacks || waiting) && (
                <div className="p-4">
                    <MoonLoader size={24}></MoonLoader>
                </div>
            )}
        </>
    )
}