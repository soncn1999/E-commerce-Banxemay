import React from 'react';
import PropTypes from 'prop-types';
import './private-style/Admin.css';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../utils/path';

Sidebar.propTypes = {

};

function Sidebar(props) {
    const navigate = useNavigate();
    const handleToggle = (idCss) => {
        let element = document.querySelector(`#sub${idCss}`);

        if (element) {
            element.classList.toggle('show');
        }
    }
    return (
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            {/* <!-- Sidebar - Brand --> */}
            <Link class="sidebar-brand d-flex align-items-center justify-content-center" to={`/${path.HOME}`}>
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-laugh-wink"></i>
                </div>
                <div class="sidebar-brand-text mx-3">Bach Tung</div>
            </Link>

            {/* <!-- Divider --> */}
            <hr class="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard --> */}
            <li class="nav-item active">
                <div class="nav-link collapsed">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span class="collapse-item" onClick={() => navigate(`/${path.PRIVATE}`)} style={{ cursor: 'pointer' }}>Trang quản lý</span>
                </div>
            </li>

            {/* <!-- Divider --> */}
            <div class="sidebar-heading">
                Người dùng
            </div>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-1" onClick={() => handleToggle('menu-title-1')}>
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Chỉnh sửa thông tin</span>
                </div>
                <div class="collapse" id="submenu-title-1">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        <Link class="collapse-item" to={path.LIST_USERS}>Quản lý DS User</Link>
                        <Link class="collapse-item" to={path.LIST_USERS_ADMIN}>Quản lý DS Admin</Link>
                        <Link class="collapse-item" to={path.LIST_USERS_BLOCK}>Quản lý DS bị khóa</Link>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-2" onClick={() => handleToggle('menu-title-2')}>
                    <i class="fas fa-fw fa-wrench"></i>
                    <span>Cấp quyền</span>
                </div>
                <div class="collapse" id="submenu-title-2">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        {/* <a class="collapse-item" href="utilities-color.html">Cấp quyền User</a> */}
                        <Link class="collapse-item" to={`${path.ADD_SYS_USER}`}>Tạo mới và cấp quyền</Link>
                    </div>
                </div>
            </li>
            <hr class="sidebar-divider" />

            <div class="sidebar-heading">
                Sản phẩm
            </div>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-3" onClick={() => handleToggle('menu-title-3')}>
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Chỉnh sửa thông tin</span>
                </div>
                <div class="collapse" id="submenu-title-3">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        <Link to={`${path.PRODUCT_ADD}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Thêm mới sản phẩm
                        </Link>

                        <Link to={`${path.LIST_PRODUCTS}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Quản lý danh sách SP
                        </Link>
                    </div>
                </div>
            </li>
            <hr class="sidebar-divider" />

            <div class="sidebar-heading">
                Thể loại sản phẩm
            </div>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-4" onClick={() => handleToggle('menu-title-4')}>
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Chỉnh sửa thông tin</span>
                </div>
                <div class="collapse" id="submenu-title-4">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        <Link to={`${path.ADD_CATEGORY}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Thêm mới Thể loại
                        </Link>

                        <Link to={`${path.LIST_CATEGORY}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Quản lý danh sách
                        </Link>
                    </div>
                </div>
            </li>
            <hr class="sidebar-divider" />

            <div class="sidebar-heading">
                Hãng sản xuất
            </div>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-5" onClick={() => handleToggle('menu-title-5')}>
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Chỉnh sửa thông tin</span>
                </div>
                <div class="collapse" id="submenu-title-5">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        <Link to={`${path.ADD_BRAND}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Thêm mới hãng sản xuất
                        </Link>

                        <Link to={`${path.LIST_BRAND}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Quản lý danh sách
                        </Link>
                    </div>
                </div>
            </li>
            <hr class="sidebar-divider" />

            <div class="sidebar-heading">
                Đơn hàng
            </div>
            <li class="nav-item">
                <div class="nav-link collapsed" style={{ cursor: 'pointer' }} id="menu-title-6" onClick={() => handleToggle('menu-title-6')}>
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Quản lý đơn hàng</span>
                </div>
                <div class="collapse" id="submenu-title-6">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Thao tác:</h6>
                        <Link to={`${path.LIST_PRODUCTS}`} class="collapse-item" style={{ cursor: 'pointer' }}>
                            Quản lý danh sách
                        </Link>
                    </div>
                </div>
            </li>
            <hr class="sidebar-divider" />
        </ul>
    );
}

export default Sidebar;