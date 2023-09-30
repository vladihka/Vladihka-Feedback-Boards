import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";
import { MoonLoader } from "react-spinners";
import Attachment from "./Attachment";

export default function FeedbackFormPopup({setShow, onCreate}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploads, setUploads] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    function handleCreatePostButtonClick(ev){
        ev.preventDefault();
        axios.post('/api/feedback', {title, description, uploads}).then(() => {
            setShow(false);
            onCreate();
        });
    };

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
                            <Attachment 
                                link={link}
                                showRemoveButton={true} 
                                handleAttachFilesInputChange={(ev,link) => handleRemoveFileButtonClick(ev,link)}>
                            </Attachment>
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