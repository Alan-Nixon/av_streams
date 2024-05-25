import { useEffect, useRef, useState } from 'react';
import NavBar from './NavBar';
import { sendStopRequest } from '../../../Functions/streamFunctions/streamManagement';

function StartLive() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canva = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const ResultvideoRef = useRef<HTMLVideoElement>(null)
    const socketRef = useRef<WebSocket | null>(null);
    const [cameraScreen, setCameraScreen] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null);

    const mediaSourceRef = useRef<MediaSource | null>(null);
    const sourceBufferRef = useRef<SourceBuffer | null>(null);

    const initializeWebSocket = () => {
        if (!socketRef.current) {
            console.log("socket connected")
            socketRef.current = new WebSocket('ws://localhost:3001');
        } else {
            console.log("no socket connection");
        }
    };

    const closeWebSocket = () => {
        console.log("close request");
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    };



    const Record = (stream: MediaStream, type: string) => {
        const mediaRecorder = new MediaRecorder(stream);
        console.log("recording started...", stream, mediaRecorder)
        const chunks: any = [];

        mediaRecorder.ondataavailable = (event) => {
            (async () => {
                if (socketRef.current) {
                    console.log(event.data);
                    socketRef.current.send(event.data);
                }
            })()
        };


        mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(chunks, { type: 'video/webm' });
            console.log(recordedBlob);
        };

        mediaRecorder.start(1000);
    };


    useEffect(() => {
        initializeWebSocket()

        return () => {
            closeWebSocket()
        }
    }, [])





    useEffect(() => {


        const startCamera = async () => {
            try {

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

                if (screenRef.current) {
                    screenRef.current.srcObject = screenStream;
                    // Record(screenStream, "screen")
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    Record(screenStream, "camera")
                }


            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };



        if (cameraScreen) {
            startCamera();
            setCameraScreen(false)
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };

    }, [cameraScreen]);


    const stopCamera = () => {
        sendStopRequest()
        closeWebSocket()
    }

    useEffect(() => {
        if (socketRef && socketRef.current) {
            socketRef.current.onmessage = (event: MessageEvent) => {
                const data = event.data;

                // Handle video data chunk
                if (sourceBufferRef.current && sourceBufferRef.current.updating === false) {
                    sourceBufferRef.current.appendBuffer(data);
                }
            };
        }
    }, [socketRef])

    useEffect(() => {
        if (ResultvideoRef.current) {
            mediaSourceRef.current = new MediaSource();
            ResultvideoRef.current.src = URL.createObjectURL(mediaSourceRef.current);

            mediaSourceRef.current.addEventListener('sourceopen', () => {
                const mime = 'video/mp4; codecs="avc1.64001E, mp4a.40.2"';
                sourceBufferRef.current = mediaSourceRef.current!.addSourceBuffer(mime);
            });
        }
    }, [])


    return (
        <>
            <NavBar />
            <div style={{ marginTop: "5%", display: "flex", marginLeft: "auto" }}>
                <div style={{ display: "flex", marginTop: "13%", marginLeft: "20.5%", marginBottom: "14%", width: "auto", height: "auto", position: "relative", transform: "scale(2.2)", border: "1px solid black" }} className="">
                    <video ref={screenRef} style={{ width: "418px", height: "235px" }} autoPlay playsInline />
                    <div style={{ width: "85px", height: "65px", position: "absolute", bottom: 0, right: 0 }}>
                        <video ref={videoRef} style={{ width: "100%", height: "100%", transform: 'scaleX(-1)' }} autoPlay playsInline />
                    </div>
                </div>
            </div>
            <div className='13%' style={{ position: "absolute" }}>
                <button onClick={() => setCameraScreen(true)}>start Live</button><br />
                <button onClick={stopCamera} className='cursor-pointer'>stop live</button>
            </div>
            <br />

            {videoUrl ? (
                <video ref={ResultvideoRef} width="640" height="480" controls autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                </video>
            ) : (
                <p>Waiting for video...</p>
            )}
        </>
    );
}

export default StartLive;
