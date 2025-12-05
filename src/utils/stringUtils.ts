// Convert a Base64 string to a Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert Uint8Array to a Base64 string
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(uint8Array);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function uint8ArrayToString(uint8Array: Uint8Array): string {
  return new TextDecoder().decode(uint8Array);
}
