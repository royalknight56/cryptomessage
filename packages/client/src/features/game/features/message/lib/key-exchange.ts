// 1. 生成 RSA 密钥对（可导出公钥）
export async function genKeyPair() {
  const kp = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );
  return kp;
}

// 导出公钥为 ArrayBuffer (spki)
export async function exportPublicKey(key: CryptoKey) {
  return await crypto.subtle.exportKey("spki", key);
}

// 从 ArrayBuffer 导入公钥
export async function importPublicKey(spki: ArrayBuffer) {
  return await crypto.subtle.importKey(
    "spki",
    spki,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"],
  );
}

// 使用对方公钥加密（输入字符串 -> 返回 base64）
export async function encryptWithPeer(pubKey: CryptoKey, text: string) {
  const enc = new TextEncoder().encode(text);
  const cipher = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, pubKey, enc);
  return arrayBufferToBase64(cipher);
}

// 使用自己私钥解密（输入 base64 -> 返回字符串）
export async function decryptWithMyPrivate(privKey: CryptoKey, b64: string) {
  const buf = base64ToArrayBuffer(b64);
  const plainBuf = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privKey,
    buf,
  );
  return new TextDecoder().decode(plainBuf);
}

// helpers
export function arrayBufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
export function base64ToArrayBuffer(b64: string) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
