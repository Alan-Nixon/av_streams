import React, { useEffect, useRef, useState } from 'react';
import { singleChatInterfce } from '../interfaces';
import { getTimeDifference } from '../commonFunctions';
import { useUser } from '../../UserContext';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const ChatComponent = ({ setChatHome, personDetails, messages }: singleChatInterfce) => {
    console.log(messages);
    const { user } = useUser();
    const [selectEmoji, setSelectEmoji] = useState<boolean>(false)
    const [message, setMessage] = useState("")
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setSelectEmoji(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEmojiSelect = (emoji: { native: string; }) => {
        setMessage((data) => data + emoji.native);
        console.log(message + emoji.native);

    };

    const sendMessage = () => {
        alert(message)
        setMessage("")
    }

    return (
        <div className="min-h-[95vh] max-h-[600px] h-[500px]  p-4 flex top-5 fixed flex-col items-center justify-center w-[450px]  dark:bg-gray-900 text-gray-800 rounded-md mr-4">

            <div className="right-0 top-0 flex flex-col flex-grow w-[100%] bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex p-1 mt-1">
                    <i onClick={() => setChatHome(true)} className="w-[26px] p-3 fa fa-angle-left" />
                    <a className="inline-flex items-start mr-3" href="#0">
                        <img className="rounded-full" src={personDetails.profileImage} width="48" height="48" alt="no image" />
                    </a>
                    <div className="pr-1">
                        <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                            <h2 className="text-xl leading-snug font-bold">{personDetails.channelName}</h2>
                        </a>
                        <a className="block text-sm font-medium hover:text-indigo-500" href="#0">@{personDetails.userName}</a>
                    </div>
                </div><hr className='mt-1' />

                {messages.map((item, index) => {
                    return (
                        <div key={index} style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="flex flex-col flex-grow h-0 p-4">
                            {item.sender !== personDetails.userId ?
                                <div className="flex justify-end w-[75%] mt-2 space-x-3 max-w-xs self-end">
                                    <div>
                                        <div className="bg-indigo-300 p-3 rounded-l-lg rounded-br-lg">
                                            <p className="text-sm">{item.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none">{getTimeDifference(item.time)} ago</span>
                                    </div>
                                    <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-gray-300">
                                        <img src={personDetails.profileImage} className='rounded-full' alt="" />
                                    </div>
                                </div>
                                :
                                <div className="flex justify-start w-[75%] mt-2 space-x-3 max-w-xs">
                                    <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-gray-300">
                                        <img src={user?.profileImage} alt="" className='rounded-full' />
                                    </div>
                                    <div>
                                        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                            <p className="text-sm">{item.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none">{getTimeDifference(item.time)} ago</span>
                                    </div>
                                </div>
                            }
                        </div>
                    )
                })}
                <div ref={emojiPickerRef} className="absolute ml-5">
                    {selectEmoji && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
                </div>
                <div className="bg-gray-300 p-4">
                    <div className="flex">
                        <button type="button" onClick={() => setSelectEmoji(!selectEmoji)} className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
                            </svg>
                        </button>
                        <input onChange={(e) => setMessage(e.target.value)} value={message} className="flex items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…" />
                        <button type="button" onClick={() => sendMessage()} className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default React.memo(ChatComponent)