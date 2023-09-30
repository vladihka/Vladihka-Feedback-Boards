'use client';

import { SessionProvider } from "next-auth/react";
import Board from "./components/Board";
import Header from "./components/Header";

export default function Home() {

  return (
    <SessionProvider>
      <Header></Header>
      <Board></Board>
    </SessionProvider>
  )
}
