import React, { useEffect, useRef } from 'react'
import NavBar from '../layout/NavBar'

import { io } from 'socket.io-client'

function ShowLive() {
  const socket = io(process.env.REACT_APP_API_GATEWAY || "")
  const pc = useRef<any>()
  const videoRef = useRef<any>()
  
    
  useEffect(()=>{
    
    socket.on("calling", (e) => {

      if (e.type === "candidate") {
        handleCandidate(e);
      } else if (e.type === "offer") {
        handleOffer(e)
      } else if (e.type === "ready") {
        if (pc.current) {
          alert("already in call ignoring");
          return;
        }
        // makeCall();
      } else if (e.type === "answer") { 
        handleAnswer(e)
      } else {
        console.log("unhandled", e);
      }
    
    });
  },[socket]);

  
    async function handleOffer(offer:any) {
      if (pc.current) { console.error("existing peerconnection"); return;}
      try {
        const userInfo ="some one"
        const configuration = {
          iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] }],
          iceCandidatePoolSize: 10,
        };
        pc.current = new RTCPeerConnection(configuration);
        pc.current.onicecandidate = (e:any) => {
          const message = {
            type: "candidate",
            id: userInfo,
            candidate: e.candidate ? e.candidate.candidate : null,
            sdpMid: e.candidate ? e.candidate.sdpMid : undefined,
            sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : undefined,
          };
          socket.emit("calling", message);
        };
        pc.current.ontrack = (e:any) => {
          console.log(e,"this is the stream")
          if(videoRef.current) {
            videoRef.current.srcObject = e.streams[0]
          }
        };
        await pc.current.setRemoteDescription(offer);
        const answer = await pc.current.createAnswer();
        socket.emit("calling", { id: userInfo, type: "answer", sdp: answer.sdp });
        await pc.current.setLocalDescription(answer);
      } catch (e) {
        console.log(e);
      }
    }

    async function handleCandidate(candidate:any) {
      try {
        if (!pc.current) { console.error("no peerconnection"); return }
        await pc.current.addIceCandidate(candidate ? candidate : null);
      } catch (e) {
        console.log(e);
      }
    }
  
    async function handleAnswer(answer: any) {
      try {
        if (!pc.current) { console.error("no peerconnection"); return }
        await pc.current.setRemoteDescription(answer);
      } catch (e) {
        console.log(e);
      }
    }


  return (
    <div>
      <NavBar />
      <video src="" ref={videoRef} width="400" height="400" autoPlay />
    </div>
  )
}

export default ShowLive 
