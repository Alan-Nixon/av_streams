import React, { useEffect, useState } from 'react'
import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import { WalletDetails, subscriptionInterface } from '../../../../Functions/interfaces'
import { getWalletDetails, isPremiumUser, subscribeToPremium } from '../../../../Functions/userFunctions/userManagement'
import Alert from '@mui/material/Alert';
import { useUser } from '../../../../UserContext'
import Swal from 'sweetalert2'
import RazorpayPayment from '../../paymentIntegrations/Razorpay';
import Paypal from '../../paymentIntegrations/Paypal'
import { getDate } from '../../../../Functions/commonFunctions'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Subscription({ showSideBar }: { showSideBar: boolean }) {
    const [subscription, setSubscription] = useState<subscriptionInterface>({ section: "", price: -1 })
    const [wallet, setWallet] = useState<WalletDetails>()
    const [error, setError] = useState("")
    const { user } = useUser()
    const Navigate = useNavigate()

    useEffect(() => {
        if (user && user?._id) {
            getWalletDetails(user._id).then(response => setWallet(response.Data))
            isPremiumUser(user._id).then((response) => {
                if (response.status)
                    Navigate('/')
            })
        }
    }, [user])

    const payWithWallet = () => {
        if (wallet && wallet?.Balance < subscription.price) {
            setError("You don't have enough balance in your wallet")
            window.scrollTo(0, 0);
        } else {
            Swal.fire({
                title: "Are you sure pay with wallet ? ",
                text: `You have ${wallet?.Balance} balance, ${subscription.price} will be deducted from your wallet`,
                showConfirmButton: true,
                showCancelButton: true,
                icon: "info"
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    const days = subscription.section === "Yearly Subscription" ? 365 : subscription.section === "Monthly Subscription" ? 28 : 7
                    const date = getDate(days, "")
                    if (user && user.Email && user?._id) {
                        subscribeToPremium({
                            expires: date,
                            userId: user._id,
                            email: user.Email,
                            amount: subscription.price,
                            paymentId: 'wallet_transacion_' + Date.now(),
                            section: subscription.section
                        })
                        setWallet(prevWallet => {
                            if (!prevWallet)
                                return prevWallet;
                            return {
                                ...prevWallet,
                                Balance: prevWallet.Balance - subscription.price
                            }
                        });
                        deductMoneyFromWallet(user?._id, subscription.price)
                    }
                }
            })
        }
    }

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    const successPayment = (response: any) => {
        const days = subscription.section === "Yearly Subscription" ? 365 : subscription.section === "Monthly Subscription" ? 28 : 7
        const date = getDate(days, "")
        if (user && user.Email && user?._id) {
            subscribeToPremium({
                expires: date,
                userId: user._id,
                email: user.Email,
                amount: subscription.price,
                paymentId: response.razorpay_payment_id || 'paypal_transacion_' + Date.now(),
                section: subscription.section
            })
            toast.success("Payment successfull")
            setTimeout(() => Navigate('/profile'), 3000)
        } 
    }

    const errorPayment = (error: any) => {
        toast.error("error occured in payment ")
    }

    return (<>
        <NavBar />
        {showSideBar ? <>
            <SideBar />
            <Content>
                <Subs />
            </Content>
        </> : <>
            <Subs />
        </>}
    </>)

    function Subs() {
        return (<>
            {error && <Alert severity="error" onClose={() => setError("")} style={{ margin: "1%" }}>{error}</Alert>}
            <div className="m-5">
                <h1 className="text-xl font-bold">SUBSCRIPTION</h1>
                <div className="flex">
                    <div className="max-w-sm mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Weekly Subscription</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Duration: <span className="font-extrabold text-red-200 text-lg">7</span> days from the date of activation</p>
                        <p className="mb-3 font-bold text-lg text-gray-700 dark:text-gray-400">Features</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "15px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "25px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Medium-quality video uploads: As a streamer, you can upload videos in medium resolution to showcase your content at its best</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Upload upto 10 medium quality videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Access to all premium videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>720p quality upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "red" }} /><span className='ml-2'>No Auto Renewal</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "red" }} /><span className='ml-2'>No 4k Resolution upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "red" }} /><span className='ml-2'>Apply tax charges</span></p>
                        <div className="flex text-green-600">
                            <p className="text-lg font-extrabold">199<span className=''> Rupees</span></p>
                            <p onClick={() => {
                                setSubscription({
                                    section: "Weekly Subscription",
                                    price: 199
                                }); setTimeout(() => scrollToBottom(), 0)
                            }} className="inline-flex px-3 ml-auto py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Subscribe Now</p>
                        </div>
                    </div>

                    <div className="max-w-sm ml-1 mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Monthly Subscription</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Duration: <span className="font-extrabold text-red-200 text-lg">28</span> days from the date of activation</p>
                        <p className="mb-3 font-bold text-lg text-gray-700 dark:text-gray-400">Features</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "15px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "25px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Medium-quality video uploads: As a streamer, you can upload videos in high resolution to showcase your content at its best</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Upload upto 30 medium quality videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Access to all premium videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>2K quality upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Auto Renewal</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "red" }} /><span className='ml-2'>No 4k Resolution upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "red" }} /><span className='ml-2'>Apply tax charges</span></p>
                        <div className="flex text-green-600">
                            <p className="text-lg font-extrabold">499<span className=''> Rupees</span></p>
                            <p onClick={() => {
                                setSubscription({
                                    section: "Monthly Subscription",
                                    price: 499
                                }); setTimeout(() => scrollToBottom(), 0)
                            }} className="inline-flex px-3 ml-auto py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Subscribe Now</p>
                        </div>
                    </div>

                    <div className="max-w-sm ml-1 mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Yearly Subscription</h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Duration <span className="font-extrabold text-red-200 text-lg">365</span> days from the date of activation</p>
                        <p className="mb-3 font-bold text-lg text-gray-700 dark:text-gray-400">Features</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "15px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Ad-free streaming: Enjoy uninterrupted viewing without any advertisements.</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "25px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Medium-quality video uploads: As a streamer, you can upload videos in high resolution to showcase your content at its best</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Unlimited uploads high quality videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Access to all premium videos</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>2K quality upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Auto Renewal</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'> 4k Resolution upload</span></p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex"><div className='mt-2 rounded' style={{ width: "10px", height: "10px", backgroundColor: "green" }} /><span className='ml-2'>Apply tax charges</span></p>
                        <div className="flex text-green-600">
                            <p className="text-lg font-extrabold">2520<span className=''> Rupees</span></p>
                            <p onClick={() => {
                                setSubscription({
                                    section: "Yearly Subscription",
                                    price: 2520
                                }); setTimeout(() => scrollToBottom(), 0)
                            }} className="inline-flex px-3 ml-auto py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Subscribe Now</p>
                        </div>
                    </div>
                </div>
                <div className="item-center w-[100%]">

                    {subscription && subscription.section && <div className="max-w-full p-6 mt-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex">
                            <button type="button" onClick={() => setSubscription(rest => ({ ...rest, section: "" }))} className="text-gray-400 ml-auto bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <h5 className="mb-2 ml-[10%] mx-auto text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{subscription.section}</h5>
                        <div className="flex ml-[10%]">
                            <div className="" style={{ width: "40%" }}>
                                <RazorpayPayment Data={{ Amount: subscription.price, successPayment, errorPayment }} />
                                <Paypal Data={{ Amount: subscription.price, successPayment, errorPayment }} />
                            </div>
                            <div className="ml-5">
                                <div className="flex"><p className="mt-1">Subscription Amount : </p> <p className="mb-2 ml-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{subscription.price}</p></div>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Wallet Balance : {wallet?.Balance}</p>
                                <p onClick={payWithWallet} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Pay with wallet</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </>)
    }
}

export default React.memo(Subscription)
