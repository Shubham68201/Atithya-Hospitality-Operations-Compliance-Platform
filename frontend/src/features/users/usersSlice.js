import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchUsers = createAsyncThunk("users/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/users", { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
  }
});

export const toggleStatus = createAsyncThunk("users/toggleStatus", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch(`/users/${id}/status`);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateRole = createAsyncThunk("users/updateRole", async ({ id, role }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch(`/users/${id}/role`, { role });
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteUser = createAsyncThunk("users/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u._id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
