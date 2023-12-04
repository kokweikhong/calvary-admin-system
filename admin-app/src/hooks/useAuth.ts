"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const useAuth = () => {
  const { auth, setAuth, signIn, signOut } = useContext(AuthContext);

  return { auth, setAuth, signIn, signOut };
}

export default useAuth;
