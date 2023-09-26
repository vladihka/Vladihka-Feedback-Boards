'use client';
import { useState } from "react";
import FeedbackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";
import FeedbackItemPopup from "./components/FeedbackItemPopup";

export default function Home() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopuoItem, setShowFeedbackPopuoItem] = useState(null);

  function openFeedbackPopupForm(){
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback){
    setShowFeedbackPopuoItem(feedback);
  }

  const feedbacks = [
    {
      title: 'Please post more videos', 
      description: 'Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia', 
      votesCount: 80
    },
    {
      title: 'Please post more videos 2', 
      description: 'Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia', 
      votesCount: 63
    },
  ]

  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
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
          <FeedbackItem {...feedback} 
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
