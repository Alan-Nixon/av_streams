import { useEffect, useState } from 'react';
import { addMoneyToWallet, getWalletDetails, withDrawMoneyToWallet } from '../../../../Functions/userFunctions/userManagement';
import { useUser } from '../../../../UserContext';
import Paypal from '../../paymentIntegrations/Paypal';
import Swal from 'sweetalert2';
import RazorpayPayment from '../../paymentIntegrations/Razorpay';
import { WalletDetails, changeEvent } from '../../../../Functions/interfaces';
import { Pagination } from '../helpers/HelperComponents';
import { useSelector } from 'react-redux';

export default function WalletSection() {
    const { user } = useUser()
    const [Amount, setAmount] = useState(0)
    const [error, setError] = useState("")
    const [validAmount, setValidAmount] = useState(false)
    const [showAddWithdraw, setShowAddWithdraw] = useState<string>("")
    const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [pagination, setPagination] = useState<number>(5);

    const width = useSelector((state: any) => state?.sideBarRedux?.width)


    useEffect(() => {
        if (user && user._id) {
            getWalletDetails(user._id).then(({ Data }) => {
                setWalletDetails(Data)
                setLoading(false)
            })
        }
    }, [user])


    const onChangeFunc = (e: changeEvent) => {
        const value = Number(e.target.value)
        if (walletDetails) {
            if (showAddWithdraw === "Withdraw" && value > walletDetails?.Balance) {
                setError("amount greater than balance")
                setValidAmount(false)
            } else if (!isNaN(value) && value > 10 && value < 100000) {
                setAmount(value)
                setError("")
                setValidAmount(true)
            } else {
                setError("Enter a valid amount")
                setValidAmount(false)
            }
        } else {
            setError("walletDetails not found")
        }
    }

    const responseFunction = (add: boolean, result: any, Data: any) => {
        Swal.fire({
            title: result.status ? `successfully ${add ? "added" : "withdrawed"}` : "Error occured",
            text: result.status ? `successfully ${add ? "added" : "withdrawed"} the amount` : result.message,
            icon: result.status ? "success" : "error"
        }).then(() => {
            if (walletDetails?.Balance) {
                const updatedWalletDetails: WalletDetails = {
                    ...walletDetails!,
                    Balance: add ? walletDetails?.Balance + Amount : walletDetails?.Balance - Amount,
                    Transactions: [
                        ...(walletDetails?.Transactions || []),
                        {
                            amount: Data.amount,
                            credited: Data.credited,
                            transactionId: Data.transactionId,
                            createdTime: Data.createdTime
                        }
                    ]
                };
                setWalletDetails(updatedWalletDetails);
                setShowAddWithdraw("")
            }
        })
    }


    const successPayment = (response: any) => {
        const Data = {
            userId: user?._id,
            amount: Number(Amount),
            walletId: walletDetails?._id,
            credited: showAddWithdraw === "Add Money" ? true : false,
            transactionId: response.razorpay_payment_id || 'paypal_transacion_' + Date.now(),
            createdTime: new Date().toISOString().toString()
        }
        if (showAddWithdraw === "Add Money") {
            addMoneyToWallet(Data).then((result) => {
                responseFunction(true, result, Data)
            })
        } else {
            withDrawMoneyToWallet(Data).then((result) => {
                responseFunction(false, result, Data)
            })
        }
    }

    const errorPayment = (error: any) => {
        Swal.fire({
            title: "Error occured",
            text: error || "Payment cancelled",
            icon: "error"
        })
    }

    const paginationTransactions = (next: boolean) => {
        if (walletDetails?.Transactions) {
            if (next) {
                if (pagination < walletDetails.Transactions.length) {
                    setPagination(pagination + 5)
                }
            } else {
                if (pagination > 5) {
                    setPagination(pagination - 5)
                }
            }
        }
        return null
    }

    function showTime(date: string) {
        const data = new Date(date)
        return data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()
    }

    return (<>{loading ? <>
        <div className="lds-dual-ring"></div>
    </> : <>
        <div className={width < 900 ? "ml-14 block" : "ml-8 mt-6 flex"}>

            <div className={`w-${width >= 900 ? "3/4" : "full"} max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700`} style={{ maxHeight: "284px", marginTop: "5%" }}>
                <div className="flex flex-col items-center pb-10 mt-5">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user?.profileImage} alt="Bonnie image" />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user?.FullName}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wallet balance : {walletDetails?.Balance}</span>
                    <div className="sm:flex-wrap md:flex mt-4 md:mt-6">
                        <p onClick={() => setShowAddWithdraw("Add Money")} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Money</p>
                        <p onClick={() => setShowAddWithdraw("Withdraw")} className="py-2 px-4 sm:mt-2 md:mt-0 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 tracking-wide">Withdraw</p>
                    </div>
                </div>

                {showAddWithdraw !== "" && <div className=" max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ marginTop: "5%" }}>
                    <div className="flex flex-col items-center pb-10 mt-5">
                        {showAddWithdraw}
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user?.FullName}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Wallet balance : {walletDetails?.Balance}</span>
                        <div className="mt-4 md:mt-6">
                            <div className='mb-2'>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{error === "" ? "Enter the amount" : <p className='error'>{error}</p>}</label>
                                <input onChange={onChangeFunc} type="text" id="amount" placeholder="ex:1000" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            {Amount !== 0 && validAmount && <>
                                <Paypal Data={{ Amount, successPayment, errorPayment }} />
                                <RazorpayPayment Data={{ Amount, successPayment, errorPayment }} />
                            </>}
                        </div>
                    </div>
                </div>}

            </div>

            <div className={!showAddWithdraw ? "w-3/4 mt-8 ml-12" : "w-3/4 ml-2 " + (width < 900 ? "mt-80" : "mt-5")} >
                {walletDetails?.Transactions && walletDetails?.Transactions.length !== 0 && <>
                    <div className="flex">
                        <h2 className={width < 570 ? "hidden" : 'text-3xl'}>Transactions</h2>
                        <h2 className='text-2xl' style={{ marginLeft: "auto", marginRight: "3%" }}>Wallet Balance : {walletDetails?.Balance}</h2>
                    </div>
                </>}
                <div className="transaction">
                    {walletDetails?.Transactions && walletDetails?.Transactions.length !== 0 ? walletDetails?.Transactions.map((trans, index) => {
                        return (<>{(index + 1 <= pagination && index >= pagination - 5) ? <>
                            <div className="mb-5 mr-5 mt-2  pl-6 border  rounded-lg shadow bg-gray-800 border-gray-700">
                                <div className="flex mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={trans.credited ? "#23b505" : "red"} className='w-7 h-7 text-gray-400' viewBox="0 0 640 512">
                                        <path d="M96 96V320c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zm64 160c35.3 0 64 28.7 64 64H160V256zM224 96c0 35.3-28.7 64-64 64V96h64zM576 256v64H512c0-35.3 28.7-64 64-64zM512 96h64v64c-35.3 0-64-28.7-64-64zM288 208a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V360c0 66.3 53.7 120 120 120H520c13.3 0 24-10.7 24-24s-10.7-24-24-24H120c-39.8 0-72-32.2-72-72V120z" />
                                    </svg>&nbsp;&nbsp; {trans.credited ? "+" : "-"}&nbsp;{trans.amount}
                                </div>
                                <p>
                                    <h5 className="mb-2 text-xl font-semibold tracking-tight text-white">Money {trans.credited ? "Credited" : "Debited"} To Your Wallet</h5>
                                </p>
                                <p className="mb-3 font-normal text-gray-400">Date : {showTime(trans.createdTime)}</p>
                            </div></> : <></>}
                        </>)
                    })
                        : <>
                            <h2 className="text-2xl mt-20" style={{ textAlign: "center" }}>No transactions yet</h2>
                        </>
                    }
                </div>
            </div>
        </div>

        {walletDetails?.Transactions && <>
            <Pagination pagination={pagination} maxCount={5} paginationFunc={paginationTransactions} Data={walletDetails.Transactions} />
        </>}


    </>}

    </>)
}
