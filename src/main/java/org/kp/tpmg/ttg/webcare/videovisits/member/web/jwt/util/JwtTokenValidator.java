package org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util;

import org.apache.log4j.Logger;
import org.springframework.security.crypto.codec.Base64;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

/**
 * Class validates a given token by using the secret configured in the application
 *
 */
public class JwtTokenValidator {
	
	public static final Logger logger = Logger.getLogger(JwtTokenValidator.class);
	
	private JwtTokenValidator() {
		
	}

    /**
     * Tries to parse specified String as a JWT token. If successful, returns User object with username, id and role prefilled (extracted from token).
     * If unsuccessful (token is invalid or not containing all required user properties), simply returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */
    public static Claims parseToken(String token, String secret) {

        try {
            Claims body = Jwts.parser()
                .setSigningKey(Base64.encode(secret.getBytes()))
                .parseClaimsJws(token)
                .getBody();
            return body;

        } catch (ExpiredJwtException e) {
        	logger.error("ExpiredJwtException : " + e);
        } catch (JwtException e) {
        	logger.error("JwtException : " + e);
        }
        return null;
    }
}
