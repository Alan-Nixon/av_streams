import React from 'react'
import { chatHomeIterface, } from '../interfaces'


function ChatWindow({ chats, singleChatopen, userDetails }: chatHomeIterface) {
    return (
        <div>
            <section className="flex fixed top-5 flex-col rounded-md justify-center antialiased dark:bg-gray-800 text-gray-600 min-h-[95vh] max-h-[720px] p-4">
                <div className="h-auto">
                    <div className='w-full bg-white rounded-lg'>
                        <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-3">

                                <div className="flex items-center">
                                    <a className="inline-flex items-start mr-3" href="#0">
                                        <img className="rounded-full" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-48-01_nugblk.jpg" width="48" height="48" alt="Lauren Marsano" />
                                    </a>
                                    <div className="pr-1">
                                        <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                            <h2 className="text-xl leading-snug font-bold">{userDetails.channelName}</h2>
                                        </a>
                                        <a className="block text-sm font-medium hover:text-indigo-500" href="#0">@lauren.mars</a>
                                    </div>
                                </div>

                                <div className="relative inline-flex flex-shrink-0">
                                    <button className="text-black hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                                            <path d="m15.621 7.015-1.8-.451A5.992 5.992 0 0 0 13.13 4.9l.956-1.593a.5.5 0 0 0-.075-.611l-.711-.707a.5.5 0 0 0-.611-.075L11.1 2.87a5.99 5.99 0 0 0-1.664-.69L8.985.379A.5.5 0 0 0 8.5 0h-1a.5.5 0 0 0-.485.379l-.451 1.8A5.992 5.992 0 0 0 4.9 2.87l-1.593-.956a.5.5 0 0 0-.611.075l-.707.711a.5.5 0 0 0-.075.611L2.87 4.9a5.99 5.99 0 0 0-.69 1.664l-1.8.451A.5.5 0 0 0 0 7.5v1a.5.5 0 0 0 .379.485l1.8.451c.145.586.378 1.147.691 1.664l-.956 1.593a.5.5 0 0 0 .075.611l.707.707a.5.5 0 0 0 .611.075L4.9 13.13a5.99 5.99 0 0 0 1.664.69l.451 1.8A.5.5 0 0 0 7.5 16h1a.5.5 0 0 0 .485-.379l.451-1.8a5.99 5.99 0 0 0 1.664-.69l1.593.956a.5.5 0 0 0 .611-.075l.707-.707a.5.5 0 0 0 .075-.611L13.13 11.1a5.99 5.99 0 0 0 .69-1.664l1.8-.451A.5.5 0 0 0 16 8.5v-1a.5.5 0 0 0-.379-.485ZM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </header>
                    </div>
                    <div style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="relative mx-auto mt-2 bg-white max-h-[73vh] shadow-lg rounded-lg">

                        <div className="py-3 px-5">
                            <h3 className=" overflow-y-auto text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                            <div className="divide-y overflow-y-auto h-[450px] divide-gray-200">

                                {chats.map((item) => (
                                    <button onClick={singleChatopen} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50" >
                                        <div className="flex items-center">
                                            <img className="rounded-full items-start flex-shrink-0 mr-3" src={item?.profileImage} width="32" height="32" alt="Marie Zulfikar" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Marie Zulfikar</h4>
                                                <div className="text-[13px]">The video chat ended · 2hrs</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                            </div>
                        </div>
                        <button className="fixed bottom-[40px] right-5 inline-flex items-center text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full text-center px-3 py-2 shadow-lg focus:outline-none focus-visible:ring-2">
                            <svg className="w-3 h-3 fill-current text-indigo-300 flex-shrink-0 mr-2" viewBox="0 0 12 12">
                                <path d="M11.866.146a.5.5 0 0 0-.437-.139c-.26.044-6.393 1.1-8.2 2.913a4.145 4.145 0 0 0-.617 5.062L.305 10.293a1 1 0 1 0 1.414 1.414L7.426 6l-2 3.923c.242.048.487.074.733.077a4.122 4.122 0 0 0 2.933-1.215c1.81-1.809 2.87-7.94 2.913-8.2a.5.5 0 0 0-.139-.439Z" />
                            </svg>
                            <span>New Chat</span>
                        </button>
                    </div>
                </div>
            </section >

        </div >
    )
}

export default React.memo(ChatWindow)