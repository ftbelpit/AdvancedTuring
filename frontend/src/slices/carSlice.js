import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import carService from "../services/carService";

const initialState = {
  cars: [],
  car: {},
  error: false,
  success: false,
  loading: false,
  message: null,
}

// Insert user car
export const insertCar = createAsyncThunk(
  "car/insert",
  async(car, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await carService.insertCar(car, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Get user cars
export const getUserCars = createAsyncThunk(
  "car/usercars",
  async(id, thunkAPI) => {
    const data = await carService.getUserCars(id)

    return data
  }
)

// Delete a car 
export const deleteCar = createAsyncThunk(
  "car/delete",
  async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await carService.deleteCar(id, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// get car by id
export const getCar = createAsyncThunk(
  "car/getcar",
  async(id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await carService.getCar(id, token)

    // Check for errors
    if(data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// get all cars
export const getCars = createAsyncThunk(
  "car/getall", 
  async(_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await carService.getCars(token)

    return data 
})

export const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(insertCar.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(insertCar.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.car = action.payload
      state.cars.unshift(state.car)
      state.message = "Carro cadastrado com sucesso! Você será redirecionado." 
    })
    .addCase(insertCar.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.car = {}
    })
    .addCase(getUserCars.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getUserCars.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.cars = action.payload 
    })
    .addCase(deleteCar.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(deleteCar.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null

      state.cars = state.cars.filter((car) => {
        return car._id !== action.payload.id
      })

      state.message = action.payload.message
    })
    .addCase(deleteCar.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      state.car = {}
    })
    .addCase(getCar.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getCar.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.car = action.payload 
    })
    .addCase(getCars.pending, (state) => {
      state.loading = true
      state.error = false
    })
    .addCase(getCars.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = null
      state.cars = action.payload 
    })

  }
})

export const { resetMessage } = carSlice.actions
export default carSlice.reducer