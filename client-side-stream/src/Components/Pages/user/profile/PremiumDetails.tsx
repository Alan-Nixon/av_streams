import React, { useEffect, useState } from 'react'
import { useUser } from '../../../../UserContext'
import { getSubscriptionDetails, isPremiumUser } from '../../../../Functions/userFunctions/userManagement'
import Subscription from '../pages/Subscription'
import { SubscriptionInterfaceDataSuccess } from '../../../../Functions/interfaces'
import { FlowMessageShower, toastFunction } from '../../../messageShowers/ToastFunction'
import { toast } from 'react-hot-toast'
import { cancelSubscription } from '../../../../Functions/userFunctions/adminManagement'
import { useNavigate } from 'react-router-dom'

function PremiumDetails() {
    const [isPrem, setIsprem] = useState(false)
    const [loading, setLoading] = useState(true)
    const [subscription, setSubscription] = useState<SubscriptionInterfaceDataSuccess>()
    const { user } = useUser();
    const navigate = useNavigate()

    useEffect(() => {
        if (user && user?._id) {
            isPremiumUser(user._id).then(({ status }) => {
                setIsprem(status)
            })
            getSubscriptionDetails(user?._id).then(({ data }) => {
                console.log(data);
                setSubscription(data.subscription);
                setLoading(false)
            })

        }
    }, [])


    if (loading) { return (<div className="lds-dual-ring" />) }

    const weeklyFeatures = [
        {
            text: "Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.",
            color: "green"
        }, {
            text: "Medium-quality video uploads: As a streamer, you can upload videos in medium resolution to showcase your content at its best",
            color: "green"
        }, {
            text: "Upload upto 10 medium quality videos",
            color: "green"
        }, {
            text: "Access to all premium videos",
            color: "green"
        }, {
            text: "720p quality upload",
            color: "green"
        }, {
            text: "No Auto Renewal",
            color: "red"
        }, {
            text: "No 4k Resolution upload",
            color: "red"
        }, {
            text: "Apply tax charges",
            color: "red"
        }
    ]

    const monthlyFeatures = [
        {
            text: "Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.",
            color: "green"
        }, {
            text: "Medium-quality video uploads: As a streamer, you can upload videos in high resolution to showcase your content at its best",
            color: "green"
        }, {
            text: "Upload upto 30 medium quality videos",
            color: "green"
        }, {
            text: "Access to all premium videos",
            color: "green"
        }, {
            text: "2K quality upload",
            color: "green"
        }, {
            text: "Auto Renewal",
            color: "green"
        }, {
            text: "No 4k Resolution upload",
            color: "red"
        }, {
            text: "Apply tax charges",
            color: "red"
        }
    ]

    const yearlyFeatures = [
        {
            text: "Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.",
            color: "green"
        }, {
            text: "Medium-quality video uploads: As a streamer, you can upload videos in high resolution to showcase your content at its best",
            color: "green"
        }, {
            text: "Unlimited uploads high quality videos",
            color: "green"
        }, {
            text: "Access to all premium videos",
            color: "green"
        }, {
            text: "2K quality upload",
            color: "green"
        }, {
            text: "Auto Renewal",
            color: "green"
        }, {
            text: "4k Resolution upload",
            color: "green"
        }, {
            text: "Apply tax charges",
            color: "green"
        }
    ]

    const removeSubscription = () => {
        toast.custom((t) => (
            <FlowMessageShower heading={"Cancel subscription"} text={"Are you sure want to cancel the subscription ?"} closeState={() => {
                toast.dismiss(t.id)
            }} onSuccess={() => {
                if (subscription) {
                    cancelSubscription(subscription).then(() => {
                        window.location.href = '/profile'
                    })
                }
            }} />
        ))
    }


    return (<>


        <div>

            {isPrem ? <>
                <div className="ml-16 mt-5 mr-16 flex">

                    <div className="mx-auto w-full">
                        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{subscription?.section}</h5>
                                <div className="ml-auto">
                                    <button onClick={removeSubscription} type="button" className="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Cancel Subscription</button>
                                </div>
                            </div>

                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Duration: <span className="font-extrabold text-red-200 text-lg">{
                                subscription?.section[0].toLowerCase() === "y" ?
                                    365 : subscription?.section[0].toLowerCase() === "m" ? 28 : 7
                            }</span> days from the date of activation</p>
                            <p className="mb-3 font-bold text-lg text-gray-700 dark:text-gray-400">Features</p>
                            <Features data={subscription?.section[0].toLowerCase() === "y" ? yearlyFeatures : subscription?.section[0].toLowerCase() === "m" ? monthlyFeatures : weeklyFeatures} />
                        </div>
                    </div>
                </div>
            </> : <>
                <div className="ml-5 flex">
                    <div className="mx-auto">
                        <Subscription showSideBar={false} />
                    </div>
                </div>
            </>}
        </div>
    </>)
}

export default React.memo(PremiumDetails)

function Features({ data }: any) {
    return (
        <>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "15px", height: "10px", backgroundColor: data[0].color }} /><span className='ml-2'>{data[0].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "25px", height: "10px", backgroundColor: data[1].color }} /><span className='ml-2'>{data[1].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[2].color }} /><span className='ml-2'>{data[2].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[3].color }} /><span className='ml-2'>{data[3].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[4].color }} /><span className='ml-2'>{data[4].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[5].color }} /><span className='ml-2'>{data[5].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[6].color }} /><span className='ml-2'>{data[6].text}</span></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: data[7].color }} /><span className='ml-2'>{data[7].text}Apply tax charges</span></p>
        </>)
}


