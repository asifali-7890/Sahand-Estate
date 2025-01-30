import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isFetching: false,
    error: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signinStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        signinSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        signinFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUserSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        updateUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteUserSuccess: (state) => {
            state.isFetching = false;
            state.currentUser = null;
        },
        deleteUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        signOutUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        signOutUserSuccess: (state) => {
            state.isFetching = false;
            state.currentUser = null;
        },
        signOutUserFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    signinStart,
    signinSuccess,
    signinFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
