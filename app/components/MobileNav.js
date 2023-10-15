import Bars2 from "@/app/components/icons/Bars2";
import Link from "next/link";
import {useState} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function MobileNav(){
    const [navOpen, setNavOpen] = useState(false);
    const {status:sessionStatus} = useSession();
    const router = useRouter();

    function login(){
        const isBoardPage = window.location.href.includes('/board/')
        if(isBoardPage){
            signIn('google');
        }
        else{
            router.push('/account');
        }
    }

    return(
        <>
            <label
                onClick={() => setNavOpen(prev => !prev)}
                className="block md:hidden mobile-nav cursor-pointer">
                <Bars2></Bars2>
            </label>
            <input type="checkbox" id="navCb" checked={navOpen}/>
            <div
                onClick={() => setNavOpen(false)}
                className="nav-popup fixed inset-0 pt-24 bg-opacity-80 bg-bgGray p-4
                    rounded-2xl z-20 text-xl uppercase text-center">
                <div className="w-full">
                    <div className="bg-bgGray shadow-lg border max-w-sm mx-auto mt-4 rounded-lg py-4">
                        <nav className="">
                            <Link className="block py-4" href={'/'}>Home</Link>
                            <Link className="block py-4" href={'/pricing'}>Pricing</Link>
                            <Link className="block py-4" href={'/help'}>Help</Link>
                            {sessionStatus === 'unauthenticated' && (
                                <>
                                    <button className="block py-4 w-full uppercase"
                                          onClick={login}>Login</button>
                                    <button className="block py-4 w-full uppercase"
                                          onClick={login}>Register</button>
                                </>
                            )}
                            {sessionStatus === 'authenticated' && (
                                <>
                                    <Link className="block py-4 w-full uppercase"
                                          href={'/account'}>Account</Link>
                                    <button className="block py-4 w-full uppercase"
                                            onClick={() => signOut()}>
                                            Logout
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}