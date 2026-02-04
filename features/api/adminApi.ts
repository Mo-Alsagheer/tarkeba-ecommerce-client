import { baseApi } from './baseApi';

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    userID?: {
      username: string;
      email: string;
    } | null;
    shippingAddress: {
      customerName: string;
      addressLine1: string;
      addressLine2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      phone: string;
    };
  }>;
  topProducts: Array<{
    _id: string;
    productName: string;
    productSlug: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  userGrowth: Array<{
    _id: string;
    count: number;
  }>;
}

export interface SalesAnalytics {
  _id: string;
  totalSales: number;
  orderCount: number;
}

export interface TopProduct {
  _id: string;
  productName: string;
  productSlug: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface UserGrowth {
  _id: string;
  count: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRolesRequest {
  userId: string;
  roles: string[];
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Legacy stats endpoint (keeping for backward compatibility)
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Orders', 'Products'],
    }),

    // New comprehensive dashboard analytics
    getDashboardAnalytics: builder.query<DashboardAnalytics, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Orders', 'Products', 'User'],
    }),

    // Sales analytics with date range
    getSalesAnalytics: builder.query<SalesAnalytics[], { days?: number }>({
      query: ({ days = 30 }) => `/admin/analytics/sales?days=${days}`,
      providesTags: ['Orders'],
    }),

    // Top selling products
    getTopProducts: builder.query<TopProduct[], { limit?: number }>({
      query: ({ limit = 10 }) => `/admin/analytics/top-products?limit=${limit}`,
      providesTags: ['Orders', 'Products'],
    }),

    // User growth analytics
    getUserGrowth: builder.query<UserGrowth[], { days?: number }>({
      query: ({ days = 30 }) => `/admin/analytics/user-growth?days=${days}`,
      providesTags: ['User'],
    }),

    // Order status breakdown
    getOrderStatusBreakdown: builder.query<OrderStatusBreakdown[], void>({
      query: () => '/admin/analytics/order-status',
      providesTags: ['Orders'],
    }),
    
    getAdminUsers: builder.query<UsersResponse, AdminUsersQueryParams>({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.set('search', search);
        }
        return `/admin/users?${params}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: builder.query<AdminUser, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    updateUserRoles: builder.mutation<AdminUser, UpdateUserRolesRequest>({
      query: ({ userId, roles }) => ({
        url: `/admin/users/${userId}/roles`,
        method: 'PATCH',
        body: { roles },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetAdminStatsQuery,
  useGetDashboardAnalyticsQuery,
  useGetSalesAnalyticsQuery,
  useGetTopProductsQuery,
  useGetUserGrowthQuery,
  useGetOrderStatusBreakdownQuery,
  useGetAdminUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRolesMutation,
  useDeleteUserMutation,
} = adminApi;
