// demoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchDemos = createAsyncThunk("demo/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/demo", { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const submitDemo = createAsyncThunk("demo/submit", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/demo", formData);
    return data.data.demo;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateDemoStatus = createAsyncThunk("demo/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch(`/demo/${id}/status`, { status });
    return data.data.demo;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const demoSlice = createSlice({
  name: "demo",
  initialState: { list: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDemos.pending,   (state) => { state.loading = true; })
      .addCase(fetchDemos.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.data; state.pagination = action.payload.pagination; })
      .addCase(fetchDemos.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateDemoStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default demoSlice.reducer;
