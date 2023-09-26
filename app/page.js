'use client';
import { useState } from "react";
import FeedbackItem from "./components/FeedbackItem";
import FeedbackFormPopup from "./components/FeedbackFormPopup";
import Button from "./components/Button";

export default function Home() {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  function openFeedbackpopup(){
    setShowFeedbackPopup(true);
  }

  return (
    <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">Coding with vladihka</h1>
        <p className="text-opacity-90 text-slate-700">Help me decide what should I build next or how can i improve</p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow"></div>
        <div>
          <Button primary onClick={openFeedbackpopup}>Make a suggestion</Button>
        </div>
      </div>
      <div className="px-8">
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
        <FeedbackItem></FeedbackItem>
      </div>
      {showFeedbackPopup && (
       <FeedbackFormPopup setShow={setShowFeedbackPopup}></FeedbackFormPopup>
      )}
    </main>
  )
}
