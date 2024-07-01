import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../UserContext';
import { getUserById, logout } from '../../../../Functions/userFunctions/userManagement';


import { useNavigate } from 'react-router-dom';
import ChatHome from '../chat/chatHome';
import { Popup } from 'reactjs-popup'
import SingleChat from '../chat/SingleChat';
import { channelInterface, chatInterfaceProps, messageArray } from '../../../../Functions/interfaces';
import io from 'socket.io-client'
import { toastFunction } from '../../../messageShowers/ToastFunction';

import { ZIM } from "zego-zim-web";
import { v4 as uuidv4 } from 'uuid';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';





function NavBar() {
    const { setShowHideSideBar, showHideSideBar } = useUser()
    const [messageSocket, setMessageSocket] = useState<any>(null)
    const [zp, setZP] = useState<any>()


    const [chatWindow, setChatwindow] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('');
    const { user } = useUser();
    // const location = useLocation()
    const Navigate = useNavigate()

    const width = useSelector((state: any) => state?.sideBarRedux?.width);


    const [isToastActive, setIsToastActive] = useState(false);

    useEffect(() => {
        const handleMessage = async (messResponse: { sender: string; message: any; }) => {
            const { data } = await getUserById(messResponse.sender);
            if (data && !isToastActive) {
                setIsToastActive(true);
                toastFunction({
                    Link: data.profileImage,
                    SenderId: data.channelName,
                    Message: messResponse.message,
                    onClose: () => setIsToastActive(false),
                });
            }
        };

        if (messageSocket) {
            messageSocket.on('incoming_message', handleMessage);
        }

        return () => {
            if (messageSocket)
                messageSocket.off('incoming_message', handleMessage);
        };
    }, [isToastActive, messageSocket]);


    useEffect(() => {
        if (user && user?._id) {
            const messageSocket = io(process.env.REACT_APP_API_GATEWAY + "")
            setMessageSocket(messageSocket);
            messageSocket.emit('join', user._id);


            const userID = user._id;
            const userName = user.channelName;
            const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
            const serverSecret = process.env.REACT_APP_ZEGO_SERVER_ID ?? "";
            const roomId = uuidv4()
            const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userID, userName);
            const zp = ZegoUIKitPrebuilt.create(TOKEN);
            zp.addPlugins({ ZIM });
            zp.setCallInvitationConfig({
                ringtoneConfig: {
                    incomingCallUrl: 'https://res.cloudinary.com/dyh7c1wtm/video/upload/v1717999547/rrr_uixgh2.mp3',
                    outgoingCallUrl: 'https://res.cloudinary.com/dyh7c1wtm/video/upload/v1718002692/beggin_edited_kgcew8.mp3'
                }
            })

            setZP(zp)

        }
    }, [])

    function searchNow() {
        if (search !== "") {
            Navigate('/')
            setTimeout(() => Navigate('/search?search=' + search), 0)
        }
    }

    return (
        <nav style={{ zIndex: "999" }} className="fixed top-0 left-0 right-0 bg-gray-900   border-white border-b-[1px] z-10">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
                <div className="flex  space-x-3 ml-10">
                    <button data-collapse-toggle="navbar-default" onClick={() => setShowHideSideBar(!showHideSideBar)} type="button" className="hamburgerButtonDiv ml-auto flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <a href="/" className="flex items-center space-x-1 rtl:space-x-reverse">
                        <img src="https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS427860.jpg" style={{ borderRadius: "100px" }} className="h-10" alt="Av Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">AV streams</span>
                    </a>

                    <div className="searchContainerHome relative flex left-5 ">
                        <div className="flex items-center">
                            <div className="absolute items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>

                            <input style={{ minWidth: "300px" }} type="search" onChange={e => setSearch(e.target.value)} id="default-search"
                                className="flex h-10 p-4 pl-10 text-sm border rounded-lg bg-gray-900 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 " placeholder="Search Streams, Videos..." required />


                        </div>
                        <button onClick={() => searchNow()} type="button" className="top-1 text-white absolute right-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Search</button>
                    </div>

                </div>
                {width > 590 && <div className="profileTagInNavbar block" id="navbar-default">
                    <ul className="font-medium flex flex-col pl-3 pr-3 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  bg-gray-800 md:bg-gray-900 border-gray-700">
                        {user ? (
                            <> 
                                <div className="flex items-center space-x-3">
                                    {window.location.pathname !== '/startLive' && <div onClick={() => window.location.href = "/startLive"} className="flex p-2 bg-transparent-500 hover:bg-gray-500 cursor-pointer">
                                        <svg fill='#ffffff' width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                                        </svg>
                                        <p className='ml-2'>start live now</p>
                                    </div>}
                                    <img src={user.profileImage} className='w-6 h-6 rounded-lg' alt="" />
                                    <strong> <a href="/profile" className="block py-2 rounded  md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                                        {user.userName}
                                    </a></strong>
                                    <p onClick={() => logout().then(() => window.location.href = '/')} style={{ cursor: "pointer" }}>Logout</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex space-x-2">
                                    <button onClick={() => window.location.href = '/Login'} className="relative inline-flex mt-1 items-center justify-center p-0.5 mb-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 text-white bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Login
                                        </span>
                                    </button>
                                    <button onClick={() => window.location.href = "/Signup"} className="relative inline-flex mt-1 items-center justify-center p-0.5 mb-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                        <span className="relative px-5 py-1 transition-all ease-in duration-75 text-white bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Register
                                        </span>
                                    </button>

                                </div>

                            </>
                        )}
                    </ul>
                </div>}
            </div >


            {chatWindow && messageSocket && user && (
                <div className="fixed md:right-[100px] md:top-0 min-w-[360px]">
                    <ChatPopup zp={zp} setChatWindow={setChatwindow} user={user} messageSocket={messageSocket} chatWindow={chatWindow} />
                </div>
            )}

            {user && !chatWindow && (
                <div onClick={() => {
                    setChatwindow(!chatWindow)
                }} className="fixed bottom-0 right-0 mb-4 mr-4 w-[40px] h-[40px] rounded-full dark:bg-gray-900 flex items-center z-50 justify-center">
                    <button className="bg-transparent w-full h-full rounded-full text-xl text-white flex items-center justify-center">
                        <i className="fa fa-comments"></i>
                    </button>
                </div>
            )}
        </nav >
    );




}

export default React.memo(NavBar)



export function ChatPopup({ chatWindow, setChatWindow, user, messageSocket, zp }: chatInterfaceProps) {

    const dumChannel: channelInterface = {
        _id: "", channelDescription: "", channelName: "",
        Followers: [], isFollowing: true, profileImage: "",
        Shorts: [], Streams: [], subscription: {}
        , userId: "", userName: "", Videos: []
    }

    const [chatHome, setChatHome] = useState(true)
    const [chats, setChats] = useState<messageArray[]>([])
    const [person, setPerson] = useState<channelInterface>(dumChannel)


    const singleChatopen = (personDetails: any) => {
        setChatHome(false)
        setPerson(personDetails.personDetails)
        setChats(personDetails.details)
    }

    return (
        <Popup trigger={<button />} position={'right top'} open={chatWindow} onClose={() => setChatWindow(false)}>
            {chatHome ?
                <ChatHome singleChatopen={singleChatopen} userDetails={user} /> :
                <SingleChat zp={zp} personDetails={person} messages={chats} setMessages={setChats} setChatHome={setChatHome} messageSocket={messageSocket} />}
        </Popup>
    )
}
