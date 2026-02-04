import { baseApi } from './baseApi';

interface CreateReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
}

interface Review {
  _id: string;
  productId: {
    _id: string;
    name: string;
    slug?: string;
    images: string[];
  } | string;
  userId: {
    _id: string;
    username: string;
    email: string;
  } | string;
  orderId: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateReviewResponse {
  success: boolean;
  message: string;
  review: Review;
}

interface GetReviewsParams {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  status?: string;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface GetReviewsResponse {
  reviews: Review[];
  summary: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<GetReviewsResponse, GetReviewsParams>({
      query: (params) => ({
        url: '/reviews',
        params,
      }),
      providesTags: (result, error, params) => [
        { type: 'Reviews', id: params.productId || 'LIST' },
      ],
    }),
    createReview: builder.mutation<CreateReviewResponse, CreateReviewRequest>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Reviews', id: arg.productId },
        { type: 'Reviews', id: 'LIST' },
        'Products',
      ],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} = reviewsApi;
