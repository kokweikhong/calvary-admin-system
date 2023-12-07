"use server";

import type { Auth } from "@/interfaces/auth";
import { config } from "@/lib/config";
import { decryptData, encryptData } from "@/lib/secure-data";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function setAuthCookie(authResponse: Auth) {
  const cookieStore = cookies();
  const encData = encryptData(JSON.stringify(authResponse), config.encrytedKey);
  cookieStore.set("auth.calvary", encData, {
    path: "/",
    // expires from authResponse and minus 5 hours
    expires: new Date(
      authResponse.refreshToken.expiresAt * 1000 - 5 * 60 * 60 * 1000
    ),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
}

export async function getAuthCookie(): Promise<Auth | null> {
  const cookieStore = cookies();
  const encData = cookieStore.get("auth.calvary");
  if (encData) {
    const decData = decryptData(encData.value, config.encrytedKey);
    return JSON.parse(decData) as Auth;
  }
  return null;
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete("auth.calvary");
}

export async function getAuthFromRequest(
  req: NextRequest
): Promise<Auth | null> {
  const encData = req.cookies.get("auth.calvary");
  if (encData) {
    const decData = decryptData(encData.value, config.encrytedKey);
    return JSON.parse(decData) as Auth;
  }
  return null;
}
