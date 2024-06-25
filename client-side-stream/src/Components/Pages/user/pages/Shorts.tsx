import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../layout/NavBar';
import SideBar from '../layout/SideBar';
import Content from '../helpers/Content';
import { addReportSubmit, getAllVideos, videoLike } from '../../../../Functions/streamFunctions/streamManagement';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportDialog from '../../../messageShowers/ReportDialog';
import { VideoData, commentInterface, videoInterface } from '../../../../Functions/interfaces';
import { getCommentsByLinkId, uploadCommentFunc } from '../../../../Functions/streamFunctions/commentManagement';
import { toast } from 'react-toastify';
import { useUser } from '../../../../UserContext';
import { getChannelByUserId } from '../../../../Functions/userFunctions/userManagement';


const Shorts = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [shorts, setShorts] = useState<VideoData[]>([
    { Link: '', Thumbnail: '', clicked: false, likesArray: [], _id: "" },
  ]);
  const [linkAndLinkId, setLinkAndLinkId] = useState({ Link: "", LinkId: "" })
  const [showReportModal, setShowReportModal] = useState(false)
  const [comment, setComments] = useState<commentInterface[][]>([])
  const [textComment, setTextComment] = useState("")
  const { user } = useUser();
  const commentsRef = useRef<any>(null)
  const videoContainerRef = useRef<any>(null);

  const handleKeyDown = (e: any) => {
    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
      const currentScrollPosition = videoContainerRef.current.scrollTop;
      const containerHeight = videoContainerRef.current.clientHeight;

      if (e.code === 'ArrowDown') {
        videoContainerRef.current.scrollTo({
          top: currentScrollPosition + containerHeight,
          behavior: 'smooth'
        });
      } else if (e.code === 'ArrowUp') {
        videoContainerRef.current.scrollTo({
          top: currentScrollPosition - containerHeight,
          behavior: 'smooth'
        });
      }
    }
  };


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos(true, "");

        const comments = await Promise.all(response.map(async (item: videoInterface) => {
          const data: any = await getCommentsByLinkId(item._id, "shorts")
          const channData = await Promise.all(data.map(async (item: any) => {
            item.userName = (await getChannelByUserId(item.userId)).channelName;
            return item
          }));

          return channData
        }))
        console.log(comments);

        setComments(comments)
        setShorts(response);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const toggleComment = (index: number) => {
    const newData = [...shorts];
    newData[index] = { ...newData[index], clicked: !newData[index].clicked };
    setShorts(newData);
  };

  const unToggleComment = () => {
    if (shorts.find(item => item.clicked)) {
      setShorts((prevShorts) =>
        prevShorts.map((short) => ({
          ...short,
          clicked: false
        }))
      );
    }
  }

  const submitReport = (text: string) => {
    setShowReportModal(false)
    if (user) {
      const report = {
        _id: "",
        channelName: user.channelName ?? "",
        userId: user._id ?? "",
        Link: linkAndLinkId.Link,
        LinkId: linkAndLinkId.LinkId,
        Section: "shorts",
        Reason: text,
        Responded: false,
        Blocked: false
      }
      addReportSubmit(report).then(() => toast.success("successfully reported to the shorts"))
    } else {
      toast.error("please login to report the video")
    }
  }

  const likeShorts = (videoId: string) => {
    if (user && user?._id) {
      videoLike(videoId, user._id).then(() => {
        const data = shorts.map((item) => {
          if (item._id === videoId) {

            const isLiked = item.likesArray.includes(user._id + "");
            const updatedLikesArray = isLiked

              ? item.likesArray.filter(id => id !== user?._id)
              : [...item.likesArray, user._id + ""];

            return { ...item, likesArray: updatedLikesArray };
          }
          return item;
        }).filter(Boolean);

        setShorts(data);
      });

    }
  }

  return (
    <>
      <NavBar />
      <SideBar />
      <Content>
        <div onClick={unToggleComment}
          ref={videoContainerRef}
          tabIndex={0}
          className="flex flex-col h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth mt-2 mb-2"
          onKeyDown={handleKeyDown}
        >

          {shorts.map((data, index) => (
            <div key={index} className="section flex mx-auto mt-4 mb-8">
              <div className="flex items-center justify-center h-screen snap-start bg-black">
                <div
                  style={{
                    height: '520px',
                    minWidth: '350px',
                    position: 'relative',
                    backgroundColor: 'black',
                    borderRadius: '2%',
                  }} >

                  <video
                    poster={data.Thumbnail}
                    controls
                    autoPlay
                    muted
                    className="absolute"
                    style={{ top: '50%', left: '50%', marginBottom: "5%", transform: 'translate(-50%, -50%)' }}
                  >
                    <source src={data.Link} />
                  </video>

                </div>
              </div>
              <div className="">

                {data.clicked ? (
                  <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 h-full mb-[10px] w-[350px] ml-2" style={{ borderTopRightRadius: '2%' }}>
                    <p className="text-xl m-3">Comments</p> <br />

                    <div className="h-[65%]">
                      {comment[index].length < 1 ? <div className='flex'>
                        <div className="text-center m-auto">
                          No comment's yet
                        </div>
                      </div> : <>
                        <div className="ml-3 overflow-y-auto max-h-full list-none" ref={commentsRef}>
                          {comment[index].map((comm, idx) => {
                            return (
                              <li className="py-2 list-none" key={idx}>
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className="flex-shrink-0">
                                    <img className="w-9 h-9 rounded-full" src={comm?.profileImage} alt="Profile" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                                      {comm.userName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                      {comm.Comment}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </div>

                      </>}
                    </div>
                    <div className="flex">
                      <input type="text" value={textComment} onChange={(e) => setTextComment(e.target.value)} placeholder="Your comments here...." name="Email" id="floating_email" className="ml-3 w-[95%] bottom-0 block py-1 px-0 text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
                      <button type="button" onClick={() => {
                        if (commentsRef.current) {
                          commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
                        }
                        const newCommentData = {
                          userName: user?.userName || "Anonymous",
                          Comment: textComment,
                          LinkId: data._id,
                          profileImage: user?.profileImage || "default_image_url",
                          Section: "shorts",
                          userId: user?._id || "unknown_user_id",
                          likedUsers: [],
                          isUserLiked: false
                        };

                        uploadCommentFunc(newCommentData);
                        setTextComment("");

                        setComments((prevComments: any) => {
                          const updatedComments = prevComments.map((commentList: any, i: number) => {
                            if (i === index) {
                              return [...commentList, newCommentData];
                            }
                            return commentList;
                          });
                          return updatedComments;
                        });
                      }
                      } className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                          <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ml-2 mt-48" style={{ color: '#0a0a0a' }}>
                    <div className="flex-col flex" onClick={() => likeShorts(data._id)} >
                      <ThumbUpIcon className="text-white" />
                      <span className="font-mono font-light not-italic text-white/65" style={{ marginLeft: data?.likesArray?.length?.toString()?.length < 2 ? "7px" : "0px" }}>{data.likesArray.length ?? 0}</span>
                    </div>
                    <div className="flex mt-3 flex-col" onClick={() => toggleComment(index)} >
                      <InsertCommentIcon className="text-white" />
                      <span className="font-mono font-light not-italic text-white/65" style={{ marginLeft: (comment[index]?.length) < 2 ? "9px" : "4px" }} >{comment[index]?.length || 0}</span>
                    </div>
                    <div className="flex mt-3 ">
                      <SendIcon className="text-white transform scale-[1]" />
                    </div>
                    <div className="flex mt-3  ">
                      {showReportModal && <ReportDialog submitReport={submitReport} closeFunc={setShowReportModal} />}
                      <MoreVertIcon onClick={() => {
                        if (user) {
                          setLinkAndLinkId({
                            Link: data.Link,
                            LinkId: data._id
                          })
                          setShowReportModal(true)
                        }
                      }} className="w-14 text-white transform scale-[1]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Content>
    </>
  );
};

export default Shorts;
