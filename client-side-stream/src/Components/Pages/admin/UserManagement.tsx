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

            </Layout>
        </>
    )
}

export default React.memo(UserManagement)




