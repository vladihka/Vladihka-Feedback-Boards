'use client'
import { signIn, signOut, useSession } from "next-auth/react"
import Button from "./Button";
import Login from "./icons/Login";
import Logout from "./icons/Logout";

export default function Header(){
    const {data:session} = useSession();
    const isLoggedIn = !!session?.user?.email;

    function logout(){
        signOut();
    }

    function login(){
        signIn('google');
    }

    return(
        <div className="max-w-2xl mx-auto flex justify-end p-2 gap-4 items-center">
            {isLoggedIn && (
                <>
                    <span>
                        Hello, {session.user.name}!
                    </span>
                    <Button 
                        className="shadow-sm bg-white border px-2 py-0 " 
                        onClick={logout}>
                        Logout <Logout></Logout>
                    </Button>
                </>
            )}
            {!isLoggedIn && (
                <>
                    Not logged in
                    <Button 
                        primary={true}
                        className="shadow-sm px-2 py-0" 
                        onClick={login}>
                        Login <Login></Login>
                    </Button>
                </>
            )}
        </div>
    )
}