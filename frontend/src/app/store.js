import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import contentReducer from "../features/content/contentSlice";
import demoReducer from "../features/demo/demoSlice";
import careersReducer from "../features/careers/careersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    users:         usersReducer,
    content:       contentReducer,
    demo:          demoReducer,
    careers:       careersReducer,
    notifications: notificationsReducer,
  },
});
