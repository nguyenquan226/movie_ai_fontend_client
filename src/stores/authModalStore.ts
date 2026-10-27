// stores/modalStore.ts
import { create } from "zustand";

interface ModalStore {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
}

export const useAuthModalStore = create<ModalStore>((set) => ({
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openRegisterModal: () => set({ isRegisterModalOpen: true }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  switchToRegister: () =>
    set({ isLoginModalOpen: false, isRegisterModalOpen: true }),
  switchToLogin: () =>
    set({ isRegisterModalOpen: false, isLoginModalOpen: true }),
}));
