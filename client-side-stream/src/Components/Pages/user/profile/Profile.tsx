import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../../../UserContext'
import NavBar from '../layout/NavBar'
import { changeChannelName, changeProfileData, changeProfileImage, isPremiumUser } from '../../../../Functions/userFunctions/userManagement';
import { Data, changeEvent, responseIntefraceImage } from '../../../../Functions/interfaces';

import Mystreams from './Mystreams';
import MyVideos from './Myvideos';
import MyPosts from './MyPosts';
import WalletSection from './Wallet';
import Followers from '../pages/Followers';
import WatchHistory from './WatchHistory';
import { toast } from 'react-toastify';


function Profile() {
    const { user } = useUser()

    const sec = localStorage.getItem('section') || 'Profile'
    const [section, setSection] = useState(sec)
    const [channelName, setChannelName] = useState("")
    const [isPremium, setIsPremium] = useState(false)
    const [nameErr, setNameErr] = useState("")

    const saveChannelName = async () => {
        const result = await changeChannelName(channelName)
        console.log(result);
        if (!result.status) {
            setNameErr(result.message);
            setTimeout(() => {
                setNameErr("");
                setChannelName(user?.channelName || "")
            }, 2500)
        }
    }

    useEffect(() => {
        if (user && user?._id) {
            isPremiumUser(user?._id).then(({ status }) => setIsPremium(status))
        }
    }, [user])


    // profile 

    return (
        <>
            <NavBar />

            <div className='completeProfileParentDiv' >
                <p className='text-2xl font-bold uppercase flex' style={{ color: isPremium ? "yellow" : "", marginLeft: "8%", marginTop: "7%" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={25} style={{ cursor: "pointer" }} onClick={() => window.location.href = '/'} >
                        <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>&nbsp;&nbsp;
                    Hi, <input type="text" onChange={(e) => setChannelName(e.target.value)} style={{ backgroundColor: "transparent", marginLeft: "1%", width: `${user?.channelName ? user?.channelName.length * 13 + "px" : "100px"}` }} defaultValue={user?.channelName} />
                    {(channelName !== "" && user?.channelName !== channelName) && <svg onClick={() => saveChannelName()} style={{ marginLeft: "0.5%", color: "white", cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15">
                        <path fill="white" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                    </svg>}
                    {isPremium && <p className='text-xs ml-1 mt-2'>you are premium user</p>}
                </p>
                <p className='error' style={{ marginLeft: "12%" }}>{nameErr}</p>
                <div className="headingsProfileSection block" style={{ marginTop: "2%", marginLeft: "5%" }}>
                    {["Profile", "Wallet", "Watch History", "Followers", "My streams", "My Videos", "My Posts"].map((item) => (
                        <span key={item} className={`profileHeadings font-bold text-xl ml-20 ${section === item ? "text-blue-500" : ""}`} onClick={() => {
                            localStorage.setItem('section', item || "Profile")
                            setSection(item);
                        }} >
                            <strong>{item}</strong>
                        </span>
                    ))}
                </div>

                {section === "Profile" && <ProfileSection />}
                {section === "Wallet" && <WalletSection />}
                {section === "Watch History" && <WatchHistory />}
                <div className="flex ml-8 mt-6 ">
                    {section === "Followers" && <Followers />}
                    {section === "My streams" && <Mystreams />}
                    {section === "My Videos" && <MyVideos />}
                    {section === "My Posts" && <MyPosts />}
                </div >
            </div >
        </>
    )
}

const ProfileSection = () => {
    const { user, setUserData } = useUser()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState({ userId: user?._id, userName: user?.userName, FullName: user?.FullName, Phone: user?.Phone.toString() })
    const [error, setError] = useState({ userNameErr: "", FullNameErr: "", PhoneErr: "" })
    const [imageData, setImageData] = useState<FileList | null>(null);
    const [imgUrl, setImgUrl] = useState(user?.profileImage)
    const [success, setSuccess] = useState("")

    useEffect(() => {
        setImgUrl(user?.profileImage)
    }, [user])


    const userNameRegex = /^[a-zA-Z0-9]+$/;
    const fullNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    const phoneRegex = /^[1-9][0-9]*$/

    const changeImage = () => {
        if (imageData) {
            console.log(Array.from(imageData)[0]);
            changeProfileImage(Array.from(imageData)[0]).then((result: responseIntefraceImage) => {
                if (result.status) {
                   toast.success("Image succussfuly changed")
                        setImageData(null)
                        if (user) {
                            const updatedUserData: Data = {
                                ...user,
                                userName: user.userName ? user.userName : "",
                                profileImage: result.url,
                            };
                            setUserData(updatedUserData);
                        }
                } else {
                   toast.error("failed to change profile image")
                }
            })
        }
    }
    const setImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageData(e.target.files)
        if (e.target.files && e.target.files[0] instanceof File) {
            setImgUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    function validateData() {
        if (profileData?.userName && userNameRegex.test(profileData?.userName.trim())) {
            if (profileData?.FullName && fullNameRegex.test(profileData?.FullName.trim())) {
                if (profileData?.Phone && phoneRegex.test(profileData?.Phone.trim())) {
                    return true
                } else {
                    setError((rest) => ({ ...rest, PhoneErr: "Enter a valid phone number" }))
                    return false
                }
            } else {
                setError((rest) => ({ ...rest, FullNameErr: "Enter a valid full name" }))
                return false
            }
        } else {
            setError((rest) => ({ ...rest, userNameErr: "Enter a valid user name" }))
            return false
        }
    }

    const handleSubmit = () => {
        if (validateData()) {
            setSuccess("user details changed successfull")
            setTimeout(() => setSuccess(""), 2500)
            changeProfileData(profileData)
        }
    }

    const setData = (e: changeEvent) => {
        setProfileData((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError((rest) => ({ ...rest, [e.target.name + "Err"]: "" }))
    }

    return (<>
        <div className="profileImageEditParentDiv">
            <div className='profileImageResponsive'>
                <img src={imgUrl} className="rounded-full" style={{ width: '450px', height: "450px" }} alt="" />
            </div>
            <div className="afterResponsiveProfileChangeIcon">
                <input className='hidden' onChange={setImage} ref={fileInputRef} type="file" accept='image/*' />
                <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.click() } }} style={{ marginLeft: "16%" }} className="mt-5 flex  items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="flex px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Change profile
                    </span>
                </button>
                {imageData && <button onClick={changeImage} className=" relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Save
                    </span>
                </button>}
            </div>
            <div className="profileEditResponsive w-100">
                <p className="success">{success}</p>
                {error && (<><p className="error">{`${error.userNameErr} ${error.PhoneErr} ${error.FullNameErr}`}</p><br /></>)}


                <form>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                            <input type="text" name='userName' onChange={setData} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" defaultValue={user?.userName} required />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
                            <input type="text" id="FullName" name='FullName' onChange={setData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" defaultValue={user?.FullName} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                        <input type="tel" id="Phone" name='Phone' onChange={setData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1234567890" defaultValue={user?.Phone} pattern="[1-9]{1}[0-9]{8}" required />
                    </div><br />

                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                        <input type="email" onChange={() => { }} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={user?.Email} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" id="password" onChange={() => { }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your password" value="********" required />
                    </div>


                    <button type="button" onClick={handleSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>

            </div>
        </div>
        <div className="beforeResponsiveProfileChangeIcon ">
            <input className='hidden' onChange={setImage} ref={fileInputRef} type="file" accept='image/*' />
            <div className="flex">
                <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.click() } }} style={{ marginLeft: "16%" }} className="mt-5 flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="flex px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Change profile
                    </span>
                </button>
                <div className="mt-5">

                    {imageData && <button onClick={changeImage} className="p-0.5  items-center justify-center   overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="flex px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Save
                        </span>
                    </button>}
                </div>
            </div>
        </div>

    </>)
}



export default React.memo(Profile)

