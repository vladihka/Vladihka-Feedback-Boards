'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import BoardForm from "@/app/account/BoardForm";
import Popup from "@/app/components/Popup";
import Button from "@/app/components/Button";

export default function EditBoardPage() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const router = useRouter();
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (id) {
            axios.get('/api/board?id=' + id)
                .then(res => {
                    setBoard(res.data);
                })
                .catch(err => {
                    console.error(err);
                    setErrorMessage("Failed to load board data.");
                    setErrorPopupVisible(true);
                });
        }
    }, [id]);

    async function handleBoardSubmit(boardData) {
        try {
            await axios.put('/api/board', {
                id: board._id, ...boardData,
            });
            router.push('/account');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('A board with this name already exists. Please choose a different name.');
                setErrorPopupVisible(true);
            } else {
                console.error(error);
            }
        }
    }

    return (
        <>
            <h1 className="text-center text-4xl mb-8">Edit Board</h1>
            {board && (
                <BoardForm {...board} buttonText={"Update Board"} onSubmit={handleBoardSubmit}></BoardForm>
            )}
            {errorPopupVisible && (
                <Popup setShow={setErrorPopupVisible}>
                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                            <h2 className="text-red-600 text-2xl font-bold mb-2 text-center">Error</h2>
                            <p className="text-gray-800 text-lg mb-4 text-center">{errorMessage}</p>
                            <Button 
                                onClick={() => setErrorPopupVisible(false)} 
                                className="bg-red-600 text-white hover:bg-red-700 w-full py-2 rounded-md transition duration-200 ease-in-out text-lg"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Popup>
            )}
        </>
    );
}
