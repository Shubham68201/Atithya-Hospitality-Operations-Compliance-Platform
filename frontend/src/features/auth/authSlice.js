import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// fetchMe: a 401 means "not logged in" — never reject, always resolve
export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data.data.user;
  } catch {
    // 401 = not authenticated — return null, don't throw
    return null;
  }
});

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try { await axiosInstance.post("/auth/logout"); } catch { /* ignore */ }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    loading: false,
    error:   null,
    checked: false,   // true once /me has been attempted
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser:    (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe — always fulfills (null = guest)
      .addCase(fetchMe.pending,   (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload ?? null;
        state.checked = true;
      })
      // loginUser
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      // logout
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
