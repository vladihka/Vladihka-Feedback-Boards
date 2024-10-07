import './globals.css'
import { Inter } from 'next/font/google'
import Header from "@/app/components/Header";
import AuthProvider from "@/app/hooks/AuthProvider";
import {AppContextProvider} from "@/app/hooks/AppContext";
import Footer from "@/app/components/Footer";

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
                    <div className={"flex flex-col items-stretch min-h-screen"}>
                        <div className={"h-full"}>
                            <Header></Header>
                        </div>
                        <div className={"flex-auto"}>
                            {children}
                        </div>
                        <div className={"justify-end"}>
                            <Footer></Footer>
                        </div>
                    </div>
                </AuthProvider>
            </AppContextProvider>
        </div>
        </body>
        </html>
    )
}