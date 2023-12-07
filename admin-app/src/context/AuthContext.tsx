"use client";

import { getAuthCookie, removeAuthCookie, setAuthCookie } from "@/actions/auth";
import { Auth, AuthRequest } from "@/interfaces/auth";
import { getConfig } from "@/lib/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

type AuthContextType = {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
  signIn: (auth: AuthRequest) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const config = getConfig();
  const router = useRouter();
  const signInUrl = config.mainServiceURL + "/api/v1/auth/signin";
  const [auth, setAuth] = useState<Auth | null>(null);

  const signIn = async (auth: AuthRequest) => {
    try {
      const response = await axios.post(signInUrl, auth);
      await setAuthCookie(response.data);
      setAuth(response.data);
    } catch (error) {
      throw new Error(`Error signing in ${error}`);
    }
  };

  const signOut = async () => {
    setAuth(null);
    await removeAuthCookie();
    router.refresh();
  };

  const getAuth = async () => {
    const auth = await getAuthCookie();
    if (auth) {
      setAuth(auth);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
