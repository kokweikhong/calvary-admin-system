"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { encryptData, decryptData } from "@/lib/secure-data";

type SignInRequest = {
  email: string;
  password: string;
};

const key = "secret-key";

export async function signIn(request: SignInRequest) {
  const cookieStore = cookies();
  console.log("signIn", request.email, request.password);
  cookieStore.set("username", request.email);
  const encData = encryptData(request.password, key);
  console.log("encData", encData);
  const decData = decryptData(encData, key);
  console.log("decData", decData);
  return revalidatePath("/auth/signin");

}
