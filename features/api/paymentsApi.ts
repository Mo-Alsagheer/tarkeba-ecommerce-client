import { baseApi } from './baseApi';

export interface PaymentMethod {
  value: string;
  label: string;
  provider: string;
}

export interface CreatePaymentRequest {
  orderID: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  walletMsisdn?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/payments/methods',
    }),

    createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: '/payments',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => response as CreatePaymentResponse,
    }),
  }),
});

export const { useGetPaymentMethodsQuery, useCreatePaymentMutation } = paymentsApi;
