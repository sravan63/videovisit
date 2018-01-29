package org.kp.tpmg.common.security;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;

import java.security.spec.KeySpec;
import java.security.spec.AlgorithmParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEParameterSpec;

import org.apache.log4j.Logger;

import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidKeyException;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;

import java.io.UnsupportedEncodingException;
import java.io.IOException;


/**
 * <a href="http://skewpassim.sourceforge.net/">http://skewpassim.sourceforge.net/</a>
 * <br>
 * <b>The following code implements a class for encrypting and decrypting
 * strings using several Cipher algorithms. The class is created with a key and
 * can be used repeatedly to encrypt and decrypt strings using that key.
 * Some of the more popular algorithms are:
 * <li>Blowfish
 * <li>DES
 * <li>DESede
 * <li>PBEWithMD5AndDES
 * <li>PBEWithMD5AndTripleDES
 * <li>TripleDES
 * </b>
 */
public class Crypto {

	private static final Logger log = Logger.getLogger(Crypto.class);
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
        	log.error("EXCEPTION: NoSuchPaddingException", e);
        } catch (NoSuchAlgorithmException e) {
        	log.error("EXCEPTION: NoSuchAlgorithmException", e);
        } catch (InvalidKeyException e) {
        	log.error("EXCEPTION: InvalidKeyException", e);
        }
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
        	if(PASS_CODE==null){
        		log.info("PASS CODE IS NULL");
        	}
            KeySpec keySpec = new PBEKeySpec(PASS_CODE.toCharArray(), salt, iterationCount);
            
            SecretKey key = SecretKeyFactory.getInstance(ALGORITHM).generateSecret(keySpec);

            _ecipher = Cipher.getInstance(key.getAlgorithm());
            _dcipher = Cipher.getInstance(key.getAlgorithm());

            // Prepare the parameters to the cipthers
            AlgorithmParameterSpec paramSpec = new PBEParameterSpec(salt, iterationCount);

            _ecipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);
            _dcipher.init(Cipher.DECRYPT_MODE, key, paramSpec);

        } catch (InvalidAlgorithmParameterException e) {
        	log.error("EXCEPTION: InvalidAlgorithmParameterException", e);
        } catch (InvalidKeySpecException e) {
        	log.error("EXCEPTION: InvalidKeySpecException", e);
        } catch (NoSuchPaddingException e) {
        	log.error("EXCEPTION: NoSuchPaddingException", e);
        } catch (NoSuchAlgorithmException e) {
        	log.error("EXCEPTION: NoSuchAlgorithmException", e);
        } catch (InvalidKeyException e) {
        	log.error("EXCEPTION: InvalidKeyException", e);
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
            return new sun.misc.BASE64Encoder().encode(enc);
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
            byte[] dec = new sun.misc.BASE64Decoder().decodeBuffer(str);

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
        } catch (IOException e) {
        	log.error("IOException", e);
        }
        return null;
    }
    
    
}

