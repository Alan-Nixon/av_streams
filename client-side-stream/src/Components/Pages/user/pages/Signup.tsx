import { useEffect, useState } from "react";
import { postSignup, sendOtp } from "../../../../Functions/userFunctions/userManagement";
import { Data, changeEvent } from "../../../../Functions/interfaces";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Google from "../../../socialMediaLogins/Google";
import Linkedin from "../../../socialMediaLogins/Linkedin";
import Recaptcha from "../../../socialMediaLogins/Recaptcha";



function Signup() {
    const [modal, showModal] = useState<string>("signup")
    const [GlobalRegister, setGlobalRegister] = useState<Data>()
    const [sentedOtp, setSentedOtp] = useState("")
    const props = {
        showModal,
        sentedOtp,
        setSentedOtp,
        GlobalRegister,
        setGlobalRegister
    }

    return (<>
        <div className='flex'>
            <img style={{ width: "50%", height: "660px" }} src="https://res.cloudinary.com/dyh7c1wtm/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1711092799/Pasted_image_isdtca.jpg?_s=public-apps" alt="" />
            <div className="m-auto" style={{ width: "80%" }}>
                {modal === "signup" ? <SignupForm props={props} /> : <Otp props={props} />}
            </div>
        </div>
    </>)
}

export default Signup


function SignupForm({ props }: any) {
    const { setSentedOtp, setGlobalRegister, showModal } = props
    const [showCaptcha, setShowCaptcha] = useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9_@]{8,}$/
    const [error, setError] = useState({ userNameErr: "", FullNameErr: "", PhoneErr: "", EmailErr: "", PasswordErr: "", ConfirmPasswordErr: "" })
    const [signupData, setSignupData] = useState({ userName: "", FullName: "", Phone: "", Email: "", Password: "", ConfirmPassword: "" })
    const [hideIcons, setHideIcons] = useState(false)

    const userNameRegex = /^[a-zA-Z0-9]+$/;
    const fullNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    const phoneRegex = /^[1-9][0-9]*$/

    async function validate(from: boolean) {
        if (userNameRegex.test(signupData.userName.trim())) {
            if (fullNameRegex.test(signupData.FullName.trim())) {
                if (phoneRegex.test(signupData.Phone.trim())) {
                    if (emailRegex.test(signupData.Email.trim())) {
                        if (passwordRegex.test(signupData.Password.trim())) {
                            if (signupData.ConfirmPassword.trim() === signupData.Password.trim()) {
                                if (from) {
                                    setSentedOtp(await sendOtp(signupData.Email))
                                    setGlobalRegister(signupData);
                                    showModal("")
                                } else {
                                    setShowCaptcha(!showCaptcha)
                                }
                            } else {
                                setError((rest) => ({ ...rest, ConfirmPasswordErr: "Password do not match" }))
                            }
                        } else {
                            setError((rest) => ({ ...rest, PasswordErr: "Enter a valid password" }))
                        }
                    } else {
                        setError((rest) => ({ ...rest, EmailErr: "Enter a valid email" }))
                    }
                } else {
                    setError((rest) => ({ ...rest, PhoneErr: "Invalid phone number" }))
                }
            } else {
                setError((rest) => ({ ...rest, FullNameErr: "Invalid full name" }))
            }
        } else {
            setError((rest) => ({ ...rest, userNameErr: "Invalid user name" }))
        }
    }

    const onchangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData((rest) => ({ ...rest, [e.target.name]: e.target.value }));
        setError((rest) => ({ ...rest, [e.target.name + 'Err']: "" }));
    }

    const responseErrorGoogleLogin = (error: any) => {
        if (error.error === 'popup_closed_by_user') {
            console.log('Google Sign-In popup was closed by the user.');
        } else {
            console.error('Google Sign-In failed with error:', error);
        }
    };

    const googleSignup = (userData: any) => {
        
        const Data = {
            userName: userData.given_name,
            FullName: userData.name,
            Email: userData.email,
            Password: userData.sub,
            imageUrl: userData.picture,
            Phone: "1234567890"
        }

        postSignup(Data).then((result) => {
            console.log(result);
            if (result.status) {
                Cookies.set("userToken", result.token, { expires: 7 })
                Swal.fire({
                    title: "Registration Success!",
                    text: "Successfully Registered with Google",
                    icon: "success",
                }).then(() => window.location.href = '/')
            } else {
                Swal.fire({
                    title: "information!",
                    text: result.message,
                    icon: "info",
                })
            }
        })
    }
    const onErrorLinkedin = (error: any) => {
        console.log(error);
    }

    const onSuccessLinkedin = (response: any) => {
        console.log(response);

    }
    return (
        <div className="m-auto " style={{ width: "80%" }}>
            <h2 className='text-2xl' style={{ textAlign: "center" }}><strong>Register</strong></h2><br />
            <form className="max-w-md mx-auto">
                {error && <><p className='error'>{error?.userNameErr || error?.FullNameErr}</p></>}<br />
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" onChange={onchangeFunc} autoComplete='username' name="userName" id="username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">User Name</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" onChange={onchangeFunc} name="FullName" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="FullName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
                    </div>
                </div>
                {error.PhoneErr && <><p className='error'>{error.PhoneErr}</p></>}
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" onChange={onchangeFunc} name="Phone" id="Phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="Phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone  Number</label>
                </div>
                {error.EmailErr && <><p className='error'>{error.EmailErr}</p></>}
                <div className="relative z-0 w-full mb-5 group">
                    <input type="email" onChange={onchangeFunc} name="Email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email Address</label>
                </div>
                {error.PasswordErr && <><p className='error'>{error.PasswordErr}</p></>}
                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" onChange={onchangeFunc} autoComplete='new-password' name="Password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                </div>
                {error.ConfirmPasswordErr && <><p className='error'>{error.ConfirmPasswordErr}</p></>}
                <div className="relative z-0 w-full mb-5 group">
                    <input type="password" onChange={onchangeFunc} autoComplete='new-password' name="ConfirmPassword" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password</label>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <a href="/Login" style={{ color: "blue" }}>Already have an account ? LOGIN</a>
                    <button type="button" style={{ marginLeft: "auto" }} onClick={() => validate(false)} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-1 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Register</button>
                </div>
                <h2 style={{ textAlign: "center" }}>OR</h2>
                {showCaptcha && <Recaptcha showCaptcha={setShowCaptcha} validate={validate} />}
                <button id="dropdownDefaultButton" onClick={() => setHideIcons(!hideIcons)} data-dropdown-toggle="dropdown" className="googleButtonLogin mt-5 text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Social Media Icon
                    {hideIcons ?
                        <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5 5 1 9 5" />
                        </svg> :
                        <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    }
                </button>

                <div id="dropdown" className={`googleButtonLogin ${!hideIcons ? "hidden" : ""} z-10 mt-2  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                    <ul className=" text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <Google onSuccess={googleSignup} responseErrorGoogle={responseErrorGoogleLogin} />
                        </li>
                        <li>
                            <Linkedin onSuccess={onSuccessLinkedin} onError={onErrorLinkedin} />
                        </li>
                    </ul>
                </div>
            </form>
        </div>

    )
}


function Otp({ props }: any) {

    const { showModal, sentedOtp, GlobalRegister, setSentedOtp } = props

    const [error, setOtpError] = useState<string | boolean>(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [otp, setOtp] = useState<string>("");
    const [second, setSecond] = useState(59);
    const [minute, setMinute] = useState(1);
    const [resendTimer, setResendTimer] = useState(29)

    useEffect(() => {
        const timer = setInterval(() => {
            if (resendTimer > 0) {
                setResendTimer(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [resendTimer]);


    useEffect(() => {
        const timer = setInterval(() => {
            setSecond(prevSecond => {
                if (prevSecond === 0) {
                    setMinute(prevMinute => {
                        if (prevMinute === 0) {
                            clearInterval(timer);
                            setOtpError("otp expired");
                            setTimeout(() => { setOtpError(""); }, 2500)
                            setSecond(0);
                            return 0;
                        } else {
                            return prevMinute - 1;
                        }
                    });
                    return 59;
                } else {
                    return prevSecond - 1;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [buttonClicked, minute, second]);



    const EnteringOtp = (e: changeEvent) => {
        setOtpError(false);
        setOtp(e.target.value);
    };

    const validateOtp = async () => {
        if (minute + second === 0) {
            setOtpError("Sorry, the OTP expired. Please try again by requesting a new OTP.");
            return;
        }

        if (otp.trim() === "" || isNaN(Number(otp)) || otp.length === 0) {
            setOtpError("Invalid OTP. Please enter a valid OTP.");
        } else {
            if (otp === sentedOtp.toString()) {
                console.log(GlobalRegister, "this is the user data");
                if (GlobalRegister) {
                    const data = await postSignup(GlobalRegister);
                    console.log(data);
                    if (data.status) {
                        Cookies.set("userToken", data.token, { expires: 7 })
                        window.location.href = '/'
                    } else {
                        Swal.fire({
                            title: "error!",
                            text: data.message,
                            icon: "info",
                        }).then(() => {
                            showModal('signup')
                        })
                    }

                }
            } else {
                setOtpError("OTP does not match. Please try again.");
            }
        }
    };


    const resendOtp = () => {
        if (resendTimer === 0) {
            setButtonClicked(true);
            setSecond(59);
            setMinute(1);
            setOtpError(false);
            setResendTimer(29);
            sendOtp(GlobalRegister?.Email ? GlobalRegister?.Email : "alannixon2005@gmail.com").then((otp) => {
                setSentedOtp(otp + "")
            })

        }
    };

    return (<>
        <div className="m-auto">
            <h2 className='text-3xl' style={{ textAlign: "center" }}><strong className='tracking-wider'>OTP</strong></h2>

            <form className="max-w-md mx-auto mt-10">
                {error && <><p className='error'>{error}</p><br /></>}
                <p>Enter otp in : <span className="error">{minute.toString() === "0" && second.toString() === "0" ? "Otp expired" : ` ${minute} : ${second >= 10 ? second : "0" + second}`}</span></p><br />
                <div className="relative z-0 w-full mb-5 group">
                    <input onChange={EnteringOtp} type="otp" name="otp" id="floating_otp" className="block py-2.5 px-0 w-full text-sm text-white-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-graye dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="floating_otp" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter the Otp</label>
                </div>
                <a href="/signup" style={{ color: "blue" }}> Go back to signup</a>
                <button type="button" onClick={validateOtp} className="float-right text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
        {minute.toString() === "0" && second.toString() === "0" && <p onClick={resendOtp} style={{ marginLeft: "65%", cursor: "pointer" }} ><span className='text-blue-400'>Resend otp </span>{resendTimer !== 0 && <span className='error'>{"in : " + resendTimer}</span>}</p>}
    </>)
}


