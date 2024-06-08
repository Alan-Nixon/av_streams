import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import NavBar from '../layout/NavBar';

const socket = io('http://localhost:3001');


const Viewer: React.FC = () => {
    const canvasRef = useRef<any>();
    const screenRef = useRef<any>();

    useEffect(() => {
        socket.on('stream', (data: any) => {
            console.log(data.screen);
            writeImage(data.screen, screenRef)
            // writeImage(data.camera, canvasRef)

        });
    }, []);

    const writeImage = (data: any, ref: any) => {
        const img = new Image();
        img.src = data;
        img.onload = () => {
            if (ref.current) {
                const context = ref.current?.getContext('2d');
                context.drawImage(img, 0, 0, ref.current.width, ref.current.height);
            }
        };
    }

    return (
        <>
            <NavBar />
            <div style={{ marginTop: "5%", display: "flex", marginLeft: "auto" }}>
                <div style={{ display: "flex", marginTop: "13%", marginLeft: "20.5%", marginBottom: "14%", width: "auto", height: "auto", position: "relative", transform: "scale(2.2)", border: "1px solid black" }} className="">
                    {/* <video ref={screenRef}  autoPlay playsInline /> */}
                    <canvas ref={canvasRef} style={{ width: "418px", height: "235px" }} />
                    <div style={{ width: "85px", height: "65px", position: "absolute", bottom: 0, right: 0 }}>
                        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", transform: 'scaleX(-1)' }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Viewer;
