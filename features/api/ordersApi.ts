import { baseApi } from './baseApi';

export interface CheckoutCartItem {
  productID: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CheckoutRequest {
  cartItems: CheckoutCartItem[];
  shippingAddress: {
    customerName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    phone?: string;
  };
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  notes?: string;
  paymentMethod: string;
  walletMsisdn?: string;
}

export interface CheckoutResponse {
  success: boolean;
  order: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
  paymentRequired: boolean;
  paymentMethod: string;
  message?: string;
  nextStep?: {
    action: string;
    endpoint: string;
    method: string;
    payload: any;
  };
}

export interface OrderItem {
  _id: string;
  orderID: string;
  productID: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  productName: string;
  productSlug: string;
  productImage: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot?: {
    description: string;
    categories: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userID: {
    _id: string;
    username: string;
    email: string;
  };
  email?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: {
    customerName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    phone?: string;
  };
  paymentDetails?: {
    method: string;
    transactionId?: string;
    paymentIntentId?: string;
  };
  notes?: string;
  trackingNumber?: string | null;
  estimatedDeliveryDate?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: Order['status'];
}

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer endpoints
    getMyOrders: builder.query<OrdersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/orders/my?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => {
        // Handle different response formats
        if (response?.data) {
          return {
            orders: Array.isArray(response.data.orders) ? response.data.orders : [],
            total: response.data.total || 0,
            page: response.data.page || 1,
            limit: response.data.limit || 10,
          };
        }
        if (Array.isArray(response?.orders)) {
          return {
            orders: response.orders,
            total: response.total || 0,
            page: response.page || 1,
            limit: response.limit || 10,
          };
        }
        return {
          orders: [],
          total: 0,
          page: 1,
          limit: 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
    
    getMyOrderById: builder.query<{ order: Order; items: OrderItem[] }, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: any) => {
        if (response?.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    // Check if user has purchased a specific product
    hasUserPurchasedProduct: builder.query<{ hasPurchased: boolean }, string>({
      query: (productId) => `/orders/check-purchase/${productId}`,
      providesTags: (_result, _error, productId) => [{ type: 'Orders', id: `PURCHASE-${productId}` }],
    }),
    
    // Admin endpoints
    adminGetOrders: builder.query<OrdersResponse, { 
      page?: number; 
      limit?: number; 
      status?: Order['status'];
      search?: string;
    }>({
      query: ({ page = 1, limit = 10, status, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        return `/admin/orders?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        console.log('Admin orders response:', response);
        // Handle different response formats from NestJS
        if (response?.data) {
          return {
            orders: Array.isArray(response.data.orders) ? response.data.orders : [],
            total: response.data.total || 0,
            page: response.data.page || 1,
            limit: response.data.limit || 10,
          };
        }
        // Handle direct response
        if (Array.isArray(response?.orders)) {
          return {
            orders: response.orders,
            total: response.total || 0,
            page: response.page || 1,
            limit: response.limit || 10,
          };
        }
        // Fallback
        return {
          orders: [],
          total: 0,
          page: 1,
          limit: 10,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Orders', id: 'ADMIN_LIST' }],
    }),
    
    adminGetOrderById: builder.query<{ order: Order; items: OrderItem[] }, string>({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: (response: any) => {
        // Handle wrapped response {order, items}
        if (response?.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    
    adminUpdateOrderStatus: builder.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: any) => {
        // Handle wrapped response
        if (response?.data) return response.data;
        return response;
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Orders', id: orderId },
        { type: 'Orders', id: 'ADMIN_LIST' },
        'Orders',
      ],
    }),

    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (checkoutData) => ({
        url: '/orders/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useHasUserPurchasedProductQuery,
  useAdminGetOrdersQuery,
  useAdminGetOrderByIdQuery,
  useAdminUpdateOrderStatusMutation,
  useCheckoutMutation,
} = ordersApi;
