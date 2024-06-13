import React, { useEffect, useState } from 'react'
import NavBar from '../layout/NavBar'
import SideBar from '../layout/SideBar'
import Content from '../helpers/Content'
import { getCurrentLives } from '../../../../Functions/streamFunctions/streamManagement'
import { videoInterface } from '../../../../Functions/interfaces'
import { useNavigate } from 'react-router-dom'

function LiveNow() {

    const [currentLives, setCurrentLives] = useState<videoInterface[]>([])
    const Navigate = useNavigate()

    useEffect(()=>{
        getCurrentLives().then(({data})=>{
            setCurrentLives(data)
        })
    },[])


    return (
        <>
            <NavBar />
            <SideBar />
            <Content>
                <>
                    <div className="m-3">
                        <h2 className="text-xl font-bold">Current Lives</h2>

                        {currentLives && currentLives.map((item, idx) => {
                            return (
                                <div key={idx} style={{ width: "23%", minWidth: "250px", maxWidth: "300px" }} onClick={() => Navigate('/FullVideo?videoId=' + item._id)} className="ml-3 mt-3 cursor-pointer hover:bg-gray-900 rounded-lg shadow">
                                    <img className="rounded-t-lg w-full" src={item.Thumbnail} alt="" />
                                    <div className="p-5">
                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.Title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.Description}</p>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </>
            </Content>
        </>
    )
}

export default React.memo(LiveNow)
