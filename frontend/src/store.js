import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice"
import carReducer from "./slices/carSlice"
import adminReducer from "./slices/adminSlice"
import adminAuthReducer from "./slices/adminAuthSlice"
import washerReducer from "./slices/washerSlice"
import washReducer from "./slices/washSlice"
import hourReducer from "./slices/hourSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    car: carReducer,
    admin: adminReducer,
    authAdmin: adminAuthReducer,
    washer: washerReducer,
    wash: washReducer,
    hour: hourReducer
  },
})