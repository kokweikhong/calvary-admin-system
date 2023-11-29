import CryotoJS from 'crypto-js';

export function encryptData(data: string, key: string): string {
  return CryotoJS.AES.encrypt(data, key).toString();
}

export function decryptData(data: string, key: string): string {
  return CryotoJS.AES.decrypt(data, key).toString(CryotoJS.enc.Utf8);
}
