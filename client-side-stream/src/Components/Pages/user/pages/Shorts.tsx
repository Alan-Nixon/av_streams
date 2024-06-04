import React, { useEffect, useState } from 'react';
import NavBar from '../layout/NavBar';
import SideBar from '../layout/SideBar';
import Content from '../helpers/Content';
import { getAllVideos } from '../../../../Functions/streamFunctions/streamManagement';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportDialog from '../../../messageShowers/ReportDialog';
// Interface for video data
interface VideoData {
  Link: string;
  Thumbnail: string;
  clicked: boolean;
  Title?: string;
  videolink?: string;
  channelDetails?: {
    channelLogo: string;
    channelName: string;
    count: string;
    isFollowing: boolean;
  };
}

const Shorts = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [shorts, setShorts] = useState<VideoData[]>([
    { Link: '', Thumbnail: '', clicked: false },
  ]);
  const [showReportModal, setShowReportModal] = useState(false)
  const [comment, setComments] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos(true);
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
    alert(text)
    setShowReportModal(false)
  }

  return (
    <>
      <NavBar />
      <SideBar />
      <Content>
        {loading ? (
          <div className="lds-dual-ring" />
        ) : (
          <div className="w-full" onClick={() => unToggleComment()}>
            <div className="flex">
              <div className="m-auto containerYT">
                {shorts.map((data, index) => (
                  <div key={index} className="section flex">
                    <div
                      style={{
                        height: '520px',
                        marginTop: '38px',
                        minWidth: '350px',
                        position: 'relative',
                        backgroundColor: 'black',
                        borderRadius: '2%',
                      }} >
                      <video
                        poster={data.Thumbnail}
                        // controls
                        muted
                        autoPlay
                        className="absolute"
                        style={{ top: '50%', height: '520px', left: '50%', transform: 'translate(-50%, -50%)' }}
                      >
                        <source src={data.Link} />
                      </video>
                    </div>
                    {data.clicked ? (
                      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 h-[520px] mt-[38px] w-[350px] ml-2" style={{ borderTopRightRadius: '2%' }}>
                        <p className="text-xl m-3">Comments</p> <br />
                        {comment.length ? <>
                        
                        </> : <>

                        </>}
                        <div className="flex">
                          <input type="text" placeholder="Your comments here...." name="Email" id="floating_email" className="ml-3 w-[95%] bottom-0 block py-1 px-0 text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />
                          <button type="button" className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-2" style={{ marginTop: '45%', color: '#0a0a0a' }}>
                        <div className="flex-col flex">
                          <ThumbUpIcon className="text-white" />
                          <span className="font-mono font-light not-italic text-white/65">15k</span>
                        </div>
                        <div className="flex mt-3 flex-col" onClick={() => toggleComment(index)} >
                          <InsertCommentIcon className="text-white" />
                          <span className="font-mono font-light not-italic text-white/65">108</span>
                        </div>
                        <div className="flex mt-3 ">
                          <SendIcon className="text-white transform scale-[1]" />
                        </div>
                        <div className="flex mt-3  ">
                          {showReportModal && <ReportDialog submitReport={submitReport} closeFunc={setShowReportModal} />}
                          <MoreVertIcon onClick={() => setShowReportModal(true)} className="w-14 text-white transform scale-[1]" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Content>
    </>
  );
};

export default Shorts;
