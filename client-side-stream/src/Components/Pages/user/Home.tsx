import NavBar from './NavBar'
import SideBar from './SideBar'
import Content from './helpers/Content'
import React, { useEffect, useState } from 'react'
import { BannerInterfaceHome, postInterface, videoInterface } from '../../../Functions/interfaces'
import { getCommentByCate } from '../../../Functions/streamFunctions/commentManagement'
import { getAllPosts, getAllVideos } from '../../../Functions/streamFunctions/streamManagement'
import { joinCommentWithpost } from '../../../Functions/commonFunctions'
import { useUser } from '../../../UserContext'
import { ShowPosts } from './helpers/HelperComponents'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [banner, setBanner] = useState<BannerInterfaceHome | null>(null)
    const [cateName, setCateName] = useState<string[]>([])
    const [trending, setTrending] = useState<videoInterface[]>([])
    const [posts, setPosts] = useState<postInterface[]>([])
    const { user } = useUser()
    const Navigate = useNavigate()

    useEffect(() => {
        setCateName(["Gaming", "Educational", "Music", 'Sports'])

        const Banners: BannerInterfaceHome = {
            bigBanner: '/images/gtaSeaCar.jpeg',
            mainBanner: "/images/Pasted_image.png",
            isLive: true,
            subBanners: Array(4).fill({
                thumbnail: "/images/subThumbNail.jpeg",
                isLive: true
            })
        }
        setBanner(Banners)

        const trendingSection: videoInterface[] = new Array(8).fill({
            Title: "Noteworthy technology acquisitions 2021",
            Views: "85k",
            channelName: "some channel",
            Description: "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
            Link: "",
            shorts: false,
            Thumbnail: "/images/subThumbNail2.jpeg"
        })
        getAllVideos(false).then(videos => {
            setTrending(videos);
        })
    }, [])

    useEffect(() => {
        if (user && user?._id) {
            getCommentByCate('post').then(({ data }) => {
                getAllPosts().then((response) => {
                    const res = joinCommentWithpost(response, data, user?._id || "");
                    if (data && res) { setPosts(res) }
                })
            })
        }
    }, [user])


    return (
        <>
            <NavBar />
            <SideBar />
            <Content> <>
                <div className="flex m-4 ml-8">
                    {cateName.map((names, idx) => {
                        return (
                            <button key={idx} type="button" className="ml-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{names}</button>
                        )
                    })}
                </div>


                <div className="ml-5 flex">
                    <div className="flex mainBanner relative">
                        <img src={banner?.mainBanner} className='' style={{ maxWidth: "50%", cursor: "pointer" }} alt="" />
                        {banner?.isLive && <div className="flex relative" style={{ float: "right" }}>
                            <div className="flex p-1 absolute top-0 right-0" style={{ backgroundColor: "black" }}>
                                <svg className="" xmlns="http://www.w3.org/2000/svg" fill="#fa000c" width={12} viewBox="0 0 512 512">
                                    <path d="M16 128h416c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16H16C7.2 32 0 39.2 0 48v64c0 8.8 7.2 16 16 16zm480 80H80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm-64 176H16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16z" />
                                </svg>
                                <span className='ml-1 text-xs' style={{ fontWeight: "bold" }}>LIVE</span>
                            </div>
                        </div>}
                        <div className="ml-2">
                            <div className="flex">
                                <img src={banner?.subBanners[0].thumbnail} className='cursor-pointer' style={{ width: "50%" }} alt="" />
                                {banner?.isLive && <div className="flex relative" style={{ float: "right" }}>
                                    <div className="flex p-1 absolute top-0 right-0" style={{ backgroundColor: "black" }}>
                                        <svg className="" xmlns="http://www.w3.org/2000/svg" fill="#fa000c" width={12} viewBox="0 0 512 512">
                                            <path d="M16 128h416c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16H16C7.2 32 0 39.2 0 48v64c0 8.8 7.2 16 16 16zm480 80H80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm-64 176H16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                        <span className='ml-1 text-xs' style={{ fontWeight: "bold" }}>LIVE</span>
                                    </div>
                                </div>}
                                <img src={banner?.subBanners[1].thumbnail} className='ml-2 cursor-pointer' style={{ width: "47%" }} alt="" />
                                {banner?.subBanners[1].isLive && <div className="flex relative" style={{ float: "right" }}>
                                    <div className="flex p-1 absolute top-0 right-0" style={{ backgroundColor: "black" }}>
                                        <svg className="" xmlns="http://www.w3.org/2000/svg" fill="#fa000c" width={12} viewBox="0 0 512 512">
                                            <path d="M16 128h416c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16H16C7.2 32 0 39.2 0 48v64c0 8.8 7.2 16 16 16zm480 80H80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm-64 176H16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                        <span className='ml-1 text-xs' style={{ fontWeight: "bold" }}>LIVE</span>
                                    </div>
                                </div>}
                            </div>
                            <div className="flex mt-3">
                                <img src={banner?.subBanners[2].thumbnail} className='mt-2 cursor-pointer' style={{ width: "50%" }} alt="" />
                                {banner?.subBanners[2].isLive && <div className="flex relative" style={{ float: "right" }}>
                                    <div className="flex p-1 absolute top-0 right-0" style={{ backgroundColor: "black" }}>
                                        <svg className="" xmlns="http://www.w3.org/2000/svg" fill="#fa000c" width={12} viewBox="0 0 512 512">
                                            <path d="M16 128h416c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16H16C7.2 32 0 39.2 0 48v64c0 8.8 7.2 16 16 16zm480 80H80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm-64 176H16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                        <span className='ml-1 text-xs' style={{ fontWeight: "bold" }}>LIVE</span>
                                    </div>
                                </div>}
                                <img src={banner?.subBanners[3].thumbnail} className='ml-2 cursor-pointer' style={{ width: "47%" }} alt="" />
                                {banner?.subBanners[3].isLive && <div className="flex relative" style={{ float: "right" }}>
                                    <div className="flex p-1 absolute top-0 right-0" style={{ backgroundColor: "black" }}>
                                        <svg className="" xmlns="http://www.w3.org/2000/svg" fill="#fa000c" width={12} viewBox="0 0 512 512">
                                            <path d="M16 128h416c8.8 0 16-7.2 16-16V48c0-8.8-7.2-16-16-16H16C7.2 32 0 39.2 0 48v64c0 8.8 7.2 16 16 16zm480 80H80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm-64 176H16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                        <span className='ml-1 text-xs' style={{ fontWeight: "bold" }}>LIVE</span>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="secondBar ml-5 mt-5">
                    <div className="">
                        <img src={banner?.bigBanner} style={{ width: "99%", height: "250px" }} alt="" />
                    </div>
                </div>


                <div className="ml-5 mt-4">
                    <h2 className="text-lg font-bold">TRENDING </h2>
                    <div className="flex flex-wrap mt-1">
                        {trending && trending.map((item, idx) => {
                            return (
                                <div key={idx} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} onClick={() => Navigate('/FullVideo?videoId=' + item._id)} className="ml-3 mt-3 cursor-pointer hover:bg-gray-900 rounded-lg shadow">
                                    <img className="rounded-t-lg w-full" src={item.Thumbnail} alt="" />
                                    <div className="p-5">
                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.Title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.Description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="posts ml-8 mt-1">
                    {posts.length !== 0 && <ShowPosts Data={posts} />}

                </div>


            </> </Content>
        </>
    )
}

export default React.memo(Home)
