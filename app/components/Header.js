'use client'
import MobileNav from "@/app/components/MobileNav";
import DesktopNav from "@/app/components/DesktopNav";
import {useContext} from "react";
import {AppContext} from "@/app/hooks/AppContext";

export default function Header(){

    const {narrowHeader} = useContext(AppContext);

    return (
        <>
            <header className={"flex text-gray-600 gap-8 h-24 " +
                "items-center max-auto" + (narrowHeader ? ' max-w-2xl' : '')}>
                <DesktopNav></DesktopNav>
                <div className="grow md:hidden"></div>
                <MobileNav></MobileNav>
            </header>
        </>

    )
}