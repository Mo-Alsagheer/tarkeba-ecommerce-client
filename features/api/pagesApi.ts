import { baseApi } from "./baseApi";

interface PageContent {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetPagesResponse {
  pages: PageContent[];
  total: number;
}

interface CreatePageRequest {
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  isPublished?: boolean;
}

interface UpdatePageRequest extends Partial<CreatePageRequest> {
  _id: string;
}

export const pagesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPages: builder.query<GetPagesResponse, void>({
      query: () => "/pages",
      providesTags: ["Pages"],
    }),
    getPageBySlug: builder.query<PageContent, string>({
      query: (slug) => `/pages/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Pages", id: slug }],
    }),
    createPage: builder.mutation<{ page: PageContent }, CreatePageRequest>({
      query: (pageData) => ({
        url: "/pages",
        method: "POST",
        body: pageData,
      }),
      invalidatesTags: ["Pages"],
    }),
    updatePage: builder.mutation<{ page: PageContent }, UpdatePageRequest>({
      query: ({ _id, ...pageData }) => ({
        url: `/pages/${_id}`,
        method: "PATCH",
        body: pageData,
      }),
      invalidatesTags: ["Pages"],
    }),
    deletePage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageBySlugQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;
