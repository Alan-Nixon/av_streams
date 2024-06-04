import React, { useEffect, useState } from 'react'
import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import { useNavigate } from 'react-router-dom';
import { searchVideosAndProfile } from '../../../../Functions/streamFunctions/streamManagement';
import { channelInterface, videoInterface } from '../../../../Functions/interfaces';

function Search() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false)
    const [videos, setvideos] = useState<videoInterface[]>([])
    const [profile, setProfile] = useState<channelInterface[]>([])
    const Navigate = useNavigate();
    const [cate, setCate] = useState("Videos")

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryParam = searchParams.get('search');
        if (queryParam && queryParam.trim() !== "") {
            setQuery(queryParam)
            setLoading(false)

            searchVideosAndProfile(queryParam).then(({ data }) => {
                console.log(data);
                setvideos(data[0])
                setProfile(data[1])
            })

        } else {
            Navigate('/')
        }
    }, []);

    return (<>
        <NavBar />
        <SideBar />
        <Content>
            {loading ? <><div className="lds-dual-ring"></div></> : <>
                <div className="flex m-4 ml-5">
                    {["Videos", "Profile"].map((names, idx) => {
                        return (
                            <button key={idx} onClick={() => setCate(names)} type="button" className="ml-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{names}</button>
                        )
                    })}
                </div>
                <div className="m-5">

                    {cate === "Videos" && <>
                        {videos.map((details, index) => {
                            return (
                                <p key={index} onClick={() => Navigate("/FullVideo?videoId=" + details._id)} style={{ width: "100%" }} className="flex flex-col mt-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row   hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <img style={{ width: "150px" }} className="object-cover w-full rounded-t-lg md:rounded-none md:rounded-s-lg" src={details.Thumbnail} alt={details.Title} />
                                    <div className="flex flex-col m-4 leading-normal">
                                        <h5 className=" text-lg font-bold tracking-tight text-gray-900 dark:text-white">{details.Title}</h5>
                                        <p className="font-normal text-gray-700 dark:text-gray-400">{details.Description}</p>
                                        <p>{details.channelName} <span className='ml-auto'>{"details.Views"} views</span></p>
                                    </div>
                                </p>
                            )
                        })}
                    </>}
                    {cate === "Profile" && profile.map((item, idx) => {
                        return (
                            <div key={idx} onClick={() => Navigate('/channel?userId=' + item._id)} className="ml-7 cursor-pointer">
                                <img className="rounded ml-4" style={{ borderRadius: "100%", width: "150px" }} src={item.profileImage} alt="" />
                                <div className="p-2" >
                                    <h5 className="mb-2 text-md ml-4 font-bold tracking-tight text-gray-900 dark:text-white">{item.channelName}</h5>
                                </div>
                            </div>
                        )
                    })}
                </div>



            </>}
        </Content>
    </>
    )
}

export default Search
