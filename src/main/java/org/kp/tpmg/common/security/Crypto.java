package org.kp.tpmg.common.security;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Crypto {

	// Key should be length of 128, 192, or 256 bits for AES.
	private static final String key = "x12#$der-md89&^-";// 312ert%";
	private static final String initVector = "encryptionIntVec";
	private static final Logger log = LoggerFactory.getLogger(Crypto.class);
	private static final String UTF_8 = "UTF-8";
	private static final String AES = "AES";
	private static final String CIPHER = "AES/CBC/PKCS5PADDING";
	
	private static final String PASS_CODE = "x12#$der-md89&^-312ert%";
    private static final String ALGORITHM = "PBEWithMD5AndDES";

    Cipher _ecipher;
    Cipher _dcipher;

    /**
     * Constructor used to create this object.  Responsible for setting
     * and initializing this object's encrypter and decrypter Chipher instances
     * given a Secret Key and algorithm.
     *
     * @param key       Secret Key used to initialize both the encrypter and
     *                  decrypter instances.
     * @param algorithm Which algorithm to use for creating the encrypter and
     *                  decrypter instances.
     */
    public Crypto(SecretKey key, String algorithm) {
        try {
            _ecipher = Cipher.getInstance(algorithm);
            _dcipher = Cipher.getInstance(algorithm);
            _ecipher.init(Cipher.ENCRYPT_MODE, key);
            _dcipher.init(Cipher.DECRYPT_MODE, key);
        } catch (NoSuchPaddingException e) {
            log.error("NoSuchPaddingException : " + e.getMessage(), e);
        } catch (NoSuchAlgorithmException e) {
        	log.error("NoSuchAlgorithmException : " + e.getMessage(), e);
        } catch (InvalidKeyException e) {
        	log.error("InvalidKeyException : " + e.getMessage(), e);
        }
    }
    
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
	
	/**
     * Constructor used to create this object
     * Pass code used PASS_CODE
     */
    public Crypto() {
        // 8-bytes Salt
        byte[] salt = {
                (byte) 0xAA, (byte) 0x9B, (byte) 0xC8, (byte) 0x32,
                (byte) 0x56, (byte) 0x11, (byte) 0xE3, (byte) 0x03
        };

        // Iteration count
        int iterationCount = 19;

        try {
            KeySpec keySpec = new PBEKeySpec(PASS_CODE.toCharArray(), salt, iterationCount);
            
            SecretKey key = SecretKeyFactory.getInstance(ALGORITHM).generateSecret(keySpec);

            _ecipher = Cipher.getInstance(key.getAlgorithm());
            _dcipher = Cipher.getInstance(key.getAlgorithm());

            // Prepare the parameters to the cipthers
            AlgorithmParameterSpec paramSpec = new PBEParameterSpec(salt, iterationCount);

            _ecipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);
            _dcipher.init(Cipher.DECRYPT_MODE, key, paramSpec);

        } catch (InvalidAlgorithmParameterException e) {
        	log.error("InvalidAlgorithmParameterException : " + e.getMessage(),e );
        } catch (InvalidKeySpecException e) {
        	log.error("InvalidKeySpecException : " + e.getMessage(),e );
        } catch (NoSuchPaddingException e) {
        	log.error("NoSuchPaddingException : " + e.getMessage(),e );
        } catch (NoSuchAlgorithmException e) {
        	log.error("NoSuchAlgorithmException : " + e.getMessage(),e );
        } catch (InvalidKeyException e) {
        	log.error("InvalidKeyException : " + e.getMessage(),e );
        }
    }

    /**
     * Takes a single String as an argument and returns an Encrypted version
     * of that String.
     *
     * @param str String to be encrypted
     * @return <code>String</code> Encrypted version of the provided String
     */
    public String massage(String str) {
        try {
            // Encode the string into bytes using utf-8
            byte[] utf8 = str.getBytes("UTF8");

            // Encrypt
            byte[] enc = _ecipher.doFinal(utf8);

            // Encode bytes to base64 to get a string
            return Base64.getEncoder().encodeToString(enc);
        } catch (BadPaddingException e) {
        	log.error("BadPaddingException", e);
        } catch (IllegalBlockSizeException e) {
        	log.error("IllegalBlockSizeException", e);
        } catch (UnsupportedEncodingException e) {
        	log.error("UnsupportedEncodingException", e);
        } catch (Exception e) {
        	log.error("Exception", e);
        }
        return null;
    }


    /**
     * Takes a encrypted String as an argument, decrypts and returns the
     * decrypted String.
     *
     * @param str Encrypted String to be decrypted
     * @return <code>String</code> Decrypted version of the provided String
     */
    public String read(String str) {

        try {

            // Decode base64 to get bytes
        	byte[] dec = Base64.getDecoder().decode(str);

            // Decrypt
            byte[] utf8 = _dcipher.doFinal(dec);

            // Decode using utf-8
            return new String(utf8, "UTF8");

        } catch (BadPaddingException e) {
        	log.error("BadPaddingException", e);
        } catch (IllegalBlockSizeException e) {
        	log.error("IllegalBlockSizeException", e);
        } catch (UnsupportedEncodingException e) {
        	log.error("UnsupportedEncodingException", e);
        } catch (Exception e) {
        	log.error("IOException", e);
        }
        return null;
    }
	
}
