import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserState {
  username: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  authorized: boolean;
  updateUser: (value: UserState) => void;
  logOutUser: () => void;
}

export const useUserState = create<UserState>()(
  persist(
    (set) => ({
      username: "",
      accessToken: "",
      refreshToken: "",
      expiresIn: 0,
      authorized: false,
      updateUser: (value: UserState) =>
        set(() => ({
          username: value.username,
          accessToken: value.accessToken,
          refreshToken: value.refreshToken,
          expiresIn: value.expiresIn,
          authorized: true,
        })),
      logOutUser: () =>
        set(() => ({
          username: "",
          accessToken: "",
          refreshToken: "",
          expiresIn: 0,
          authorized: false,
        })),
    }),
    {
      name: "user-storage", // name of item in the storage (must be unique)
    },
  ),
);
