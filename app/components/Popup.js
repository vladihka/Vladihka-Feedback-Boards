export default function Popup({setShow, children, title, narrow}){

    function close(ev){
        ev.preventDefault();
        ev.stopPropagation();
        setShow(false)
    }

    return (
        <div 
            className="fixed z-40 inset-0 bg-white md:bg-black md:bg-opacity-80 flex md:items-center"
            onClick={close}>
            <button onClick={close} className="hidden md:block fixed top-4 right-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="w-full h-full overflow-y-scroll">
                <div 
                    className={(narrow ? 'md:max-w-sm' : 'md:max-w-2xl')+" bg-white  md:my-8 md:mx-auto md:rounded-lg overflow-hidden text-gray-600"}
                    onClick={e => e.stopPropagation()}>
                    <div className="relative min-h-[40px] md:min-h-0">
                        <button onClick={close} className="absolute top-4 left-8 md:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        {!!title && (
                            <h2 className="py-4 text-center border-b">
                                {title}
                            </h2>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}