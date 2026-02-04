import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, findUser, validateSession } from "./services/authService";

export type User = {
  id: number;
  email: string;
};

export type AuthState = {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: any, { rejectWithValue }) => {
    try {
      return await createUser(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: any, { rejectWithValue }) => {
    try {
      return await findUser(data);
    } catch (error: any) {
      console.log(error, "thunk");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const authenticateSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action.payload, "err in slice");
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      });
  },
});

export const { logout } = authenticateSlice.actions;
export default authenticateSlice.reducer;
