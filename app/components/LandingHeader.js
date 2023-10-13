'use client'
import Link from "next/link";
import Bars2 from "@/app/components/icons/Bars2";
import {useState} from "react";

export default function LandingHeader(){
    const [navOpen, setNavOpen] = useState(false);
    return (
        <header className="flex text-gray-600 gap-8 h-24 items-center">
            <Link href="/" className="text-primary font-bold text-xl relative z-30">FeedbackBoard</Link>
            <nav className="gap-4 grow hidden md:flex">
                <Link href={'/'}>Home</Link>
                <Link href={'/pricing'}>Pricing</Link>
                <Link href={'/help'}>Help</Link>
            </nav>
            <nav className="hidden md:flex gap-4 items-center">
                <Link href={'/login'}>Login</Link>
                <Link href={'/register'}
                      className="bg-primary text-white px-4 py-2 rounded-md">Sign up</Link>
            </nav>
            <div className="grow md:hidden"></div>
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
                            <Link className="block py-4" href={'/login'}>Login</Link>
                            <Link className="block py-4" href={'/register'}>Register</Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}