import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Content from './helpers/Content'
import { channelInterface, postInterface, videoInterface } from '../../../Functions/interfaces'
import { getPostFromUser } from '../../../Functions/streamFunctions/streamManagement'
import { useNavigate } from 'react-router-dom'
import { getPopularChannels, getTrendingChannels } from '../../../Functions/userFunctions/userManagement'
import { ShowPosts } from './helpers/HelperComponents'

function Channels() {
  const [popular, setPopular] = useState<channelInterface[]>([])
  const [trending, setTrending] = useState<channelInterface[]>([])
  const [popChannelPosts, setPopChannelPosts] = useState<postInterface[]>([])
  const [trendingChannelPosts, setTrendingChannelPosts] = useState<postInterface[]>([])

  const Navigate = useNavigate()

  useEffect(() => {

    getPopularChannels(5).then(async ({ data }) => {
      setPopular(data)
      const posts = await Promise.all(data.map(async (item: channelInterface) => await getPostFromUser(item.userId)))
      setPopChannelPosts(posts.flat(Infinity))
    })

    getTrendingChannels(5).then(async ({ data }) => {
      setTrending(data)
      const posts = await Promise.all(data.map(async (item: channelInterface) => await getPostFromUser(item.userId)))
      setTrendingChannelPosts(posts.flat(Infinity))
    })

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
                  <img className="rounded ml-4" style={{ borderRadius: "100%", width: "150px" }} src={item.profileImage} alt="" />
                  <div className="p-2" >
                    <h5 className="mb-2 text-md ml-4 font-bold tracking-tight text-gray-900 dark:text-white">{item.channelName}</h5>
                  </div>
                </div>
              )
            })}
          </div>
          {popChannelPosts?.length !== 0 && <ShowPosts Data={popChannelPosts} />}

          <p className="text-xl mt-8 font-bold">Trending Channels</p>
          <div className="flex flex-wrap mt-3">
            {trending.map((item, idx) => {
              return (
                <div key={idx} className="ml-7 cursor-pointer">
                  <img className="rounded" style={{ borderRadius: "100%", width: "150px" }} src={item.profileImage} alt="" />
                  <div className="p-2" >
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{item.channelName}</h5>
                  </div>
                </div>
              )
            })}
          </div>

          {trendingChannelPosts?.length !== 0 && <ShowPosts Data={trendingChannelPosts} />}

        </div>
      </Content>
    </>
  )
}

export default Channels
