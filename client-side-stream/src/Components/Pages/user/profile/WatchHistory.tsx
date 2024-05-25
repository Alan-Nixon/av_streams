

export default function WatchHistory() {
    const shortsWatchHistory = new Array(6).fill({
        Thumbnail: "https://templates.simplified.co/usetldr/82515/tmpt/34cb11fc-f979-49ae-ab59-db6d81fee69c/thumbs/gaming-ai-you-tube-shorts-thumbnail-1.png",
        videoLink: "",
        Heading: "Noteworthy technology acquisitions 2021",
        Description: "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
    })

    const Videos = new Array(4).fill({
        Thumbnail: "https://w0.peakpx.com/wallpaper/102/75/HD-wallpaper-bgmi-thumbnail-ideas-gaming-thumbnail-design-map-pubg.jpg",
    })

    return (<>
        <div className=" ml-10 mt-6 ">
            <div className="block">
                <h2 className='text-xl ml-3 mr-3'>Shorts</h2>
            </div><br />
            {/* this is the card  */}
            <div className="overflow-x-auto">
                <div className="flex">
                    {shortsWatchHistory.length !== 0 ? shortsWatchHistory.map((short, index) => {
                        return (
                            <div key={index} className="flex-none pe-2 cursor-pointer ">
                                <div className="mt-1 max-w-sm hover:bg-gray-200 rounded-lg shadow  dark:border-gray-700 mb-4 mr-4" style={{ width: "250px", height: "100%", backgroundColor: "transparent" }}>
                                    <img className="rounded-t-lg" src={short.Thumbnail} style={{ maxHeight: "250px", margin: "auto", width: "100%", objectFit: "cover" }} alt="" />
                                    <div className="p-5">
                                        <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{short.Heading}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{short.Description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <>
                        you dont have any shorts watched yet
                    </>}
                </div>
            </div>
            {/* card ended here */}


            <div className="mt-4 mb-5">
                <h2 className='text-xl ml-3 mr-3 mb-2'>videos</h2>

                {Videos.length !== 0 ? Videos.map((vid) => {
                    return (
                        <div key={vid.id} style={{ width: "80%" }} className="flex mt-2 items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <img style={{ maxWidth: "170px" }} className="object-cover rounded-t-lg md:rounded-none md:rounded-s-lg" src={vid.Thumbnail} alt="" />
                            <div className="ml-5">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                                <p>185k views</p>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="mb-10 hover:bg-gray-500 p-1 rounded" style={{ marginRight: "1%" }}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={5} fill='#ffffff' viewBox="0 0 128 512">
                                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )
                }) : <>
                    <p className="mt-2">you dont have watched any videos yet...</p>
                </>}
            </div>




        </div>
    </>)
}

