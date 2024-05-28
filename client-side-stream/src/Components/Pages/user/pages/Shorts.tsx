import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import { useEffect, useState } from 'react'
import { videoInterfaceComment } from '../../../../Functions/interfaces'
import { getAllVideos } from '../../../../Functions/streamFunctions/streamManagement'

function Shorts() {
  const [loading, setLoading] = useState<boolean>(true)
  const [shorts, setShorts] = useState([{
    Link: "", Thumbnail: "", clicked: false
  }])

  useEffect(() => {
    const shortsArr = new Array(2).fill({
      Title: "The Kid LAROI, Justin Bieber - STAY (Official Video)",
      videolink: "/videos/The Kid LAROI, Justin Bieber - STAY (Official Video).mp4",
      Thumbnail: "/videos/stayThumbnail.jpeg",
      channelDetails: {
        channelLogo: "/videos/download.jpeg",
        channelName: "Gamer 123",
        count: "365000",
        isFollowing: false
      },
      clicked: false
    })
    getAllVideos(true).then((response) => {
      setShorts(response)
      setLoading(false)
    })
  }, [])

  const toggleComment = (index: number) => {
    const newData = [...shorts];
    newData[index] = { ...newData[index], clicked: !newData[index].clicked };
    setShorts(newData);
  }


  return (
    <>
      <NavBar />
      <SideBar />
      <Content>
        {loading ? <div className="lds-dual-ring" /> : <>
          <div className="w-full">
            <div className="flex">
              <div className="m-auto">
                {shorts && shorts.map((data, index) => (
                  <div className="flex">
                    <div style={{ height: "540px", marginTop: "8%", width: "350px", position: "relative", backgroundColor: "black", borderRadius: "2%" }}>
                      <video poster={data.Thumbnail} controls muted autoPlay className='absolute' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <source src={data.Link} />
                      </video>
                    </div>
                    {data.clicked ?
                      <div className="bg-gray-500" style={{ marginTop: "8%", borderTopRightRadius: '2%' }}>
                        <p className="text-2xl">Comments</p>
                      </div> :
                      <div className="ml-2 " style={{ marginTop: "45%", color: "#0a0a0a" }}>
                        <div className="flex" >
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} viewBox="0 0 512 512" width={25} fill='#545454' >
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-5c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                          </svg><span className="ml-1">15k</span>
                        </div>
                        <div className="flex mt-3">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} width={25} fill='#545454' viewBox="0 0 512 512">
                            <path d="M119.4 44.1c23.3-3.9 46.8-1.9 68.6 5.3l49.8 77.5-75.4 75.4c-1.5 1.5-2.4 3.6-2.3 5.8s1 4.2 2.6 5.7l112 104c2.9 2.7 7.4 2.9 10.5 .3s3.8-7 1.7-10.4l-60.4-98.1 90.7-75.6c2.6-2.1 3.5-5.7 2.4-8.8L296.8 61.8c28.5-16.7 62.4-23.2 95.7-17.6C461.5 55.6 512 115.2 512 185.1v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.6 300.4C17.2 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141z" />
                          </svg><span className='ml-1'>2k</span>
                        </div>
                        <div className="flex mt-3">
                          <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleComment(index)} style={{ cursor: "pointer" }} width={25} fill='#545454' viewBox="0 0 512 512">
                            <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                          </svg><span className="ml-1">108</span>
                        </div>
                        <div className="flex mt-3">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} width={25} fill='#545454' viewBox="0 0 512 512">
                            <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                          </svg>
                        </div>
                      </div>}


                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
        }

      </Content >
    </>
  )
}

export default Shorts
