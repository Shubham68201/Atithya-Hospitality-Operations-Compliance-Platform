// contentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchContent = createAsyncThunk("content/fetch", async (page, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/content", { params: page ? { page } : {} });
    return data.data.content;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateContent = createAsyncThunk("content/update", async ({ page, section, key, value }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/content/${page}/${section}/${key}`, { value });
    return { page, section, key, value, item: data.data.content };
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const contentSlice = createSlice({
  name: "content",
  initialState: { data: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.fulfilled, (state, action) => { state.data = action.payload; state.loading = false; })
      .addCase(fetchContent.pending,   (state) => { state.loading = true; })
      .addCase(fetchContent.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default contentSlice.reducer;
