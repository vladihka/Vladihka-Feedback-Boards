import axios from "axios";

export function feedbackOpenNeeded(feedbacksFetchCount, pathname){
    if(feedbacksFetchCount === 1 && /^\/feedback\/[a-z0-9]+/.test(pathname)){
        return pathname.replace('/feedback/', '');
    }
    else{
        return false;
    }
}

export async function fetchFeedback(id){
    const response = await axios.get(`/api/feedback?id=${id}`);
    return response.data;
}

export async function fetchSpecificFeedbacks(params){
    params = new URLSearchParams(params)
    const response = await axios.get('/api/feedback?'+params.toString());
    return response.data;
}

export async function postLoginActions(openFeedback, fetchVotes, fetchFeedbacks){
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
            openFeedback(res.data);
            localStorage.removeItem('post_after_login');
        });
    }
    const commentToPost = localStorage.getItem('comment_after_login');
    if(commentToPost){
        const commentData = JSON.parse(commentToPost);
        axios.post('/api/comment', commentData).then(async() => {
            const feedback = await fetchFeedbacks(commentData.feedbackId);
            openFeedback(feedback);
            localStorage.removeItem('comment_after_login');
        })
    }
}

export function notifyIfBottomOfThePage(onBottomReached, bottomOffset = 100){
    const html = window.document.querySelector('html');
    const howMuchScrolled = html.scrollTop;
    const howMuchIsToScroll = html.scrollHeight;
    const leftToScroll = howMuchIsToScroll - howMuchScrolled - html.clientHeight;
    if(leftToScroll <= bottomOffset) {
        onBottomReached(true);
    }
}