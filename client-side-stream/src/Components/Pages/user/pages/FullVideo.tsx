import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../layout/NavBar'
import { useUser } from '../../../../UserContext';
import Comment from '../helpers/Comment';
import { addReportSubmit, getAllVideos, getVideosWithId } from '../../../../Functions/streamFunctions/streamManagement';
import { followChannel, isFollowing, isPremiumUser } from '../../../../Functions/userFunctions/userManagement';
import { commentInterface, videoInterface } from '../../../../Functions/interfaces';
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
    const [recomandedVideos, setRecomandedVideos] = useState<videoInterface[]>([]);

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

            getCommentsByLinkId(videoId, 'video').then((data) => setComments(data))

            getAllVideos(false, "").then((data: any) => setRecomandedVideos(data))

        } else {
            Navigate('/')
        }

    }, [user])



    useEffect(() => {

        const handleKeyPress = (event: KeyboardEvent) => {
            const { key } = event; const { current } = videoRef
            if (key) {

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

            // document.addEventListener('keydown', handleKeyPress);
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





    if (loading) {
        return (<><div className="lds-dual-ring"></div></>)
    }

    return (
        <>
            <NavBar />
            <div className="md:flex ">
                <div className="mr-8 md:mr-0">
                    <div className="flex mt-20  ml-2 h-auto">
                        <div className="mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={25} style={{ cursor: "pointer", paddingTop: "1%" }} onClick={() => window.location.href = '/'} >
                                <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </div>
                        <div className="" style={{ borderRadius: "0%" }}>
                            <video className='border-none ' ref={videoRef} width={900} style={{ marginLeft: "1%", marginTop: "1%", maxHeight: "500px", height: "auto", borderRadius: 0 }} poster={videoDetails.Thumbnail} controls muted autoPlay>
                                <source src={videoDetails.Link} style={{ borderRadius: 0 }} type="video/mp4" />
                            </video>
                        </div>


                    </div>
                    <div className="flex ml-10 w-auto">
                        <div className="flex w-[900px]">
                            <h2 className="text-2xl ml-3 mt-2">{videoDetails.Title}</h2>
                            <div className="mt-3 ml-auto cursor-pointer">
                                <MoreVertIcon onClick={() => setShowReportModal(true)} />
                                {showReportModal && <ReportDialog submitReport={submitReport} closeFunc={setShowReportModal} />}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap ml-8">
                        <div className="flex w-full mt-2 ml-3 bg-gray-800 h-15 sm:h-14">
                            <div className="flex items-center">
                                <img
                                    src={videoDetails.profileImage}
                                    className="rounded-full w-10 h-10 sm:w-8 sm:h-8 mt-2 ml-6"
                                    alt=""
                                />
                                <div className="ml-6 sm:ml-4 mt-2 sm:mt-1">
                                    <h2 className="text-xl sm:text-md">
                                        <span className='w-[70px]'>{videoDetails.channelName}</span>
                                    </h2>
                                    <h2 className="text-xs" style={{ width: "150px" }}>
                                        <span>{videoDetails.count} followers</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="flex ml-auto items-center mr-6">
                                {videoDetails.isFollowing ? (
                                    <div
                                        className="cursor-pointer flex"
                                        onClick={() => {
                                            setVideoDetails((prevDetails) => ({
                                                ...prevDetails,
                                                isFollowing: !prevDetails.isFollowing,
                                            }));
                                            followChannel(videoDetails.userId);
                                        }}
                                    >
                                        <p className="ml-2 mt-2">UNFOLLOW</p>
                                    </div>
                                ) : (
                                    <div
                                        className="cursor-pointer flex"
                                        onClick={() => {
                                            setVideoDetails((prevDetails) => ({
                                                ...prevDetails,
                                                isFollowing: !prevDetails.isFollowing,
                                            }));
                                            followChannel(videoDetails.userId);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            className="mb-2"
                                            viewBox="0 0 448 512"
                                        >
                                            <path
                                                fill="#ffffff"
                                                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                                            />
                                        </svg>
                                        <p className="ml-2 mt-2">FOLLOW</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div ref={commentSectionRef} className="commentSection mt-0   mb-8" style={{ height: "auto" }}>
                        <Comment indexKey='0' Section='video' LinkId={videoDetails._id} CommentsArray={Comments} />
                    </div>
                </div>

                <div className="ml-5 mt-20 w-auto">
                    <h2 className="text-xl font-bold text-center">Recommended</h2>
                    {recomandedVideos?.map((video, idx) => {
                        return (
                            <div
                                key={idx}
                                onClick={() => Navigate('/FullVideo?videoId=' + video?._id)}
                                className="flex mt-5 max-w-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer"
                            >
                                <img
                                    className="object-cover rounded-l-lg w-2/4"
                                    src={video.Thumbnail}
                                    alt={video.Title}
                                />
                                <div className="flex flex-col justify-between p-4 w-2/4">
                                    <h5 className="font-semibold text-white">
                                        {video.Title}
                                    </h5>
                                    <p className="text-sm text-gray-400 mt-2">
                                        185k views <span className="ml-2">18 hours ago</span>
                                    </p>
                                </div>
                            </div>

                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default React.memo(FullVideo)
