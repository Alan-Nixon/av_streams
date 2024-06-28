import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import React, { useEffect, useState } from 'react'
import { BannerInterfaceHome, categoryInterface, postInterface, videoInterface } from '../../../../Functions/interfaces'
import { getCommentByCate } from '../../../../Functions/streamFunctions/commentManagement'
import { getAllPosts, getAllVideos } from '../../../../Functions/streamFunctions/streamManagement'
import { joinCommentWithpost } from '../../../../Functions/commonFunctions'
import { useUser } from '../../../../UserContext'
import { ModalPremium, ShowPosts } from '../helpers/HelperComponents'
import { useNavigate } from 'react-router-dom'
import { getCategory } from '../../../../Functions/streamFunctions/adminStreamFunction'
import { isPremiumUser } from '../../../../Functions/userFunctions/userManagement'
import { toast } from 'react-toastify'

function Home() {
    const [banner, setBanner] = useState<BannerInterfaceHome | null>(null)
    const [cateName, setCateName] = useState<string[]>([])
    const [selectedCate, setSelectedCate] = useState<string>("")
    const [trending, setTrending] = useState<videoInterface[]>([])
    const [posts, setPosts] = useState<postInterface[]>([])
    const [visible, setVisible] = useState(false)
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
                mainBanner: videos[2],
                subBanners: videos.slice(0, 4)
            }
            setBanner(Banners)
        })

    }, [])

    const redirect = (link: string, isPremium: boolean) => {
        if (user && user?._id) {
            if (isPremium) {
                isPremiumUser(user._id).then(({ status }) => {
                    if (status) {
                        Navigate(link)
                    } else {
                        setVisible(true)
                    }
                })
            } else {
                Navigate(link)
            }
        } else {
            toast.info("Please login to watch premium videos")
        }
    }

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
            <Content>
                <>

                    <div className="">
                        <ModalPremium visible={visible} setVisible={setVisible} />
                    </div>
                    <div className="flex m-4 ml-8">
                        {cateName.map((names, idx) => {
                            return (
                                <button key={idx} onClick={() => setSelectedCate(names)} type="button" className={`${selectedCate === names ? "bg-gray-800 hover:bg-gray-900 " : "hover:bg-gray-800 bg-gray-900 "} "ml-2 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"`}>{names}</button>
                            )
                        })}
                    </div>

                    {selectedCate === "Gaming" && <>

                        <div className="flex flex-wrap md:flex-nowrap ml-3">
                            <div className="w-full md:w-1/2 m-2 ">
                                <img
                                    src={banner?.mainBanner?.Thumbnail}
                                    onClick={() => redirect('/FullVideo?videoId=' + banner?.mainBanner?._id, Boolean(banner?.mainBanner?.Premium))}
                                    style={{ width: '100%', height:"100%", cursor: 'pointer' }}
                                    alt="Main Banner"
                                />
                            </div>
                            <div className="w-full md:w-1/2 m-2">
                                <div className="flex flex-wrap md:flex-wrap lg:flex-wrap">

                                    <div className="flex sm:w-1/2 md:w-full lg:1/2">
                                        <div className="w-full">
                                            <img
                                                onClick={() => redirect('/FullVideo?videoId=' + banner?.subBanners[0]?._id, Boolean(banner?.subBanners[0]?.Premium))}
                                                src={banner?.subBanners[0]?.Thumbnail}
                                                style={{ width: '100%', cursor: "pointer" }}
                                                alt="Sub Banner 1"
                                            />
                                        </div>
                                        <div className="w-full pl-1">
                                            <img
                                                onClick={() => redirect('/FullVideo?videoId=' + banner?.subBanners[1]?._id, Boolean(banner?.subBanners[1]?.Premium))}
                                                src={banner?.subBanners[1]?.Thumbnail}
                                                style={{ width: '100%', cursor: "pointer" }}
                                                alt="Sub Banner 2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex pt-1 sm:w-1/2 md:w-full lg:1/2">
                                        <div className="w-full">
                                            <img
                                                onClick={() => redirect('/FullVideo?videoId=' + banner?.subBanners[2]?._id, Boolean(banner?.subBanners[2]?.Premium))}
                                                src={banner?.subBanners[2]?.Thumbnail}
                                                style={{ width: '100%', cursor: "pointer" }}
                                                alt="Sub Banner 3"
                                            />
                                        </div>
                                        <div className="w-full pl-1">
                                            <img
                                                onClick={() => redirect('/FullVideo?videoId=' + banner?.subBanners[3]?._id, Boolean(banner?.subBanners[3]?.Premium))}
                                                src={banner?.subBanners[3]?.Thumbnail}
                                                style={{ width: '100%', cursor: "pointer" }}
                                                alt="Sub Banner 4"
                                            />
                                        </div>
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
                                        <div key={idx} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} onClick={() => redirect('/FullVideo?videoId=' + item._id, item.Premium)} className="ml-3 mt-3 cursor-pointer hover:bg-gray-900 rounded-lg shadow">
                                            <img className="rounded-t-lg w-full" src={item.Thumbnail} alt="" />
                                            <div className="p-5">
                                                <h5 className="mb-2 text-xl font-bold tracking-tight text-white">{item.Title}</h5>
                                                <p className="mb-3 font-normal text-gray-400">{item.Description}</p>
                                                {item.Premium && <p className="text-yellow-700 font-bold">Premium</p>}
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

                </>
            </Content>
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