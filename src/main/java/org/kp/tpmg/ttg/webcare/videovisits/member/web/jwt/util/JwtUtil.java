package org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JwtUtil {

	private JwtUtil() {

	}

	public final static String JWT_SECRET = "videovisit-jwt-secret-kaiser-ttg-tpmg-ncal-this-key";
	public final static String JWT_SECRET_EMAIL = "videovisit-email-jwt-secret-kaiser-ttg-tpmg-ncal-this-key";
	public final static long JWT_TOKEN_EXPIRATION_MILLIS = 7200000;// expiration set to 2 hours
	public static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

	public static Claims createClaims(String userName) {
		return Jwts.claims().setSubject(userName);
	}

	public static boolean validateAuthToken(final String authToken) {
		logger.info(LOG_ENTERED);
		boolean isValid = false;
		Claims claims = null;
		try {
			claims = JwtTokenValidator.parseToken(authToken, JwtUtil.JWT_SECRET);
		} catch (Exception e) {
			logger.warn("Error while validating token", e);
		}
		logger.debug("claims : {}",claims);
		if (claims != null && !claims.isEmpty()) {
			isValid = true;
		}
		logger.info(LOG_EXITING);
		return isValid;
	}

	public static String generateJwtToken(String mrn) {
		logger.info(LOG_ENTERED);
		Claims claims = JwtUtil.createClaims(mrn);
		String authToken = JwtTokenGenerator.generateToken(claims, JWT_SECRET, JWT_TOKEN_EXPIRATION_MILLIS);
		logger.info(LOG_EXITING);
		return authToken;
	}
	
	public static boolean validateAuthToken(final String authToken, final String reqMeetingId, final String reqMrn) {
		logger.info(LOG_ENTERED + " mobile direct launch");
		boolean isValid = false;
		Claims claims = null;
		try {
			claims = JwtTokenValidator.parseToken(authToken, JwtUtil.JWT_SECRET);
		} catch (Exception e) {
			logger.warn("Error while validating mobile direct launch token ", e);
		}
		logger.debug("claims : {}",claims);
		if (claims != null && !claims.isEmpty() && StringUtils.isNotBlank(reqMeetingId) && StringUtils.isNotBlank(reqMrn) ) {
			final String meetingId = (String) claims.get("meetingId");
			final String mrn = (String) claims.get("mrn");
			if(StringUtils.isNotBlank(meetingId) && StringUtils.isNotBlank(mrn) 
					&& reqMeetingId.equalsIgnoreCase(meetingId) && reqMrn.equalsIgnoreCase(mrn)) {
				isValid = true;
			}	
		}
		if(!isValid && authToken.contains(reqMeetingId) && authToken.contains(reqMrn)) {
			isValid = true;
		}
		logger.info(LOG_EXITING + " mobile direct launch");
		return isValid;
	}
	
	public static Claims validateEmailAuthToken(final String authToken) {
		logger.info(LOG_ENTERED);
		Claims claims = null;
		try {
			claims = JwtTokenValidator.parseToken(authToken, JwtUtil.JWT_SECRET_EMAIL);
		} catch (Exception e) {
			logger.warn("Error while validating email auth token", e);
		}
		logger.info(LOG_EXITING);
		return claims;
	}
}
