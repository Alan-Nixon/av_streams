import React, { useEffect, useState } from 'react'
import { channelInterface, chatHomeIterface, chatHomeUsers, } from '../../../../Functions/interfaces'
import { useUser } from '../../../../UserContext'
import { getChatOfUser } from '../../../../Functions/chatFunctions/chatManagement'
import { useNavigate } from 'react-router-dom'
import { getPersonDetailsChat, getTimeDifference } from '../../../../Functions/commonFunctions'
import { getNewChats, getfollowersByUserId } from '../../../../Functions/userFunctions/userManagement'


function ChatHome({ singleChatopen, userDetails }: chatHomeIterface) {

    const [homeChats, setHomeChats] = useState<chatHomeUsers[]>([])
    const [newChats, setNewChat] = useState<chatHomeUsers[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showNewChat, setShowNewChat] = useState(false)
    const { user } = useUser()
    const Navigate = useNavigate()

    useEffect(() => {
        (async () => {
            if (user && user._id) {
                const res = await getChatOfUser(user._id)
                console.log(res, "---");

                if (res && res?.data?.length > 0) {

                    const personDetails = await getPersonDetailsChat(res.data, user._id)
                    setHomeChats(personDetails);
                    const newChats = await getNewChats(res.data.map((item: any) => item.personDetails.userId))
                    setNewChat(newChats.res?.data)
                } else {
                    const { data } = await getNewChats([])
                    setNewChat(data);
                }

            } else {
                Navigate('/')
            }
            setLoading(false)
        })();
    }, [user])


    if (loading) {
        return (<>
            <section className="flex w-[450px] fixed top-5 flex-col rounded-md justify-center antialiased dark:bg-gray-800 text-gray-600 min-h-[95vh] max-h-[620px] p-4">

                <div role="status" className="flex min-h-[95vh] max-h-[720px] w-[450px] p-4 items-center justify-center bg-gray-300 rounded-lg  dark:bg-gray-700">
                    chats
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </section>
        </>)
    }

    return (
        <div>
            <section className="flex w-[450px] fixed top-5 flex-col rounded-md justify-center antialiased dark:bg-gray-800 text-gray-600 min-h-[95vh] max-h-[720px] p-4">
                <div className="h-auto">
                    <div className='w-full bg-white rounded-lg'>
                        <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-3">

                                <div className="flex items-center">
                                    <a className="inline-flex items-start mr-3" href="#0">
                                        <img className="rounded-full" src={user?.profileImage} width="48" height="48" alt="profile image" />
                                    </a>
                                    <div className="pr-1">
                                        <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                            <h2 className="text-xl leading-snug font-bold">{userDetails.channelName}</h2>
                                        </a>
                                        <a className="block text-sm font-medium hover:text-indigo-500" href="#0">@lauren.mars</a>
                                    </div>
                                </div>

                               
                            </div>

                        </header>
                    </div>
                    <div style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="relative mx-auto mt-2 bg-white max-h-[73vh] shadow-lg rounded-lg">

                        <div className="py-3 px-5">
                            {showNewChat && <>
                                <div className="mb-2">
                                    <h3 className=" text-xs font-bold uppercase text-gray-400 mb-1">new chat (you both need to follow to message)</h3>
                                    <div className="divide-y overflow-y-auto h-auto divide-gray-200">

                                        {newChats?.length && newChats?.map((item) => (
                                            <button onClick={() => singleChatopen(item)} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50" >
                                                <div className="flex items-center">
                                                    <img className="rounded-full items-start flex-shrink-0 mr-3" src={item?.personDetails?.profileImage} width="32" height="32" alt="Marie Zulfikar" />
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-900">{item?.personDetails?.channelName}</h4>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}

                                    </div>
                                </div>
                            </>}
                            <h3 className=" overflow-y-auto text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                            <div className="divide-y overflow-y-auto h-[450px] divide-gray-200">

                                {homeChats.map((item, idx) => (
                                    <button onClick={() => singleChatopen(item)} key={idx} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50" >
                                        <div className="flex items-center">
                                            <img className="rounded-full items-start flex-shrink-0 mr-3" src={item?.personDetails?.profileImage} width="32" height="32" alt="Marie Zulfikar" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">{item?.personDetails?.channelName}</h4>
                                                <div className="text-[13px]">The chat ended · {getTimeDifference(item.details[item.details.length - 1]?.time) ?? ""}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                            </div>

                        </div>

                        <button onClick={() => setShowNewChat(!showNewChat)} className="fixed bottom-[40px] right-5 inline-flex items-center text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full text-center px-3 py-2 shadow-lg focus:outline-none focus-visible:ring-2">
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

export default React.memo(ChatHome)