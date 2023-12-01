import { create } from "zustand";
import type { Auth } from "@/interfaces/auth";
import { getSignInCookie } from "@/actions/auth";

interface SessionStore {
  session: Auth | null;
  setSession: (session: Auth) => void;
  removeSession: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => set(() => ({ session: session })),
  removeSession: () => set(() => ({ session: null })),
}));
