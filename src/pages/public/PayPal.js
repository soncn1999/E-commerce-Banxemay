import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import { handleCheckOutProduct, updateCartProductResetApi } from '../../services/user';
import { emitter } from "../../utils/Emitter";

// This value is from the props in the UI
const style = { "layout": "vertical", "color": "gold" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount, payload }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options, currency: currency
            }
        });
    }, [currency, showSpinner])
    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: { currency_code: currency, value: amount }
                            }
                        ]
                    }).then((orderId) => orderId)
                }}
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    if (response.status === 'COMPLETED') {

                        payload.isCheckOut = true;

                        let checkOutApiStatus = await handleCheckOutProduct({
                            totalItem: payload.totalItem,
                            status: payload.status,
                            isCheckOut: payload.isCheckOut
                        });

                        if (checkOutApiStatus && checkOutApiStatus.success) {
                            Swal.fire({
                                title: "Thành công!",
                                text: "Bạn đã thanh toán đơn hàng!",
                                icon: "success"
                            });
                            await updateCartProductResetApi();
                            emitter.emit('EVENT_CLEAR_MODAL_DATA', {
                                'id': 'your id',
                            });
                        } else {
                            Swal.fire({
                                title: "Oops!",
                                text: "Bạn chưa thanh toán được đơn hàng!",
                                icon: "error"
                            });
                        }
                    }
                })}
            />
        </>
    );
}

export default function PayPal({ amount, payload }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "125px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}