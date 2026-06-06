import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/notifications");
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markAllRead = createAsyncThunk("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.patch("/notifications/read-all");
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { list: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
      })
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(markAllRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.list = state.list.map((n) => ({ ...n, isRead: true }));
      });
  },
});

export default notificationsSlice.reducer;
