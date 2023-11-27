import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Footer, Header } from '../../components';
import './public-style/Order.scss';
import payment from '../../assets/order/WomanShoppingOnline.gif';
import deliveryboy from '../../assets/order/DeliveryBoy.gif';
import { formatter } from '../../utils/helper';
import path from '../../utils/path';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './public-style/Cart.css';
import PayPal from './PayPal';
import axios from 'axios';
import { updateAddress } from '../../store/userSlice';
import { updateUserApi, handleCheckOutProduct, updateCartProductResetApi } from '../../services/user';
import { emitter } from '../../utils/Emitter';
import { getCurrentUserRedux } from '../../store/asyncActions';

Order.propTypes = {

};

function Order(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userCurrent = useSelector((state) => state.user);
    const addressUser = useSelector((state) => state.user.address);
    const user_id = useSelector((state) => state.user.id);

    const [userCart, setUserCart] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [address, setAddress] = useState({
        province: '',
        district: '',
        commune: '',
        residence: '',
    });
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [commune, setCommune] = useState('');

    useEffect(() => {
        if (userCurrent && userCurrent.current && userCurrent.current.cart.length > 0) {
            let cartArr = [...userCurrent.current.cart];
            let cartArrCopy = [];
            let cartArrFilter = cartArr.map((item) => {
                if (!item.product.isRevoked && item.product.quantity > 0) {
                    cartArrCopy.push(item);
                }
            });

            let totalProductsResult = cartArrCopy.reduce((total, item) => {
                return total + item.quantity;
            }, 0);

            setTotalProduct(totalProductsResult);

            let totalPaymentResult = cartArrCopy.reduce((total, item) => {
                return total + (item.quantity * +item.product.price);
            }, 0);

            setTotalPayment(totalPaymentResult);
        }

        getProvince();

        listenToEmitter();

    }, [userCurrent.current])

    const listenToEmitter = () => {
        emitter.on('EVENT_CLEAR_MODAL_DATA', (data) => {
            dispatch(getCurrentUserRedux(user_id));
            navigate(`/`);
        });
    }

    const getProvince = async () => {
        // replace this url with your server
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(function (response) {
                // xử trí khi thành công
                if (response && response.status == 200) {
                    setProvince(response.data);
                }
            })
            .catch(function (error) {
                // xử trí khi bị lỗi
                console.log(error);
            })
            .finally(function () {
                // luôn luôn được thực thi
            });
    }

    const getDistrict = async (p) => {
        axios.get(`https://provinces.open-api.vn/api/p/${p}?depth=2`)
            .then(function (response) {
                // xử trí khi thành công
                if (response && response.status == 200) {
                    setDistrict(response.data.districts);
                }
            })
            .catch(function (error) {
                // xử trí khi bị lỗi
                console.log(error);
            })
            .finally(function () {
                // luôn luôn được thực thi
            });
    }

    const getCommune = async (d) => {
        axios.get(`https://provinces.open-api.vn/api/d/${d}?depth=2`)
            .then(function (response) {
                // xử trí khi thành công
                console.log('fetch wards >>> ', response);
                if (response && response.status == 200) {
                    setCommune(response.data.wards);
                }
            })
            .catch(function (error) {
                // xử trí khi bị lỗi
                console.log(error);
            })
            .finally(function () {
                // luôn luôn được thực thi
            });
    }

    const setSelectProvince = async (event) => {
        let code = event.slice(0, 2);
        let province = event.slice(2).trim();
        let addressCopy = { ...address };
        addressCopy.province = province;
        setAddress(addressCopy);
        await getDistrict(+code);
    }

    const setSelectedDistrict = async (event) => {
        let code = event.slice(0, 3);
        let district = event.slice(3).trim();
        let addressCopy = { ...address };
        addressCopy.district = district;
        setAddress(addressCopy);
        await getCommune(+code);
    }

    const handleConfirmAddress = async () => {
        if (!address.residence.length > 0 || !address.commune.length > 0 || !address.district.length > 0 || !address.province.length > 0) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Bạn đã nhập thiếu thông tin đặt hàng!",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        let userAddress = `${address.residence} - ${address.commune} - ${address.district} - ${address.province}`;
        dispatch(updateAddress(userAddress));
        let response = await updateUserApi({
            address: userAddress
        });
        if (response && response.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Đặt địa chỉ giao hàng thành công!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Đặt địa chỉ giao hàng không thành công!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    const handleOderCOD = () => {
        Swal.fire({
            title: "Bạn muốn đặt hàng?",
            text: "Hãy xác nhận!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận đặt hàng"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!address.residence.length > 0 || !address.commune.length > 0 || !address.district.length > 0 || !address.province.length > 0) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Bạn đã nhập thiếu thông tin đặt hàng!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
            }
            let response = await handleCheckOutProduct({
                totalItem: totalProduct,
                status: 'Processing',
                isCheckOut: false
            });
            if (response && response.success) {
                await updateCartProductResetApi();
                Swal.fire({
                    title: "Bạn đã đặt hàng thành công, đơn hàng sẽ được vận chuyển.",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                    background: `#fff url(/images/trees.png)`,
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("/images/nyan-cat.gif")
                      left top
                      no-repeat
                    `
                });
                dispatch(getCurrentUserRedux(user_id));
                navigate(`/`);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Có lỗi, Bạn hãy thử lại hoặc liên hệ quản trị!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    return (
        <>
            <Header />
            <div className="" style={{ paddingTop: "150px", minHeight: "580px" }}>
                <div className="card cart">
                    <div className="row">
                        <div className='order-wrapper'>
                            <div className='order-image'>
                                <div className="cart">
                                    <div style={{ paddingBottom: '5px' }}><h4><b>ĐỊA CHỈ NHẬN HÀNG: {address.province}  {address.district}  {address.commune}  {address.residence}</b></h4></div>

                                    <div className="order-address">
                                        <select class="form-select" aria-label="Default select example" className="order-input" name="province" onChange={(event) => setSelectProvince(event.target.value)}>
                                            <option selected value=''>Chọn tỉnh/thành phố</option>
                                            {
                                                province && province?.length > 0 && province.map((item) => {
                                                    return <option value={`${item.code} ${item.name}`}>{item.name}</option>
                                                })
                                            }
                                        </select>

                                        <select class="form-select" aria-label="Default select example" className="order-input" name="district" onChange={(event) => setSelectedDistrict(event.target.value)}>
                                            <option selected value=''>Chọn huyện/quận</option>
                                            {
                                                district && district?.length > 0 && district.map((item) => {
                                                    return <option value={`${item.code}  ${item.name}`}>{item.name}</option>
                                                })
                                            }
                                        </select>

                                        <select class="form-select" aria-label="Default select example" className="order-input" name="commune" onChange={(event) => setAddress({ ...address, [event.target.name]: event.target.value })}>
                                            <option selected value=''>Chọn xã/phường</option>
                                            {
                                                commune && commune?.length > 0 && commune.map((item) => {
                                                    return <option value={`${item.name}`}>{item.name}</option>
                                                })
                                            }
                                        </select>

                                        <div class="form-group">
                                            <input name="residence" class="form-control" className="order-input" id="exampleFormControlInput1" placeholder="Địa chỉ cụ thể (số nhà, thôn/xóm)" onChange={(event) => setAddress({ ...address, [event.target.name]: event.target.value })} />
                                            <div className="btn btn-success" onClick={() => handleConfirmAddress()}>Xác nhận địa chỉ</div>
                                        </div>
                                    </div>

                                    <div style={{ paddingBottom: '5px', cursor: 'pointer' }}><h4><b>PHƯƠNG THỨC THANH TOÁN</b></h4></div>

                                    <button type="button" class="btn btn-primary btn-lg mb-3 mt-0" style={{ fontWeight: 550 }} onClick={() => handleOderCOD()}>
                                        <i class="fa-solid fa-truck-fast"></i>
                                        &nbsp;
                                        Thanh toán khi nhận hàng
                                    </button>

                                    <div>
                                        <PayPal
                                            amount={Math.floor((totalPayment / 24265).toFixed(3))}
                                            payload={
                                                {
                                                    totalItem: totalProduct,
                                                    status: 'Processing',
                                                }
                                            }
                                        />
                                    </div>

                                    <img src={payment} alt="payment" className="order-image__illustration" />
                                </div>
                            </div>
                            <div className='order-payment'>
                                <div className="col-md-12 cart">
                                    <div className="title">
                                        <div className="row">
                                            <div className="col"><h4><b>THANH TOÁN ĐƠN HÀNG</b></h4></div>
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
                                                            &nbsp;
                                                            <div className="col ajust-quantity" style={{ display: 'flex' }}>
                                                                {/* <span onClick={() => handleProductQuantity(-1, index)} style={{ cursor: "pointer" }}>-</span>
                                                            &nbsp; */}
                                                                <span className="" style={{ margin: 'auto' }}>Số lượng: {item.quantity}</span>
                                                                {/* &nbsp;
                                                            <span onClick={() => handleProductQuantity(+1, index)} style={{ cursor: "pointer" }}>+</span> */}
                                                            </div>
                                                            <div className="col" style={{ display: 'flex' }}>
                                                                <span style={{ margin: 'auto' }}>{formatter.format(item?.product?.price)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                    <div className="row" style={{ display: 'flex', marginTop: '10px' }}>
                                        <div><h4><b>THANH TOÁN: </b></h4></div>
                                        <div className="text-right" style={{ color: '#e5091c', fontSize: '16px' }}><span>{formatter.format(totalPayment)}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Order;