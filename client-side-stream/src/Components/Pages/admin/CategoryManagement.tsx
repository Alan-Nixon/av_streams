import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { addCategory, blockCategoryCateId, getCategory } from '../../../Functions/streamFunctions/adminStreamFunction'
import { DataTable } from '../../Helpers/helperComponents';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { categoryInterface, changeEvent } from '../../../Functions/interfaces';
import { scrollDown } from '../../../Functions/commonFunctions';
import { toast } from 'react-toastify';


function CategoryManagement() {
    const [category, setCategory] = useState<categoryInterface[]>([])
    const [error, setError] = useState("")
    const [showCate, setShowCate] = useState(false)

    const [cateDetails, setCateDetails] = useState({
        categoryName: "", Description: "",
    })

    useEffect(() => {
        getCategory().then(({ data }) => setCategory(data))

    }, [])

    const blockCategory = (cateId: string) => {
        blockCategoryCateId(cateId).then(({ status }) => {
            if (status) {
                setTimeout(() => toast.success("successfully completed the action"), 0)
                const newCate = category.filter((item) => {
                    if (item._id === cateId) {
                        return { ...item, Display: !item.Display }
                    }
                    return item
                })
                setCategory(newCate)
            } else {
                toast.error("error while updating display")
            }
        })
    }

    const showAddCate = () => {
        setShowCate(true);
        scrollDown()
    }

    const submitCreateCate = () => {
        const alphabeticRegex = /^[A-Za-z]+$/
        if (alphabeticRegex.test(cateDetails.categoryName) && cateDetails.categoryName.trim().length > 2) {
            if (cateDetails.Description.trim().length > 3) {
                if (isCateExist()) {
                    addCategory(cateDetails).then(({status})=>{
                        status ? toast.success("category added successfully"):toast.error("error occured while adding")
                        setShowCate(false)
                    })
                } else {
                    setError("Category already exist")
                }
            } else {
                setError("Enter a valid description")
            }
        } else {
            setError("Enter a valid category name")
        }
    }

    function isCateExist() {
        const cateName = category.map((item) => item.categoryName.toLowerCase())
        return !cateName.includes(cateDetails.categoryName.toLowerCase())
    }

    const createCateDetails = (e: changeEvent) => {
        setCateDetails((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError("")
    }

    const columnData = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'categoryName', headerName: 'Category Name', width: 130 },
        { field: 'Description', headerName: 'Description', width: 300 },
        { field: 'isBlocked', headerName: 'Post Count', width: 130, renderCell: (params: any) => params.row.postCount?.length },
        { field: 'videosCount', headerName: 'Videos Count', width: 130, renderCell: (params: any) => params.row.videosCount?.length },
        { field: 'Active', headerName: 'Status', width: 130, renderCell: (params: any) => params.row.Display ? "Active" : "Hidden" },
        { field: 'action', headerName: 'Action', width: 130, renderCell: (params: any) => <p onClick={() => blockCategory(params.row._id)}>{params.row.Display ? "Block" : "Unblock"}</p> },
    ]

    return (
        <>
            <Layout>
                <div className="m-2">
                    <div className="flex">
                        <h2 className="text-xl mt-5">Category Management</h2>
                        <button onClick={() => showAddCate()} type="button" className="text-gray-900 ml-auto mt-3 mr-5 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600">Add Category</button>
                    </div>
                    <div className="w-[95%] m-5">
                        <DataTable columnsData={columnData} rowsData={category} />
                    </div>
                    {showCate && <div className="m-5 w-[55%]">
                        <h2 className='text-xl font-bold'>Add Category</h2>
                        {error && <div className="error">{error}</div>}
                        <div className="mt-3 ">
                            <TextField
                                className='w-full'
                                required
                                id="standard"
                                name='categoryName'
                                type='text'
                                label="Category Name"
                                onChange={createCateDetails}
                                placeholder="Enter category name"
                                variant="standard"
                            />
                            <TextField
                                className='w-full mt-5'
                                required
                                id="standard"
                                name='Description'
                                label="Description"
                                type='text'
                                onChange={createCateDetails}
                                placeholder="Enter desctiption"
                                variant="standard"
                            />
                        </div>

                        <Button onClick={() => submitCreateCate()} style={{ width: '100%', marginTop: "3%" }} variant="contained">Submit</Button>
                    </div>}
                </div>
            </Layout>
        </>
    )
}

export default React.memo(CategoryManagement)
