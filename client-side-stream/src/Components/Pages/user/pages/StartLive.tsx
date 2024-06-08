import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Streaming = () => {
    const videoRef = useRef<any>();
    const screenRef = useRef<any>();
    const canvasRef = useRef<any>();
    const screenCanvasRef = useRef<any>();
    const streamingRef = useRef(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            navigator.mediaDevices.getDisplayMedia({ video: true }).then((screenStream) => {

                if (screenRef.current) {
                    screenRef.current.srcObject = screenStream
                }

                if (videoRef.current) {

                    videoRef.current.srcObject = stream;
                    videoRef.current.play();

                    if (canvasRef.current) {



                        const context = canvasRef.current?.getContext('2d');
                        // const screen = screenRef.current?.getContext('2d');
 
                        const captureFrame = () => {

                            if (!streamingRef.current ) return;

                            context.drawImage(videoRef.current, 0, 0, canvasRef.current?.width, canvasRef.current?.height);
                            // screen.drawImage(videoRef.current, 0, 0, screenRef.current?.width, screenRef.current?.height);

                            socket.emit('stream', {
                                camera: canvasRef.current.toDataURL('image/webp'),
                                screen: screenCanvasRef.current?.toDataURL('image/webp'),
                            });

                            requestAnimationFrame(captureFrame);

                        };

                        screenRef.current.addEventListener('play', () => {
                            streamingRef.current = true;
                            captureFrame();
                        });
                    }
                }
            })


            return () => {
                streamingRef.current = false;
                stream?.getTracks().forEach(track => track.stop());
            };
        });
    }, []);



    return (
        <div>
            {/* <video ref={videoRef} style={{ display: 'none' }}></video> */}

            <canvas ref={screenCanvasRef} width="640" height="480" style={{ display: "none" }} />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
            <div style={{ marginTop: "5%", display: "flex", marginLeft: "auto" }}>
                <div style={{ display: "flex", marginTop: "13%", marginLeft: "20.5%", marginBottom: "14%", width: "auto", height: "auto", position: "relative", transform: "scale(2.2)", border: "1px solid black" }} className="">
                    <video ref={screenRef} style={{ width: "418px", height: "235px" }} autoPlay playsInline />
                    <div style={{ width: "85px", height: "65px", position: "absolute", bottom: 0, right: 0 }}>
                        <video ref={videoRef} style={{ width: "100%", height: "100%", transform: 'scaleX(-1)' }} autoPlay playsInline />
                    </div>
                </div>
            </div>
            <div className='13%' style={{ position: "absolute" }}>
            </div>
        </div>
    );
};

export default Streaming;
