import React, { useState } from 'react'
import { PostLogin, forgetPasswordOtpSend } from '../../../../Functions/userFunctions/userManagement'
import Cookies from 'js-cookie'
import { useUser } from '../../../../UserContext'
import Google from '../../../socialMediaLogins/Google'
import Linkedin from '../../../socialMediaLogins/Linkedin'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

export default function Login() {

    const width = useSelector((state: any) => state?.sideBarRedux?.width);
    const { setUserData } = useUser()
    const [showModal, setShowModal] = useState("login")
    const [hideIcons, setHideIcons] = useState(true)
    const [loginData, setLoginData] = useState({ Email: "", Password: "" })
    const [error, setError] = useState({ emailErr: "", passwordErr: "" })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9_@]{8,}$/

    const LoginValidation = async () => {
        if (emailRegex.test(loginData.Email)) {
            if (passwordRegex.test(loginData.Password)) {
                const result = await PostLogin(loginData, setUserData)
                if (!result.status) {
                    setError((rest) => ({ ...rest, emailErr: result.message }))
                } else {
                    Cookies.set("userToken", result.token, { expires: 7 })
                    window.location.href = '/'
                }
            } else {
                setError((rest) => ({ ...rest, passwordErr: "Password should be 8 characters with letters, numbers, @, or _" }))
            }
        } else {
            setError((rest) => ({ ...rest, emailErr: "Please enter a valid email" }))
        }
    }

    const onchangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((rest) => ({ ...rest, [e.target.name]: e.target.value }));
        setError((rest) => ({ ...rest, [e.target.name.toLowerCase() + 'Err']: "" }));
    }

    const responseErrorGoogle = (error: any) => {
        if (error.error === 'popup_closed_by_user') {
            console.log('Google Sign-In popup was closed by the user.');
        } else {
            console.error('Google Sign-In failed with error:', error);
        }
    };

    const googleLogin = (response: any) => {
        const obj = {
            Email: response.email,
            Password: response.sub
        }

        PostLogin(obj, setUserData).then((result) => {
            if (result.status) {
                Cookies.set("userToken", result.token)
                window.location.href = '/'
            } else {
                toast.error(result?.message ?? "error occured while login")

            }
        })
    }

    const onError = (error: any) => {
        console.log(error);
    }

    const onSuccess = (response: any) => {
        console.log(response);
    }

    return (<>

        <div style={{
            background: width < 1000 ? `url(/images/imageTestLogin.jpg) no-repeat center center / cover` : "",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',
            bottom: "0",
            overflow: "hidden",
            height: '105%'
        }}>
            <div className='flex overflow-y-hidden'>
                {width >= 1000 && <img className='h-[700px] w-[50%] overflow-hidden bottom-0' src="/images/imageTestLogin.jpg" alt="" />}
                <div className="m-auto overflow-hidden" style={{ width: "80%" }}>
                    <div className="m-auto " style={{ width: "80%" }}>
                        {showModal ? <>
                            <h2 className='text-3xl' style={{ textAlign: "center" }} ><strong>Login</strong></h2>
                            <form className="max-w-md mx-auto mt-16">
                                {error?.emailErr && <><p className='error'>{error.emailErr}</p><br /></>}
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="email" onChange={onchangeFunc} name="Email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                                </div>
                                {error?.passwordErr && <><p className='error'>{error?.passwordErr}</p><br /></>}

                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="password" onChange={onchangeFunc} name="Password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                                </div>
                                <button type="button" onClick={LoginValidation} className="float-right text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Login</button>
                                <p onClick={() => { setShowModal("") }} style={{ cursor: "pointer", color: "blue", width: "auto" }}>forgot password ?</p>
                                <p className='mt-5 mx-5' style={{ textAlign: "center" }}>OR</p>



                                <button id="dropdownDefaultButton" onClick={() => setHideIcons(!hideIcons)} data-dropdown-toggle="dropdown" className="googleButtonLogin mt-5 text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                    Login With Social Media
                                    {hideIcons ?
                                        <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5 5 1 9 5" />
                                        </svg> :
                                        <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    }
                                </button>

                                <div id="dropdown" className={`googleButtonLogin ${hideIcons ? "hidden" : ""} z-10 mt-2  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                    <ul className=" text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        <li className='flex mt-1'>
                                            <div className="mx-auto">
                                                <Google onSuccess={googleLogin} responseErrorGoogle={responseErrorGoogle} />

                                            </div>
                                        </li>
                                        <li className='mt-2'>
                                            <Linkedin onSuccess={onSuccess} onError={onError} />
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex">
                                    <Link to='/Signup' style={{ color: "blue", textAlign: "center", float: "right", margin: "auto", marginTop: "3%" }}>Dont have an account ? Register</Link>
                                </div>
                            </form></>
                            : <ForgetPassword setShowModal={setShowModal} />}

                    </div>
                </div>
            </div>
        </div>

    </>)
}



function ForgetPassword({ setShowModal }: any) {
    const [Email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async () => {
        if (!emailRegex.test(Email)) { setError("Enter a valid email") } else {
            const data = await forgetPasswordOtpSend(Email)
            console.log(data);
            (data.status) ? setSuccess(data.message) : setError(data.message);
            (data.status) && setTimeout(() => setShowModal('login'), 1500)
        }
    }

    return (<>
        <div className="m-auto" style={{ width: "80%" }}>
            <h2 className='text-3xl' style={{ textAlign: "center" }} ><strong className='tracking-wider'>Forget Password</strong></h2>
            <form className="max-w-md mx-auto mt-10">
                {error && <p className='error mt-5'>{error}</p>}
                {<p className='text-green-500'> {success}</p>}
                <div className="relative z-0 w-full mb-5 mt-7 group">
                    <input type="email" onChange={(e) => { setEmail(e.target.value); setError("") }} name="email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter the Email</label>
                </div>
                <div className="flex">
                    <a href='/Login' style={{ color: "blue" }}>Go back to login ?</a>
                    <button onClick={handleSubmit} type="button" className="float-right ml-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Submit</button>
                </div>
            </form>
        </div>
    </>)
}