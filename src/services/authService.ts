import privateAxios from "@/lib/privateAxios";
import publicAxios from "@/lib/publicAxios";
import {
  IAccount,
  IGetAccount,
  LoginInput,
  RegisterInput,
} from "@/types/authen.type";
import { IBackendRes } from "@/types/backend.type";

export const authService = {
  callLogin: (credentials: LoginInput): Promise<IBackendRes<IAccount>> => {
    return publicAxios.post(`/auth/login`, credentials);
  },

  callLogout: (): Promise<IBackendRes<IAccount>> => {
    return privateAxios.post(`auth/logout`);
  },

  CallRefreshToken: (): Promise<IBackendRes<IAccount>> => {
    return privateAxios.get(`/auth/refreshToken`);
  },

  callFetchAccount: (): Promise<IBackendRes<IGetAccount>> => {
    return privateAxios.get("/auth/account");
  },

  callRegister: (data: RegisterInput): Promise<IBackendRes<IGetAccount>> => {
    return publicAxios.post(`/auth/register`, data);
  },
};
