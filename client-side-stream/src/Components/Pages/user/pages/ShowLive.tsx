import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import NavBar from '../layout/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import Comment from '../helpers/Comment';
import { commentInterface, videoInterface } from '../../../../Functions/interfaces';
import { getAllVideos } from '../../../../Functions/streamFunctions/streamManagement';
import { useZego } from '../../../../LiveZegoProvider';
import { useUser } from '../../../../UserContext';


const socket = io(process.env.REACT_APP_STREAM_MANAGEMENT_URL ?? "");

const Viewer: React.FC = () => {
    const screenRef = useRef<HTMLVideoElement>(null);
    const cameraRef = useRef<HTMLVideoElement>(null);
    const [selectEmoji, setSelectEmoji] = useState<boolean>(false)
    const [message, setMessage] = useState("")
    const [recomandedVideos, setRecomandedVideos] = useState<videoInterface[]>([])

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [comments, setComments] = useState<commentInterface[]>([])
    const { liveId } = useParams()
    const Navigate = useNavigate()


    const { zg } = useZego()
    const { user } = useUser()

    useEffect(() => {
        const getLive = async () => {
            if (zg && cameraRef.current && user) {

                const roomID = "uuidv4"
                const userID = "3780";
                const userName = user.userName
                const token = "04AAAAAGZwcAsAEG4wdmxtcWY0d24wbGhhbDUAoNuxn34woYFGHXUIw9Nw43g3J8uniCWeUKq17NN6kBZo8AbOWXZKiZttOsUPoC97m+cX2aASNRxwccs77ZJueXgfo9uoDbyEeqbWyUZhYWQGNpRcVACKS3OVCGt+YVNhpxVLfIdgwREw5KCn47Ys0kxin2jYAozzWDKE/hsE6ny4W3iW6xTCpzSQlwamEfItPgKJBeu+pe68YFMlt2VBIpU="
                const result = await zg.loginRoom(roomID, token, { userID }, { userUpdate: true });

                const streamID = "2520"
                const remoteStream = await zg.startPlayingStream(streamID);
                console.log(remoteStream, "this is the stream");
                if (remoteStream) {
                    console.log(remoteStream);
                    
                    alert(remoteStream)
                    cameraRef.current.srcObject = remoteStream
                }
            }
        }
        getLive()
    }, [zg, user])

    useEffect(() => {


        getAllVideos(false, "").then((data) => {
            console.log(data);
            setRecomandedVideos(data)
        })

        return () => {
        };
    }, []);

    const superChat = [{
        channelName: "Hey gamer",
        profileImage: "/videos/download.jpeg",
        text: "I liked this ❤️💖😍💘🥰💕💓💞",
    }].concat(Array(9).fill({
        channelName: "Hey gamer",
        profileImage: "/videos/download.jpeg",
        text: "I liked this ❤️💖😍💘🥰💕💓💞",
    }));

    const sendMessage = () => {

    }

    return (
        <>
            <NavBar />
            <div className="mt-14 ml-16 w-[97%]">

                <div className="flex">
                    <div className="w-[67%]">

                        <div style={{ margin: '1%', marginLeft: "12%", marginBottom: "10%", maxHeight: "650px", display: 'flex' }}>
                            <div style={{ display: 'flex', marginTop: '13%', position: 'relative', border: '1px solid black', transform: 'scale(1.5)' }}>
                                <div style={{ width: '640px', height: '360px' }}>
                                    <video ref={screenRef} autoPlay muted width="640" height="360" style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div style={{ width: '160px', height: '90px', position: 'absolute', bottom: 0, right: 0 }}>
                                    <video ref={cameraRef} autoPlay width="160" height="90" style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[30%] mt-2">

                        <div className="superChat ml-7 mr-1 mt-2 rounded-md " style={{ width: "380px", backgroundColor: "#2e2e2e" }}>
                            <div className="heading mt-3" style={{ borderRadius: "10px" }}>
                                <h2 className="text-2xl font-bold font-sans not-italic" style={{ textAlign: "center" }}>SUPER CHAT</h2>
                                {/* <hr className='mt-2' /> */}
                                <div className='mt-5' style={{ overflowY: "auto", maxHeight: "420px" }}>
                                    {superChat.map((item, index) => (
                                        <div key={index} className="comment-card text-red not-italic  font-semibold rounded-md mt-2 flex bg-black/10 pt-2 pl-4" >
                                            <img src={item.profileImage} className='ml-4 mt-1' style={{ borderRadius: "100%", width: "40px", height: "40px" }} alt="" />
                                            <div className="block ml-2 mt-1">
                                                <p className='text-sm '>{item.channelName}</p>
                                                <p className='text-xs ml-1 text-white-900/40'>{item.text}</p>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 mt-auto">
                                    <div className="flex">
                                        <button type="button" onClick={() => setSelectEmoji(!selectEmoji)} className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
                                            </svg>
                                        </button>
                                        <input onChange={(e) => setMessage(e.target.value)} value={message} className="flex items-center h-10 w-full rounded px-3 text-sm bg-transparent" type="text" placeholder="Type your message…" />
                                        <button type="button" onClick={() => sendMessage()} className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>



            <div className="flex">
                <div className="commentSection mt-0   mb-8" style={{ width: "70%", height: "auto" }}>
                    {liveId && <Comment CommentsArray={comments} Section='videos' indexKey='0' LinkId={liveId} />}
                </div>
                <div className="justify-center">
                    {recomandedVideos?.length !== 0 ?
                        recomandedVideos?.map((video, idx) => {
                            return (
                                <p key={idx} onClick={() => Navigate('/FullVideo?videoId=' + video?._id)} style={{ width: "80%", backgroundColor: "#141414" }} className="recomandedBackgroundParentDiv flex mt-2 ml-auto mr-3 flex-col rounded-lg shadow md:flex-row md:max-w-xl ">
                                    <img className="object-cover rounded-t-lg" style={{ width: "150px" }} src={video.Thumbnail} alt="" />
                                    <div className="flex flex-col m-2 leading-normal">
                                        <h5 className=" tracking-tight text-gray-900 dark:text-white">{video.Title}</h5>
                                        <p className='text-sm'>185k views <span className='ml-2'> 18 hours ago</span></p>
                                    </div>
                                </p>
                            )
                        })

                        : <></>}
                </div>
            </div>

        </>
    );
};

export default Viewer;


