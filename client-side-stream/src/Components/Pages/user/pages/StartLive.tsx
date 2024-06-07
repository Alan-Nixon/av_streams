import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Streaming = () => {
    const videoRef = useRef<any>();
    const canvasRef = useRef<any> ();
    const streamingRef = useRef(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {

                videoRef.current.srcObject = stream;
                videoRef.current.play();
                if (canvasRef.current) {

                    const context = canvasRef.current.getContext('2d');

                    const captureFrame = () => {
                        if (!streamingRef.current) return;
                        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        socket.emit('stream', canvasRef.current.toDataURL('image/webp'));
                        requestAnimationFrame(captureFrame);
                    };

                    videoRef.current.addEventListener('play', () => {
                        streamingRef.current = true;
                        captureFrame();
                    });
                }
            }

            return () => {
                streamingRef.current = false;
                stream.getTracks().forEach(track => track.stop());
            };
        });
    }, []);

    

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} width="640" height="480"></canvas>
        </div>
    );
};

export default Streaming;
