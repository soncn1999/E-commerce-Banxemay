import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './public-style/Cart.css';
import { Header, Footer } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCoupons, getListOrderApi } from '../../services/user';
import moment from 'moment';
import path from '../../utils/path';
import Swal from 'sweetalert2';
import { changeUserCart } from '../../store/userSlice';
import { removeCartApi, updateCartEditDetailApi } from '../../services/user';
import { formatter } from '../../utils/helper';

Cart.propTypes = {

};

function Cart(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user_id = useSelector((state) => state.user.id);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userCurrent = useSelector((state) => state.user);

    const [userCart, setUserCart] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    const [coupons, setCoupons] = useState([]);
    // const [orders, setOrders] = useState([]);

    useEffect(() => {
        getListCoupons();
    }, []);

    useEffect(() => {
        if (userCurrent && userCurrent.current && userCurrent.current.cart.length > 0) {
            let cartArr = [...userCurrent.current.cart];
            let cartArrCopy = [];
            let cartArrFilter = cartArr.map((item) => {
                if (!item.product.isRevoked && item.product.quantity > 0) {
                    cartArrCopy.push(item);
                }
            });

            console.log('cart copy >>>', cartArrCopy);

            let totalProductsResult = cartArrCopy.reduce((total, item) => {
                return total + item.quantity;
            }, 0);

            setTotalProduct(totalProductsResult);

            let totalPaymentResult = cartArrCopy.reduce((total, item) => {
                return total + (item.quantity * +item.product.price);
            }, 0);

            setTotalPayment(totalPaymentResult);
        }
    }, [userCurrent.current])

    const getListCoupons = async () => {
        let response = await getAllCoupons();
        if (response && response.success && response.getCoupon?.length > 0) {
            setCoupons(response.getCoupon);
            return response;
        }
    }

    // const getListOrder = async () => {
    //     let response = await getListOrderApi();
    //     if (response && response.success && response.listOrder?.length >= 0) {
    //         setOrders(response.listOrder);
    //         return response;
    //     }
    // }

    //Edit product quantity
    const handleProductQuantity = async (operator, index) => {
        let cartArrCopy = [];
        if (userCart.length == 0) {
            cartArrCopy = [...userCurrent.current.cart];
        } else {
            cartArrCopy = [...userCart];
        }

        let { _id, color } = cartArrCopy[index];
        let product_id = cartArrCopy[index].product._id;

        const productQuantity = cartArrCopy[index].product.quantity;

        console.log('Cart duoc chon >>> ', cartArrCopy[index], " + ", product_id);

        if (cartArrCopy.length > 0) {
            //Biến cart item đang thay đổi số lượng
            let cartArrItem = { ...cartArrCopy[index] };
            //Biến số lượng tương ứng với cart item trên
            let quantityTemp = cartArrItem.quantity;
            //Biến số lượng đang được thay đổi tăng/giảm
            quantityTemp = quantityTemp + operator;

            if (quantityTemp <= productQuantity && quantityTemp > 0) {
                cartArrItem.quantity = quantityTemp;

                cartArrCopy.splice(index, 1, cartArrItem);

                setUserCart(cartArrCopy);

                console.log('Check Cart >>>> ', {
                    _id: cartArrCopy[index]._id,
                    product: cartArrCopy[index].product._id,
                    quantity: quantityTemp,
                    color: color
                });

                if (cartArrCopy[index]._id) {
                    let response = await updateCartEditDetailApi({
                        _id: cartArrCopy[index]._id,
                        product: cartArrCopy[index].product._id,
                        quantity: quantityTemp,
                        color: color
                    });
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Hãy tải lại trang",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

                dispatch(changeUserCart(cartArrCopy));
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Quá số lượng đặt hàng!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }

        //Caculate at Front-end
        let totalProductsResult = cartArrCopy.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        setTotalProduct(totalProductsResult);

        let totalPaymentResult = cartArrCopy.reduce((total, item) => {
            return total + (item.quantity * +item.product.price);
        }, 0);

        setTotalPayment(totalPaymentResult);

    }

    //Remove products in a cart
    const removeProduct = async (index) => {
        let cartArrCopy = [];
        if (userCart.length == 0) {
            cartArrCopy = [...userCurrent.current.cart];
        } else {
            cartArrCopy = [...userCart];
        }

        let _id = cartArrCopy[index]._id;

        if (cartArrCopy.length > 0) {
            cartArrCopy.splice(index, 1);
            setUserCart(cartArrCopy);
        }
        let response = await removeCartApi({
            cart_id: _id
        });

        if (response && response.success) {
            dispatch(changeUserCart(cartArrCopy));
            Swal.fire('Đã bỏ sản phẩm khỏi giỏ hàng!', '', 'success');
        } else {
            Swal.fire('Có lỗi xảy ra!', '', 'error');
        }

        let totalProductsResult = cartArrCopy.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        setTotalProduct(totalProductsResult);

        let totalPaymentResult = cartArrCopy.reduce((total, item) => {
            return total + (item.quantity * +item.product.price);
        }, 0);

        setTotalPayment(totalPaymentResult);
    }

    const handleOpenOrder = () => {
        navigate(`/${path.ORDER}`);
    }

    return (
        <Fragment>
            <Header />
            <div className="" style={{ paddingTop: "150px" }}>
                <div className="card cart">
                    <div className="row">
                        <div className="col-md-8 cart">
                            <div className="title">
                                <div className="row">
                                    <div className="col"><h4><b>GIỎ HÀNG CỦA BẠN</b></h4></div>
                                    <div className="col align-self-center text-right text-muted">{totalProduct} Sản phẩm</div>
                                </div>
                            </div>
                            {
                                userCurrent.isLoggedIn && userCurrent?.current?.cart.length > 0 && userCurrent.current.cart.map((item, index) => {
                                    if (!item.product.isRevoked && item.product.quantity > 0) {
                                        return (
                                            <div className="row border-top border-bottom" key={item._id}>
                                                <div className="row main align-Sản phẩm-center">
                                                    <div className="col-2">
                                                        {
                                                            item?.product?.image?.length > 0 ? <img className="img-fluid" src={item.product.image[0]} /> :
                                                                <img className="img-fluid" src='https://dummyimage.com/450x300/dee2e6/6c757d.jpg' />
                                                        }
                                                    </div>
                                                    <div className="col">
                                                        <div className="row text-muted">Màu sắc: {item.color}</div>
                                                        <div className="row">{item?.product?.title}</div>
                                                    </div>
                                                    <div className="col ajust-quantity">
                                                        <span onClick={() => handleProductQuantity(-1, index)} style={{ cursor: "pointer" }}>-</span>
                                                        &nbsp;
                                                        <span className="border">{item.quantity}</span>
                                                        &nbsp;
                                                        <span onClick={() => handleProductQuantity(+1, index)} style={{ cursor: "pointer" }}>+</span>
                                                    </div>
                                                    <div className="col">{formatter.format(item?.product?.price)} &nbsp;<span className="close" style={{ cursor: 'pointer' }} onClick={() => removeProduct(index)}>&#10005;</span></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                            <div className="back-to-shop">
                                <span className="btn-back">
                                    <Link to={`/${path.HOME}`}>
                                        <i class="fa-solid fa-arrow-left"></i> &nbsp; Quay lại
                                    </Link>
                                </span>
                                {/* <span className="btn-order"><i class="fa-solid fa-circle-check"></i> &nbsp; Đặt hàng</span> */}
                            </div>
                        </div>
                        <div className="col-md-4 summary">
                            <div><h5><b>ĐƠN HÀNG</b></h5></div>
                            <hr />
                            <div className="row">
                                <div className="col" style={{ paddingLeft: "10px" }}>SỐ LƯỢNG: <span>{totalProduct}</span></div>
                                <div className="col text-right"><span>{formatter.format(totalPayment)}</span></div>
                            </div>
                            <form>
                                <p>Vận chuyển</p>
                                <select><option className="text-muted">Standard-Delivery- 5.00 &#8363;</option></select>
                                <p>Phương thức thanh toán</p>
                                <select>
                                    <option className="text-muted">Thanh toán Online (PayPal)</option>
                                </select>
                                {/* <p>Mã giảm giá</p>
                                <select>
                                    {
                                        coupons.length > 0 && coupons.map((item) => {
                                            return <option className="text-muted" value={item._id}>{item.name} (-{item.discount}%)</option>
                                        })
                                    }
                                </select> */}
                            </form>
                            <div className="row" style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "2vh 0" }}>
                                <div className="col">Tổng số</div>
                                <div className="col text-right"> {formatter.format(totalPayment)}</div>
                            </div>
                            <div className="checkout-btn" style={{ cursor: "pointer" }} onClick={() => handleOpenOrder()}>THANH TOÁN</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>

    );
}

export default Cart;