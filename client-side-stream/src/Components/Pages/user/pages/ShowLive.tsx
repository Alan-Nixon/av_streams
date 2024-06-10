import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import NavBar from '../layout/NavBar';

const socket = io('http://localhost:3001');

const Viewer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const screenRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const lastFrameTimeRef = useRef<number>(0);
    const frameRate = 30; // Desired frame rate

    useEffect(() => {
        socket.on('stream', (data: { screen: string; camera: string }) => {
            const currentTime = Date.now();
            if (currentTime - lastFrameTimeRef.current >= 1000 / frameRate) {
                writeImage(data.screen, screenRef);
                writeImage(data.camera, canvasRef);
                lastFrameTimeRef.current = currentTime;
            }
        });

        return () => {
            socket.off('stream');
        };
    }, []);

    const startRecording = () => {
        const canvasStream = canvasRef.current?.captureStream(30); // 30 FPS
        const screenStream = screenRef.current?.captureStream(30);

        if (canvasStream && screenStream) {
            const combinedStream = new MediaStream([
                ...canvasStream.getTracks(),
                ...screenStream.getTracks(),
            ]);

            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm; codecs=vp9',
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                if (videoRef.current) {
                    videoRef.current.src = url;
                    videoRef.current.play();
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const writeImage = (dataUrl: string, ref: React.RefObject<HTMLCanvasElement>) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            if (ref.current) {
                const context = ref.current.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, ref.current.width, ref.current.height);
                    context.drawImage(img, 0, 0, ref.current.width, ref.current.height);
                }
            }
        };
    };

    return (
        <>
            <NavBar />
            <div style={{ margin: '1%', marginLeft: "12%", marginBottom: "10%", maxHeight: "650px", display: 'flex' }}>
                <div style={{ display: 'flex', marginTop: '13%', position: 'relative', border: '1px solid black', transform: 'scale(1.5)' }}>
                    <div style={{ width: '640px', height: '360px' }}>
                        <canvas ref={screenRef} width="640" height="360" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={{ width: '160px', height: '90px', position: 'absolute', bottom: 0, right: 0 }}>
                        <canvas ref={canvasRef} width="160" height="90" style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
                    </div>
                </div>
            </div>
            <video ref={videoRef} style={{ width: '640px', height: '360px', margin: '12%', marginLeft: "15%" }} controls />
            <div style={{ textAlign: 'center' }}>
                <button onClick={startRecording}>Start Recording</button>
                <button onClick={stopRecording}>Stop Recording</button>
            </div>
        </>
    );
};

export default Viewer;
