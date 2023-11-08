import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategories } from '../services/app';
import { userLoginApi, userRegisterApi, getCurrentUserApi, userLogoutApi } from '../services/user';
import Swal from 'sweetalert2';

export const getAllCategoriesRedux = createAsyncThunk('/product/getallproduct', async () => {
    try {
        const response = await getAllCategories();
        return response;
    } catch (error) {
        console.log(error);
    }
});

export const loginUserRedux = createAsyncThunk('/user/login', async (data) => {
    try {
        const response = await userLoginApi(data);

        if (response && response.success) {
            return response;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Không thể đăng nhập...',
                text: 'Sai tên đăng nhập hoặc mật khẩu!',
            });
        }
    } catch (error) {
        console.log(error);
    }
});

export const registerUserRedux = createAsyncThunk('/user/register', async (data) => {
    try {
        const response = await userRegisterApi(data);
        return response;
    } catch (error) {
        console.log(error);
    }
});

export const getCurrentUserRedux = createAsyncThunk('/user/current', async (data) => {
    try {
        const response = await getCurrentUserApi(data);

        if (response && response.success) {
            return response;
        } else if (response && !response.success) {
            console.log('Token Expired >>> ', response);
        } else {
            console.log('Can not get current user!!!');
        }
    } catch (error) {
        console.log(error);
    }
});

export const handleLogoutRedux = createAsyncThunk('/user/logout', async (data) => {
    try {
        const response = await userLogoutApi();
        if (response && response.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {

    }
});
