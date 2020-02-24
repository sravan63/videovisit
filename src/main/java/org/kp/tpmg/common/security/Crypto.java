package org.kp.tpmg.common.security;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.log4j.Logger;

public class Crypto {

	// Key should be length of 128, 192, or 256 bits for AES.
	private static final String key = "x12#$der-md89&^-";// 312ert%";
	private static final String initVector = "encryptionIntVec";
	private static final Logger log = Logger.getLogger(Crypto.class);
	private static final String UTF_8 = "UTF-8";
	private static final String AES = "AES";
	private static final String CIPHER = "AES/CBC/PKCS5PADDING";

	public static String encrypt(String value) {
		String result = null;
		try {
			IvParameterSpec iv = new IvParameterSpec(initVector.getBytes(UTF_8));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(UTF_8), AES);

			Cipher cipher = Cipher.getInstance(CIPHER);
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

			byte[] encrypted = cipher.doFinal(value.getBytes());
			result = Base64.getEncoder().encodeToString(encrypted);
		} catch (Exception e) {
			log.error("Error while encrypting value : " + value, e);
		}
		return result;
	}

	public static String decrypt(String encrypted) {
		String result = null;
		try {
			IvParameterSpec iv = new IvParameterSpec(initVector.getBytes(UTF_8));
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(UTF_8), AES);

			Cipher cipher = Cipher.getInstance(CIPHER);
			cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
			byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));

			result = new String(original);
		} catch (Exception e) {
			log.error("Error while decrypting value : " + encrypted, e);
		}

		return result;
	}
	
	public static void main(String[] args) {
		System.out.println(Crypto.encrypt("kpncalvv99352123308926828544"));
		System.out.println(Crypto.decrypt(Crypto.encrypt("kpncalvv99352123308926828544")));
	}
	
}
