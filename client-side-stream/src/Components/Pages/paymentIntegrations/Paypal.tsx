import { PayPalButton } from 'react-paypal-button-v2';
import { RazorpayInterface } from '../../../Functions/interfaces';


const Paypal: React.FC<{ Data: RazorpayInterface }> = ({ Data }) => {
    const { successPayment, errorPayment, Amount } = Data

    return (
        <PayPalButton
            amount={Amount}
            onSuccess={successPayment}
            onError={errorPayment}
        />
    )
}

export default Paypal
