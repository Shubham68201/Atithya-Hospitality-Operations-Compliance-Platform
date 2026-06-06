import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchJobs = createAsyncThunk("careers/fetchJobs", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/careers/jobs", { params });
    return data.data.jobs;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchApplications = createAsyncThunk("careers/fetchApplications", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/careers/applications", { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createJob = createAsyncThunk("careers/createJob", async (jobData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/careers/jobs", jobData);
    return data.data.job;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateJob = createAsyncThunk("careers/updateJob", async ({ id, ...jobData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/careers/jobs/${id}`, jobData);
    return data.data.job;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteJob = createAsyncThunk("careers/deleteJob", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/careers/jobs/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const careersSlice = createSlice({
  name: "careers",
  initialState: { jobs: [], applications: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload || []; })
      .addCase(fetchJobs.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applications = action.payload.data || [];
        state.pagination   = action.payload.pagination;
      })
      .addCase(createJob.fulfilled, (state, action) => { state.jobs.unshift(action.payload); })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      });
  },
});

export default careersSlice.reducer;
