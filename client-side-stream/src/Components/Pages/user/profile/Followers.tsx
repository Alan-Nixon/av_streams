import { useEffect, useState } from "react"
import { FollowFollowersTypeData, FollowersDetailsArray, changeEvent } from "../../../../Functions/interfaces"
import { useUser } from "../../../../UserContext"
import { getfollowersByUserId } from "../../../../Functions/userFunctions/userManagement"
import { useNavigate } from "react-router-dom"

export default function Followers() {
    const [selected, setSelected] = useState("Followers")
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<FollowersDetailsArray[]>([])
    const [followers, setFollowers] = useState<FollowFollowersTypeData | null>(null)

    const { user } = useUser()

    useEffect(() => {

        if (user && user?._id) {

            getfollowersByUserId(user?._id).then(async (data) => {
                const followersData: FollowFollowersTypeData = {
                    title: "Followers",
                    data: data.Followers,
                    action: "BLOCK"
                }
                setFollowers(followersData);
                setData(followersData.data)
            })
            setLoading(false)
        }

    }, [user])


    const serachFromArray = (arr: FollowersDetailsArray[], value: string) => {
        return arr.filter(item => (item.userName.includes(value) || item.Email.includes(value)) ? true : false) || [];
    }

    const findFollowers = (e: changeEvent) => {
        const value = e.target.value;
        if (followers && data) {
            const filteredData = serachFromArray(data, value)
            setFollowers({
                title: "Followers",
                data: value.trim() === "" ? data : filteredData,
                action: "BLOCK"
            })
        }
    }

    return (<>{loading ? <>
        <div className="lds-dual-ring"></div>
    </> : <>
        <div className="ml-5 w-full mt-5 text-xl justify-between">
            <div className="flex w-full">

                <p className='ml-12 cursor-pointer' onClick={() => setSelected("Followers")} style={{ color: selected === "Followers" ? "blue" : "" }} >Followers
                    {selected === "Followers" && <div style={{ backgroundColor: "blue" }} className="h-1 w-full"></div>}
                </p>

                <div className="ml-auto" style={{ marginRight: "10%" }}>
                    <form className="max-w-lg me-auto">
                        <div className="flex">
                            <div className="relative w-full">
                                <input onChange={findFollowers} type="search" placeholder="Search followers, following ..." style={{ minWidth: "400px" }} id="search-dropdown" className="block p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" required />
                            </div>
                        </div>
                    </form>
                </div>

            </div>
            {selected === "Followers" && followers && <FollowerSection section={followers} />}

        </div>
    </>}

    </>)

    function FollowerSection({ section }: any) {
        console.log(section);
        
        const Navigate = useNavigate()
        return (<>
            <div className="flex">

                <div className="ml-12 mt-5 mb-5 w-full">
                    <div style={{ width: "90%" }} className=" p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{section?.title}</h5>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                View all
                            </a>
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">

                                {section.data?.length !== 0 ? section.data.map((fol: FollowersDetailsArray) => {
                                    return (
                                        <li className="py-3 sm:py-4">
                                            <div className="flex items-center cursor-pointer" onClick={() => Navigate('/channel?userId=' + fol.channelId)}>
                                                <div className="flex-shrink-0">
                                                    <img className="w-8 h-8 rounded-full" src={fol?.profileImage} alt="Neil image" />
                                                </div>
                                                <div className="flex-1 min-w-0 ms-4">
                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {fol?.userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {fol?.Email}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                                    : <>
                                        <p>No {section.title} found</p>
                                    </>}


                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>)
    }

}