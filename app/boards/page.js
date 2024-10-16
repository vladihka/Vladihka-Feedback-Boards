'use client';
import Edit from "@/app/components/icons/Edit";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BoardsPage() {

    const { data: session, status } = useSession();
    const [boards, setBoards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPremium, setIsPremium] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('google');
        } else if (status === 'authenticated') {
            fetchBoards(); 
            fetchSubscription();
        }
    }, [status]);

    const fetchBoards = async () => {
        const response = await axios.get(`/api/boards?search=${searchTerm}`);
        setBoards(response.data);
    };

    const fetchSubscription = async () => {
        const response = await axios.get('/api/subscription');
        const subscriptionStatus = response.data?.stripeSubscriptionData?.object?.status;
        setIsPremium(subscriptionStatus === 'active');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchBoards();
        }
    }, [searchTerm, status]);

    if (status === 'loading') {
        return <>Loading...</>;
    }

    if (status === 'unauthenticated') {
        return <>Unauthenticated. Redirecting...</>;
    }

    const canWeCreateBoard = boards?.length === 0 || isPremium;

    const handleDeleteBoard = (id) => {
        setBoardToDelete(id);
        setIsModalOpen(true);
    };

    const handleDeleteConfirmed = async (id) => {
        try {
            await axios.delete(`/api/board?id=${id}`);
            setBoards(boards.filter(board => board._id !== id));
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-4 sm:p-6 md:p-8 w-11/12 max-w-xs sm:max-w-md">
                        <h2 className="text-lg mb-4 text-center">Confirm Deletion</h2>
                        <p className="text-center">Are you sure you want to delete this board?</p>
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    handleDeleteConfirmed(boardToDelete);
                                    setIsModalOpen(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h1 className="text-center text-4xl mb-8">All boards:</h1>
            <input
                type="text"
                placeholder="Search boards..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border p-2 rounded mb-4 w-full"
            />
            <div className="grid md:grid-cols-2 gap-4">
                {boards.map(board => (
                    <div
                        key={'board-tile-' + board.name}
                        className={"rounded-md flex flex-col shadow-sm h-24 items-center justify-center text-center " +
                            (board.archived ? 'bg-orange-100' : 'bg-white')
                        }
                    >
                        <div className="grow flex items-center">
                            <Link
                                className="hover:underline"
                                href={'/board/' + board.slug}>{board.name}</Link>
                            {board.archived && (
                                <div className="ml-2 text-orange-400">(archived)</div>
                            )}
                        </div>
                        <div
                            className="flex gap-4 p-2 w-full border-t border-black border-opacity-10 text-gray-700 text-sm">
                            <Link
                                className={`w-full text-center flex gap-2 items-center justify-center ${board.adminEmail === session?.user?.email ? '' : 'opacity-50 cursor-not-allowed'}`}
                                href={board.adminEmail === session?.user?.email ? '/account/edit-board/' + board._id : '#'}
                                onClick={e => {
                                    if (board.adminEmail !== session?.user?.email) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Edit className="w-4 h-4"/>
                                Edit
                            </Link>
                            <Link className="block w-full text-center border-l border-l-black border-opacity-10"
                                  href={'/board/' + board.slug}>Visit &rarr;</Link>
                            <button
                                className={`block w-full text-center border-l border-l-black border-opacity-10 ${board.adminEmail === session?.user?.email ? 'text-red-600' : 'opacity-50 cursor-not-allowed text-gray-500'}`}
                                onClick={() => handleDeleteBoard(board._id)}
                                disabled={board.adminEmail !== session?.user?.email} 
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {canWeCreateBoard && (
                    <Link href={'/account/new-board'}
                          className="flex items-center justify-center bg-indigo-300 rounded-md shadow-sm py-2">
                        <span>Add new board +</span>
                    </Link>
                )}
            </div>
        </>
    );
}
