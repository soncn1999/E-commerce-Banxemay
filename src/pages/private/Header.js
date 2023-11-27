import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './private-style/Admin.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import Swal from 'sweetalert2';
import { getCurrentUserRedux } from '../../store/asyncActions';

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
        if (!isLoggedIn && !user_id) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Phiên làm việc đã hết hạn, hãy đăng nhập lại!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(`/${path.LOGIN}`);
        }

        return () => {
            if (!isLoggedIn) {
                navigate(`/${path.LOGIN}`);
            }
        }
    }, [isLoggedIn]);

    const handleToggle = (idCss) => {
        let element = document.querySelector(`#sub${idCss}`);

        if (element) {
            element.classList.toggle('show');
        }
    }
    return (
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* <!-- Topbar Navbar --> */}
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown no-arrow">
                    <div class="nav-link dropdown-toggle"
                        id="menu-user-admin"
                        onClick={() => handleToggle('menu-user-admin')} style={{ cursor: 'pointer', color: '#000', fontSize: '14px' }}>
                        <span class="mr-2 d-none d-lg-inline">
                            {
                                userCurrent && userCurrent?.email ? userCurrent.email : undefined
                            }
                        </span>
                    </div>
                    {/* <!-- Dropdown - User Information --> */}
                    <div class="dropdown-menu dropdown-menu-left shadow animated--grow-in"
                        aria-labelledby="userDropdown" id="submenu-user-admin" style={{ fontSize: "14px" }}>
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Settings
                        </a>
                        <a class="dropdown-item" href="#">
                            <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Log
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default Header;