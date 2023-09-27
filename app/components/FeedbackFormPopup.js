import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import PaperClip from "./icons/PaperClip";

export default function FeedbackFormPopup({setShow}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploads, setUploads] = useState([]);

    function handleCreatePostButtonClick(ev){
        ev.preventDefault();
        axios.post('/api/feedback', {title, description}).then(() => {
            setShow(false);
        });
    }

    async function handleAttachFilesInputChange(ev){
        const files = [...ev.target.files];
        const data = new FormData();
        for(const file of files){
            data.append('file', file);
        }
        const res = await axios.post('/api/upload', data);
        setUploads((existingUpload) => {
            return [...existingUpload, ...res.data];
        });
    }

    return (
        <Popup setShow={setShow} title={'Make a suggestion'}>
            <form className="p-8">
                <label className="block mt-4 mb-1 text-slate-700">Title</label>
                <input 
                    value={title}
                    className="w-full border p-2 rounded-md" 
                    type="text" 
                    placeholder="A short, descriptive title"
                    onChange={ev => setTitle(ev.target.value)}>
                </input>
                <label className="block mt-4 mb-1 text-slate-700">Details</label>
                <textarea 
                    className="w-full border p-2 rounded-md" 
                    placeholder="Please include any details"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}>
                </textarea>
                {uploads?.length > 0 && (
                    <div>
                        <label className="block mt-2 mb-1 text-slate-700">Files</label>
                        <div className="flex gap-2">
                        {uploads.map(link => (
                            <a href={link} target="_blank" className="h-16">
                                {/.(jpg|png)$/.test(link) ? (
                                    <img className="h-16 w-auto rounded-md" src={link}></img>
                                ) : (
                                    <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
                                        <PaperClip className="w-4 h-4"></PaperClip>
                                        {link.split('/')[3].substring(19)}
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                    <label className="py-2 px-4 text-gray-600 cursor-pointer">
                        <span>Attach files</span>
                        <input multiple onChange={handleAttachFilesInputChange} type="file" className="hidden"></input>
                    </label>
                    <Button primary onClick={handleCreatePostButtonClick}>Create post</Button>
                </div>
            </form>
        </Popup>
    )
}