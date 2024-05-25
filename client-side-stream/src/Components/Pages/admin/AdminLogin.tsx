import React, { useState } from "react";
import { TERipple } from "tw-elements-react";
import { adminPostLogin } from "../../../Functions/userFunctions/adminManagement";
import { result } from "../../../Functions/interfaces";
import Cookies from "js-cookie";

export default function AdminLogin() {
    const [adminData, setAdminData] = useState({ Email: "", Password: "" })
    const [error, setError] = useState({ emailErr: "", passwordErr: "" })

    const creadentialsEnter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminData((rest) => ({ ...rest, [e.target.name]: e.target.value }))
        setError((rest) => ({ ...rest, [e.target.name.toLowerCase() + "Err"]: "" }))
    }

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9_@]{8,}$/;
console.log(adminData);

        if (emailRegex.test(adminData.Email)) {
            if (passwordRegex.test(adminData.Password)) {
                adminPostLogin(adminData).then((result: result) => {
                    if (!result.status) {
                        setError((rest) => ({ ...rest, emailErr: result.message }))
                    } else {
                        console.log(result.token, "admin token");
                        Cookies.set('adminToken', result.token || "", { expires: 7 })
                        window.location.href = '/admin'
                    }
                })
            } else {
                setError((rest) => ({ ...rest, passwordErr: "Password should be 8 characters with letters, numbers, @, or _" }))
            }
        } else {
            setError((rest) => ({ ...rest, emailErr: "Please enter a valid email" }))
        }

    }
    return (
        <section className=" bg-neutral-200 dark:bg-neutral-700">
            <div className="container h-full p-10">
                <div className=" ml-8 flex  flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200" style={{ marginLeft: "7%" }}>
                    <div className="w-full" >
                        <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800" >
                            <div className="g-0 lg:flex lg:flex-wrap">
                                {/* <!-- Left column container--> */}
                                <div className="px-4 md:px-0 lg:w-6/12" style={{ margin: "auto" }}>
                                    <div className="md:mx-6 md:p-12">
                                        {/* <!--Logo--> */}
                                        <div className="text-center">
                                            <img
                                                className="mx-auto w-48 rounded-full"
                                                src="https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS427860.jpg"
                                                alt="logo"
                                            />
                                            <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                                                AV STREAMS ADMIN
                                            </h4>
                                        </div>

                                        <form>

                                            <div className="mb-5">
                                                {error.emailErr && <p className="error">{error.emailErr}</p>}
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                                <input name="Email" autoComplete="email" onChange={creadentialsEnter} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
                                            </div>
                                            <div className="mb-5">
                                                {error.passwordErr && <p className="error">{error.passwordErr}</p>}
                                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                                <input name="Password" onChange={creadentialsEnter} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your password here" required autoComplete="current-password" />
                                            </div>

                                            {/* <!--Submit button--> */}
                                            <div className="mb-12 pb-1 pt-1 text-center">
                                                <TERipple rippleColor="light" className="w-full">
                                                    <button onClick={handleSubmit}
                                                        className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                                        type="button"
                                                        style={{
                                                            background:
                                                                "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                                                        }}
                                                    >
                                                        Log in
                                                    </button>
                                                </TERipple>
                                            </div>


                                        </form>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}