import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import washService from "../services/washService";

const initialState = {
  washes: [],
  wash: {},
  error: false,
  success: false,
  loading: false,
  message: null,
}

// Insert user wash
export const insertWash = createAsyncThunk(
  "wash/insert",
  async(wash, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await washService.insertWash(wash, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Get user washes
export const getUserWashes = createAsyncThunk(
  "wash/userwashes",
  async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await washService.getUserWashes(id, token)

    return data
  }
)

// Get washer washes
export const getWasherWashes = createAsyncThunk(
  "wash/washerwashes",
  async(id, thunkAPI) => {
    const data = await washService.getWasherWashes(id)

    return data
  }
)

// Delete a wash 
export const deleteWash = createAsyncThunk(
  "wash/delete",
  async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await washService.deleteWash(id, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// get wash by id
export const getWash = createAsyncThunk(
  "wash/getwash",
  async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await washService.getWash(id, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// get all washes
export const getWashes = createAsyncThunk(
  "wash/getall", 
  async(_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await washService.getWashes(token)

    return data 
})

export const washSlice = createSlice({
  name: "wash",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(insertWash.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(insertWash.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.wash = action.payload
      state.washes.unshift(state.wash)
      state.message = "Lavagem agendada com sucesso!" 
    })
    .addCase(insertWash.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.wash = {}
    })
    .addCase(getUserWashes.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getUserWashes.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washes = action.payload 
    })
    .addCase(getWasherWashes.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getWasherWashes.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washes = action.payload 
    })
    .addCase(deleteWash.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(deleteWash.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null

      state.washes = state.washes.filter((wash) => {
        return wash._id !== action.payload.id
      })

      state.message = action.payload.message
    })
    .addCase(deleteWash.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.wash = {}
    })
    .addCase(getWash.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getWash.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.wash = action.payload 
    })
    .addCase(getWashes.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getWashes.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washes = action.payload 
    })

  }
})

export const { resetMessage } = washSlice.actions
export default washSlice.reducer