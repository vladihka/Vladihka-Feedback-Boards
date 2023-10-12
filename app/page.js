import Link from "next/link";

export default function Home() {
    return (
        <section className="grid grid-cols-2 gap-8 my-24 items-center">
            <div className="">
                <h1 className="text-4xl mb-4 leading-normal">Your users will love FeedbackBoards</h1>
                <p className="text-gray-600 mb-8">Experience a seamless, collaborative solution for user requests. Say goodbye to outdated
                    spreadsheets and chaotic boards. Empower your customers, gain priceless insights.</p>
                <Link 
                    href={'/register'}
                    className="bg-primary text-white px-6 py-4 rounded-md">Try for free &rarr;</Link>
            </div>
            <div className="relative">
                <img src="board.png" alt="" className="relative z-10"/>
                <div className="bg-indigo-400 bg-opacity-40 w-[300px] h-[300px] rounded-full
                    absolute left-[50%] -ml-[150px] top-[50%] -mt-[150px]"></div>
            </div>
        </section>
    )
}
