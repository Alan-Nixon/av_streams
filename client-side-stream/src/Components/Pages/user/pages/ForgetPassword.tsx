import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { forgetPasswordPost } from '../../../../Functions/userFunctions/userManagement';

function ForgetPassword() {
    const location = useLocation();
    const [password, setPassword] = useState({ Password: "", confirmPassword: "" })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const onchangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError("")
    }
    const handleSubmit = async () => {
        const passwordRegex = /^[a-zA-Z0-9_@]{8,}$/
        if (passwordRegex.test(password.Password)) {
            if (password.Password === password.confirmPassword) {
                const queryParams = new URLSearchParams(location.search);
                const userId = queryParams.get('userId'); 
                if (userId) {
                    forgetPasswordPost({ userId, Password: password.Password }).then((result) => {
                        if (!result.status) {
                            setError(result.message)
                        } else {
                            setSuccess("Password changed succussfully")
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 3000)
                        }
                    })
                } else {
                    setError("")
                }
            } else {
                setError("password do not match")
            }
        } else {
            setError("Enter a valid password")
        }
    }
    return (
        <div className="container mx-auto mt-8">
            <div className="flex justify-center">
                <div className="w-96">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="text-center">
                            <h3><i className="fa fa-lock fa-4x"></i></h3>
                            <h2 className="text-center text-2xl" style={{ color: "black" }}><strong>Forgot Password ?</strong></h2>
                        </div>
                        <div className="py-4 mt-8">
                            {error && <p className='error'>{error}</p>}
                            {success && <p className='success'>{success}</p>}
                            <div className="mb-4">
                                <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
                                    <span className="mr-3"><i className="fa fa-envelope color-blue"></i></span>
                                    <input onChange={onchangeFunc} id="Password" name="Password" placeholder="Enter the new password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="Password" />
                                </div>
                                <div className="flex mt-8 items-center border-b border-b-2 border-blue-500 py-2">
                                    <span className="mr-3"><i className="fa fa-envelope color-blue"></i></span>
                                    <input onChange={onchangeFunc} id="confirmPassword" name="confirmPassword" placeholder="Repeat new password" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="Password" />
                                </div>
                            </div>
                            <div onClick={handleSubmit} className="mt-3 mb-4" style={{ marginTop: "5%" }}>
                                <input name="recover-submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full" value="Reset Password" type="button" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword
