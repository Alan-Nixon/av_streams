import React, { useEffect, useState } from 'react'
import NavBar from '../layout/NavBar'
import { useNavigate } from 'react-router-dom'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { numTokandM } from '../../../../Functions/commonFunctions'
import { carouselInterface, channelInterface, postInterface, videoInterface } from '../../../../Functions/interfaces'
import { getMostWatchedVideoUser, getPostFromUser, getVideosByUserId } from '../../../../Functions/streamFunctions/streamManagement'
import { followChannel, getChannelById } from '../../../../Functions/userFunctions/userManagement'
import { useUser } from '../../../../UserContext'
import ChakraMessage from '../../../messageShowers/ChakraUI'
import { useSocket } from '../../../../Functions/realtime/socketContext'
import { ShowPosts } from '../helpers/HelperComponents'
import { useSelector } from 'react-redux'


function Channel() {
    const [loading, setLoading] = useState<boolean>(true)
    const [section, setSection] = useState("Home");
    const [channelId, setChannelId] = useState<string>("")
    const [width, setWidth] = useState(0)
    const { user } = useUser();
    const { socket } = useSocket()
    const Navigate = useNavigate()

    const [channelDetails, setChannelDetails] = useState<channelInterface>({
        _id: "", channelName: "", Followers: [],
        profileImage: "", Shorts: [], Streams: [],
        subscription: {}, userId: "", userName: "",
        Videos: [], channelDescription: "", isFollowing: false
    })
    const screen = useSelector((state: any) => state?.sideBarRedux?.width)
    useEffect(() => {

        setWidth(screen)
    }, [screen])

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const userId = urlParams?.get('userId');
        if (!userId) { return Navigate('/') }
        setChannelId(userId)
        getChannelById(userId).then(async (Data: channelInterface) => {
            if (!Data) { return Navigate('/') }

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
                if (Data.Followers.includes(user?._id) && socket) {
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
            {width <= 640 && <><Main prop="0" /></>}
            {width > 640 && <Content> <Main prop="1" /></Content>}
        </>}
    </>)

    function Main({ prop }: { prop: String }) {
        console.log(prop);

        return (<>
            <div className="m-2">
                <h1 className='text-xl font-bold'>Welcome to {channelDetails.channelName}</h1>
                {!user && <ChakraMessage message={"you need to login to follow and message"} />}
                <Card className="cursor-default ml-8 mt-2 mr-5 dark:bg-gray-800" style={{ backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity))", borderRadius: "8%", minWidth: "370px" }} >
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
                                    <p onClick={followChannelOnClick}>{channelDetails.isFollowing ? "UNFOLLOW" : "FOLLOW"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <div className="mt-4 mx-5">
                    {["Home", "Videos", "Shorts", "Posts", "Live"].map((item) => (
                        <span key={item} className={`profileHeadings font-bold mx-3 text-xl ${section === item ? "text-blue-500" : ""}`} onClick={() => {
                            setSection(item);
                        }} >
                            <strong>{item}</strong>
                        </span>
                    ))}
                </div>
            </div>
            {section === "Home" && <ChannelHome />}
            {section === "Videos" && <Videos channelId={channelId} shorts={false} />}
            {section === "Shorts" && <Videos channelId={channelId} shorts={true} />}
            {section === "Posts" && <Posts channelId={channelId} />}
        </>)
    }

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
        return (
            <div className=''>
                <div className="m-5 ml-5">
                    <div id="default-carousel" className="relative" data-carousel="slide">
                        <div className="relative overflow-hidden rounded-lg" style={{ height: "500px" }}>
                            {carousel.map((item, idx) => {
                                return (<div key={idx} className={`${currentCarousel === idx ? "" : 'hidden'} duration-700 ease-in-out`} data-carousel-item>
                                    <img src={item?.imgUrl} style={{ height: "500px" }} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
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


    function Videos({ channelId, shorts }: { channelId: string, shorts: boolean }) {

        const [videos, setVideos] = useState<videoInterface[]>([])

        useEffect(() => {

            getChannelById(channelId).then(({ userId }) => getVideosByUserId(userId, shorts).then(({ data }) => setVideos(data)))

        }, [])

        return (<>
            <div className={`w-[86%] ml-12 mt-2 ${shorts && "flex"}`} >
                {videos.length > 0 && videos.map((details, index) => (
                    <>
                        {shorts ? <>
                            <div key={index} onClick={() => Navigate('/FullVideo?videoId=' + details._id)} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} className="ml-3 mt-3 hover:bg-gray-900 cursor-pointer rounded-lg shadow">
                                <p>
                                    <img className="rounded-t-lg w-full" src={details.Thumbnail} alt="" />
                                </p>
                                <div className="p-5">
                                    <p> <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{details.Title}</h5></p>
                                    <p className="text-yellow-700 font-bold">Premium</p>
                                </div>
                            </div>
                        </> : <>

                            <p key={index} onClick={() => Navigate("/FullVideo?videoId=" + details._id)} style={{ width: "100%" }} className="flex  mt-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row   hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <img style={{ width: "150px" }} className="object-cover w-full rounded-t-lg md:rounded-none md:rounded-s-lg" src={details.Thumbnail} alt={details.Title} />
                                <div className="flex flex-col m-4 leading-normal">
                                    <h5 className=" text-lg font-bold tracking-tight text-gray-900 dark:text-white">{details.Title}</h5>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">{details.Description}</p>
                                    <p>{details.channelName}</p>
                                </div>
                            </p>

                        </>}
                    </>))}
            </div>
        </>)
    }

    function Posts({ channelId }: { channelId: string }) {

        const [posts, setPosts] = useState<postInterface[]>([])

        useEffect(() => {
            getChannelById(channelId).then(({ userId }) => {
                getPostFromUser(userId).then((data) => {
                    setPosts(data);
                })
            })
        }, [])

        return (<>
            <div className="posts ml-8 mt-1">
                {posts.length !== 0 && <ShowPosts Data={posts} />}
            </div>
        </>)
    }

}

export default React.memo(Channel)


