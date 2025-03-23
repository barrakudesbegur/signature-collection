import {
  BASE64_ENCODED_DECRYPT_KEY,
  BASE64_ENCODED_ENCRYPT_KEY,
} from "astro:env/server";
import {
  decodeBase64,
  decryptData,
  encryptData,
  validateKeyPair,
} from "./encryption";

const encryptKey = decodeBase64(BASE64_ENCODED_ENCRYPT_KEY);
const decryptKey = decodeBase64(BASE64_ENCODED_DECRYPT_KEY);

if (encryptKey && decryptKey && !validateKeyPair(encryptKey, decryptKey)) {
  throw new Error(
    "Invalid encryption keys pair. Check your environment variables."
  );
}

/**
 * Encrypts data using the BASE64_ENCODED_ENCRYPT_KEY environment variable.
 */
export function encryptDataWithEnv(data: string) {
  if (!encryptKey) {
    throw new Error("Missing encryption key");
  }
  return encryptData(data, encryptKey);
}

/**
 * Decrypts data using the BASE64_ENCODED_DECRYPT_KEY environment variable.
 */
export function decryptDataWithEnv(data: string) {
  if (!decryptKey) {
    throw new Error("Missing decryption key");
  }
  return decryptData(data, decryptKey);
}
