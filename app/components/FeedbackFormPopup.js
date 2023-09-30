import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import axios from "axios";
import Attachment from "./Attachment";
import AttachFilesButton from "./AttachFilesButton";

export default function FeedbackFormPopup({setShow, onCreate}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploads, setUploads] = useState([]);

    function handleCreatePostButtonClick(ev){
        ev.preventDefault();
        axios.post('/api/feedback', {title, description, uploads}).then(() => {
            setShow(false);
            onCreate();
        });
    };

    function handleRemoveFileButtonClick(ev, link){
        ev.preventDefault();
        setUploads(currentUploads => {
            return currentUploads.filter(val => val !== link);
        });
    }

    function addNewUploads(newLinks){
        setUploads(prevLinks => [...prevLinks, ...newLinks])
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
                                handleRemoveFileButtonClick={(ev,link) => handleRemoveFileButtonClick(ev,link)}>
                            </Attachment>
                        ))}
                    </div>
                </div>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                    <AttachFilesButton onNewFiles={addNewUploads}></AttachFilesButton>
                    <Button primary onClick={handleCreatePostButtonClick}>Create post</Button>
                </div>
            </form>
        </Popup>
    )
}