import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { liveDetails } from '../../../../Functions/interfaces';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../layout/NavBar';

const socket = io(process.env.REACT_APP_STREAM_MANAGEMENT_URL ?? "");

const Streaming = () => {
    const videoRef = useRef<any>(null);
    const screenRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const screenCanvasRef = useRef<any>(null);
    const streamingRef = useRef<any>(false);
    const [startedLive, setStartedLive] = useState(false);
    const [error, setError] = useState("")
    const [liveDetails, setDetails] = useState<liveDetails>({
        Title: "", Description: "", Thumbnail: null
    })


    useEffect(() => {
        if (startedLive) {
            const startStreaming = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

                    if (videoRef.current && screenRef.current) {
                        // Set video sources and play
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();

                        screenRef.current.srcObject = screenStream;
                        screenRef.current.play();

                        if (canvasRef.current && screenCanvasRef.current) {
                            const context = canvasRef.current.getContext('2d');
                            const screenContext = screenCanvasRef.current.getContext('2d');

                            const captureFrame = () => {
                                if (!streamingRef.current) return;

                                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                                screenContext.drawImage(screenRef.current, 0, 0, screenCanvasRef.current.width, screenCanvasRef.current.height);
                                saveVideo(stream, screenStream)

                                if (context && screenContext) {
                                    socket.emit('stream', {
                                        screen: screenCanvasRef.current.toDataURL('image/webp'),
                                        camera: canvasRef.current.toDataURL('image/webp'),
                                        uuid: "2520"
                                    });

                                }

                                requestAnimationFrame(captureFrame);
                            };

                            streamingRef.current = true;
                            captureFrame();
                        }
                    }
                } catch (error) {
                    console.error('Error accessing media devices:', error);
                }
            };

            startStreaming();

            return () => {
                streamingRef.current = false;
                if (videoRef.current) {
                    videoRef.current.srcObject.getTracks().forEach((track: any) => track.stop());
                }
                if (screenRef.current) {
                    screenRef.current.srcObject.getTracks().forEach((track: any) => track.stop());
                }
            };
        }
    }, [startedLive]);

    const saveVideo = (streamCamera: any, screenStream: any) => {
        const mediaRecorderCamera = new MediaRecorder(streamCamera);
        mediaRecorderCamera.ondataavailable = (event) => {
            socket.emit('saveCamera', event.data)
        }

        const mediaRecorderScreen = new MediaRecorder(screenStream);
        mediaRecorderScreen.ondataavailable = (event) => {
            socket.emit('saveScreen', event.data)
        }
        mediaRecorderCamera.start(1000)
        mediaRecorderScreen.start(1000)
    }

    const startLiveFunc = () => {
        if (liveDetails.Title?.trim() !== "") {
            if (liveDetails.Description?.trim() !== "") {
                if (liveDetails.Thumbnail) {
                    setStartedLive(true);
                    const uuid = "2520"
                    socket.emit("joinRoom", uuid);
                    socket.emit("startLive", { ...liveDetails, Uuid: uuid })
                    setTimeout(() => setDetails({ Description: "", Thumbnail: null, Title: "" }), 0)
                } else {
                    setError("Please select a thumbnail image")
                }
            } else {
                setError("Enter a valid description for the live stream")
            }
        } else {
            setError("Error title for the live stream")
        }
    }


    return (<>
        <NavBar />
        <div className='mt-[14%]'>
            <div className="block">
                <div style={{ marginLeft: '13%', marginTop: '8%', display: 'flex' }}>
                    <div style={{ position: 'relative', marginLeft: "6%", border: '1px solid black', transform: 'scale(1.5)' }}>
                        <video ref={screenRef} style={{ width: '100%', height: '400px' }} autoPlay playsInline />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '160px', height: '90px' }}>
                            <video ref={videoRef} style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} autoPlay playsInline />
                        </div>
                    </div>
                </div>
            </div>

            <div className="block mt-14 ml-16 "><br /><br /><br />
                <canvas ref={screenCanvasRef} width="640" height="480" style={{ display: 'none' }} />
                <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
                <button type="button" onClick={() => setStartedLive(false)} className="text-white bg-gray-800 hover:bg-gray-900  rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Stop Live</button>
            </div><br />



            <form className="max-w-4xl ml-16">
                <h2 className='text-align font-bold' >Details For Streams</h2><br />
                {error && <p className='error mb-2'>{error}</p>}
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" onChange={(e) => {
                        setDetails((rest) => ({ ...rest, Title: e.target.value }))
                        setError("")
                    }
                    } name="Title" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Title for the live</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" onChange={(e) => {
                        setDetails((rest) => ({ ...rest, Description: e.target.value }))
                        setError("")
                    }
                    } name="Description" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter the description</label>
                </div>

                <div className="relative z-0 w-full mb-5">
                    <input type="file" accept='image/*' onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const imageData = e.target?.files
                            setDetails((rest) => ({ ...rest, Thumbnail: imageData[0] }))
                            setError("")
                        }
                    }} name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                </div>

                <div className="ml-auto">
                    <button type="button" onClick={() => startLiveFunc()} className="text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Start Live</button>
                </div>
            </form>

        </div>
    </>
    );
};

export default React.memo(Streaming);


// import React, { useRef, useEffect } from 'react';
// import io from 'socket.io-client';

// const Broadcaster = () => {
//   const videoRef = useRef<any>(null);
//   const socketRef = useRef<any>(null);
//   const peerConnections = useRef<any>({});

//   useEffect(() => {
//     socketRef.current = io('http://localhost:3001');

//     socketRef.current.on('watcher', (id:any) => {
//       const peerConnection = new RTCPeerConnection();
//       peerConnections.current[id] = peerConnection;

//       let stream = videoRef.current.srcObject;
//       stream.getTracks().forEach((track:any) => peerConnection.addTrack(track, stream));

//       peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//           socketRef.current.emit('candidate', id, event.candidate);
//         }
//       };

//       peerConnection.createOffer()
//         .then(sdp => peerConnection.setLocalDescription(sdp))
//         .then(() => {
//           socketRef.current.emit('offer', id, peerConnection.localDescription);
//         });
//     });

//     socketRef.current.on('answer', (id:any, description:any) => {
//       peerConnections.current[id].setRemoteDescription(description);
//     });

//     socketRef.current.on('candidate', (id:any, candidate:any) => {
//       peerConnections.current[id].addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     socketRef.current.on('disconnectPeer', (id:any) => {
//       peerConnections.current[id].close();
//       delete peerConnections.current[id];
//     });

//     socketRef.current.emit('broadcaster');

//     return () => {
//       socketRef.current.disconnect();
//       Object.values(peerConnections.current).forEach((pc:any) => pc.close());
//     };
//   }, []);

//   const startLiveStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       videoRef.current.srcObject = stream;
//     } catch (error) {
//       console.error('Error accessing media devices.', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={startLiveStream}>Start Live Stream</button>
//       <video ref={videoRef} autoPlay muted playsInline></video>
//     </div>
//   );
// };

// export default Broadcaster;
