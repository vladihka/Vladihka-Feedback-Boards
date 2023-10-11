'use client';

import { SessionProvider } from "next-auth/react";

export default function Home() {
    return (
        <SessionProvider>
            <div>Landing page to register</div>
        </SessionProvider>
    )
}
