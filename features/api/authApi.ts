import { baseApi } from "./baseApi";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isVerified: boolean;
  avatar?: string;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const unwrapUserLike = (input: unknown): unknown => {
  // Backend responses vary (user/data wrappers, nested data, etc.).
  // This tries to extract the actual user object without assuming one fixed shape.
  let current: unknown = input;
  for (let i = 0; i < 3; i++) {
    if (!isRecord(current)) break;

    if ("user" in current) {
      current = current.user;
      continue;
    }

    if ("data" in current && isRecord(current.data) && "user" in current.data) {
      current = current.data.user;
      continue;
    }

    if ("data" in current) {
      current = current.data;
      continue;
    }

    break;
  }
  return current;
};

const extractAccessToken = (input: unknown): string | undefined => {
  if (!isRecord(input)) return undefined;

  const directAccessToken = input.accessToken;
  const directToken = input.token;
  if (typeof directAccessToken === "string") return directAccessToken;
  if (typeof directToken === "string") return directToken;

  const data = input.data;
  if (!isRecord(data)) return undefined;

  const nestedAccessToken = data.accessToken;
  const nestedToken = data.token;
  if (typeof nestedAccessToken === "string") return nestedAccessToken;
  if (typeof nestedToken === "string") return nestedToken;

  return undefined;
};

const transformUserResponse = (input: unknown): User => {
  const unwrapped = unwrapUserLike(input);
  const user = isRecord(unwrapped) ? unwrapped : ({} as UnknownRecord);
  return {
    ...user,
    name:
      (typeof user.name === "string" && user.name) ||
      (typeof user.username === "string" && user.username) ||
      "User",
    roles: Array.isArray(user.roles)
      ? (user.roles as string[])
      : typeof user.role === "string"
        ? [user.role]
        : ["customer"],
  } as User;
};

const transformAuthResponse = (response: unknown): AuthResponse => {
  const accessToken = extractAccessToken(response);
  const base: UnknownRecord = isRecord(response) ? response : {};
  return {
    ...base,
    accessToken,
    user: transformUserResponse(response),
  } as AuthResponse;
};

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: transformAuthResponse,
      invalidatesTags: ["User"],
    }),

    resendOtp: builder.mutation<{ message: string }, ResendOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-verification-otp",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: transformAuthResponse,
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Cart", "Orders"],
    }),

    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        // Handle both direct user object and { user: ... } wrapper
        return transformUserResponse(response);
      },
      providesTags: ["User"],
    }),

    // Legacy or alternative flow - can be kept or removed
    googleLogin: builder.mutation<AuthResponse, { code: string }>({
      query: (data) => ({
        url: "/auth/google/callback",
        method: "POST",
        body: data,
      }),
      transformResponse: transformAuthResponse,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useGoogleLoginMutation,
} = authApi;
