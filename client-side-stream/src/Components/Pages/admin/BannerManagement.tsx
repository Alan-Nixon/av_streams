import React, { useEffect, useRef, useState } from 'react'
import Layout from './Layout'
import { bannerInterface, changeEvent } from '../../../Functions/interfaces'
import { animateScroll as scroll } from 'react-scroll';
import { addBannerImageAdmin, getBannerByLocation, updateBannerImage } from '../../../Functions/userFunctions/adminManagement';
import { toast } from 'react-toastify';
import { toastifyHelperData } from '../../Helpers/helperComponents';


function BannerManagement() {
    const [homeBanner, setHomeBanner] = useState<bannerInterface>({
        _id: "objectID mongo",
        imgUrl: "http://localhost:3000/images/gtaSeaCar.jpeg",
        location: "home"
    })

    const [videosBanner, setVideosBanner] = useState<bannerInterface[]>([])
    const [gtThanTwo, setgtThanTwo] = useState(false);
    const [currentimage, setCurrentImage] = useState<File | null>(null)
    const [updateBannerId, setUpdateBannerId] = useState("")
    const addBannerRef = useRef<HTMLInputElement | null>(null)
    const updateBannerRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        getBannerByLocation("videos").then(({ data }) => setVideosBanner(data))
        getBannerByLocation('home').then(({ data }) => setHomeBanner(data[0]))
        setgtThanTwo(videosBanner.length > 2)
    }, [])

    const saveBannerImage = (location: string) => {
        addBannerImageAdmin({
            imageData: currentimage, location
        }).then(() => {
            toast.success("Successfully Uploaded", { ...toastifyHelperData, position: "top-right" });
        })
    }

    const updateBanner = (e: changeEvent) => {
        if (e.target.files) {
            updateBannerImage(e.target.files[0], updateBannerId).then(({ data }) => {
                if (updateBannerId === homeBanner._id) {
                    setHomeBanner(data)
                    toast.success("successfully uploaded the image")
                } else {
                    const newBanners = videosBanner.map((element) => {
                        if (element._id === updateBannerId) {
                            return { ...element, imgUrl: data.imgUrl };
                        }
                        return element;
                    });
                    setVideosBanner(newBanners);
                    toast.success("successfully uploaded the image");
                }
            })
        }
    }

    const deleteBanner = (bannerId: string) => {

    }

    const addImage = (e: changeEvent) => {
        if (e.target.files) {
            const bannerImage = e?.target?.files[0]
            console.log(bannerImage);

            setCurrentImage(bannerImage)
            const obj = {
                _id: "",
                imgUrl: URL.createObjectURL(e?.target?.files[0]),
                location: "videos"
            }
            setVideosBanner((prev) => [...prev, obj])
            scroll.scrollToBottom({
                containerId: 'chatContainer',
                duration: 500,
                smooth: 'easeInOutQuart'
            });
        }
    }

    return (
        <>
            <Layout>
                <div className="ml-8 mt-5">
                    <h1 className="text-xl">Banner Management</h1>
                    <div className="mt-8">
                        <span> Home Banners</span>
                        <div className='flex flex-wrap'>
                            <div className="w-[95%]">
                                <img src={homeBanner?.imgUrl} style={{ width: "100%" }} alt="" />
                                <div className="mt-2">
                                    <button type="button" onClick={() => {
                                        setUpdateBannerId(homeBanner._id)
                                        updateBannerRef.current?.click()
                                    }} className="text-white bg-gradient-to-br from-red-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Update Banner</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input className='hidden' accept='image/*' type="file" ref={updateBannerRef}
                        onChange={updateBanner} />
                    <div className="mt-5">
                        <div className="flex">
                            <input className='hidden' onChange={addImage} accept='image/*' type="file" ref={addBannerRef} />
                            {currentimage && <p>{currentimage?.name}</p>}
                            <button onClick={() => { addBannerRef.current?.click() }} type="button" className="ml-auto text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Add Banners</button>
                            {currentimage && <button onClick={() => saveBannerImage("videos")} type="button" className="mr-12 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">Save</button>}
                        </div>
                        <h2 className="text-xl">Video Banner</h2>
                        <div className='flex mt-3 flex-wrap'>
                            {videosBanner.map((item: any, index: number) => {
                                return (
                                    <div key={index} className="w-[250px] ml-5">
                                        <img src={item?.imgUrl} style={{ width: "100%", height: "150px" }} alt="" />
                                        <div className="mt-2">
                                            <button type="button" onClick={() => {
                                                setUpdateBannerId(item._id)
                                                updateBannerRef.current?.click()
                                            }} className="text-white bg-gradient-to-br from-red-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Update Banner</button>
                                            {gtThanTwo && <button onClick={() => deleteBanner(item._id)} type="button" className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Remove</button>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default React.memo(BannerManagement)
