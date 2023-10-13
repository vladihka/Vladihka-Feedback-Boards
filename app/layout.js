import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";
import {headers} from "next/headers"
import LandingHeader from "@/app/components/LandingHeader";
import AuthProvider from "@/app/hooks/AuthProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Feedback boards',
    description: '',
}

export default function RootLayout({ children }) {
    const headersList = headers();
    const path = headersList.get('x-invoke-path');
    const isBoardPage = path?.startsWith('/board/');
    // console.log(path);
    return (
        <html lang="en">
            <body className={inter.className + (isBoardPage ? '' :  ' bg-bgGray')}>
                {isBoardPage && (
                    <>
                        {children}
                    </>
                )} 
                {!isBoardPage && (
                    <main className="mx-auto max-w-4xl px-4">
                        <AuthProvider>
                            <LandingHeader></LandingHeader>
                            {children}
                        </AuthProvider>
                    </main>
                )}
            </body>
        </html>
    )
}