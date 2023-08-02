import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hourService from "../services/hourService";

const initialState = {
  hours: [],
  hour: {},
  error: false,
  success: false,
  loading: false,
  message: null
};

// Adicionar horário a um lavador
export const insertHour = createAsyncThunk(
  "hour/insert",
  async(timeData, thunkAPI) => {
    const { hour, washerId } = timeData;
    const token = thunkAPI.getState().authAdmin.admin.token_admin;

    const data = await hourService.insertHour(
      { 
        hour,
        washerId
      }, 
      timeData.id, 
      token
    );

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Remover horário de um lavador
export const deleteHour = createAsyncThunk(
  "hour/delete",
  async (id, thunkAPI) => {
    const tokenAdmin = thunkAPI.getState().authAdmin.admin.token_admin;

    const data = await hourService.deleteHour(id, tokenAdmin);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Obter horários de um lavador
export const getHours = createAsyncThunk(
  "hour/getall",
  async (washerId, thunkAPI) => {
    const data = await hourService.getHours(washerId);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getAvailableHours = createAsyncThunk(
  "hour/getAvailableHours",
  async (timeData, thunkAPI) => {
    const { washerId, date } = timeData;
    const data = await hourService.getAvailableHours(washerId, date);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const hourSlice = createSlice({
  name: "hour",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertHour.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(insertHour.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.hour = action.payload
        state.hours.unshift(state.hour)
        state.message = action.payload.message
      })
      .addCase(insertHour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hour = {};
      })
      .addCase(deleteHour.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteHour.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.hours = state.hours.filter((hour) => {
          return hour.id !== action.payload.id;
        });

        state.message = action.payload.message;
      })
      .addCase(deleteHour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hour = {};
      })
      .addCase(getHours.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getHours.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.hours = action.payload;
      })
      .addCase(getHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAvailableHours.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAvailableHours.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.hours = action.payload;
      })
      .addCase(getAvailableHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetMessage } = hourSlice.actions;
export default hourSlice.reducer;