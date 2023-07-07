import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import washerService from "../services/washerService";

const initialState = {
  washers: [],
  washer: {},
  error: false,
  success: false,
  loading: false,
  message: null,
}

// Insert washer
export const insertWasher = createAsyncThunk(
  "washer/insert",
  async(washer, thunkAPI) => {
    const tokenAdmin = thunkAPI.getState().authAdmin.admin.token_admin

    const data = await washerService.insertWasher(washer, tokenAdmin)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

export const getWasher = createAsyncThunk(
  "washer/getwasher",
  async(id, thunkAPI) => {

    const data = await washerService.getWasher(id)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// get all washers
export const getWashers = createAsyncThunk(
  "washer/getall", 
  async(_, thunkAPI) => {
    const data = await washerService.getWashers()

    return data 
})

export const assessments = createAsyncThunk(
  "washer/assessments",
  async(assessmentData, thunkAPI) => {
    const { score, assessment, userName, userId } = assessmentData;
    const token = thunkAPI.getState().auth.user.token;

    const data = await washerService.assessments(
      { 
        score,
        assessment,
        userName,
        userId
      }, 
      assessmentData.id, 
      token
    );

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

export const washerSlice = createSlice({
  name: "washer",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(insertWasher.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(insertWasher.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washer = action.payload
      state.washers.unshift(state.washer)
      state.message = "Lavador cadastrado com sucesso!" 
    })
    .addCase(insertWasher.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.wash = {}
    })
    .addCase(getWasher.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getWasher.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washer = action.payload 
    })
    .addCase(getWashers.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getWashers.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.washers = action.payload 
    })
    .addCase(getWashers.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.washer = {}
    })
    .addCase(assessments.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    
      const { score, assessment, userName, userId } = action.payload.assessment;
    
      state.washer.assessments.push({
        score,
        assessment,
        userName,
        userId,
      });
    
      state.message = action.payload.message;
    })
    .addCase(assessments.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  }
})

export const { resetMessage } = washerSlice.actions
export default washerSlice.reducer