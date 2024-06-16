import { createContext, useContext, useEffect, useState } from "react";
import { ContentProps } from "./Functions/interfaces";
import { useUser } from "./UserContext";
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'
import { v4 as uuidv4 } from 'uuid';

const LiveContext = createContext<any>({
    zp: null,
    setZp: () => { }
});

export const useZego = () => useContext(LiveContext);



export const LiveProvider = ({ children }: ContentProps) => {

    const [zg, setZg] = useState<any>(null);
    const { user } = useUser()
    useEffect(() => {
        console.log(user, "this is the user");

        const initZego = async () => {
            if (user && user._id) {

                const appID = Number(process.env.REACT_APP_ZEGO_STREAM_APP_ID)
                const server = process.env.REACT_APP_ZEGO_STREAM_SERVER_ID ?? ""
                const zg = new ZegoExpressEngine(appID, server);
                
                setZg(zg)
                
                zg.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
                    if (state == 'DISCONNECTED') {
                        alert("disconnecteed")
                    }

                    if (state == 'CONNECTING') {
                    }

                    if (state == 'CONNECTED') {
                    }
                })

                zg.on('roomUserUpdate', (roomID, updateType, userList) => {
                    console.warn(
                        `roomUserUpdate: room ${roomID}, user ${updateType === 'ADD' ? 'added' : 'left'} `,
                        JSON.stringify(userList),
                    );
                });

                zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
                    if (updateType == 'ADD') {
                    } else if (updateType == 'DELETE') {
                    }
                });

            }

        }
        initZego()

    }, [user]);




    const liveContextValue: any = { zg, setZg }

    return (
        <LiveContext.Provider value={liveContextValue}>
            {children}
        </LiveContext.Provider>
    );
};