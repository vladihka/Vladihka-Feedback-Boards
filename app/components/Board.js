import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import FeedbackItemPopup from "./FeedbackItemPopup";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";
import BoardHeader from "./BoardHeader";
import BoardBody from "./BoardBody";
import { feedbackOpenNeeded, fetchSpecificFeedbacks, notifyIfBottomOfThePage, postLoginActions, fetchFeedback } from "../libs/boardFunctions";
import { FeedbacksFetchContext } from "../hooks/FeedbackFetchContext";

export default function Board({name}){
  
    const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [votesLoading, setVotesLoading] = useState(false);
    const [votes, setVotes] = useState([]);
    const {data:session} = useSession();
    const [sortOrFilter, setSortOrFilter] = useState('votes');
    const loadedRows = useRef(0);
    const sortOrFilterRef = useRef('votes');
    const fetchingFeedbacksRef = useRef(false);
    const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
    const everythingLoadedRef = useRef(false);
    const [searchPhrase, setSearchPhrase] = useState('');
    const searchPhraseRef = useRef('');
    const debouncedFetchFeedbacksRef = useRef(debounce(fetchFeedbacks,300));
    const waitingRef = useRef(false);
    const [waiting, setWaiting] = useState(true);
    const pathname = usePathname();
    const [feedbacksFetchCount, setFeedbacksFetchCount] = useState(0);

    useEffect(() => {
        fetchFeedbacks();
        const handleScroll = () => notifyIfBottomOfThePage(() => fetchFeedbacks(true));
        window.addEventListener('scroll', handleScroll);
        return () => {window.removeEventListener('scroll', handleScroll);}
    }, []);

    useEffect(() => {
        fetchVotes();
    }, [feedbacks]);

    useEffect(() => {
        if(feedbacksFetchCount === 0){
            return;
        }
        loadedRows.current = 0;
        sortOrFilterRef.current = sortOrFilter;
        searchPhraseRef.current = searchPhrase;
        everythingLoadedRef.current = false;
        if(feedbacks?.length > 0){
            setFeedbacks([]);
        }
        setWaiting(true);
        waitingRef.current = true;
        debouncedFetchFeedbacksRef.current();
    }, [sortOrFilter, searchPhrase]);

    useEffect(() => {
        if(feedbacksFetchCount === 0){
            return;
        }
        const url = showFeedbackPopupItem 
            ? `/board/${name}/feedback/${showFeedbackPopupItem._id}` 
            : `/board/`+name;
        window.history.pushState({}, '', url);
    }, [showFeedbackPopupItem]);

    useEffect(() => {
        const idToOpen = feedbackOpenNeeded(feedbacksFetchCount, pathname);
        if(idToOpen){
            fetchFeedback(idToOpen).then(setShowFeedbackPopupItem)
        }
    }, [feedbacksFetchCount])

    useEffect(() => {
        if(!session?.user?.email){
            return;
        }
        postLoginActions(fetchVotes, fetchFeedbacks, openFeedbackPopupItem);
    }, [session]);

    async function fetchFeedbacks(append=false){
        if(fetchingFeedbacksRef.current || everythingLoadedRef.current){
            return;
        }
        fetchingFeedbacksRef.current = true;
        setFetchingFeedbacks(true);
        fetchSpecificFeedbacks({
            boardName: name,
            sortOrFilter: sortOrFilterRef.current,
            loadedRows: loadedRows.current,
            search: searchPhraseRef.current,
        }).then(feedbacks => {
            setFeedbacksFetchCount(prevCount => prevCount + 1);
            setFeedbacks(currentFeedbacks => append ? [...currentFeedbacks, ...feedbacks] : feedbacks)
            if(feedbacks?.length > 0) {
              loadedRows.current += feedbacks.length;
            }
            if(feedbacks?.length === 0){
              everythingLoadedRef.current = true;
            }
            fetchingFeedbacksRef.current = false;
            setFetchingFeedbacks(false);
            waitingRef.current = false;
            setWaiting(false);
        });
    }

    async function fetchVotes(){
        setVotesLoading(true);
        const ids = feedbacks.map(f => f._id)
        const res = await axios.get('/api/vote?feedbackIds='+ids.join(','));
        setVotes(res.data);
        setVotesLoading(false);
    }

    function openFeedbackPopupItem(feedback){
        setShowFeedbackPopupItem(feedback);
    }


    async function handleFeedbackUpdate(newData){
      setShowFeedbackPopupItem(prevData => {
        return {...prevData, ...newData};
      });
      loadedRows.current = 0;
      await fetchFeedbacks();
    }

    return (
        <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg md:mt-4 md:mb-8 overflow-hidden">
            <FeedbacksFetchContext.Provider value={{
                sortOrFilter,
                searchPhrase,
                boardName: name,
                setSortOrFilter,
                setSearchPhrase,}}> 
                <BoardHeader onNewFeedback={fetchFeedbacks}></BoardHeader>
            </FeedbacksFetchContext.Provider>
              <div className="px-8">
                  <BoardBody
                      fetchingFeedbacks={fetchingFeedbacks}
                      votes={votes}
                      feedbacks={feedbacks}
                      waiting={waiting}
                      onFeedbackClick={openFeedbackPopupItem}
                      votesLoading={votesLoading}
                      onVotesChange={fetchVotes}>
                  </BoardBody>
              </div>
          {showFeedbackPopupItem && (
            <FeedbackItemPopup
              {...showFeedbackPopupItem} 
              votes={votes.filter(v => v.feedbackId.toString() === showFeedbackPopupItem._id)}
              onVotesChange={fetchVotes}
              setShow={setShowFeedbackPopupItem}
              onUpdate={handleFeedbackUpdate}>
            </FeedbackItemPopup>
          )}
      </main>
    )
}