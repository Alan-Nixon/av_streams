import React, { ChangeEvent, useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { adminCreateUser, blockUserId, getAllUsers } from '../../../Functions/userFunctions/adminManagement'
import { Data, changeEvent } from '../../../Functions/interfaces';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Layout from './Layout';
import { DataTable } from '../../Helpers/helperComponents';

function UserManagement() {
    const [userData, setUserData] = useState<Data[]>([]);
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [createUserData, setCreateUserData] = useState({ Email: "", Password: "", confirmPassword: "", FullName: "", userName: "", Phone: "", isAdmin: false })
    const [error, setError] = useState("")
    useEffect(() => {
        getAllUsers().then((result) => { setUserData(result) })
    }, [])

    const blockUser = (userId: string | undefined, index: number) => {
        index -= 1
        blockUserId(userId)
        setUserData(userData.map((data, i) => i === index ? { ...data, isBlocked: !data.isBlocked } : data));
    }

    const createUserDetails = (e: changeEvent) => {
        setCreateUserData((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError("")
    }

    const submitCreateUser = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9_@]{8,}$/
        const userNameRegex = /^[a-zA-Z0-9]+$/;
        const fullNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
        const phoneRegex = /^[1-9][0-9]*$/

        if (userNameRegex.test(createUserData.userName.trim()) && createUserData.userName.trim().length > 2) {
            if (fullNameRegex.test(createUserData.FullName.trim()) && createUserData.FullName.trim().length > 4) {
                if (phoneRegex.test(createUserData.Phone.trim())) {
                    if (createUserData.Phone.trim().length === 10) {
                        if (emailRegex.test(createUserData.Email.trim())) {
                            if (passwordRegex.test(createUserData.Password.trim())) {
                                if (createUserData.confirmPassword.trim() === createUserData.Password.trim()) {
                                    // adminCreateUser(createUserData)
                                } else {
                                    setError("Password do not match")
                                }
                            } else {
                                setError("Enter a valid password")
                            }
                        } else {
                            setError("Enter a valid email")
                        }
                    } else {
                        setError("Phone number should be 10 characters")
                    }
                } else {
                    setError("Invalid phone number")
                }
            } else {
                setError("Invalid full name")
            }
        } else {
            setError("Invalid user name")
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'userName', headerName: 'Name', width: 130 },
        { field: 'FullName', headerName: 'Full Name', width: 130 },
        { field: 'Email', headerName: 'Email', width: 190 },
        { field: 'isBlocked', headerName: 'Blocked', width: 130 },
        { field: 'isAdmin', headerName: 'Is Admin', width: 130 },
        {
            field: 'action', headerName: 'Action', width: 130, renderCell: (params: any) => {
                const text = params.row.isBlocked ? "unblock" : "block"
                return (
                    <a href="#" onClick={() => blockUser(params.row._id, params.row.id)}>{text}</a>
                );
            }
        }
    ];
    const checkIsAdmin = (event: any) => {
        setCreateUserData(rest => ({ ...rest, isAdmin: event.target.checked }))
    }
    const rowsData = JSON.parse(JSON.stringify(userData))
    rowsData.forEach((item: any) => item.action = `<a href='#'>block</a>`)
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (

        <>
            <Layout>
                <div className="" style={{ width: "90%", margin: "5%" }}>
                    <DataTable rowsData={rowsData} columnsData={columns} />
                    <div className="mt-5">
                        <h2 className='text-xl font-bold'>Create User</h2>
                        {error && <div className="error">{error}</div>}
                        <div className="flex  space-x-8">
                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='userName'
                                type='text'
                                label="user name"
                                onChange={createUserDetails}
                                placeholder="Enter user name"
                                variant="standard"
                            />
                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='Email'
                                label="Email"
                                type='email'
                                onChange={createUserDetails}
                                placeholder="Enter email"
                                variant="standard"
                            />
                        </div>
                        <div className="mt-4 flex space-x-8">
                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='Phone'
                                label="Enter number"
                                type='number'
                                onChange={createUserDetails}
                                placeholder="Enter phone number"
                                variant="standard"
                            />
                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='FullName'
                                label="full name"
                                onChange={createUserDetails}
                                placeholder="Enter Full Name"
                                variant="standard"
                            />
                        </div>
                        <div className="mt-4 flex space-x-8">

                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='Password'
                                label="Password"
                                onChange={createUserDetails}
                                placeholder="Enter Password"
                                type='password'
                                variant="standard"
                            />
                            <TextField
                                className='w-1/2'
                                required
                                id="standard"
                                name='confirmPassword'
                                type='password'
                                label="Repeat password"
                                onChange={createUserDetails}
                                placeholder="repeat your password"
                                variant="standard"
                            />
                        </div>
                        <FormControlLabel onChange={(e) => checkIsAdmin(e)} className='m-1' label="Is Admin" control={<Checkbox {...label} />} /> <br />
                        <Button onClick={() => submitCreateUser()} style={{ width: '100%', marginTop: "0.5%" }} variant="contained">Submit</Button>
                    </div>

                </div>


                {/* <div className="overflow-x-auto sm:rounded-lg">
                    <h2 className='mt-8 text-2xl' style={{ color: "black", marginLeft: "5%" }} ><strong >User Management</strong></h2>
                    <div style={{ float: "right", marginTop: "0%", marginRight: "4%" }} ><button onClick={() => setShowCreateUser(!showCreateUser)} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create User</button></div>
                    <table style={{ marginTop: "5%", marginLeft: "6%", width: "90%", backgroundColor: "#cfcfcf", borderRadius: "13%" }} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>

                                <th className='px-6'>User Name</th>
                                <th scope="col" className="py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-5 py-3">
                                    Phone
                                </th>
                                <th scope="col" className="py-3">
                                    Admin
                                </th>
                                <th scope="col" className="py-3">
                                    Blocked
                                </th>
                                <th scope="col" className="py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((item, index) => {
                                return (
                                    <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className='px-8'>
                                            {item.userName}
                                        </td>
                                        <td className="py-4">
                                            {item.Email}
                                        </td>
                                        <td className="px-2 py-4">
                                            {item.Phone}
                                        </td>
                                        <td className="py-4">
                                            {item.isAdmin + ""}
                                        </td>
                                        <td className="py-4">
                                            {item.isBlocked + ""}
                                        </td>
                                        <td className="py-4">
                                            <a href="#" onClick={() => blockUser(item._id, index)} className={`font-medium text-${item.isBlocked ? "blue" : "red"}-600 dark:text-${item.isBlocked ? "blue" : "red"}-500 hover:underline`}>
                                                <strong>{item.isBlocked ? "unblock" : "block"}</strong>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
                    <br /><br />
                    <div className={showCreateUser ? "" : "hidden"}>
                        <h2><strong className='text-2xl ml-8' style={{ color: "black" }} >Create user</strong></h2>
                        <div className='flex bg-gray-400' style={{ width: "100%" }}><br />
                            <form className="max-w-sm mx-auto mt-5">
                                <div className="mb-5">
                                    {error.EmailErr && <><p className='error'>{error.EmailErr}</p></>}
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">user email</label>
                                    <input onChange={createUserDetails} name="Email" type='email' autoComplete='email' id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="youremail@gmail.com" required />
                                </div>
                                <div className="mb-5">
                                    {error.PasswordErr && <><p className='error'>{error.PasswordErr}</p></>}
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your password</label>
                                    <input type="password" autoComplete='new-password' onChange={createUserDetails} name='Password' id="Password" placeholder='Enter your password' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>
                                <div className="mb-5">
                                    {error.confirmPasswordErr && <><p className='error'>{error.confirmPasswordErr}</p></>}
                                    <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Repeat password</label>
                                    <input type="password" autoComplete='new-password' onChange={createUserDetails} name="confirmPassword" placeholder='Confirm your password' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>

                            </form>
                            <div style={{ borderLeft: "1px solid black", height: "400px" }}></div>

                            <form className="max-w-sm mx-auto mt-5">
                                <div className="mb-5">
                                    {error && <><p className='error'>{error?.FullNameErr}</p></>}
                                    <label htmlFor="FullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Full Name</label>
                                    <input type="text" id="FullName" onChange={createUserDetails} placeholder='Enter your Full Name' name='FullName' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>
                                <div className="mb-5">
                                    {error && <><p className='error'>{error?.userNameErr}</p></>}
                                    <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">user name</label>
                                    <input type="text" name='userName' onChange={createUserDetails} autoComplete='userName' id="userName" placeholder='Enter your user name' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>
                                <div className="mb-5">
                                    {error.PhoneErr && <><p className='error'>{error.PhoneErr}</p></>}
                                    <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">phone</label>
                                    <input type="number" onChange={createUserDetails} name='Phone' placeholder='Enter your phone number' id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>
                                <div className="flex items-start mb-5">
                                    <div className="flex items-center h-5">
                                        <input id="terms" type="checkbox" value="" onChange={() => setCreateUserData((rest) => ({ ...rest, isAdmin: !rest.isAdmin }))} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                    </div>
                                    <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-black-300">Is this User Have Admin privilege</label>
                                </div>
                                <button type="button" onClick={submitCreateUser} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
                            </form>
                        </div>

                    </div>
                </div>
                <footer className='h-4'>

                </footer> */}
            </Layout>
        </>
    )
}

export default React.memo(UserManagement)




