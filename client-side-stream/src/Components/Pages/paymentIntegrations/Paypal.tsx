import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { RazorpayInterface } from '../../../Functions/interfaces';

const Paypal: React.FC<{ Data: RazorpayInterface }> = ({ Data }) => {
    const { successPayment, errorPayment, Amount } = Data;

    return (
        <>
            <PayPalScriptProvider options={{ clientId: "test", currency: "USD" }}>
                <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: Amount + "",
                                    currency_code: "USD"
                                }
                            }],
                            intent: "CAPTURE"
                        });
                    }}
                    onApprove={(data, actions) => {
                        if(actions.order){
                            return actions.order.capture().then((details) => {
                                successPayment(details);
                            }).catch((error) => {
                                errorPayment(error);
                            });
                        }
                        return Promise.reject()
                    }}
                    onError={(err) => {
                        errorPayment(err);
                    }}
                />
            </PayPalScriptProvider>
        </>
    );
}

export default Paypal;
