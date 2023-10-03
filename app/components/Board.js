import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import FeedbackItem from "./FeedbackItem";
import FeedbackFormPopup from "./FeedbackFormPopup";
import FeedbackItemPopup from "./FeedbackItemPopup";
import { MoonLoader } from "react-spinners";

export default function Board(){
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopuoItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const {data:session} = useSession();
  const [sort, setSort] = useState('votes');
  const loadedRows = useRef(0);
  const sortRef = useRef('votes');
  const fetchingFeedbacksRef = useRef(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const everythingLoadedRef = useRef(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    everythingLoadedRef.current = false;
    fetchFeedbacks();
  }, [sort])

  useEffect(() => {
    if(session?.user?.email){
        const feedbackToVote = localStorage.getItem('vote_after_login');
        if(feedbackToVote){
            axios.post('/api/vote', {feedbackToVote}).then(() => {
              localStorage.removeItem('vote_after_login');
              fetchVotes();
            })
        }
        const feedbackToPost = localStorage.getItem('post_after_login');
        if(feedbackToPost){
          const feedbackData = JSON.parse(feedbackToPost);
          axios.post('/api/feedback', feedbackData).then(async(res) => {
            await fetchFeedbacks();
            setShowFeedbackPopupItem(res.data);
            localStorage.removeItem('post_after_login');
          });
        }
        const commentToPost = localStorage.getItem('comment_after_login');
        if(commentToPost){
          const commentData = JSON.parse(commentToPost);
          axios.post('/api/comment', commentData).then(() => {
            axios.get('/api/feedback?id='+commentData.feedbackId).then(res => {
              setShowFeedbackPopupItem(res.data);
              localStorage.removeItem('comment_after_login');
            })
          })
        }
    }
  }, [session?.user?.email]);

  async function fetchVotes(){
    setVotesLoading(true);
    const ids = feedbacks.map(f => f._id)
    const res = await axios.get('/api/vote?feedbackIds='+ids.join(','));
    setVotes(res.data);
    setVotesLoading(false);
  }

  function openFeedbackPopupForm(){
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback){
    setShowFeedbackPopupItem(feedback);
  }

  function handleScroll(){
    const html = window.document.querySelector('html');
    const howMuchScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight;
    const leftToScroll = howMuchIsToScroll - howMuchScrolled - html.clientHeight;
    if(leftToScroll <= 100) {
      fetchFeedbacks(true);
    }
  }

  function registerScrollListener(){
    window.addEventListener('scroll', handleScroll);
  }

  function unregisterScrollListener(){
    window.removeEventListener('scroll', handleScroll);
  }

  useEffect(() => {
    registerScrollListener();
    return () => {unregisterScrollListener();}
  }, [])

  async function fetchFeedbacks(append=false){
    if(fetchingFeedbacksRef.current) return;
    if(everythingLoadedRef.current) return;
    fetchingFeedbacksRef.current = true;
    setFetchingFeedbacks(true);
    axios.get(`/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}`).then(res => {
      if(append){
        setFeedbacks(currentFeedbacks => [...currentFeedbacks, ...res.data])
      }
      else{
        setFeedbacks(res.data);
      }
      if(res.data?.length > 0) {
        loadedRows.current += res.data.length;
      }
      if(res.data?.length === 0){
        everythingLoadedRef.current = true;
      }
      fetchingFeedbacksRef.current = false;
      setFetchingFeedbacks(false);
    });
  }

  async function handleFeedbackUpdate(newData){
    setShowFeedbackPopupItem(prevData => {
      return {...prevData, ...newData};
    });
    await fetchFeedbacks();
  }

    return (
        <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-4 md:mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
        <h1 className="font-bold text-xl">Coding with vladihka</h1>
        <p className="text-opacity-90 text-slate-700">Help me decide what should I build next or how can i improve</p>
      </div>
      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow flex items-center">
          <span className="text-gray-400 text-sm">Sort by:</span>
           <select 
              value={sort}
              onChange={ev => {setSort(ev.target.value)}}
              className="bg-transparent py-2 text-gray-600">
            <option value="votes">Most voted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div>
          <Button primary onClick={openFeedbackPopupForm}>Make a suggestion</Button>
        </div>
      </div>
      <div className="px-8">
        {feedbacks.map(feedback => (
          <FeedbackItem 
            key={feedback._id} 
            {...feedback} 
            onVotesChange={fetchVotes}
            votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())}
            parentLoadingVotes={votesLoading}
            onOpen={() => openFeedbackPopupItem(feedback)}></FeedbackItem>
        ))}
        {fetchingFeedbacks && (
          <div className="p-4">
            <MoonLoader size={24}></MoonLoader>
          </div>
        )}
      </div>
      {showFeedbackPopupForm && (
       <FeedbackFormPopup 
          onCreate={fetchFeedbacks}
          setShow={setShowFeedbackPopupForm}></FeedbackFormPopup>
      )}
      {showFeedbackPopuoItem && (
        <FeedbackItemPopup
          {...showFeedbackPopuoItem} 
          votes={votes.filter(v => v.feedbackId.toString() === showFeedbackPopuoItem._id)}
          onVotesChange={fetchVotes}
          setShow={setShowFeedbackPopupItem}
          onUpdate={handleFeedbackUpdate}>
        </FeedbackItemPopup>
      )}
    </main>
    )
}