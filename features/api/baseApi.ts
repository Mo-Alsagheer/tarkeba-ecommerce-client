import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';
import { getStoredAccessToken } from '@/lib/authStorage';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  credentials: 'include', // Include cookies for refresh tokens
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth?.accessToken;
    const token = stateToken || getStoredAccessToken();
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Accept-Language', 'ar');
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Products', 'Cart', 'Orders', 'Reviews', 'Categories', 'Coupons', 'Returns'],
  endpoints: () => ({}),
});
