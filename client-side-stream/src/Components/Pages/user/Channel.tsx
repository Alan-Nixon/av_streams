import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import SideBar from './SideBar'
import Content from './helpers/Content'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { numTokandM } from '../../../Functions/commonFunctions'
import { carouselInterface, channelInterface, videoInterface } from '../../../Functions/interfaces'
import { getMostWatchedVideoUser } from '../../../Functions/streamFunctions/streamManagement'
import { followChannel, getChannelById } from '../../../Functions/userFunctions/userManagement'
import { useUser } from '../../../UserContext'
import ChakraMessage from '../../messageShowers/ChakraUI'
import { useSocket } from '../../../Functions/realtime/socketContext'


function Channel() {
    const [loading, setLoading] = useState<boolean>(true)
    const [section, setSection] = useState("Home");
    const [channelId, setChannelId] = useState<string>("")
    const { user } = useUser();
    const { socket } = useSocket()
    const Navigate = useNavigate()

    const [channelDetails, setChannelDetails] = useState<channelInterface>({
        _id: "", channelName: "", Followers: [],
        profileImage: "", Shorts: [], Streams: [],
        subscription: {}, userId: "", userName: "",
        Videos: [], channelDescription: "", isFollowing: false
    })

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);        
        const userId = urlParams?.get('userId');
        if (!userId) { return Navigate('/') }
        setChannelId(userId)
        getChannelById(userId).then(async (Data: channelInterface) => {
            if (user && user._id) {
                if (user._id === Data.userId) { return Navigate('/profile') }
                Data.isFollowing = Data.Followers.includes(user?._id)
            } else {
                Data.isFollowing = false
            }
            Data.channelDescription = Data.channelDescription ?? "Av streams gives you good gaming experience"
            setChannelDetails(Data)
            setLoading(false);
        })
    }, [user])

    const followChannelOnClick = () => {
        if (user && user._id) {
            const Data = JSON.parse(JSON.stringify(channelDetails))
            Data.isFollowing = !Data.isFollowing
            if (Data.Followers.includes(user?._id)) {
                Data.Followers = Data.Followers.filter((item: string) => item !== user?._id)
            } else {
                Data.Followers.push(user?._id)
            }
            setChannelDetails(Data);
            followChannel(channelDetails.userId).then(() => {
                if (Data.Followers.includes(user?._id)) {
                    socket.emit('followChannel', {
                        data: {
                            Link: user?.profileImage,
                            SenderId: user?.userName,
                            Message: `${user?.userName} is now following you`,
                        }, userId: channelDetails.userId
                    })
                }
            })
        }
    }

    return (<>
        {loading ? <>
            <div className="lds-dual-ring"></div>
        </> : <>
            <NavBar />
            <SideBar />
            <Content>
                <div className="m-2">
                    <h1 className='text-xl font-bold'>Welcome to {channelDetails.channelName}</h1>
                    {!user && <ChakraMessage message={"you need to login to follow and message"} />}
                    <Card className="cursor-default ml-8 mt-2 dark:bg-gray-800" style={{ backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity))", borderRadius: "8%", width: "93%" }} >
                        <CardActionArea>
                            <CardContent>
                                <div className="flex ml-5">
                                    <img className='rounded-full' style={{ width: "100px", height: '100px' }} src={channelDetails.profileImage} alt="" />
                                    <div className="ml-5 text-white mt-2">
                                        <h1 className=' text-lg'>{channelDetails.channelName}</h1>
                                        <p>{numTokandM(channelDetails.Followers.length.toString())} Followers</p>
                                        <p>{channelDetails.channelDescription}</p>
                                    </div>
                                    <div className="ml-auto flex mt-8 text-white">
                                        <p onClick={followChannelOnClick}>{channelDetails.isFollowing ? "UNFOLLOW" : "FOLLOW"}</p><p className="ml-2">MESSAGE</p>
                                    </div>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <div className="mt-4">
                        {["Home", "Videos", "Shorts", "Posts", "Live"].map((item) => (
                            <span key={item} className={`profileHeadings font-bold text-xl ml-20 ${section === item ? "text-blue-500" : ""}`} onClick={() => {
                                setSection(item);
                            }} >
                                <strong>{item}</strong>
                            </span>
                        ))}
                    </div>
                </div>
                {section === "Home" && <ChannelHome />}
            </Content>
        </>}
    </>)


    // home
    function ChannelHome() {
        const [carousel, setCarousel] = useState<carouselInterface[]>([])
        const [currentCarousel, setCurrentCarousel] = useState<number>(0)
        const [mostWatched, setMostWatched] = useState<videoInterface[]>([])

        const Navigate = useNavigate()


        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams) {
                const channelId = urlParams.get('userId');
                if (channelId) {
                    setCarousel([{
                        imgUrl: "/images/carouselitem2.jpg"
                    }, {
                        imgUrl: "/images/carouselitem3.jpg"
                    }, {
                        imgUrl: "/images/carouselItem1.jpeg"
                    }]);

                    getMostWatchedVideoUser(channelDetails.userId).then((data) => setMostWatched(data))
                } else {
                    Navigate('/')
                }
            } else {
                Navigate('/')
            }
        }, [])

        const switchCarousel = (next: boolean) => {
            if (next) {
                setCurrentCarousel(currentCarousel + 1 === carousel.length ? 0 : currentCarousel + 1)
            } else {
                setCurrentCarousel(currentCarousel === 0 ? carousel.length - 1 : currentCarousel - 1)
            }
        }
        return (<div className='ml-8'>
            <div className="m-5 ml-5">
                <div id="default-carousel" className="relative" style={{ width: "98%" }} data-carousel="slide">
                    <div className="relative overflow-hidden rounded-lg" style={{ height: "500px" }}>
                        {carousel.map((item, idx) => {
                            return (<div key={idx} className={`${currentCarousel === idx ? "" : 'hidden'} duration-700 ease-in-out`} data-carousel-item>
                                <img src={item?.imgUrl} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                            </div>)
                        })}
                    </div>
                    <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                        <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                        <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
                        <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
                        <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
                        <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
                    </div>
                    <button type="button" onClick={() => switchCarousel(false)} className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                            <span className="sr-only">Previous</span>
                        </span>
                    </button>
                    <button type="button" onClick={() => switchCarousel(true)} className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="sr-only">Next</span>
                        </span>
                    </button>
                </div>
            </div>
            <p className="text-xl font-bold">Most Watched</p>
            <div className="m-3 flex flex-wrap">
                {mostWatched.length !== 0 ? mostWatched.map((item, index) => {
                    return (
                        <div key={index} onClick={() => Navigate('/FullVideo?videoId=' + item._id)} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} className="ml-3 mt-3 hover:bg-gray-900 cursor-pointer rounded-lg shadow">
                            <p>
                                <img className="rounded-t-lg w-full" src={item.Thumbnail} alt="" />
                            </p>
                            <div className="p-5">
                                <p> <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.Title}</h5></p>
                                <p className="text-yellow-700 font-bold">Premium</p>
                            </div>
                        </div>
                    )
                }) : <>No videos yet</>}
            </div>
        </div>)
    }

}

export default React.memo(Channel)


