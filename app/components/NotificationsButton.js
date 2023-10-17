import Bell from "@/app/components/icons/Bell";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";
import Popup from "@/app/components/Popup";
import {useRouter} from "next/navigation";

export default function NotificationsButton(){
    const {status} = useSession();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if(status === 'authenticated'){
            fetchNotifications();
        }
    }, [status]);

    function fetchNotifications(){
        axios.get('/api/notification').then(res => {
            setNotifications(res.data);
        })
    }

    if(status !== 'authenticated'){
        return ''
    }

    const unreadNotifications = notifications.filter(n => !n.read);

    function NotificationText({notification}){
        return(
            <>
                {notification.sourceUserName} {notification.type === 'vote' ?
                'voted' : 'commented'} on <b>{notification.feedbackId?.title}</b>
            </>
        )
    }

    async function handleNotificationClick(notification){
        await axios.put('/api/notification', {id:notification._id});
        setOpen(false);
        const feedback = notification.feedbackId;
        router.push(`/board/${feedback.boardName}/feedback/${feedback._id}`);
        fetchNotifications();
    }

    return(
        <>
            <button className="relative" onClick={() => setOpen(true)}>
                <Bell></Bell>
                {unreadNotifications.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-sm px-1 rounded-full text-white">
                        {unreadNotifications.length}
                    </div>
                )}
            </button>
            {open && (
                <Popup
                    title="Notifications"
                    narrow={1}
                    setShow={setOpen}>
                    <div className="">
                        {notifications.map(notification => (
                            <div
                                onClick={() => handleNotificationClick(notification)}
                                key={notification._id}>
                                {notification.read && (
                                    <div className="p-4 border-b cursor-pointer text-black text-opacity-30">
                                        <NotificationText notification={notification}></NotificationText>
                                    </div>
                                )}
                                {!notification.read && (
                                    <div className="p-4 border-b cursor-pointer text-black">
                                        <NotificationText notification={notification}></NotificationText>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Popup>
            )}
        </>
    )
}