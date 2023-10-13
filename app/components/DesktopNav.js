import Link from "next/link";
import { useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function DesktopNav(){
    const {status:sessionStatus} = useSession();

    return(
        <>
            <Link href="/" className="text-primary font-bold text-xl relative z-30">FeedbackBoard</Link>
            <nav className="gap-4 grow hidden md:flex">
                <Link href={'/'}>Home</Link>
                <Link href={'/pricing'}>Pricing</Link>
                <Link href={'/help'}>Help</Link>
            </nav>
            <nav className="hidden md:flex gap-4 items-center">
                {sessionStatus === 'authenticated' && (
                    <>
                        <Link href={'/account'}>Your account</Link>
                    </>
                )}
                {sessionStatus === 'unauthenticated' && (
                    <>
                        <Link href={'/account'}>Login</Link>
                        <Link href={'/account'}
                                className="bg-primary text-white px-4 py-2 rounded-md">Sign up</Link>
                    </>
                )}
            </nav>
        </>
    )
}