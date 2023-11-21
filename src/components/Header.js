import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Header-style/Header.scss';
import { Button, Input } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserRedux, handleLogoutRedux } from '../store/asyncActions';
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

    // console.log('set show quantity cart >>> ', showQuantityOrder);

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
                        <li className="header-above__item">HÃNG XE</li>
                        <li className="header-above__item">DÒNG XE</li>
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
                                    userCurrent && userCurrent?.current?.role != "user" &&
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