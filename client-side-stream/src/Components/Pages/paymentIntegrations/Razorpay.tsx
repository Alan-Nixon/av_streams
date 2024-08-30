import React from 'react';
import { RazorpayInterface } from '../../../Functions/interfaces';

const RazorpayPayment: React.FC<{ Data: RazorpayInterface }> = ({ Data }) => {
    const { successPayment, errorPayment, Amount } = Data


    const handlePayment = () => {
        const options = {
            key: process.env.REACT_APP_RAZORPAY_CLIENT+"",
            amount: Amount * 100,
            currency: 'INR',
            name: 'AV streams',
            description: 'Test payment',
            image: 'https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS427860.jpg',
            notes: {
                address: 'Razorpay Corporate Office'
            },
            theme: {
                color: '#3399cc'
            },
            handler: successPayment,
            modal: {
                ondismiss: errorPayment
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div>
            <button type="button" onClick={handlePayment} style={{ backgroundColor: "white", paddingTop: "1%", paddingBottom: "1%" }} className="px-5 w-full border  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm  text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 me-2 mb-2">
                <img src='/videos/razorpayimage.png' style={{ width: "45px", height: "30px" }} />
                <p className="text-black">Connect with Razorpay</p>
            </button>
        </div>
    );
};

export default RazorpayPayment;
