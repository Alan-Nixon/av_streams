import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import React, { useEffect, useState } from 'react'
import { BannerInterfaceHome, categoryInterface, postInterface, videoInterface } from '../../../../Functions/interfaces'
import { getCommentByCate } from '../../../../Functions/streamFunctions/commentManagement'
import { getAllPosts, getAllVideos } from '../../../../Functions/streamFunctions/streamManagement'
import { joinCommentWithpost } from '../../../../Functions/commonFunctions'
import { useUser } from '../../../../UserContext'
import { ShowPosts } from '../helpers/HelperComponents'
import { useNavigate } from 'react-router-dom'
import { getCategory } from '../../../../Functions/streamFunctions/adminStreamFunction'

function Home() {
    const [banner, setBanner] = useState<BannerInterfaceHome | null>(null)
    const [cateName, setCateName] = useState<string[]>([])
    const [selectedCate, setSelectedCate] = useState<string>("")
    const [trending, setTrending] = useState<videoInterface[]>([])
    const [posts, setPosts] = useState<postInterface[]>([])
    const { user } = useUser()
    const Navigate = useNavigate()

    useEffect(() => {
        getCategory().then(({ data }) => {
            if (data) {
                data = data?.filter((item: categoryInterface) => item.Display);
                if (data) {
                    setCateName(data?.map((item: categoryInterface) => item.categoryName));
                    if (data.length > 0) { setSelectedCate(data[0]?.categoryName) }
                }
            }
        })



        // getBanners

        getAllVideos(false, "Gaming").then(videos => {

            setTrending(videos);
            const Banners: BannerInterfaceHome = {
                bigBanner: '/images/gtaSeaCar.jpeg',
                mainBanner: {
                    _id: videos[2]._id,
                    Thumbnail: videos[2].Thumbnail
                },
                subBanners: videos.slice(0, 4)
            }
            setBanner(Banners)
        })

    }, [])

    useEffect(() => {
        if (user && user?._id) {
            getCommentByCate('post').then((data) => {
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
                            <button key={idx} onClick={() => setSelectedCate(names)} type="button" className={`${selectedCate === names ? "bg-gray-800 hover:bg-gray-900 " : "hover:bg-gray-800 bg-gray-900 "} "ml-2 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"`}>{names}</button>
                        )
                    })}
                </div>

                {selectedCate === "Gaming" && <>

                    <div className="ml-5 flex">
                        <div className="flex mainBanner relative">
                            <img src={banner?.mainBanner?.Thumbnail} onClick={() => Navigate('/FullVideo?videoId=' + banner?.mainBanner?._id)} style={{ width: "50%", cursor: "pointer" }} alt="" />
                            <div className="ml-2">
                                <div className="flex">
                                    <img onClick={() => Navigate('/FullVideo?videoId=' + banner?.subBanners[0]?._id)} src={banner?.subBanners[0]?.Thumbnail} className='cursor-pointer' style={{ width: "50%" }} alt="" />
                                    <img onClick={() => Navigate('/FullVideo?videoId=' + banner?.subBanners[1]?._id)} src={banner?.subBanners[1]?.Thumbnail} className='ml-2 cursor-pointer' style={{ width: "47%" }} alt="" />
                                </div>
                                <div className="flex mt-3">
                                    <img onClick={() => Navigate('/FullVideo?videoId=' + banner?.subBanners[2]?._id)} src={banner?.subBanners[2]?.Thumbnail} className='cursor-pointer' style={{ width: "50%" }} alt="" />
                                    <img onClick={() => Navigate('/FullVideo?videoId=' + banner?.subBanners[3]?._id)} src={banner?.subBanners[3]?.Thumbnail} className='ml-2 cursor-pointer' style={{ width: "47%" }} alt="" />
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

                </>}

                {selectedCate === "Educational" && <Section Cate='Educational' />}

            </> </Content>
        </>
    )
}

export default React.memo(Home)


function Section({ Cate }: { Cate: string }) {

    const [videos, setVideos] = useState<videoInterface[]>([])
    const Navigate = useNavigate()

    useEffect(() => {
        getAllVideos(false, Cate).then((data) => {
            setVideos(data)
        })
    }, [])

    return (<>
        <div className="ml-5 mt-4">
            <h2 className="text-lg font-bold">TRENDING {Cate.toUpperCase()} VIDEOS</h2>
            <div className="flex flex-wrap mt-1">
                {videos && videos.map((item, idx) => {
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
    </>)
}