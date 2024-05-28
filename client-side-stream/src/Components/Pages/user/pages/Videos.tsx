import React, { useEffect, useState } from 'react'
import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import { ModalInterfaceStateSetState, carouselInterface, videoInterface } from '../../../../Functions/interfaces'
import { useNavigate } from 'react-router-dom'
import { isPremiumUser } from '../../../../Functions/userFunctions/userManagement'
import { useUser } from '../../../../UserContext'
import { getBannerByLocation } from '../../../../Functions/userFunctions/adminManagement'
import { getPremiumVideos } from '../../../../Functions/streamFunctions/streamManagement'



function Videos() {
    const [premiumVideos, setPremiumVideos] = useState<videoInterface[] | []>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [currentCarousel, setCurrentCarousel] = useState<number>(0)
    const [carousel, setCarousel] = useState<carouselInterface[]>([])
    const { user } = useUser()
    const Navigate = useNavigate()


    useEffect(() => {
        getBannerByLocation('videos').then(({ data }) => {
            setCarousel(data)
        })


        getPremiumVideos().then(({ data }) => {
            setPremiumVideos(data);
        })
    }, [])

    useEffect(() => {
        const crInterval = setTimeout(() => setCurrentCarousel(currentCarousel === carousel.length - 1 ? 0 : currentCarousel + 1), 4000)
        return () => clearTimeout(crInterval)
    }, [currentCarousel])

    const showPremiumIfNot = (videoId: string) => {
        isPremiumUser(user?._id || "").then(res => {
            if (!res.status)
                setVisible(true)
            else
                Navigate('/FullVideo?videoId=' + videoId)
        })
    }



    const switchCarousel = (next: boolean) => {
        if (next) {
            setCurrentCarousel(currentCarousel + 1 === carousel.length ? 0 : currentCarousel + 1)
        } else {
            setCurrentCarousel(currentCarousel === 0 ? carousel.length - 1 : currentCarousel - 1)
        }
    }

    return (
        <>
            <NavBar />
            <SideBar />
            <Content>
                <div className="">
                    <Modal visible={visible} setVisible={setVisible} />
                </div>

                <div className="m-3">
                    <div id="default-carousel" className="relative" data-carousel="slide">
                        <div className="relative overflow-hidden rounded-lg" style={{ height: "500px" }}>
                            {carousel.map((item, idx) => {
                                return (<div key={idx} className={`${currentCarousel === idx ? "" : 'hidden'} duration-700 ease-in-out`} data-carousel-item>
                                    <img src={item.imgUrl} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                                </div>)
                            })}
                        </div>
                        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                            <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
                            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
                        </div>
                        <button type="button" onClick={() => switchCarousel(false)} className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                </svg>
                                <span className="sr-only">Previous</span>
                            </span>
                        </button>
                        <button type="button" onClick={() => switchCarousel(true)} className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <span className="sr-only">Next</span>
                            </span>
                        </button>
                    </div>
                </div>


                <div className="m-3">
                    <h1 className="text-xl font-bold">Premium Version</h1>
                </div>
                <div className="m-3 flex flex-wrap">
                    {premiumVideos.length !== 0 && premiumVideos.map((item, index) => {
                        return (
                            <div key={index} onClick={() => showPremiumIfNot(item._id)} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} className="ml-3 mt-3 hover:bg-gray-900 cursor-pointer rounded-lg shadow">
                                <p>
                                    <img className="rounded-t-lg w-full" src={item.Thumbnail} alt="" />
                                </p>
                                <div className="p-5">
                                    <p> <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.Title}</h5></p>
                                    <p className="text-yellow-700 font-bold">Premium</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Content>
        </>
    )
}



function Modal({ visible, setVisible }: ModalInterfaceStateSetState) {
    const Navigate = useNavigate()
    return (
        <div className="centered-container">
            <div id="default-modal" tabIndex={-1} aria-hidden="true" style={{ marginLeft: "25%", marginTop: "7%", position: "fixed" }} className={`${!visible && "hidden"} fixed overflow-y-auto overflow-x-hidden  z-50  w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                <div className=" p-4 w-full max-w-2xl max-h-full">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Terms of Subscription
                            </h3>
                            <button type="button" onClick={() => setVisible(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                At av streams, we offer three types of subscriptions tailored to meet your streaming needs: weekly, monthly, and yearly. With each subscription, you gain access to a premium streaming experience, free from interruptions by advertisements.
                            </p>
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                For your convenience, all subscriptions come with auto-renewal enabled. Once activated, your subscription will automatically renew at the end of its duration using the funds available in your wallet. This ensures uninterrupted access to premium content without the hassle of manual renewal. This can be disable in your profile
                            </p>
                        </div>

                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <div className="" style={{ float: "right" }}>
                                <button data-modal-hide="default-modal" type="button" onClick={() => Navigate('/subscription')} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button data-modal-hide="default-modal" type="button" onClick={() => setVisible(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default React.memo(Videos)