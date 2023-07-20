import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hoursWasherService from "../services/hoursWasherService";

export const addTimeToWasher = createAsyncThunk(
  "hoursWasher/addTimeToWasher",
  async (timeData, thunkAPI) => {
    const { hour, washerId } = timeData;
    const token = thunkAPI.getState().authAdmin.admin.token_admin;

    const data = await hoursWasherService.addTimeToWasher(
      {
        hour,
      },
      washerId,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const removeTimeFromWasher = createAsyncThunk(
  "hoursWasher/removeTimeFromWasher",
  async (timeData, thunkAPI) => {
    const { hour, washerId } = timeData;
    const token = thunkAPI.getState().authAdmin.admin.token_admin;

    const data = await hoursWasherService.removeTimeFromWasher(
      {
        hour,
      },
      washerId,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

const hoursWasherSlice = createSlice({
  name: "hoursWasher",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
    hours: [], // Campo para armazenar os horários
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTimeToWasher.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTimeToWasher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        // Atualizar o campo hours com os horários retornados pelo servidor
        state.hours = action.payload;

        state.message = action.payload.message;
      })
      .addCase(addTimeToWasher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeTimeFromWasher.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTimeFromWasher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        // Atualizar o campo hours removendo o horário
        const removedHour = action.payload.hour;
        state.hours = state.hours.filter((hour) => hour !== removedHour);

        state.message = action.payload.message;
      })
      .addCase(removeTimeFromWasher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
})

export default hoursWasherSlice.reducer