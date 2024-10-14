'use client';
import {useEffect, useState} from "react";
import axios from "axios";
import {MoonLoader} from "react-spinners";
import Button from "@/app/components/Button";

export default function SubscriptionPage(){

    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false); // добавим состояние для ошибок

    useEffect(() => {
        setIsLoading(true);
        setHasError(false); // сбросим ошибки перед загрузкой

        axios.get('/api/subscription')
            .then(res => {
                setSubscription(res.data?.stripeSubscriptionData);
                setIsLoading(false);
            })
            .catch(err => {
                if(err.response?.status === 401){
                    // Ошибка авторизации, можно обработать этот случай
                    setSubscription(null);
                } else {
                    setHasError(true); // установим ошибку
                }
                setIsLoading(false);
            });
    }, []);

    const isCancelled = !!subscription?.cancel_at;
    const endTime = new Date(subscription?.current_period_end * 1000);
    let humanReadableEndTime;
    if (subscription) {
        humanReadableEndTime = endTime?.toISOString().replace('T', ' ').substring(0, 16);
    }

    function manageSubscriptionButtonClick() {
        axios.post('/api/subscription').then(res => {
            window.location.href = res.data;
        });
    }

    function manageSubscriptionClick(){
        axios.post('/api/subscription').then(res => {
            window.location.href = res.data;
        });
    }

    return (
        <div>
            <h1 className="text-center text-4xl mb-8">Your subscription</h1>
            {isLoading && (
                <div className="w-full flex justify-center">
                    <MoonLoader size={36}></MoonLoader>
                </div>
            )}
            {!isLoading && !subscription && !hasError && (
                <div className="text-center">
                    No active subscriptions
                    <div className="flex justify-center">
                        <Button
                            className="my-4"
                            primary={1}
                            onClick={manageSubscriptionButtonClick}>Go PRO!</Button>
                    </div>
                </div>
            )}
            {subscription && (
                <div className="text-center">
                    Your subscription is {isCancelled ? 'cancelled' : subscription.status}
                    <br/>
                    {isCancelled && (
                        <div>Your subscription ends:&nbsp;{humanReadableEndTime}</div>
                    )}
                    <div className="flex justify-center">
                        <Button
                            className="my-4"
                            primary={1}
                            onClick={manageSubscriptionClick}>Manage your subscription</Button>
                    </div>
                </div>
            )}
            {!isLoading && hasError && (
                <div className="text-center text-red-500">Failed to load subscription data. Please try again later.</div>
            )}
        </div>
    );
}
