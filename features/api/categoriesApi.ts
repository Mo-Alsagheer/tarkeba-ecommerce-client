import { baseApi } from "./baseApi";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | Category;
  children?: Category[];
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: any) => {
        // Handle both direct array and wrapped responses
        if (Array.isArray(response)) return response;
        if (response?.categories && Array.isArray(response.categories))
          return response.categories;
        if (response?.data && Array.isArray(response.data))
          return response.data;
        return [];
      },
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    getCategoryTree: builder.query<Category[], void>({
      query: () => "/categories/tree",
      providesTags: [{ type: "Categories", id: "TREE" }],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),

    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: (_result, _error, slug) => [
        { type: "Categories", id: slug },
      ],
    }),

    createCategory: builder.mutation<Category, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => {
        // Handle wrapped response from NestJS
        if (response?.data) return response.data;
        return response;
      },
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: "TREE" },
      ],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: any) => {
        // Handle wrapped response from NestJS
        if (response?.data) return response.data;
        return response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Categories", id },
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: "TREE" },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "Categories", id: "TREE" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
