import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import NavBar from '../layout/NavBar';

const socket = io('http://localhost:3001');


const Viewer: React.FC = () => {
    const canvasRef = useRef<any> ();
    useEffect(() => {
        socket.on('stream', (data) => {
            const img = new Image();
            img.src = data;
            img.onload = () => {
                const context = canvasRef.current.getContext('2d');
                context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        });
    }, []);

    return (
        <>
            <NavBar />
            <canvas ref={canvasRef} width="640" height="480"></canvas>
        </>
    );
};

export default Viewer;
