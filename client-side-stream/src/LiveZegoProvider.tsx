import { createContext, useContext, useEffect, useState } from "react";
import { ContentProps } from "./Functions/interfaces";
import { useUser } from "./UserContext";
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { v4 as uuidv4 } from 'uuid';

const LiveContext = createContext<any>({
    zg: null,
    setZg: () => { }
});

export const useZego = () => useContext(LiveContext);

export const LiveProvider = ({ children }: ContentProps) => {
    const [zg, setZg] = useState<any>(null);
    const { user } = useUser();

    useEffect(() => {
        console.log(user, "this is the user");

        const initZego = async () => {
            if (user && user._id) {
                const appID = Number(process.env.REACT_APP_ZEGO_STREAM_APP_ID);
                const server = process.env.REACT_APP_ZEGO_STREAM_SERVER_ID ?? "";

                
                const zgInstance = new ZegoExpressEngine(appID, server);

                
                if (zgInstance.setLogConfig) {
                    zgInstance.setLogConfig({
                        logLevel: 'disable' 
                    });
                } else {
                    console.warn("setLogConfig is not available. Check the ZegoExpressEngine documentation for log configuration.");
                }

                setZg(zgInstance);

                
                zgInstance.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
                    if (state === 'DISCONNECTED') {
                        alert("Disconnected");
                    } else if (state === 'CONNECTING') {
                        
                    } else if (state === 'CONNECTED') {
                        
                    }
                });

                zgInstance.on('roomUserUpdate', (roomID, updateType, userList) => {
                    console.warn(
                        `roomUserUpdate: room ${roomID}, user ${updateType === 'ADD' ? 'added' : 'left'} `,
                        JSON.stringify(userList),
                    );
                });

                zgInstance.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
                    if (updateType === 'ADD') {
                        
                    } else if (updateType === 'DELETE') {
                        
                    }
                });
            }
        };

        initZego();
    }, [user]);

    
    const liveContextValue: any = { zg, setZg };

    
    return (
        <LiveContext.Provider value={liveContextValue}>
            {children}
        </LiveContext.Provider>
    );
};
