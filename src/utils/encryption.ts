import crypto from "crypto";

/**
 * Decodes a base64 string
 */
export function decodeBase64<T extends unknown>(base64: T) {
  if (typeof base64 !== "string") return base64;
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Encodes a string to a base64 string
 */
export function encodeBase64<T extends unknown>(data: T) {
  if (typeof data !== "string") return data;
  return Buffer.from(data, "utf8").toString("base64");
}

/**
 * Generates a new key pair
 */
export function generateKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return {
    publicKeyBase64: encodeBase64(publicKey),
    privateKeyBase64: encodeBase64(privateKey),
    publicKey,
    privateKey,
  };
}

/**
 * Encrypts data using the public key.
 */
export function encryptData(data: string, encryptKey: string) {
  if (!encryptKey) {
    throw new Error("Missing encryption key");
  }

  const encryptedData = crypto.publicEncrypt(
    {
      key: encryptKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(data, "utf8")
  );

  return encryptedData.toString("base64");
}

/**
 * Decrypts data using the private key
 */
export function decryptData(encryptedData: string, decryptKey: string) {
  if (!decryptKey) {
    throw new Error("Missing decryption key");
  }

  const decryptedData = crypto.privateDecrypt(
    {
      key: decryptKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedData, "base64")
  );

  return decryptedData.toString("utf8");
}

/**
 * Creates a SHA-256 hash of the data
 */
export function hashData(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Verifies if the plaintext matches the hash
 */
export function verifyHash(plaintext: string, hash: string) {
  const computedHash = hashData(plaintext);
  return computedHash === hash;
}

/**
 * Validates that the encryption key pair is valid
 */
export function validateKeyPair(encryptKey: unknown, decryptKey: unknown) {
  if (typeof encryptKey !== "string" || typeof decryptKey !== "string") {
    return false;
  }
  if (!encryptKey || !decryptKey) {
    return false;
  }

  try {
    const testString = "abcd";
    const encrypted = encryptData(testString, encryptKey);
    const decrypted = decryptData(encrypted, decryptKey);
    return decrypted === testString;
  } catch (error) {
    console.error(error);
    return false;
  }
}
