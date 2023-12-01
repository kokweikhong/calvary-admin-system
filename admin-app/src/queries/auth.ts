import axios from "axios";
import type { Auth } from "@/interfaces/auth";
import { setSignInCookie, removeSignInCookie } from "@/actions/auth";

const API_URL = "http://localhost:8080/api/v1"

export async function signIn(email: string, password: string) {
  const resp = await axios.post(`${API_URL}/auth/signin`, { email, password });
  if (resp.status === 200) {
    await setSignInCookie(resp.data);
    return resp.data as Auth;
  } else {
    console.log(resp.data.error.message);
    throw new Error(resp.data.error.message);
  }
}

export async function signOut() {
  await removeSignInCookie();
}
