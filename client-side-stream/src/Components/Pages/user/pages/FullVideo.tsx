import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../layout/NavBar'
import { useUser } from '../../../../UserContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comment from '../helpers/Comment';
import { addReportSubmit, getVideosWithId } from '../../../../Functions/streamFunctions/streamManagement';
import { followChannel, isFollowing, isPremiumUser } from '../../../../Functions/userFunctions/userManagement';
import { commentInterface } from '../../../../Functions/interfaces';
import { getCommentsByLinkId } from '../../../../Functions/streamFunctions/commentManagement';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportDialog from '../../../messageShowers/ReportDialog';
import { toast } from 'react-toastify';

function FullVideo() {

    const { user } = useUser()
    const Navigate = useNavigate()
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [Comments, setComments] = useState<commentInterface[] | []>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showReportModal, setShowReportModal] = useState(false)

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

    const commentSectionRef = useRef<any>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {

        if (videoId) {
            getVideosWithId(videoId).then((Data) => {

                if (Data.Premium) {
                    if (user && user?._id) {
                        isPremiumUser(user?._id).then(({ status }) => { if (!status) { Navigate('/') } })
                    } else {
                        Navigate('/')
                    }
                }

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
            const { key } = event; const { current } = videoRef

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

        const handleFocus = () => setIsActive(true);
        const handleBlur = () => setIsActive(false);

        const element = commentSectionRef.current;
        if (element) {
            element.addEventListener('focusin', handleFocus);
            element.addEventListener('focusout', handleBlur);
        }

        if (!isActive) {

            document.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            if (element) {
                element.removeEventListener('focusin', handleFocus);
                element.removeEventListener('focusout', handleBlur);
              }
        };

    }, [isFullScreen]);


    const submitReport = (text: string) => {
        if (user && user?.channelName && user?._id) {
            addReportSubmit({
                _id: "",
                channelName: user?.channelName,
                userId: user?._id,
                LinkId: videoDetails._id,
                Link: videoDetails.Thumbnail,
                Section: "video",
                Reason: text, Responded: false,
                Blocked: false
            }).then(({ status }) => {
                status ? toast.success("successfully reported the video") : toast.success("error occured reporting the video")
            })
        } else {
            toast.error("Please login to report")
        }
    }




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
            <div style={{ marginTop: "80px" }} className="">
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
                       
                        <div className="superChat ml-7 mr-1 mt-2 rounded-md " style={{ width: "380px", backgroundColor: "#2e2e2e" }}>
                            <div className="heading mt-3" style={{ borderRadius: "10px" }}>
                                <h2 className="text-2xl font-bold font-sans not-italic" style={{ textAlign: "center" }}>SUPER CHAT</h2>
                                {/* <hr className='mt-2' /> */}
                                <div className='mt-5' style={{ overflowY: "auto", maxHeight: "380px" }}>
                                    {superChat.map((item, index) => (
                                        <div key={index} className="comment-card text-red not-italic  font-semibold rounded-md mt-2 flex bg-black/10 pt-2 pl-4" >
                                            <img src={item.profileImage} className='ml-4 mt-1' style={{ borderRadius: "100%", width: "40px", height: "40px" }} alt="" />
                                            <div className="block ml-2 mt-1">
                                                <p className='text-sm '>{item.channelName}</p>
                                                <p className='text-xs ml-1 text-white-900/40'>{item.text}</p>
                                            </div>
                                            {/* <div className="ml-auto me-4">
                                                <FavoriteIcon width={10} />
                                            </div> */}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="flex ml-5" style={{ backgroundColor: "transparent", width: "65%" }}>
                        <h2 className="text-2xl ml-3 mt-2">{videoDetails.Title}</h2>
                        <div className="flex ml-auto">
                            <div className="ml-3">
                                <MoreVertIcon onClick={() => setShowReportModal(true)} />
                                {showReportModal && <ReportDialog submitReport={submitReport} closeFunc={setShowReportModal} />}
                            </div>
                            {/* Like DisLike */}
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
                        <div ref={commentSectionRef} className="commentSection mt-0   mb-8" style={{ width: "67%", height: "auto" }}>
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


