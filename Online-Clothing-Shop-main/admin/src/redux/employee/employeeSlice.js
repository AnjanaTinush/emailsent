import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEmployee: null,
  error: null,
  loading: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    employeeLoginStart: (state) => {
      state.loading = true;
    },
    employeeLoginSuccess: (state, action) => {
      state.currentEmployee = action.payload;
      state.loading = false;
      state.error = null;
    },
    employeeLoginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    employeeLogout: (state) => {
      state.currentEmployee = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  employeeLoginStart,
  employeeLoginSuccess,
  employeeLoginFailure,
  employeeLogout,
} = employeeSlice.actions;

export default employeeSlice.reducer;