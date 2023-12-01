"use server";

import { cookies } from "next/headers";
import { encryptData, decryptData } from "@/lib/secure-data";
import type { Auth } from "@/interfaces/auth";
import type { NextRequest } from "next/server";


const key = "secret-key";

export async function setSignInCookie(authResponse: Auth) {
  const cookieStore = cookies();
  const encData = encryptData(JSON.stringify(authResponse), key);
  console.log("authResponse", new Date(authResponse.refreshTokenExpiresAt * 1000));
  cookieStore.set("auth.calvary", encData, {
    path: "/",
    // expires from authResponse and minus 5 hours
    expires: new Date(authResponse.refreshTokenExpiresAt * 1000),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
}

export async function getSignInCookie() {
  const cookieStore = cookies();
  const encData = cookieStore.get("auth.calvary");
  if (encData) {
    const decData = decryptData(encData.value, key);
    return JSON.parse(decData) as Auth;
  }
  return null;
}

export async function removeSignInCookie() {
  const cookieStore = cookies();
  cookieStore.delete("auth.calvary");
}

export async function isAuthenticated(req: NextRequest) {
  const cookieStore = cookies();
  const isAuthCookie = req.cookies.has("auth.calvary");
  if (!isAuthCookie) return false;
  const encData = cookieStore.get("auth.calvary");
  const decData = decryptData(encData?.value ?? "", key);
  const authResponse = JSON.parse(decData) as Auth;
  if (new Date(authResponse.refreshTokenExpiresAt * 1000) > new Date()) {
    return true;
  }
  return false;
}
