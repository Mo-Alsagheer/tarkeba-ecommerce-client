import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/store";
import {
  getStoredAccessToken,
  setStoredAccessToken,
  clearStoredAccessToken,
} from "@/lib/authStorage";
import { Mutex } from "async-mutex";

// Create a mutex to prevent multiple refresh calls
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  credentials: "include", // Include cookies for refresh tokens
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth?.accessToken;
    const token = stateToken || getStoredAccessToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Accept-Language", "ar");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Wait for any ongoing refresh to complete
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Check if another request is already refreshing
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        console.log("Token expired, attempting refresh...");

        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          console.log("Token refresh successful");

          // Extract the new access token
          const newAccessToken =
            (refreshResult.data as any)?.accessToken ||
            (refreshResult.data as any)?.token;

          if (newAccessToken) {
            // Store the new token
            setStoredAccessToken(newAccessToken);

            // Update the store
            api.dispatch({
              type: "auth/updateAccessToken",
              payload: newAccessToken,
            });

            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions);
          }
        } else {
          console.log("Token refresh failed, logging out...");
          // Refresh failed - clear auth state
          clearStoredAccessToken();
          api.dispatch({ type: "auth/logout" });
        }
      } finally {
        release();
      }
    } else {
      // Wait for the mutex to be available, then retry the request
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Products",
    "Cart",
    "Orders",
    "Reviews",
    "Categories",
    "Coupons",
    "Returns",
    "Pages",
  ],
  endpoints: () => ({}),
});
