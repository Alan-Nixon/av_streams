import { useEffect, useRef, useState } from 'react'
import { CommentProps, commentInterface } from '../../../../Functions/interfaces'
import { useUser } from '../../../../UserContext'
import { commentLikeWithId, uploadCommentFunc, uploadCommentReplyFunc } from '../../../../Functions/streamFunctions/commentManagement'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


function Comment({ CommentsArray, Section, LinkId, incComm, indexKey }: CommentProps) {

    const [Comments, setComments] = useState<commentInterface[]>(CommentsArray || [])
    const [clickedReply, setClickedReply] = useState<number[]>([])
    const [comment, setComment] = useState<string>("")
    const [reply, setReply] = useState<string>("")
    const [selectEmoji, setSelectEmoji] = useState<boolean>(false)
    const { user } = useUser()


    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setSelectEmoji(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEmojiSelect = (emoji: { native: string; }) => {
        setComment(comment + emoji.native);
    };


    const toggleReply = (index: number) => {
        setClickedReply(clickedReply.includes(index) ?
            (arr => arr.filter(item => item !== index)) :
            [...clickedReply, index]
        )
    }

    const uploadComment = () => {
        if (comment.trim() !== "" && user?._id) {
            let com = {
                _id: "",
                userName: user?.userName,
                Comment: comment,
                Replies: [],
                likedUsers: [],
                LinkId: "",
                isUserLiked: false,
                profileImage: user.profileImage || "",
                Section: "post",
            } as commentInterface
            if (Comments?.length !== 0) {
                setComments([com, ...Comments])
            } else {
                Comments.push(com)
                setComments(Comments)
            }
            setClickedReply(rest => rest.map(item => item + 1))
            setComment("");
            uploadCommentFunc({
                Comment: comment,
                LinkId,
                userId: user._id, Section,
                profileImage: user.profileImage || ""
            })
            if (incComm && indexKey)
                incComm(Number(indexKey), com)
        }
    }

    const uploadReply = (commentId: string) => {
        if (reply !== "" && user) {
            const updatedComments = Comments.map(comment => {
                if (comment._id === commentId) {
                    const updatedReplies = comment.Replies ? [...comment.Replies] : [];
                    return {
                        ...comment,
                        Replies: [...updatedReplies, { userName: user?.userName, Reply: reply }]
                    };
                }
                return comment;
            });
            uploadCommentReplyFunc({
                userName: user?.userName,
                profileImage: user?.profileImage || "",
                commentId, Reply: reply
            })
            setComments(updatedComments);
            setReply("")
        }
    };

    const commentLike = (commentId: string) => {
        if (user && user._id) {
            const updatedComments = Comments.map(comment => {
                if (comment._id === commentId) {
                    return { ...comment, isUserLiked: !comment.isUserLiked };
                }
                return comment;
            });
            setComments(updatedComments);
            commentLikeWithId(commentId, user._id)
        }
    }

    return (
        <div className='ml-5 relative'>
            <div style={{ width: "97%" }} className='ml-2'>
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg"  >
                    <button type="button" onClick={() => setSelectEmoji(!selectEmoji)} className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
                        </svg>
                    </button>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your comments here...." name="Email" id="floating_email" className="ml-3 block py-1 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                    <button type="button" onClick={() => uploadComment()} className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div ref={emojiPickerRef} className="absolute ml-5">
                {selectEmoji && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
            </div>


            <ul role="list" style={{ width: "85%" }} className="ml-16 divide-gray-200 dark:divide-gray-700">
                {Comments?.length !== 0 ? Comments?.map((comm, index) => {
                    return (
                        <li className="py-2" key={index}>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="flex-shrink-0">
                                    <img className="w-9 h-9 rounded-full" src={comm?.profileImage} alt="Neil image" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                                        {comm.userName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {comm.Comment}
                                    </p>
                                    <p onClick={() => toggleReply(index)} className="cursor-pointer text-sm text-gray-500 truncate dark:text-gray-400"><span className="">{(comm?.Replies?.length || "0") + " Replies"}</span></p>
                                </div>

                                <div className="">

                                    {comm.isUserLiked ?
                                        <FontAwesomeIcon icon={faThumbsUp} onClick={() => commentLike(comm._id)} style={{ transform: "scale(1.5x)" }} className="fa-thin" /> :
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => commentLike(comm._id)} style={{ marginLeft: "3%", cursor: "pointer" }} width={20} viewBox="0 0 512 512">
                                            <path fill="#ffffff" d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                                        </svg>
                                    }


                                </div>
                            </div>

                            {clickedReply.includes(index) && <>
                                <div className="ml-14">
                                    <form className='w-full'>
                                        <label htmlFor="chat" className="sr-only">Your message</label>
                                        <div className="flex items-center px-3 py-2 rounded-lg"  >
                                            <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
                                                </svg>
                                                <span className="sr-only">Add emoji</span>
                                            </button>
                                            <input type="text" onChange={(e) => setReply(e.target.value)} placeholder="Your comments here...." name="Email" id="floating_email" className="ml-3 block py-1 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                                            <button type="button" onClick={() => uploadReply(comm._id)} className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                                <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                                </svg>
                                            </button>

                                        </div>
                                    </form>
                                    {comm.Replies && comm.Replies.map((item: any, ind: number) => {
                                        return (
                                            <div key={ind} className="flex mt-2 items-center space-x-3 rtl:space-x-reverse">
                                                <div className="flex-shrink-0">
                                                    <img className="w-9 h-9 rounded-full" src={user?.profileImage} alt="Neil image" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                                                        {item.userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {item.Reply}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>}

                        </li>
                    )
                }) : <p className='flex ml-5 uppercase'>
                    No Comments Yet
                </p>}

            </ul>
        </div>
    )
}

export default Comment
