import React, { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { ContentProps, socketContextInterface } from '../interfaces'


const socketContextProvider = createContext<socketContextInterface>({
  socket: null,
  setSocket: () => { },
})

export const useSocket = () => useContext(socketContextProvider)

function SocketContext({ children }: ContentProps) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_GATEWAY || "")
    setSocket(socket)

    socket.on('connect', () => {
      console.log('Connected to socket')
    })


    return () => {
      socket.disconnect()
    }
  }, [])

  const SocketContextValue = {
    socket,
    setSocket,
  }
  
  return (
    <socketContextProvider.Provider value={SocketContextValue}>
      {children}
    </socketContextProvider.Provider>
  )
}

export default SocketContext