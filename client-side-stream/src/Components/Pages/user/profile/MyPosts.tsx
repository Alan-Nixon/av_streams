import { useEffect, useState } from 'react'
import { changeEvent, postInterface, postInterfaceUpload } from '../../../../Functions/interfaces'
import Comment from '../helpers/Comment';
import Swal from 'sweetalert2'
import { deletePostFromCloudinary, getAllpostOfUser, uploadPost } from '../../../../Functions/streamFunctions/streamManagement'
import { useUser } from '../../../../UserContext';
import { getCommentByCate } from '../../../../Functions/streamFunctions/commentManagement';
import { joinCommentWithpost, likePostHome, numTokandM } from '../../../../Functions/commonFunctions';
import { toast } from 'react-toastify';

function MyPosts() {
    const { user } = useUser()
    const [progress, setProgress] = useState(-1)
    const [myPost, setMyPost] = useState<postInterface[]>([])
    const [postData, setPostData] = useState<postInterfaceUpload>({ Title: "", Description: "", PostImage: null })
    const [error, setError] = useState<string>("")
    const [imageName, setImageName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [imageUrl, setImgUrl] = useState("")

    useEffect(() => {
        (async () => {
            const posts: postInterface[] = (await getAllpostOfUser()).data
            const { data } = await getCommentByCate('post')
            const res = joinCommentWithpost(posts, data, user?._id || "")
            posts.forEach(element => element.profileLink = user?.profileImage || "")
            setMyPost(res); setLoading(false);

        })()
    }, [user])

    const savePost = (e: changeEvent) => {
        if (e.target && e.target.files) {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                setPostData((prevData) => ({ ...prevData, PostImage: selectedFile }));
                setImageName(selectedFile.name); setImgUrl(URL.createObjectURL(selectedFile))
            } else {
                console.log("No file selected");
            }
        }
    };


    const saveText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
        setPostData((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError("")
    }



    const uploadPostValidation = () => {
        if (postData.Title !== "") {
            if (postData.Title.length > 3) {
                if (postData.Description.length > 3) {
                    if (postData.PostImage) {
                        uploadPost(postData, setProgress).then((result) => {
                            toast.success("successfully uploaded the post")
                            Swal.fire({
                                title: result.status ? "successfully uploaded" : "error login!",
                                text: result.message,
                                icon: result.status ? "success" : "error",
                            }).then(() => {
                                if (result.status) {
                                    setMyPost([...myPost, {
                                        _id: "", channelName: user?.channelName || "",
                                        Description: postData.Description,
                                        dislikes: "0", Comments: [], likes: "0", postLink: imageUrl,
                                        profileLink: user?.profileImage || "", Time: new Date().toString(),
                                        Title: postData.Title, userId: user?._id || "",
                                    }])
                                    setPostData({ Title: "", Description: "", PostImage: null })
                                }
                            })
                        })
                    } else {
                        setError("Select an image")
                    }
                } else {
                    setError("Enter a valid description")
                }
            } else {
                setError("Title length should be greater than")
            }
        } else {
            setError("Enter a valid Title ")
        }
    }

    const showPosts = (index: number) => {
        const newData: postInterface[] = myPost.slice();
        newData[index] = { ...newData[index], clicked: !newData[index].clicked };
        setMyPost(newData);
    };

    const deletePost = (index: number, link: string, postId: string) => {
        setMyPost(prev => prev.filter((item, i) => i !== index))
        deletePostFromCloudinary(link, postId)
    }

    const postLike = (postId: string, index: number) => {
        likePostHome(postId);
        const newData: postInterface[] = myPost.slice();
        newData[index] = {
            ...newData[index],
            liked: !newData[index].liked,
            likes: (parseInt(newData[index].likes) + (newData[index].liked ? -1 : 1)).toString()
        };
        setMyPost(newData);
    };


    return (<>
        <div style={{ width: "90%", margin: "auto" }}>
            {progress !== -1 && <div className="progressDiv flex">
                <progress value={progress} style={{ width: "100%", marginTop: "0.5%" }} max="100" />
                <p className="success ml-2 mb-1">{progress.toString() === "100" ? "completed" : progress + "%"}</p>
            </div>}



            <div className="mt-4">
                {error && <p className="error">{error}</p>}
                <form className="max-w-full mt-3 mb-4">
                    <div className="mb-5">
                        <label htmlFor="Title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input name='Title' onChange={saveText} type="Title" id="Title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a title for your post" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea name='Description' onChange={saveText} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your descriptiom here..."></textarea>
                    </div>
                </form>
            </div>


            {imageName && <div className=""><p>Selected Image : {imageName}</p></div>}
            <div className="flex mb-5 mt-3 items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" onChange={savePost} accept="image/*" className="hidden" />
                </label>

            </div>

            <div className="mb-5 flex">
                <div className="ml-auto">
                    <button type="button" onClick={uploadPostValidation} className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload</button>
                </div>
            </div>
            {loading ? <>
                <div className="flex">
                    <div className="smallLoader m-auto"></div>
                </div>
            </> : <>
                {myPost && myPost.map((data, index) => (
                    <div className='mt-1 ease-out' key={index}>
                        <div className="flex">
                            <ul role="list" className="max-w-sm divide-y divide-gray-200 dark:divide-gray-700">
                                <li className="sm:py-1">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="flex-shrink-0">
                                            <img className="w-8 h-8 rounded-full" src={data.profileLink} alt="Neil image" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-md font-semibold text-gray-900 truncate dark:text-white">
                                                {data.channelName}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="ml-auto mt-1 mr-3">
                                <button onClick={() => deletePost(index, data.postLink, data._id)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                    <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Delete Post
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="ml-8">
                            <p>{data.Title}</p>
                            <p className="text-xs" style={{ maxWidth: "95%" }}>{data.Description}</p>
                            <img src={data.postLink} style={{ width: "98%" }} className='mt-5' alt='post not found' />
                        </div>
                        <div className="flex ml-9 mt-3">
                            {data.liked ?
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => postLike(data._id, index)} style={{ cursor: "pointer" }} width={20} fill='#fff' viewBox="0 0 512 512">
                                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                </svg>
                                : <svg onClick={() => postLike(data._id, index)} xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} viewBox="0 0 512 512" width={20} fill='#fff' >
                                    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                </svg>}<span className="ml-1">{numTokandM(data.likes)}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => showPosts(index)} style={{ cursor: "pointer" }} className='ml-2' width={20} fill='#fff' viewBox="0 0 512 512">
                                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                            </svg><span className="ml-1">{data?.Comments?.length || "0"}</span>
                        </div>
                        {data.clicked && <Comment indexKey={index.toString()} Section='post' LinkId={data._id} CommentsArray={data.Comments} />}
                    </div>
                ))}
            </>
            }

        </div>
    </>)
}

export default MyPosts
