import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import NavBar from '../layout/NavBar';


const Viewer: React.FC = () => {
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

        </>
    );
};

export default Viewer;
