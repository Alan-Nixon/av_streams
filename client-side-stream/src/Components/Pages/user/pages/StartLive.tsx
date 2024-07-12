import { useRef, useEffect, useState } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { io } from "socket.io-client";
import Swal from 'sweetalert2';



// import { SocketContext, socket } from "../../context/socket";

const configuration = { iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]}], iceCandidatePoolSize: 10 };
const socket = io("http://localhost:8006", { transports: ["websocket"] });




function VideoCall({ closeVideoCall }: any) {


  let pc: any;
  let localStream: any;
  let startButton: any;
  let hangupButton: any;
  let muteAudButton: any;
  let muteVideo: any
  let remoteVideo: any;
  let localVideo: any;

  useEffect(() => {


    socket.on("message", (e) => {

      switch (e.type) {
        case "offer":
          handleOffer(e);
          break;
        case "answer":
          handleAnswer(e);
          break;
        case "candidate":
          handleCandidate(e);
          break;
        case "ready":
          if (pc) {
            alert("already in call ignoreing")
            console.log("already in call, ignoring");
            return;
          }
          makeCall();
          break;
        case "bye":
          if (pc) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", e);
          break;
      }

      if (!localStream) {
        console.log("not ready yet");
        return;
      }

    });
    socket.on('ignoredStatus', (res) => {

      hangup()
      Swal.fire({
        title: 'cuted the call',

      })

    })

  }, [localStream]);


  async function makeCall() {

    try {

      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e: any) => {
        const message: any = {
          type: "candidate",
          candidate: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("message", message);
      };

      pc.ontrack = (e: any) => {
        console.log(e.streams, "this is the stream");
        remoteVideo.current.srcObject = e.streams[0]
      };
      if (localStream) {

        localStream.getTracks().forEach((track: any) => pc.addTrack(track, localStream));
        const offer = await pc.createOffer();
        socket.emit("message", { type: "offer", sdp: offer.sdp });
        await pc.setLocalDescription(offer);
      }

    } catch (e) {
      console.log(e);
    }
  }



  async function handleOffer(offer: any) {
    if (pc) {
      console.error("existing peerconnection");
      return;
    }
    try {
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e: any) => {
        const message: any = {
          type: "candidate",
          candidate: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("message", message);
      };
      pc.ontrack = (e: any) => (remoteVideo.current.srcObject = e.streams[0]);
      localStream.getTracks().forEach((track: any) => pc.addTrack(track, localStream));
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      socket.emit("message", { type: "answer", sdp: answer.sdp });
      await pc.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }


  async function handleAnswer(answer: any) {
    if (!pc) {
      console.error("no peerconnection");
      return;
    }
    try {
      await pc.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(candidate: any) {
    try {
      if (!pc) {
        console.error("no peerconnection");
        return;
      }
      if (!candidate) {
        await pc.addIceCandidate(null);
      } else {
        await pc.addIceCandidate(candidate);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async function hangup() {
    if (pc) {
      pc.close();
      pc = null;
    }
    localStream.getTracks().forEach((track: any) => track.stop());
    localStream = null;
    startButton.current.disabled = false;
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;

    closeVideoCall()



  }




  startButton = useRef(null);
  hangupButton = useRef(null);
  muteAudButton = useRef(null);
  localVideo = useRef(null);
  remoteVideo = useRef(null);
  muteVideo = useRef(null)

  useEffect(() => {
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVideo.current.disabled = true
  }, []);

  const [audiostate, setAudio] = useState(true);
  const [videoState, setVideoState] = useState(true)

  const startB = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true },
      });
      localVideo.current.srcObject = localStream;
    } catch (err) {
      console.log(err);
    }

    startButton.current.disabled = true;
    hangupButton.current.disabled = false;
    muteAudButton.current.disabled = false;
    muteVideo.current.disabled = false

    socket.emit("message", { type: "ready" });
  };

  const hangB = async () => {

    Swal.fire({
      title: 'Are you sure to  correct!',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((res) => {

      if (res.isConfirmed) {
        hangup();

        socket.emit("message", { type: "bye" });
      }

    })



  };


  function muteAudio() {
    if (localStream) {
      localStream.getAudioTracks().forEach((track: any) => {
        alert(track.enabled)
        track.enabled = !track.enabled; // Toggle mute/unmute
      });
      setAudio(true); // Update state for UI toggle
    }
  }

  function pauseVideo() {

    if (localStream) {
      localStream.getVideoTracks().forEach((track: any) => {
        track.enabled = !track.enabled; // Toggle video track
      });
      setVideoState(true); // Update state for UI toggle
    }

  }







  return (
    <>
      <div className='bg-white w-screen h-screen position: fixed ' style={{ position: 'absolute', zIndex: '99', backgroundColor: "white" }}>
        <div className="flex justify-center h-screen bg-white position: fixed  " style={{ marginTop: "100px", paddingLeft: "250px" }}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              {/* Box 1 (Participant video feed) */}
              <div className="bg-gray-200 h-[400px] w-[500px] rounded-lg shadow-md">
                {/* Image */}
                <video
                  ref={localVideo}
                  className="video-item"
                  autoPlay
                  playsInline
                  src=" "
                ></video>

                {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZqj-XReJ2R76nji51cZl4ETk6-eHRmZBRw&s" alt="Participant Video" className="w-full h-full rounded-lg object-cover" /> */}
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
              {/* Box 2 (Your video feed) */}
              <div className="bg-gray-200 h-[400px] w-[500px] rounded-lg shadow-md">
                {/* Image */}
                <video
                  ref={remoteVideo}
                  className="video-item"
                  autoPlay
                  playsInline
                  src=" "
                ></video>

                {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZqj-XReJ2R76nji51cZl4ETk6-eHRmZBRw&s" alt="Your Video" className="w-full h-full rounded-lg object-cover" /> */}
              </div>
            </div>
          </div>
          <div className=" absolute flex justify-center items-center mt-4 mb-4" style={{ paddingTop: "480px" }}>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full bg-gray-300 hover:bg-gray-400" ref={muteAudButton}
                onClick={muteAudio}>
                {audiostate ? <FiMic /> : <FiMicOff />}

              </button>
              <button className="p-2 rounded-full bg-gray-300 hover:bg-gray-400" ref={startButton}
                onClick={startB}>
                {/* <FaPhone  className="text-gray-600" /> */}
                start
              </button>
              <button className="p-2 rounded-full bg-gray-300 hover:bg-gray-400" ref={muteVideo}
                onClick={pauseVideo}>
                {/* {videoState?  <FaVideoSlash className="text-gray-600" />:<FaVideo className="text-gray-600" />} */}
                pause
              </button>
              <button className="p-2 rounded-full bg-gray-300 hover:bg-gray-400" ref={hangupButton}
                onClick={hangB} >
                {/* <FaTimes className="text-gray-600" /> */}
                hangup
              </button>
            </div>
          </div>
        </div>
        {/* Footer bar for controls */}
      </div>
    </>

  )
}

export default VideoCall