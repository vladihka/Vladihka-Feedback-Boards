import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";
import {useContext, useState} from "react";
import Popup from "@/app/components/Popup";
import {useRouter} from "next/navigation";
import {AppContext, loginAndRedirect, logoutAndRedirect} from "@/app/hooks/AppContext";
import NotificationsButton from "@/app/components/NotificationsButton";

export default function DesktopNav(){

    const {data:session, status:sessionStatus} = useSession();
    const [showUserPopup, setShowUserPopup] = useState(false);
    const router = useRouter();
    const {style} = useContext(AppContext);

    function goAndClose(uri){
        setShowUserPopup(false);
        router.push(uri);
    }
    function login(){
        loginAndRedirect(router, signIn);
    }

    return(
        <>
            <Link
                href="/"
                className={"font-bold text-xl relative z-30 "
                + (
                    style === 'hyper'
                        ? 'text-red-500'
                        : style === 'oceanic'
                            ? 'text-blue-500'
                            : style === 'cotton-candy'
                                ? 'text-pink-300'
                                : style === 'gotham'
                                    ? 'text-gradient-to-r from-gray-700 via-gray-900 to-black'
                                    : style === 'sunset'
                                        ? 'text-red-200'
                                        : style === 'mojave'
                                            ? 'text-yellow-300'
                                            : 'text-blue-500'
                    )
            }>
                FeedbackBoard
            </Link>
            <nav className="gap-4 grow hidden md:flex">
                <Link href={'/'}>Home</Link>
                <Link href={'/pricing'}>Pricing</Link>
                <Link href={'/help'}>Help</Link>
            </nav>
            <nav className="hidden md:flex gap-4 items-center">
                {sessionStatus === 'authenticated' && (
                    <>
                        <button
                            onClick={() => setShowUserPopup(true)}
                            className="flex items-center bg-gray-300 rounded-xl cursor-pointer">
                            <img
                                className="w-8 h-8 rounded-full"
                                src={session.user.image} alt=""/>
                            <span className="px-2">
                                {session.user.name.split(' ')[0]}
                            </span>
                        </button>
                        <NotificationsButton></NotificationsButton>
                    </>
                )}
                {sessionStatus === 'unauthenticated' && (
                    <>
                        <button onClick={login}>Login</button>
                        <button onClick={login}
                                className="bg-primary text-white px-4 py-2 rounded-md">
                                Sign up
                        </button>
                    </>
                )}
            </nav>
            {showUserPopup && (
                <Popup narrow={1} setShow={setShowUserPopup}>
                    <button
                        onClick={() => goAndClose('/account')}
                        className="block w-full text-center py-4 uppercase">
                        Your boards
                    </button>
                    <button
                        onClick={() => goAndClose('/subscription')}
                        className="block w-full text-center py-4 uppercase">
                        Subscription
                    </button>
                    <button
                        className="block w-full text-center py-4 uppercase"
                        onClick={() => {
                            setShowUserPopup(false);
                            logoutAndRedirect(router, signOut);
                        }
                    }>
                        Logout
                    </button>
                </Popup>
            )}
        </>
    )
}