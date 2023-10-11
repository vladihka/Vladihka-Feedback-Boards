import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";
import {headers} from "next/headers"

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
                    <main className="mx-auto max-w-4xl">
                        <header className="flex text-gray-600 gap-8 h-24 items-center">
                            <Link href="" className="text-primary font-bold text-xl">FeedbackBoard</Link>
                            <nav className="flex gap-4 grow">
                            <Link href={'/'}>Home</Link>
                            <Link href={'/pricing'}>Pricing</Link>
                            <Link href={'/help'}>Help</Link>
                            </nav>
                            <nav className="flex gap-4 items-center">
                                <Link href={'/login'}>Login</Link>
                                <Link href={'/register'}
                                    className="bg-primary text-white px-4 py-2 rounded-md">Sign up</Link>
                            </nav>
                        </header>
                        {children}
                    </main>
                )}
            </body>
        </html>
    )
}