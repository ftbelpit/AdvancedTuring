import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAuthService from "../services/adminAuthService";

const admin = JSON.parse(localStorage.getItem("admin"))

const initialState = {
  admin: admin ? admin : null,
  error: false,
  success: false,
  loading: false,
}

// Logout an admin
export const logoutAdmin = createAsyncThunk("authAdmin/logout_admin", async() => {
  await adminAuthService.logoutAdmin()
})

// Sign in an admin
export const loginAdmin = createAsyncThunk(
  "authAdmin/login_admin",
  async (admin, thunkAPI) => {
    const data = await adminAuthService.loginAdmin(admin)

    // check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

export const adminAuthSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    resetAdmin: (state) => {
      state.loading = false
      state.error = false
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(logoutAdmin.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.admin = null
    })
    .addCase(loginAdmin.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.admin = action.payload
    })
    .addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.admin = null
    })
  }
})

export const {resetAdmin} = adminAuthSlice.actions
export default adminAuthSlice.reducer