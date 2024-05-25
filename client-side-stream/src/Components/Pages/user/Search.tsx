import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Content from './helpers/Content'
import { useNavigate } from 'react-router-dom';
import { searchVideosAndProfile } from '../../../Functions/streamFunctions/streamManagement';

function Search() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false)
    const Navigate = useNavigate();
    const [cate, setCate] = useState("Videos")

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryParam = searchParams.get('search');
        if (queryParam && queryParam.trim() !== "") {
            setQuery(queryParam)
            setLoading(false)

            searchVideosAndProfile(queryParam).then(({data}) => {
                console.log(data);
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
                            <button key={idx} type="button" className="ml-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{names}</button>
                        )
                    })}
                </div>
            </>}
        </Content>
    </>
    )
}

export default Search
