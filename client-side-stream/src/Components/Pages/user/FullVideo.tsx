import React, { useEffect, useRef, useState } from 'react'
import NavBar from './NavBar'
import { useUser } from '../../../UserContext';
import Comment from './helpers/Comment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getVideosWithId } from '../../../Functions/streamFunctions/streamManagement';
import { followChannel, isFollowing } from '../../../Functions/userFunctions/userManagement';
import { commentInterface } from '../../../Functions/interfaces';
import { getCommentsByLinkId } from '../../../Functions/streamFunctions/commentManagement';

function FullVideo() {
    const { user } = useUser()
    const Navigate = useNavigate()
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [Comments, setComments] = useState<commentInterface[] | []>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [videoDetails, setVideoDetails] = useState({
        _id: "", Link: "", channelName: "",
        Description: "", dislikes: "0", likes: "0",
        shorts: true, count: "", isFollowing: false,
        Thumbnail: "", profileImage: "",
        Title: "", userId: "", Time: "",
        likesArray: []
    })
    const [searchParams] = useSearchParams();
    const videoId = searchParams.get('videoId');

    useEffect(() => {

        if (videoId) {
            getVideosWithId(videoId).then((Data) => {
                isFollowing(user?._id || "", Data.userId).then((res) => {
                    setVideoDetails({
                        ...Data, profileImage: res.profileLink,
                        isFollowing: res.isFollowing
                    })
                    setLoading(false)
                })
            })

            getCommentsByLinkId(videoId, 'video').then(({ data }) => {
                setComments(data)
            })
        } else {
            Navigate('/')
        }

    }, [user])



    const relatedVideos = [{
        Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)",
        videolink: "/videos/The Kid LAROI, Justin Bieber - STAY (Official Video).mp4",
        Thumbnail: "/videos/stayThumbnail.jpeg",
    }, {
        Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)",
        videolink: "/videos/The Kid LAROI, Justin Bieber - STAY (Official Video).mp4",
        Thumbnail: "/videos/stayThumbnail.jpeg",
    }, {
        Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)",
        videolink: "/videos/The Kid LAROI, Justin Bieber - STAY (Official Video).mp4",
        Thumbnail: "/videos/stayThumbnail.jpeg",
    }, {
        Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)",
        videolink: "/videos/The Kid LAROI, Justin Bieber - STAY (Official Video).mp4",
        Thumbnail: "/videos/stayThumbnail.jpeg",
    },]

    const superChat = [{
        channelName: "Hey gamer",
        profileImage: "/videos/download.jpeg",
        text: "I liked this ❤️💖😍💘🥰💕💓💞",
    }].concat(Array(9).fill({
        channelName: "Hey gamer",
        profileImage: "/videos/download.jpeg",
        text: "I liked this ❤️💖😍💘🥰💕💓💞",
    }))


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const { key } = event
            const { current } = videoRef
            if (key.toLowerCase() === 'f' && current) {
                if (isFullScreen) {
                    document.exitFullscreen();
                    setIsFullScreen(false);
                } else {
                    setIsFullScreen(true);
                    current.requestFullscreen()
                }
            } else if (key.toLocaleLowerCase() === 'm' && current) {
                current.muted = !current.muted;
            } else if (key === ' ' && current) {
                event.preventDefault()
                current.paused ? current.play() : current.pause();
            }
        };
        // document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isFullScreen]);







    const RecomandedVideos = new Array(5).fill({
        userName: "Gamer 123",
        Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)"
    })

    if (loading) {
        return (<><div className="lds-dual-ring"></div></>)
    }

    return (
        <>
            <NavBar />
            <div style={{ marginTop: "65px" }} className="">
                <div className="marginFromLeft ml-5 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={25} style={{ cursor: "pointer", position: "absolute", paddingTop: "1%" }} onClick={() => window.location.href = '/'} >
                        <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                    <div className="flex" style={{ position: "relative", marginLeft: "2%" }}>
                        <div className="videoDiv" style={{ borderRadius: "0%" }}>
                            <video className='border-none ' ref={videoRef} width={900} style={{ marginLeft: "1%", marginTop: "1%", maxHeight: "500px", height: "auto", borderRadius: 0 }} poster={videoDetails.Thumbnail} controls autoPlay>
                                <source src={videoDetails.Link} style={{ borderRadius: 0 }} type="video/mp4" />
                            </video>
                        </div>
                        <div className="superChat ml-7 mr-1 mt-2 " style={{ width: "380px", borderRadius: "7%", backgroundColor: "#2e2e2e" }}>
                            <div className="heading mt-3" style={{ borderRadius: "10px" }}>
                                <h2 className="text-2xl" style={{ textAlign: "center" }}>SUPER CHAT</h2>
                                <hr className='mt-2' />
                                <div className='mt-5' style={{ overflowY: "auto", maxHeight: "380px" }}>
                                    {superChat.map((item, index) => (
                                        <div key={index} className="commentsChat flex mt-1" style={{ backgroundColor: "#424242" }}>
                                            <img src={item.profileImage} className='ml-4 mt-1' style={{ borderRadius: "100%", width: "40px", height: "40px" }} alt="" />
                                            <div className="block ml-2 mt-1">
                                                <p className='text-sm'>{item.channelName}</p>
                                                <p className='text-xs ml-1'>{item.text}</p>
                                            </div>
                                            <div className="ml-auto me-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "50%" }} width={20} viewBox="0 0 512 512">
                                                    <path fill="#ffffff" d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex ml-5" style={{ backgroundColor: "transparent", width: "65%" }}>
                        <h2 className="text-2xl ml-3 mt-2">{videoDetails.Title}</h2>
                        <div className="flex ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "3%" }} width={40} viewBox="0 0 512 512">
                                <path fill="#ffffff" d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width={40} style={{ marginLeft: "15%", marginTop: "4%", transform: "rotate(50 50 50)" }} viewBox="0 0 512 512">
                                <path fill="#ffffff" d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16H286.5c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8H384c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H32z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width={40} style={{ marginLeft: "15%" }} viewBox="0 0 512 512">
                                <path fill='#ffffff' d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex ml-5">
                        <div className="flex subscribeDiv mt-2 ml-3 " style={{ width: "68%", height: "60px", backgroundColor: "#2e2e2e" }}>
                            <div className='flex'>
                                <img src={videoDetails.profileImage} style={{ borderRadius: "100%", width: "40px", height: "40px", marginTop: "5%", marginLeft: "6%" }} alt="" />
                                <h2 className="text-xl" style={{ width: "150px", height: "30px", marginLeft: "8%", marginTop: "4%" }}><span>{videoDetails.channelName}</span><br />
                                    <h2 className="text-xs" style={{ width: "150px" }}><span>{videoDetails.count} followers</span></h2></h2>
                            </div>
                            <div className="flex ml-auto">

                                {videoDetails.isFollowing ? <>
                                    <div className='cursor-pointer ml-auto mr-6 mt-3 flex' onClick={() => {
                                        setVideoDetails((prevDetails) => ({
                                            ...prevDetails,
                                            isFollowing: !prevDetails.isFollowing,
                                        }));
                                        followChannel(videoDetails.userId)
                                    }} style={{ float: "right" }}>
                                        <p className='ml-2 mt-2'>UNFOLLOW</p>   </div>
                                </> : <>
                                    <div className='cursor-pointer ml-auto mr-6 mt-3 flex' onClick={() => {
                                        setVideoDetails((prevDetails) => ({
                                            ...prevDetails,
                                            isFollowing: !prevDetails.isFollowing,
                                        }));
                                        followChannel(videoDetails.userId)
                                    }
                                    } style={{ float: "right" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} className='mb-2' viewBox="0 0 448 512">
                                            <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                        </svg>
                                        <p className='ml-2 mt-2'>FOLLOW</p>
                                    </div>
                                </>
                                }
                            </div>


                        </div>
                        <div className='otherVideosSection m-auto' style={{ width: "27%" }}>
                            <h2 className="text-2xl" style={{ textAlign: "center" }} >Recomanded</h2>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="commentSection mt-0   mb-8" style={{ width: "67%", height: "auto" }}>
                            <Comment indexKey='0' Section='video' LinkId={videoDetails._id} CommentsArray={Comments} />
                        </div>
                        <div className="justify-center">
                            {RecomandedVideos.length !== 0 ?
                                RecomandedVideos.map((video) => {
                                    return (
                                        <a href="#" style={{ width: "80%", backgroundColor: "#141414" }} className="recomandedBackgroundParentDiv flex mt-2 ml-auto mr-3 flex-col rounded-lg shadow md:flex-row md:max-w-xl ">
                                            <img className="object-cover rounded-t-lg" style={{ width: "150px" }} src="https://lh3.googleusercontent.com/a/ACg8ocL2nEt-sPQXcxr1GD76jsTKuIqccxtnrdZ0IGBnCC9I-FE35w=s96-c" alt="" />
                                            <div className="flex flex-col m-2 leading-normal">
                                                <h5 className=" tracking-tight text-gray-900 dark:text-white">{video.Title}</h5>
                                                <p className='text-sm'>{video.userName}</p>
                                                <p className='text-sm'>185k views <span className='ml-2'> 18 hours ago</span></p>
                                            </div>
                                        </a>
                                    )
                                })

                                : <></>}
                        </div>
                    </div>

                    {/* comment finished */}
                </div>
            </div>
        </>
    )
}

export default React.memo(FullVideo)


