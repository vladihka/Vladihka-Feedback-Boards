'use client'
import Link from "next/link";
import React, {useContext} from "react";
import {AppContext} from "@/app/hooks/AppContext";

export default function Footer(){
    const {style} = useContext(AppContext);
    return(
        <>
            <footer className={""}>
                <hr className="border-t border-gray-300 py-0.5"/>
                <div className={"flex items-center justify-between gap-8 pb-2"}>
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
                    <p>All rights reserved</p>
                </div>
            </footer>
        </>
    )
}