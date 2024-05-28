import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { reportType, videoInterface } from '../../../Functions/interfaces'
import { ChangeVisiblityContent, blockContentVisiblity, getBlockedVideos, getReportsBySection } from '../../../Functions/streamFunctions/adminStreamFunction'
import { toast } from 'react-toastify'

function ReportManagement() {
    const [videoReports, setVideoReports] = useState<reportType[]>([])
    const [blockedVideos, setBlockedVideos] = useState<videoInterface[]>([])

    useEffect(() => {
        
        getReportsBySection('video').then(({ data }) => {
            setVideoReports(data)
        })

        getBlockedVideos().then(({ data }) => {
            setBlockedVideos(data)
        })

    }, [])


    const blockContent = (LinkId: string, Section: string, reportId: string) => {
        blockContentVisiblity(LinkId, Section, reportId).then(({ status }) => {
            if (status) { toast.success("successfully updated the visiblity") }
            else { toast.error("error failed to update") }
            if (Section === "video") {
                const newReports = JSON.parse(JSON.stringify(videoReports))
                newReports.forEach((item: reportType) => {
                    if (item._id === reportId) {
                        return { ...item, Respond: !item.Responded }
                    } else {
                        return item
                    }
                })
                setVideoReports(newReports)
            }
        })
    }

    const changeVisiblity = (LinkId: string, Section: string) => {
        ChangeVisiblityContent(LinkId, Section).then(({ status }) => {
            if (status) { toast.success("successfully changed the visiblity") }
            else { toast.error("error failed to changed") }
            
        })
    }

    return (
        <>
            <Layout>
                <div className="m-2">
                    <h2 className="text-xl font-bold">Report Management</h2>

                    <div className="mt-5">
                        <h2 className="text-md">Reports Video Section</h2>
                    </div>

                    {videoReports.map((item, idx) => {
                        return (<p key={idx} className="flex m-3 flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-300">
                            <img className="object-cover ml-1 w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={item.Link} alt="" />
                            <div className="flex flex-col justify-between p-4 leading-normal">
                                <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-black">Reported by : {item.channelName}</h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-black">Reason : {item.Reason}</p>
                                {!item.Responded && <button type="button" onClick={() => blockContent(item.LinkId, item.Section, item._id)} style={{ width: "150px" }} className="py-2.5 w-full px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Block visiblity</button>}
                                <p>{item.Responded && "responded to the report"}</p>
                            </div>
                        </p>)
                    })}

                    <div className="mt-5">
                        <h2 className="text-md mb-5">Blocked Video</h2>
                        {blockedVideos.length !==0 ?  blockedVideos.map((item, idx) => {
                            return (
                                <p key={idx} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-300">
                                    <img src={item.Thumbnail} className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" alt="" />
                                    <div className="flex text-black flex-col justify-between ml-3 leading-normal">
                                        <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 ">{item.Title}</h5>
                                        <button type="button" onClick={() => changeVisiblity(item._id, "video")} style={{ width: "150px" }} className="py-2.5 w-full px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Unblock visiblity</button>
                                    </div>
                                </p>
                            )
                        }) : <p>no blocked video</p>}
                    </div>

                </div>
            </Layout>
        </>
    )
}

export default React.memo(ReportManagement)
