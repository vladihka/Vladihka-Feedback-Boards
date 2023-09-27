import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";
import { MoonLoader } from "react-spinners";

export default function FeedbackFormPopup({setShow}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploads, setUploads] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    function handleCreatePostButtonClick(ev){
        ev.preventDefault();
        axios.post('/api/feedback', {title, description}).then(() => {
            setShow(false);
        });
    }

    async function handleAttachFilesInputChange(ev){
        const files = [...ev.target.files]
        setIsUploading(true);
        const data = new FormData();
        for(const file of files){
            data.append('file', file);
        }
        const res = await axios.post('/api/upload', data);
        setUploads((existingUpload) => {
            return [...existingUpload, ...res.data];
        });
        setIsUploading(false);
    }

    function handleRemoveFileButtonClick(ev, link){
        ev.preventDefault();
        setUploads(currentUploads => {
            return currentUploads.filter(val => val !== link);
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
                        <div className="flex gap-3">
                        {uploads.map(link => (
                            <a href={link} target="_blank" className="h-16 relative">
                                <button
                                    onClick={ev => handleRemoveFileButtonClick(ev, link)}                              
                                    className="-right-2 -top-2 absolute bg-red-400 p-1 rounded-md text-white">
                                    <Trash></Trash>
                                </button>
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
                    <label className="flex gap-2 py-2 px-4  cursor-pointer">
                        {isUploading && (
                            <MoonLoader  size={18}></MoonLoader>
                        )}
                        <span className={(isUploading) ? 'text-gray-300' : 'text-gray-600'}>
                            {isUploading ? 'Uploading...' : 'Attach files'}
                        </span>
                        <input multiple onChange={handleAttachFilesInputChange} type="file" className="hidden"></input>
                    </label>
                    <Button primary onClick={handleCreatePostButtonClick}>Create post</Button>
                </div>
            </form>
        </Popup>
    )
}