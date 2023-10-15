import './globals.css'
import { Inter } from 'next/font/google'
import {headers} from "next/headers"
import Header from "@/app/components/Header";
import AuthProvider from "@/app/hooks/AuthProvider";
import {AppContextProvider} from "@/app/hooks/AppContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Feedback boards',
    description: '',
}

export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body>
                <div className="mx-auto max-w-4xl px-4">
                    <AppContextProvider>
                        <AuthProvider>
                            <Header></Header>
                            {children}
                        </AuthProvider>
                    </AppContextProvider>
                </div>
            </body>
        </html>
    )
}