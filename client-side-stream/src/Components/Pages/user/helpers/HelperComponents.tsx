import { useNavigate } from "react-router-dom"
import { ModalInterfaceStateSetState, commentInterface, paginationInterface, postInterface } from "../../../../Functions/interfaces"
import { useUser } from "../../../../UserContext"
import ChakraMessage from "../../../messageShowers/ChakraUI"
import { likePostHome, numTokandM } from "../../../../Functions/commonFunctions"
import { useState } from "react"
import Comment from './Comment';



export const Pagination = ({ pagination, paginationFunc, Data, maxCount }: paginationInterface) => {
    return (
        <div className="flex" style={{ width: "100%" }}>
            <div className="dark-bg-blue-300" style={{ width: "60%" }} ></div>
            <div style={{ width: "40%" }}>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{pagination - maxCount}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(pagination, Data.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{Data?.length}</span> Transactions
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button onClick={() => paginationFunc(false)} style={{ cursor: pagination <= maxCount ? "not-allowed" : "pointer" }} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                            </svg>
                            Prev
                        </button>
                        <button onClick={() => paginationFunc(true)} style={{ cursor: pagination > Data?.length ? "not-allowed" : "pointer" }} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            Next
                            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ShowPosts = ({ Data }: any) => {
    const [posts, setPosts] = useState<postInterface[]>(Data || [])
    const Navigate = useNavigate()
    const { user } = useUser()

    const showPosts = (index: number) => {
        const newData: postInterface[] = posts.slice();
        newData[index] = { ...newData[index], clicked: !newData[index].clicked };
        setPosts(newData);
    };

    const postLike = (postId: string, index: number) => {
        likePostHome(postId);
        const newData: postInterface[] = posts.slice();
        newData[index] = {
            ...newData[index],
            liked: !newData[index].liked,
            likes: (parseInt(newData[index].likes) + (newData[index].liked ? -1 : 1)).toString()
        };
        setPosts(newData);
    };
    const incComm = (index: number, comm: commentInterface) => {
        console.log(index, comm);
        setPosts(prevPosts => {
            const updatedPosts = [...prevPosts];
            updatedPosts[index] = {
                ...updatedPosts[index],
                Comments: [...updatedPosts[index].Comments, comm]
            };
            return updatedPosts;
        });
        return null;
    };
    return (<>
        {posts.map((data, index) => (
            <div className='mt-1' key={index}>
                <ul role="list" onClick={() => Navigate('/channel?userId=' + data.userId)} className="max-w-sm cursor-pointer divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="sm:py-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="flex-shrink-0">
                                <img src={data.profileLink} className="w-8 h-8 rounded-full" alt="Neil image" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-md font-semibold truncate text-white">
                                    {data.channelName}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="ml-8">
                    <p>{data.Title}</p>
                    <p className="text-xs" style={{ maxWidth: "95%" }}>{data.Description}</p>
                    <img src={data.postLink} style={{ width: "98%" }} className='mt-5' alt='post not found' />
                </div>
                {!user && <ChakraMessage message={"You need to Login to comment"} />}
                <div className="flex ml-9 mt-3">
                    {data.liked ?
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => postLike(data._id, index)} style={{ cursor: "pointer" }} width={20} fill='#fff' viewBox="0 0 512 512">
                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                        : <svg onClick={() => postLike(data._id, index)} xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} viewBox="0 0 512 512" width={20} fill='#fff' >
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </svg>}
                    <span className="ml-1">{numTokandM(data.likes)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => showPosts(index)} style={{ cursor: "pointer" }} className='ml-2' width={20} fill='#fff' viewBox="0 0 512 512">
                        <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                    </svg><span className="ml-1">{data?.Comments?.length || "0"}</span>
                </div>

                {data.clicked && <Comment LinkId={data._id} Section="post" indexKey={index.toString()} incComm={incComm} CommentsArray={data?.Comments} />}
            </div>
        ))}
    </>)
} 


export function ModalPremium({ visible, setVisible }: ModalInterfaceStateSetState) {
    const Navigate = useNavigate()
    return (
        <div className="centered-container">
            <div id="default-modal" tabIndex={-1} aria-hidden="true" style={{ marginLeft: "25%", marginTop: "7%", position: "fixed" }} className={`${!visible && "hidden"} fixed overflow-y-auto overflow-x-hidden  z-50  w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                <div className=" p-4 w-full max-w-2xl max-h-full">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Terms of Subscription
                            </h3>
                            <button type="button" onClick={() => setVisible(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                At av streams, we offer three types of subscriptions tailored to meet your streaming needs: weekly, monthly, and yearly. With each subscription, you gain access to a premium streaming experience, free from interruptions by advertisements.
                            </p>
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                For your convenience, all subscriptions come with auto-renewal enabled. Once activated, your subscription will automatically renew at the end of its duration using the funds available in your wallet. This ensures uninterrupted access to premium content without the hassle of manual renewal. This can be disable in your profile
                            </p>
                        </div>

                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <div className="" style={{ float: "right" }}>
                                <button data-modal-hide="default-modal" type="button" onClick={() => Navigate('/subscription')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button data-modal-hide="default-modal" type="button" onClick={() => setVisible(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
