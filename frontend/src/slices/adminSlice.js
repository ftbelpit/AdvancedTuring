import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"

import adminService from "../services/adminService"

const initialState = {
  admin: {},
  error: false,
  success: false,
  loading: false,
  message: null
}

// Get admin details
export const profileAdmin = createAsyncThunk(
  "admin/profile_admin",
  async(admin, thunkAPI) => {
    const tokenAdmin = thunkAPI.getState().authAdmin.admin.token_admin

    const data = await adminService.profileAdmin(admin, tokenAdmin)
    
    return data
  }
) 

// Update admin details
export const updateProfileAdmin = createAsyncThunk(
  "admin/update_admin",
  async(admin, thunkAPI) => {
    const tokenAdmin = thunkAPI.getState().authAdmin.admin.token_admin
    
    const data = await adminService.updateProfileAdmin(admin, tokenAdmin)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Get admin details
export const getAdminDetails = createAsyncThunk(
  "admin/get_admin",
  async(id_admin, thunkAPI) => {
    const data = await adminService.getAdminDetails(id_admin)

    return data
  }
)

export const adminSlice = createSlice({
  name: "admin", 
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(profileAdmin.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(profileAdmin.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.admin = action.payload
    })
    .addCase(updateProfileAdmin.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(updateProfileAdmin.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.admin = action.payload
      state.message = "Administrador atualizado com sucesso!"
    })
    .addCase(updateProfileAdmin.rejected, (state, action) => {
      console.log(state, action)
      state.loading = false
      state.error = action.payload
      state.admin = {}
    })
    .addCase(getAdminDetails.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getAdminDetails.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.admin = action.payload
    })
  }
}) 

export const {resetMessage} = adminSlice.actions
export default adminSlice.reducer