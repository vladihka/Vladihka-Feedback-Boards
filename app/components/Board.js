import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "./Button";
import FeedbackItem from "./FeedbackItem";

export default function Board(){
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopuoItem, setShowFeedbackPopuoItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const {data:session} = useSession();

  useEffect(() => {
    axios.get('/api/feedback').then(res => {
      setFeedbacks(res.data);
    })
  }, []);

  useEffect(() => {
    if(session?.user.email){
        const feedbackId = localStorage.getItem('vote_after_login');
        if(feedbackId){
            alert(feedbackId);
        }
    }
  }, [session?.user.email]);

  function openFeedbackPopupForm(){
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback){
    setShowFeedbackPopuoItem(feedback);
  }

    return (
        <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
        {session?.user.email || 'not loggeg in'}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">Coding with vladihka</h1>
        <p className="text-opacity-90 text-slate-700">Help me decide what should I build next or how can i improve</p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow"></div>
        <div>
          <Button primary onClick={openFeedbackPopupForm}>Make a suggestion</Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map(feedback => (
          <FeedbackItem key={feedback._id} {...feedback} 
                        onOpen={() => openFeedbackPopupItem(feedback)}></FeedbackItem>
        ))}
        
      </div>
      {showFeedbackPopupForm && (
       <FeedbackFormPopup setShow={setShowFeedbackPopupForm}></FeedbackFormPopup>
      )}
      {showFeedbackPopuoItem && (
        <FeedbackItemPopup 
          {...showFeedbackPopuoItem} 
          setShow={setShowFeedbackPopuoItem}>
        </FeedbackItemPopup>
      )}
    </main>
    )
}