import {signIn, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import Edit from "../components/icons/Edit"

export default function AccountView(){
    const {data:session, status} = useSession();
    const [boards, setBoards] = useState([]);
    useEffect(() => {
        if(status === 'unauthenticated'){
            signIn('google');
        }
        if(status === 'authenticated'){
            axios.get('/api/board').then(res => {
                setBoards(res.data)
            })
        }
    }, [status]);

    if(status === 'loading'){
        return
            <>
                'Loading...'
            </>;
    }

    if(status === "unauthenticated"){
        return
            <>
                'Unauthenticated. Redirecting...'
            </>;
    }

    return(
        <>
            <h1 className="text-center text-4xl mb-8">Your boards:</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boards.map(board => (
                    <div
                        key={'board-tile-'+board.name}
                        className="bg-white rounded-md shadow-sm h-24 flex-col flex
                        items-center justify-center text-center">
                        <div className="grow flex items-center">
                            <Link
                                className="hover:underline"
                                href={'/board/'+board.slug}>
                                {board.name}
                            </Link>
                        </div>
                        <div className="flex gap-4 p-2 w-full border-t border-gray-100 text-gray-700 text-sm">
                            <Link className="w-full text-center flex gap-2 items-center justify-center"
                                  href={'/account/edit-board/'+board._id}>
                                  <Edit className="w-4 h-4"></Edit>
                                  Edit
                            </Link>
                            <Link className="w-full block text-center border-l"
                                  href={'/board/'+board.slug}>
                                  Visit &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
                <Link href={'/account/new-board'}
                      className="flex items-center justify-center bg-indigo-300 rounded-md shadow-sm">
                    <span>Add new board +</span>
                </Link>
            </div>
        </>
    )
}