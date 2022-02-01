package org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;


public class JwtUtil {
	
	private JwtUtil() {
		
	}
	
	public final static String JWT_SECRET = "videovisit-jwt-secret-kaiser-ttg-tpmg-ncal-this-key";
	public final static long JWT_TOKEN_EXPIRATION_MILLIS = 1800000;//expiration set to 30 mins
	public static final Logger logger = Logger.getLogger(JwtUtil.class);
	
	public static Claims createClaims(String userName){
		return Jwts.claims().setSubject(userName);
	}
	
	public static String generateJwtToken(final String name){
		Claims claims = JwtUtil.createClaims(name);
		return JwtTokenGenerator.generateToken(claims, JWT_SECRET,JWT_TOKEN_EXPIRATION_MILLIS);
	}
	
	public static boolean validateAuthToken(final String authToken, final String reqMeetingId, final String reqMrn) {
		logger.info(LOG_ENTERED);
		boolean isValid = false;
		Claims claims = null;
		try {
			claims = JwtTokenValidator.parseToken(authToken, JwtUtil.JWT_SECRET);
		} catch (Exception e) {
			logger.warn("Error while validating token", e);
		}
		logger.debug(claims);
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
		logger.info(LOG_EXITING);
		return isValid;
	}
	
}
