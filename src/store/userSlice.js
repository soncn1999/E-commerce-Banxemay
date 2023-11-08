import { createSlice } from "@reduxjs/toolkit";
import { loginUserRedux, registerUserRedux, getCurrentUserRedux, handleLogoutRedux } from './asyncActions';

const initialState = {
    isLoggedIn: false,
    isTokenValid: false,
    current: null,
    token: null,
    id: '',
    email: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUserCart: (state, action) => {
            console.log('check slide >>> ', action.payload);
            let stateCopy = { ...state.current };
            stateCopy.cart = action.payload;
            state.current = stateCopy;
        },
        // registerUser: (state, action) => {

        // }
    },

    extraReducers: (builder) => {
        // Bắt đầu thực hiện action login (Promise pending)
        // builder.addCase(login.pending, (state) => {
        //     // Bật trạng thái loading
        //     state.isLoading = true;
        // });

        builder.addCase(loginUserRedux.fulfilled, (state, action) => {
            console.log('check login payload >>> ', action.payload);
            if (action.payload && action.payload.accessToken) {
                state.isLoggedIn = true;
                state.current = action.payload?.data;
                state.id = action.payload?.data?._id;
                state.email = action.payload?.data?.email;
                state.token = action.payload?.accessToken;
                state.isTokenValid = true
            } else {
                state.isLoggedIn = false;
                state.current = null;
                state.id = null;
                state.email = null;
                state.token = null;
                state.isTokenValid = false;
            }
        });

        builder.addCase(registerUserRedux.fulfilled, (state, action) => {
            console.log('check register payload >>> ', action.payload);
            state.isLoggedIn = true;
            state.current = action.payload?.data;
            state.id = action.payload?.data?._id;
            state.email = action.payload?.data?.email;
            state.token = action.payload?.accessToken;
            state.isTokenValid = true
        });

        builder.addCase(getCurrentUserRedux.fulfilled, (state, action) => {
            console.log('check current payload >>> ', action.payload);
            if (action.payload && action.payload.success) {
                state.current = action.payload?.data;
            } else {
                state.isLoggedIn = false;
                state.current = null;
                state.id = null;
                state.email = null;
                state.token = null;
                state.isTokenValid = false;
            }
        });

        builder.addCase(handleLogoutRedux.fulfilled, (state, action) => {
            console.log('payload >>> ', action.payload);

            state.isLoggedIn = false;
            state.current = null;
            state.id = null;
            state.email = null;
            state.token = null;
            state.isTokenValid = false;

        })

        // builder.addCase(loginUserRedux.rejected, (state, action) => {
        //     console.log('Token Expired!!!');
        //     state.isLoggedIn = false;
        //     state.errorMessage = action.payload;
        // });
    },
});

export const { changeUserCart } = userSlice.actions;

export default userSlice.reducer;