import React, { useEffect, useState } from 'react'
import { changeEvent, videoInterface } from '../../../../Functions/interfaces'
import { Pagination } from '../helpers/HelperComponents'
import { useUser } from '../../../../UserContext'
import { uploadToS3Bucket } from '../../../../Functions/AWS_s3_bucket'
import { getUserVideos, uploadVideo } from '../../../../Functions/streamFunctions/streamManagement'
import { isPremiumUser } from '../../../../Functions/userFunctions/userManagement'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function MyVideos() {
    const [progress, setProgress] = useState<number>(-1)
    const [videos, setVideos] = useState<videoInterface[]>([])
    const [shorts, setShorts] = useState<videoInterface[]>([])
    const [uploadVideoFile, setUploadVideo] = useState<null | File>(null)
    const [Thumbnail, setVideoThumnail] = useState<File>()
    const [pagination, setPagination] = useState<number>(6)
    const [error, setError] = useState("")
    const { user } = useUser();
    const [selectedVideo, setSeletected] = useState("")

    const [videoDetails, setVideoDetails] = useState<videoInterface>({
        _id: "", Title: "", Description: "",
        Link: "", shorts: false, Thumbnail: "",
        userId: user?._id || "", Visiblity: true,
        channelName: user?.channelName || "", Premium: false
    })

    const Navigate = useNavigate()

    useEffect(() => {

        getUserVideos(false).then((result) => {
            setVideos(result)
        })
        getUserVideos(true).then((Shorts) => {
            setShorts(Shorts)
        })

    }, [])


    const uploadVideoValidation = (isShorts: boolean) => {
        if (validation()) {
            if (uploadVideoFile && user && user._id && user.channelName && Thumbnail) {
                uploadToS3Bucket(uploadVideoFile, setProgress).then(async (url) => {
                    const Data: videoInterface = {
                        _id: "", Link: url,
                        userId: user._id || "",
                        Title: videoDetails.Title,
                        Description: videoDetails.Description,
                        shorts: isShorts, Visiblity: true,
                        channelName: user?.channelName || "",
                        Thumbnail: "", Premium: (await isPremiumUser(user._id || "")).status
                    }
                    uploadVideo(Data, Thumbnail).then((res) => {
                        toast.success(res.status ? "successfully uploaded the video" : "error uploading the video")
                        isShorts ? setShorts((rest) => ([...rest, Data])) : setVideos((rest) => ([...rest, Data]))
                        setProgress(-1)
                    })
                })
            }
        } else {
            window.scrollTo(0, 0);
        }
    }

    const saveVideo = (e: changeEvent) => {
        if (e.target.files) {
            setUploadVideo(e.target.files[0])
            setSeletected(e.target.files[0].name)
        }
    }

    const saveText = (e: changeEvent) => {
        setVideoDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError("")
    }

    const validation = () => {
        if (videoDetails.Title.trim() !== "") {
            if (videoDetails.Description.trim() !== "") {
                if (uploadVideoFile) {
                    if (Thumbnail) {
                        return true
                    } else {
                        setError("please select a thumbnail")
                    }
                } else {
                    setError("Please select a video")
                    return false
                }
            } else {
                setError("Enter a valid title")
                return false
            }
        } else {
            setError("Title is required")
            return false
        }
    }

    const saveThumbnail = (e: changeEvent) => {
        const files = e.target?.files;
        if (files && files.length > 0) {
            setVideoThumnail(files[0]);
        }
    }


    const paginationFunc = (next: boolean) => {
        if (next) {

            if (pagination < videos.length) {
                setPagination(pagination + 6)
            }
        } else {
            if (pagination > 6) {
                setPagination(pagination - 6)
            }
        }
        return null
    }

    return (<>
        <div style={{ width: "98%" }}>
            <div style={{ width: "90%", margin: "auto" }}>
                {progress !== -1 && <div className="progressDiv flex">
                    <progress value={progress} style={{ width: "100%", marginTop: "0.5%" }} max="100" />
                    <p className="success ml-2 mb-1">{progress.toString() === "100" ? "completed" : progress + "%"}</p>
                </div>}
                {error && <p className="error">{error}</p>}
                {selectedVideo && <p className='success'>{"selected video : " + selectedVideo}</p>}
                <div className="flex mt-3 items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{selectedVideo ? selectedVideo : "VIDEO MP4 OR ANY OTHER FORMAT (MAX SIZE. 1GB)"}</p>
                        </div>
                        <input id="dropzone-file" type="file" onChange={saveVideo} accept="video/*" className="hidden" />
                    </label>
                </div>

                <div className="mt-4">
                    <form className="max-w-full mt-3 mb-4">
                        <div className="mb-5">
                            <label htmlFor="Title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input type="Title" name='Title' onChange={saveText} id="Title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a title for your video" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea id="message" name='Description' onChange={(e) => setVideoDetails((prev) => ({ ...prev, Description: e.target.value }))} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your descriptiom here..."></textarea>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="Thumbnail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thumbnail</label>
                            <input type="file" onChange={saveThumbnail} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5 flex">
                            <div className="ml-auto">
                                <button type="button" onClick={() => uploadVideoValidation(true)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Upload As Shorts</button>
                                <button type="button" onClick={() => uploadVideoValidation(false)} className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload As Video</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div >

            <div className="mt-5 w-full">
                <div className="flex">

                    <div style={{ width: "70%" }}>
                        <h2 className="text-xl">My Videos</h2>
                        {videos && videos.length !== 0 ? (
                            videos.map((details, index) => (
                                (index < pagination && index >= pagination - 6) && <>
                                    <p key={index} onClick={() => Navigate("/FullVideo?videoId=" + details._id)} style={{ width: "100%" }} className="flex flex-col mt-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row   hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <img style={{ width: "150px" }} className="object-cover w-full rounded-t-lg md:rounded-none md:rounded-s-lg" src={details.Thumbnail} alt={details.Title} />
                                        <div className="flex flex-col m-4 leading-normal">
                                            <h5 className=" text-lg font-bold tracking-tight text-gray-900 dark:text-white">{details.Title}</h5>
                                            <p className="font-normal text-gray-700 dark:text-gray-400">{details.Description}</p>
                                            <p>{details.channelName} <span className='ml-auto'>{"details.Views"} views</span></p>
                                        </div>
                                    </p>
                                </>
                            ))
                        ) : (
                            <p>No videos available</p>
                        )}
                        <br />
                        <div className="">
                            {videos.length !== 0 && < Pagination pagination={pagination} maxCount={6} paginationFunc={paginationFunc} Data={videos} />}
                        </div>
                    </div>


                    <div style={{ width: "50%" }} className='ml-4'>
                        <h2 className="text-xl">My Shorts</h2>
                        <div className="flex flex-wrap">
                            {shorts && shorts.length !== 0 ? (
                                shorts.map((short) => (
                                    <div style={{ maxWidth: "45%" }} className="max-w-xs hover:bg-gray-900 ml-2 mt-3 rounded-lg shadow " >
                                        <p>
                                            <img className="w-full rounded-t-lg" src={short.Thumbnail} alt="" />
                                        </p>
                                        <div className="p-3">
                                            <p>
                                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{short.Title}</h5>
                                            </p>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{short.Description}</p>
                                        </div>
                                    </div >
                                ))
                            ) : (
                                <p>No shorts available</p>
                            )}
                        </div>
                    </div>


                </div>

            </div>
        </div >
    </>)
}

export default React.memo(MyVideos)




