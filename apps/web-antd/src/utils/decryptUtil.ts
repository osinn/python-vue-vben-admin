import { JSEncrypt } from 'jsencrypt';

const jse = new JSEncrypt();

/**
 * RSA加密
 * @param {*} encrypt
 * @returns
 */
export function RSAencrypt(encrypt: string, publickey: string) {
  jse.setPublicKey(publickey);
  return jse.encrypt(encrypt);
}
/**
 * RSA解密
 * @param {*} encrypted
 * @returns
 */
export function RSAdecrypt(encrypted: string, privateKey: string) {
  jse.setPrivateKey(privateKey);
  return jse.decrypt(encrypted);
}
