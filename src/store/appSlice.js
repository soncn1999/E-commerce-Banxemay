import { createSlice } from "@reduxjs/toolkit";
import { getAllCategoriesRedux } from './asyncActions';

const initialState = {
    isLoading: false,
    categories: null,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        // Bắt đầu thực hiện action login (Promise pending)
        // builder.addCase(login.pending, (state) => {
        //     // Bật trạng thái loading
        //     state.isLoading = true;
        // });

        builder.addCase(getAllCategoriesRedux.fulfilled, (state, action) => {
            console.log('check category payload >>> ', action.payload);
            state.isLoading = false;
            state.categories = action.payload;
        });

        builder.addCase(getAllCategoriesRedux.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        });
    }
});

export default appSlice.reducer;