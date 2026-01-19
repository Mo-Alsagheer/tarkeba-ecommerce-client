import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/features/api/baseApi';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import { setCredentials, updateAccessToken, logout } from '@/features/auth/authSlice';
import { setStoredAccessToken, clearStoredAccessToken } from '@/lib/authStorage';

const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action) => {
    setStoredAccessToken(action.payload.accessToken);
  },
});

authListenerMiddleware.startListening({
  actionCreator: updateAccessToken,
  effect: (action) => {
    setStoredAccessToken(action.payload);
  },
});

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: () => {
    clearStoredAccessToken();
  },
});

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(authListenerMiddleware.middleware)
        .concat(baseApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
