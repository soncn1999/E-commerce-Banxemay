import axios from '../axios';

const userRegisterApi = (data) => axios({
    url: '/user/register',
    method: 'post',
    data
});

//By Admin
const changeUserRoleApi = (id, data) => axios({
    url: `/user/updateuserbyadmin?id=${id}`,
    method: 'put',
    data
});

//By Admin
const getListCurrentUserApi = (data) => axios({
    url: '/user/getallusers',
    method: 'get'
});

const userLoginApi = (data) => axios({
    url: '/user/login',
    method: 'post',
    data
});

const userLogoutApi = () => axios({
    url: '/user/logout',
    method: 'get'
});

const getCurrentUserApi = (data) => axios({
    url: `/user/current/${data}`,
    method: 'get',
});

const getAllCoupons = () => axios({
    url: '/coupon/get-coupon',
    method: 'get'
});

const getListOrderApi = () => axios({
    url: '/order/get-list-order',
    method: 'get'
});

const updateCartApi = (data) => axios({
    url: '/user/update-cart-product-add',
    method: 'put',
    data: data
});

const removeCartApi = (data) => axios({
    url: '/user/update-cart-product-remove',
    method: 'put',
    data: data
});

const updateCartEditDetailApi = (data) => axios({
    url: '/user/update-cart-product-edit',
    method: 'put',
    data: data
});

const handleBlockUserApi = (data) => axios({
    url: `/user/blockuser/${data}`,
    method: 'put',
});

const handleRemoveBlockUserApi = (data) => axios({
    url: `/user/removeblockuser/${data}`,
    method: 'put',
});

const handleGetListBlockUserApi = () => axios({
    url: '/user/getlistblockuser',
    method: 'get'
})

export {
    userRegisterApi, userLoginApi, getCurrentUserApi, getAllCoupons, getListOrderApi,
    updateCartApi, removeCartApi, updateCartEditDetailApi, changeUserRoleApi, getListCurrentUserApi,
    userLogoutApi, handleBlockUserApi, handleRemoveBlockUserApi, handleGetListBlockUserApi
}