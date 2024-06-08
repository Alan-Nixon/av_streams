import React, { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from "zego-express-engine-webrtc";



function VideoCall() {
    return (
        <div>
            <App />
        </div>
    );
}

export default VideoCall;

function App() {
    const appId = Number(process.env.REACT_APP_ZEGO_APP_ID) ?? 0;
    const serverId = process.env.REACT_APP_ZEGO_SERVER_ID ?? "325";
    const appSign = "71eadd18ea0b1b9e5a0cee4b0f070d15ec4b276de9bc282cb025933d9b152070"

    useEffect(() => {
        console.log('App ID:', appId);
        console.log('Server ID:', serverId);
        // console.log('Token:', token);
        const token = "04AAAAAGZlkdEAEHBnN29wcmpyZmZqZXd6aW0AoGstJtkgtU5MYEQqHrfrbuBTUTT2KprRj0WJRrIaQ3BvlNiw2nNY4bkitFAeiQd+qQ9rrfKFpEEccMcQV+85qdDAx4373fl+aDOJzCTPVbqqEaytQ0iTiMBl+MIxBpFNmYprNFrck6ct5gHiwgJe3pgL1294s80LoaPyyTvVv6dziCZlIQBa/Z8K6oOp8Mm0czLAK+Q9TscTA5M7t4xtNJ8="

       

        const initializeApp = async () => {

            try {
                const zg = new ZegoExpressEngine(appId, serverId);

                // Log token details for debugging
                console.log('Attempting to login with token:', token);

                await zg.loginRoom("zego-room", token,
                    { userID: "123", userName: "kishan" },
                    { userUpdate: true }
                );

                const localStream = await zg.createStream({
                    camera: {
                        audio: true,
                        video: true,
                    },
                });

                const videoElement = document.createElement("video");
                videoElement.id = "local-video";
                videoElement.className = "h-28 w-32";
                videoElement.autoplay = true;
                videoElement.muted = false;
                videoElement.playsInline = true;

                const localVideoContainer = document.getElementById("local-video");
                if (localVideoContainer) {
                    localVideoContainer.appendChild(videoElement);
                    videoElement.srcObject = localStream;
                }

                const streamID = "123" + Date.now();
                zg.startPublishingStream(streamID, localStream);

            } catch (error) {
                console.error("Error initializing ZegoExpressEngine:", error);
            }
        };

        initializeApp();
    }, [appId, serverId]);

    return (
        <div>
            <div id="local-video"></div>
            <div id="remote-video"></div>

        </div>
    );
}

