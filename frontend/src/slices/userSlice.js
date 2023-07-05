import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"

import userService from "../services/userService"

const initialState = {
  users: [],
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null
}

// Get user details
export const profile = createAsyncThunk(
  "user/profile",
  async(user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await userService.profile(user, token)
    
    return data
  }
) 

// Get user details
export const getUserDetails = createAsyncThunk(
  "user/get",
  async(id, thunkAPI) => {
    const data = await userService.getUserDetails(id)

    return data
  }
)

export const getUsers = createAsyncThunk(
  "user/getall", 
  async(_, thunkAPI) => {
    const token = thunkAPI.getState().authAdmin.admin.token_admin

    const data = await userService.getUsers(token)

    return data 
})

export const userSlice = createSlice({
  name: "user", 
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(profile.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(profile.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.user = action.payload
    })
    .addCase(getUserDetails.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getUserDetails.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.user = action.payload
    })
    .addCase(getUsers.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.users = action.payload 
    })
  }
}) 

export const {resetMessage} = userSlice.actions
export default userSlice.reducer