'use client'
import Link from "next/link";
import { signIn} from "next-auth/react";
import MobileNav from "@/app/components/MobileNav";
import DesktopNav from "@/app/components/DesktopNav";

export default function LandingHeader(){

    async function handleLoginButtonClick(){
        await signIn('google');
    }
    return (
        <header className="flex text-gray-600 gap-8 h-24 items-center">
            <DesktopNav></DesktopNav>
            <div className="grow md:hidden"></div>
            <MobileNav></MobileNav>
        </header>
    )
}