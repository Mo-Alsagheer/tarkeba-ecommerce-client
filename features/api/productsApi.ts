import { baseApi } from './baseApi';

export interface ProductVariant {
  size: string;
  price: number;
  stock: number;
  comparePrice?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string; // Category ID
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters) {
          if (filters.page) params.append('page', filters.page.toString());
          if (filters.limit) params.append('limit', filters.limit.toString());
          if (filters.category) params.append('category', filters.category);
          if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
          if (filters.search) params.append('search', filters.search);
          if (filters.sort) params.append('sort', filters.sort);
        }
        
        return {
          url: `/products${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    getFeaturedProducts: builder.query<Product[], void>({
      query: () => ({
        url: '/products/featured',
        method: 'GET',
      }),
      providesTags: [{ type: 'Products', id: 'FEATURED' }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/products/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Products', id: slug }],
    }),

    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Products', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
