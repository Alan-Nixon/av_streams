import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Content from './helpers/Content'
import { postInterface, videoInterface } from '../../../Functions/interfaces'
import { getPostFromUser } from '../../../Functions/streamFunctions/streamManagement'
import { useNavigate } from 'react-router-dom'

function Channels() {
  const [popular, setPopular] = useState<videoInterface[]>([])
  const [trending, setTrending] = useState<videoInterface[]>([])
  const [popChannelPosts, setPopChannelPosts] = useState<postInterface[]>([])

  const Navigate = useNavigate()

  useEffect(() => {
    const pop = new Array(6).fill({
      _id: "663727eedbf3c05ef34d618e",
      userId: "663727eedbf3c05ef34d618b",
      Title: "Noteworthy technology acquisitions 2021",
      Views: "85k",
      channelName: "some channel",
      Description: "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
      Link: "",
      shorts: false,
      Thumbnail: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/gaming-logo-design-template-d91be991586c340507ccca2d554dc84f_screen.jpg?ts=1685062010"
    });

    (async () => {
      const posts = (await Promise.all(pop.map(async (item) => await getPostFromUser(item.userId)))).flat(Infinity)
      setPopChannelPosts(posts)
    })()

    setPopular(pop)
    setTrending(pop)
  }, [])

  return (
    <>
      <NavBar />
      <SideBar />
      <Content>
        <div className="m-4">
          <p className="text-xl font-bold">Popular Channels</p>
          <div className="flex flex-wrap mt-3">
            {popular.map((item, idx) => {
              return (
                <div key={idx} onClick={() => Navigate('/channel?userId=' + item._id)} className="ml-7 cursor-pointer">
                  <img className="rounded" style={{ borderRadius: "100%", width: "150px" }} src={item.Thumbnail} alt="" />
                  <div className="p-2" >
                    <h5 className="mb-2 text-md ml-4 font-bold tracking-tight text-gray-900 dark:text-white">{item.channelName}</h5>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xl mt-3 font-bold">Trending Channels</p>
          <div className="flex flex-wrap mt-3">
            {trending.map((item, idx) => {
              return (
                <div key={idx} className="ml-7 cursor-pointer">
                  <img className="rounded" style={{ borderRadius: "100%", width: "150px" }} src={item.Thumbnail} alt="" />
                  <div className="p-2" >
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{item.channelName}</h5>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Content>
    </>
  )
}

export default Channels
