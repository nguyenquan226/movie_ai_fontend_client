import { IUser } from "@/types/user.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IAuthUser {
  userId: number | null;
  email: string;
  roleId: number | null;
  roleName: string;
  fullName: string;
  genderCode: string;
  isVip: boolean | null;
  statusCode: string;
  avatarUrl: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

interface IAuthState {
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  access_token: string;
  errorRefreshToken: string;
  authUser: IAuthUser;
}

const initialAuthState: IAuthState = {
  isLoggingIn: false,
  isSigningUp: false,
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  access_token: "",
  errorRefreshToken: "",
  authUser: {
    userId: null,
    email: "",
    roleId: null,
    roleName: "",
    fullName: "",
    genderCode: "",
    isVip: null,
    statusCode: "",
    avatarUrl: "",
    permissions: [],
  },
};

type authAction = {
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setIsLoggingIn: (value: boolean) => void;
  setIsSigningUp: (value: boolean) => void;
  loginAction: (data: { access_token: string; user: IAuthUser }) => void;
  logOutAction: () => void;
  setRefreshTokenAction: (status: boolean, message: string) => void;
  setTokenToTestApi: () => void;
  fetchAccountAction: (user: IUser) => void;
  resetAuthAction: () => void;
  setAuthUser: (user: IAuthUser) => void;
};

export const useAuthStore = create<IAuthState & authAction>()(
  persist(
    (set, get) => ({
      ...initialAuthState,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setLoading: (value) => set({ isLoading: value }),

      loginAction: ({ access_token, user }) => {
        set((prev) => ({
          isAuthenticated: true,
          authUser: {
            ...prev.authUser,
            ...user,
          },
          isLoading: false,
          access_token: access_token,
        }));
      },

      logOutAction: () => {
        set({
          access_token: "",
          isLoading: false,
          isAuthenticated: false,
          authUser: {
            userId: null,
            email: "",
            roleId: null,
            roleName: "",
            fullName: "",
            genderCode: "",
            isVip: null,
            statusCode: "",
            avatarUrl: "",
            permissions: [],
          },
        });
      },

      setRefreshTokenAction: (status, message) => {
        set({
          isRefreshToken: status,
          errorRefreshToken: message,
          access_token: "",
          isAuthenticated: false,
        });
      },

      setTokenToTestApi: () => {
        set({ access_token: "" });
      },

      fetchAccountAction: (user) => {
        set({
          isAuthenticated: true,
          isLoading: false,
          authUser: {
            userId: user.userId,
            email: user.email,
            roleId: user.roleId,
            roleName: user.roleName,
            fullName: user.fullName,
            genderCode: user.genderCode,
            isVip: user.isVip,
            statusCode: user.statusCode,
            avatarUrl: user.avatarUrl,
            permissions: user.permissions || [],
          },
        });
      },
      resetAuthAction: () => {
        set({
          isAuthenticated: false,
          access_token: "",
          authUser: initialAuthState.authUser,
          isLoading: false,
        });
      },

      setAuthUser: (user) => {
        set((state) => ({
          authUser: {
            ...state.authUser,
            genderCode: user.genderCode,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
          },
        }));
      },

      setIsLoggingIn: (value) => set({ isLoggingIn: value }),

      setIsSigningUp: (value) => set({ isSigningUp: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
