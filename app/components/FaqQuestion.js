'use client'
import {useState} from "react";
import ChevronDown from "@/app/components/icons/ChevronDown";
import ChevronUp from "@/app/components/icons/ChevronUp";

export default function FaqQuestion({question, children}){
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="rounded-lg overflow-hidden my-4">
            <button
                className="w-full flex gap-2 items-center bg-indigo-300 bg-opacity-50 md:text-xl p-4 cursor-pointer"
                onClick={() => setIsOpen(prev => !prev)}>
                {!isOpen && (
                    <ChevronDown className="w-6 h-6 text-indigo-800"></ChevronDown>
                )}
                {isOpen && (
                    <ChevronUp className="w-6 h-6 text-indigo-800"></ChevronUp>
                )}
                {question}
            </button>
            {isOpen && (
                <div className="bg-indigo-300 bg-opacity-30 p-4 text-gray-600">
                    {children}
                </div>
            )}
        </div>
    )
}