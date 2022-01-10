package org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util;

import java.security.Key;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.joda.time.DateTime;
import org.springframework.security.crypto.codec.Base64;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtTokenGenerator {
	public static final Logger logger = LoggerFactory.getLogger(JwtTokenGenerator.class);
	
	private JwtTokenGenerator() {
		
	}

    public static String generateToken(Claims claims, String secret, Long expirationMillis) {
    	
    	logger.debug("date : {}",DateTime.now().plus(expirationMillis).toDate());
    	Key key = Keys.hmacShaKeyFor(Base64.encode(secret.getBytes()));
        return Jwts.builder()
                .setClaims(claims)
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(DateTime.now().plus(expirationMillis).toDate())
                .compact();
    }
}
