import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Header-style/Header.scss';
import { Button, Input } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserRedux, handleLogoutRedux } from '../store/asyncActions';
import { getAllProductApi, getListBrandApi, getListProductRelateBrandApi, getListProductSortByPriceApi, getAllCategoryApi, getProductByCategoryApi, getAllProductForSearchApi } from '../services/product';
import Swal from 'sweetalert2';
import { GiDeliveryDrone } from 'react-icons/gi';
import { PiSteeringWheelFill } from 'react-icons/pi';
import { MdPayments } from 'react-icons/md';
import { BiUserCircle } from 'react-icons/bi';
import { BsCartFill } from 'react-icons/bs';
import '../style.scss';

Header.propTypes = {

};

function Header(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user_id = useSelector((state) => state.user.id);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userCurrent = useSelector((state) => state.user);
    const [listProduct, setListProduct] = useState({});
    const [brand, setBrand] = useState([]);
    const [listCategory, setListCategory] = useState([]);


    useEffect(() => {
        //User Refresh
        if (!userCurrent.current && isLoggedIn && user_id) {
            dispatch(getCurrentUserRedux(user_id));
        }

        //Token Expired
        // if (!isLoggedIn && !user_id) {
        //     Swal.fire({
        //         position: 'top-end',
        //         icon: 'error',
        //         title: 'Phiên làm việc đã hết hạn, hãy đăng nhập lại!',
        //         showConfirmButton: false,
        //         timer: 1500
        //     });
        //     navigate(`/${path.LOGIN}`);
        // }
        getListBrand();
        getListCategoryApi();
        // getProductByCategory();
        return () => {
            // if (!isLoggedIn) {
            //     navigate(`/${path.LOGIN}`);
            // }
        }
    }, [isLoggedIn]);

    console.log('Current User Header >>> ', userCurrent);

    const handleLogoutUser = () => {
        dispatch(handleLogoutRedux());
    }

    const handleNavigateToCart = () => {
        if (!isLoggedIn && !user_id) {
            Swal.fire({
                title: "Bạn chưa đăng nhập",
                text: "Đăng nhập để vào giỏ hàng",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đăng nhập"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            });
        } else {
            navigate(`/${path.CART}`);
        }
    }

    const getListBrand = async () => {
        let response = await getListBrandApi();
        if (response && response.success) {
            let { data } = response;
            setBrand(data);
        }
        console.log('brand >>> ', response.data);
    }

    const getListCategoryApi = async () => {
        let response = await getAllCategoryApi();
        if (response && response.success) {
            let { productCategories } = response;
            if (productCategories?.length > 0) {
                setListCategory(productCategories);
            }
        }
        console.log('list categories >>> ', response.productCategories)
    }

    // const getProductByCategory = async (data) => {
    //     console.log('data >>> ', data);
    //     let response = await getProductByCategoryApi(data);
    //     if (response && response.success) {
    //         const { success, total, page, product } = response;
    //         setListProduct(product);
    //         setPageInfo({
    //             total, page
    //         })
    //     }
    // }

    // console.log('set show quantity cart >>> ', showQuantityOrder);

    const handleGetProductByOption = (type, title) => {
        console.log('Type >>> ', type, 'title >>> ', title);
        navigate(`/${path.PRODUCTS_FILTER}/${type}=${title}`);
    }

    return (
        <div className="header fixed-top" >
            <div className="header-left">
                <div className="header-left__wrapper">
                    <Link to={`/${path.HOME}`}>
                        <div className="header-left__logo"></div>
                    </Link>
                </div>
            </div>
            <div className="header-right">
                <div className="header-above">
                    <ul className="header-above__list">
                        <li className="header-above__item">
                            <Link to={`/${path.HOME}`} style={{ color: '#fff' }}>
                                TRANG CHỦ
                            </Link></li>
                        <li className="header-above__item">
                            HÃNG XE
                            <div className="header-above__submenu">
                                <ul className="header-above__submenu-list">
                                    {
                                        brand && brand.length > 0 && brand.map((item) => {
                                            return <li className="header-above__submenu-item" onClick={() => handleGetProductByOption('brand', item.title)}>{item.title}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className="header-above__item">
                            DÒNG XE
                            <div className="header-above__submenu">
                                <ul className="header-above__submenu-list">
                                    {
                                        listCategory && listCategory.length > 0 && listCategory.map((item) => {
                                            return <li className="header-above__submenu-item" onClick={() => handleGetProductByOption('category', item.title)}>{item.title}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className="header-above__item">TIN TỨC</li>
                        <li className="header-above__item">TÌM ĐẠI LÝ</li>
                        <li className="header-above__item">LIÊN HỆ</li>
                        <li className="header-above__item user-justify">
                            <div className="header-above__item__user-box">
                                <BiUserCircle />
                                &nbsp;
                                <span>{userCurrent && userCurrent?.current && `${userCurrent.current.firstname} ${userCurrent.current.lastname}`}</span>
                            </div>

                            <ul className="header-above__item__submenu-user">
                                <li className="header-above__item__submenu-item" onClick={() => navigate(`/${path.LOGIN}`)}>
                                    ĐĂNG NHẬP
                                </li>
                                <li className="header-above__item__submenu-item" onClick={() => navigate(`/${path.REGISTER}`)}>
                                    ĐĂNG KÝ
                                </li>
                                {
                                    userCurrent && userCurrent?.current?.role && userCurrent?.current?.role != "user" &&
                                    <li className="header-above__item__submenu-item" onClick={() => navigate(`/${path.PRIVATE}`)}>
                                        TRANG ADMIN
                                    </li>
                                }

                                <li className="header-above__item__submenu-item" style={{ color: 'red' }} onClick={() => handleLogoutUser()}>
                                    ĐĂNG XUẤT
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="header-bellow">
                    <div className="header-bellow__list">
                        <div className="header-bellow__item">
                            <div className="header-bellow__icon"><GiDeliveryDrone /></div>
                            <div className="header-bellow__content">
                                <div className="header-bellow__content-title">GIAO HÀNG</div>
                                <div className="header-bellow__content-desc">Vận chuyển toàn quốc</div>
                            </div>
                        </div>

                        <div className="header-bellow__item">
                            <div className="header-bellow__icon"><PiSteeringWheelFill /></div>
                            <div className="header-bellow__content">
                                <div className="header-bellow__content-title">LÁI THỬ</div>
                                <div className="header-bellow__content-desc">Trải nghiệm sản phẩm</div>
                            </div>
                        </div>

                        <div className="header-bellow__item">
                            <div className="header-bellow__icon"><MdPayments /></div>
                            <div className="header-bellow__content">
                                <div className="header-bellow__content-title">THANH TOÁN</div>
                                <div className="header-bellow__content-desc">Thanh toán linh hoạt</div>
                            </div>
                        </div>

                        <div className="header-bellow__item" onClick={() => handleNavigateToCart()} style={{ cursor: 'pointer' }}>
                            <div className="header-bellow__icon cart--color"><BsCartFill /></div>
                            <div className="header-bellow__content">
                                <div className="header-bellow__content-title cart--title">GIỎ HÀNG</div>
                                <div className="header-bellow__content-desc">{userCurrent && userCurrent?.current && userCurrent.current?.cart.length} sản phẩm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;