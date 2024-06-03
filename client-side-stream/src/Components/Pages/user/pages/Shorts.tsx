import React, { useEffect, useState } from 'react';
import NavBar from '../layout/NavBar';
import SideBar from '../layout/SideBar';
import Content from '../helpers/Content';
import { getAllVideos } from '../../../../Functions/streamFunctions/streamManagement';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

  return (
    <>
      <NavBar />
      <SideBar />
      <Content>
        {loading ? (
          <div className="lds-dual-ring" />
        ) : (
          <div className="w-full">
            <div className="flex">
              <div className="m-auto">
                {shorts.map((data, index) => (
                  <div key={index} className="flex">
                    <div
                      style={{
                        height: '540px',
                        marginTop: '8%',
                        width: '350px',
                        position: 'relative',
                        backgroundColor: 'black',
                        borderRadius: '2%',
                      }}
                    >
                      <video
                        poster={data.Thumbnail}
                        controls
                        muted
                        autoPlay
                        className="absolute"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      >
                        
                        <source src={data.Link} />
                      </video>
                    </div>
                    {data.clicked ? (
                      <div
                        className="bg-gray-500"
                        style={{ marginTop: '8%', borderTopRightRadius: '2%' }}
                      >
                        <p className="text-2xl">Comments</p>
                      </div>
                    ) : (
                      <div className="ml-2" style={{ marginTop: '45%', color: '#0a0a0a' }}>
                        <div className="flex-col flex">
                          <ThumbUpIcon className="text-white" />
                          <span className="font-mono font-light not-italic text-white/65">15k</span>
                        </div>
                        <div className="flex mt-3 flex-col">
                          <InsertCommentIcon className="text-white" />
                          <span className="font-mono font-light not-italic text-white/65">108</span>
                        </div>
                        <div className="flex mt-3 ">
                          <SendIcon className="text-white transform scale-[1]" />
                        </div>
                        <div className="flex mt-16  ">
                          <MoreVertIcon className="w-14 text-white transform scale-[1]" />
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
