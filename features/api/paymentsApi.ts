import { baseApi } from './baseApi';

export interface PaymentMethod {
  value: string;
  label: string;
  provider: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/payments/methods',
    }),
  }),
});

export const { useGetPaymentMethodsQuery } = paymentsApi;
