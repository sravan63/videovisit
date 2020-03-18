package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.TRUE;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.VVResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class WebUtil {

	public static final Logger logger = Logger.getLogger(WebUtil.class);
	private static Pattern DOB_MMYYYY_PATTERN = Pattern.compile("\\d[\\d]/\\d\\d\\d\\d");
	public static final String EMAIL_PATTERN ="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+";
	public static final String MOB_CLIENT_ID = "vv-mbr-mbl-web";
	public static final String DEFAULT_DEVICE = "Desktop";
	public static final String NON_MEMBER = "Non_Mmbr";

	public static final String HSESSIONID_COOKIE_NAME = "HSESSIONID";
	public static final String S_COOKIE_NAME = "S";

	public static final String LOG_ENTERED = "Entered";
	public static final String LOG_EXITING = "Exiting";
	public static final String VV_MBR_BACK_BUTTON = "vv-mbr-back-btn";
	public static final String SSO_SIMULATION = "sso_simulation";
	public static final String VV_MBR_SSO_WEB = "vv-mbr-sso-web";
	public static final String VV_MBR_SSO_WEB_MOBILE = "vv-mbr-mbl-sso-web";
	public static final String VV_MBR_SSO_BACK_BTN = "vv-mbr-sso-back-btn";
	public static final String VV_MBR_WEB = "vv-mbr-web";
	public static final String VV_MBR_WEB_MOBILE = "vv-mbr-mbl-web";
	public static final String VV_MBR_GUEST = "vv-mbr-guest";
	public static final String VV_MBR_GUEST_MOBILE = "vv-mbr-guest-mbl";
	public static final String VV_MBR_GUEST_BACK_BTN = "vv-mbr-guest-back-btn";
	public static final String VV_MBR_SSO_SIM_WEB = "vv-mbr-sso-sim";
	public static final String VV_MBR_SSO_SIM_BACK_BTN = "vv-mbr-sso-sim-back-btn";
	public static final String EDGE = "edge";
	public static final String KPPC = "KPPC";
	public static final String BANDWIDTH_512_KBPS = "512kbps";
	public static final String BANDWIDTH_1024_KBPS = "1024kbps";
	
	public static final String TRUE = Boolean.TRUE.toString();
	public static final String FALSE = Boolean.FALSE.toString();
	public static final String BLOCK_SAFARI_VERSION = "12";
	public static final String AUTH_TOKEN = "authtoken";
	public static final String SSO_SESSION = "ssoSession";
	public static final String GUEST = "guest";
	public static final String LOGIN_TYPE = "loginType";
	public static final String SSO = "sso";
	public static final String TEMP_ACCESS = "tempAccess";
	public static final String SUBMIT_LOGIN = "submitLogin";
	public static final String SSO_SUBMIT_LOGIN = "ssoSubmitLogin";
	
	public static final String SUCCESS_200 = "200";
	public static final String FAILURE_900 = "900";
	public static final String FAILURE = "failure";
	public static final String SUCCESS = "success";
	public static final String MRN = "mrn";
	
	public static final String ANDROID = "android";
	
	
	public static boolean isDOBMMYYYYFormat(String value) {
		if (value == null)
			return false;
		else {
			value = value.trim();
			java.util.regex.Matcher m = DOB_MMYYYY_PATTERN.matcher(value);
			return m.matches();
		}

	}

	/**
	 * Get cookie based on the cookie name
	 * 
	 * @param httpRequest
	 * @param cookieName
	 * @return
	 */
	public static Cookie getCookie(HttpServletRequest httpRequest, String cookieName) {
		if (httpRequest.getCookies() != null && StringUtils.isNotBlank(cookieName)) {
			for (Cookie cookie : httpRequest.getCookies()) {
				logger.info("Cookie name=" + cookie.getName());
				if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) {
					return cookie;
				}
			}
		}
		return null;
	}


	public static void setCookie(HttpServletResponse response, String cookieName, String cookieValue) {
		logger.info("Cookie name=" + cookieName + ", cookie value=" + cookieValue);
		Cookie cookie;
		try {
			cookie = new Cookie(cookieName, URLEncoder.encode(cookieValue, "UTF-8"));
			cookie.setPath("/");
			cookie.setDomain("kaiserpermanente.org");
			cookie.setSecure(true);
			response.addCookie(cookie);
		} catch (UnsupportedEncodingException e) {
			logger.warn("Error while adding a coockie=" + cookieName + ", cookie value=" + cookieValue);
		}

	}

	public static void removeCookie(HttpServletRequest httpRequest, HttpServletResponse response, String cookieName) {
		logger.info("cookie name=" + cookieName);
		Cookie[] cookies = httpRequest.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (StringUtils.equalsIgnoreCase(cookie.getName(), cookieName)) {
					cookie.setValue(null);
					cookie.setMaxAge(0);
					cookie.setPath("/");
					cookie.setDomain("kaiserpermanente.org");
					cookie.setSecure(true);
					response.addCookie(cookie);
					logger.info("removed cookie name=" + cookie.getName());
				}
			}
		}

	}

	public static String getBrowserDetails(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		String browser = "";
		try {
			String browserDetails = httpRequest.getHeader("User-Agent");
			String userAgent = browserDetails;
			String user = userAgent.toLowerCase();

			logger.info("User Agent for the request is : " + browserDetails);
			if (user.contains("msie")) {
				String substring = userAgent.substring(userAgent.indexOf("MSIE")).split(";")[0];
				browser = substring.split(" ")[0].replace("MSIE", "IE") + "-" + substring.split(" ")[1];
			} else if (user.contains(EDGE)) {
				browser = EDGE;
			} else if (user.contains("safari") && user.contains("version")) {
				browser = (userAgent.substring(userAgent.indexOf("Safari")).split(" ")[0]).split("/")[0] + "-"
						+ (userAgent.substring(userAgent.indexOf("Version")).split(" ")[0]).split("/")[1];
			} else if (user.contains("opr") || user.contains("opera")) {
				if (user.contains("opera"))
					browser = (userAgent.substring(userAgent.indexOf("Opera")).split(" ")[0]).split("/")[0] + "-"
							+ (userAgent.substring(userAgent.indexOf("Version")).split(" ")[0]).split("/")[1];
				else if (user.contains("opr"))
					browser = ((userAgent.substring(userAgent.indexOf("OPR")).split(" ")[0]).replace("/", "-"))
							.replace("OPR", "Opera");
			} else if (user.contains("chrome")) {
				browser = (userAgent.substring(userAgent.indexOf("Chrome")).split(" ")[0]).replace("/", "-");
			} else if ((user.indexOf("mozilla/7.0") > -1) || (user.indexOf("netscape6") != -1)
					|| (user.indexOf("mozilla/4.7") != -1) || (user.indexOf("mozilla/4.78") != -1)
					|| (user.indexOf("mozilla/4.08") != -1) || (user.indexOf("mozilla/3") != -1)) {
				browser = "Netscape-?";

			} else if (user.contains("firefox")) {
				browser = (userAgent.substring(userAgent.indexOf("Firefox")).split(" ")[0]).replace("/", "-");
			} else if (user.contains("rv")) {
				browser = "IE";
			} else {
				browser = "UnKnown, More-Info: " + userAgent;
			}
		} catch (Exception ex) {
			logger.warn("Error while getting browser details");
			if (browser == null) {
				browser = "";
			}
		}
		logger.info(LOG_EXITING + " Browser Name=" + browser);
		return browser;
	}

	public static String getDeviceOs() {
		return StringUtils.isBlank(System.getProperty("os.name")) ? DEFAULT_DEVICE : System.getProperty("os.name");
	}

	public static String getDeviceOsVersion() {
		return StringUtils.isBlank(System.getProperty("os.version")) ? DEFAULT_DEVICE
				: System.getProperty("os.version");
	}

	public static long convertStringToLong(String value) {
		long returnVal = 0;
		if (StringUtils.isNotBlank(value)) {
			try {
				returnVal = Long.parseLong(value);
			} catch (Exception e) {
				logger.error("Error while converting string value to long: " + value, e);
			}
		}
		return returnVal;
	}

	public static String replaceSpecialCharacters(String input) {
		logger.info(LOG_ENTERED);
		if (StringUtils.isNotBlank(input)) {
			String specialCharStr = null;
			final Map<String, String> map = new HashMap<String, String>();
			try {
				specialCharStr = AppProperties.getExtPropertiesValueByKey("REPLACE_SPECIAL_CHARACTERS");
			} catch (Exception e) {
				logger.error("Error while reading external properties file: " + e.getMessage(), e);
			}

			if (StringUtils.isNotBlank(specialCharStr)) {
				final String[] array = specialCharStr.split("\\s*,\\s*");
				if (!ArrayUtils.isEmpty(array)) {
					for (String specialChar : array) {
						if (StringUtils.isNotBlank(specialChar)) {
							final String[] symbols = specialChar.split("\\s*:\\s*");
							if (!ArrayUtils.isEmpty(symbols)) {
								map.put(symbols[0], symbols[1]);
							}
						}
					}
				}
			} else {
				map.put("\u2019", "\u0027");
				map.put("\u2018", "\u0027");
				map.put("\u055A", "\u0027");
				map.put("\u201B", "\u0027");
				map.put("\uFF07", "\u0027");
				map.put("\u0060", "\u0027");
				map.put("\u00B4", "\u0027");
				map.put("\uFFFD", "\u0027");
			}
			logger.debug("Map of special characters to be replaced with characters as follows : " + map);
			logger.debug("Before update input :" + input);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				if (input.contains(entry.getKey())) {
					input = input.replace(entry.getKey(), entry.getValue());
				}
			}
			logger.debug("After update input :" + input);
		}
		logger.info(LOG_EXITING);
		return input;
	}

	public static boolean isSsoSimulation() {
		final String ssoSimulation = AppProperties.getExtPropertiesValueByKey("SSO_SIMULATION");
		final boolean isSsoSimulation = StringUtils.isNotBlank(ssoSimulation) && TRUE.equalsIgnoreCase(ssoSimulation);
		return isSsoSimulation;
	}

	public static String getSSOCookieName() {
		logger.info(LOG_ENTERED);
		String SSO_COOKIE_NAME = AppProperties.getExtPropertiesValueByKey("SSO_COOKIE_NAME");
		if (StringUtils.isBlank(SSO_COOKIE_NAME)) {
			SSO_COOKIE_NAME = "ObSSOCookie";
		}
		logger.info(LOG_EXITING + ", SSO_COOKIE_NAME : " + SSO_COOKIE_NAME);
		return SSO_COOKIE_NAME;
	}

	public static <T> String prepareCommonOutputJson(final String operation, final String code, final String message,
			final T result) {
		logger.info(LOG_ENTERED);
		final VVResponse output = new VVResponse();
		Gson gson = new GsonBuilder().serializeNulls().create();
		output.setName(operation);
		output.setCode(code);
		output.setMessage(message);
		if (result == null) {
			output.setData((Serializable) "");
		} else {
			output.setData((Serializable) result);
		}
		final String json = gson.toJson(output);
		logger.info(LOG_EXITING);
		return json;
	}
	
	public static String setBandWidth(String result, String desktopBandwidth) {
		logger.info(LOG_ENTERED);
		JsonElement jelement = new JsonParser().parse(result);
		JsonObject jobject = jelement.getAsJsonObject();
		if (jobject != null && jobject.get("data") != null && jobject.get("data").isJsonObject()) {
			jobject.getAsJsonObject("data").addProperty("desktopBandwidth", desktopBandwidth);
		}
		result = jobject.toString();
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String getClientIdByLoginType(final String loginType) {
		logger.info(LOG_ENTERED);
		String clientId = "";
		if (GUEST.equalsIgnoreCase(loginType)) {
			clientId = VV_MBR_GUEST;
		} else if (SSO.equalsIgnoreCase(loginType)) {
			clientId = VV_MBR_SSO_WEB;
		} else {
			clientId = VV_MBR_WEB;
		}
		logger.info(LOG_EXITING);
		return clientId;
	}
	
	public static String getClientId(final String loginType, final String isFromMobile) {
		logger.info(LOG_ENTERED);
		String clientId = VV_MBR_WEB;
		if (SSO.equalsIgnoreCase(loginType)) {
			if (TRUE.equalsIgnoreCase(isFromMobile)) {
				clientId = VV_MBR_SSO_WEB_MOBILE;
			} else {
				clientId = VV_MBR_SSO_WEB;
			}
		} else {
			if (TRUE.equalsIgnoreCase(isFromMobile)) {
				clientId = VV_MBR_WEB_MOBILE;
			} else {
				clientId = VV_MBR_WEB;
			}
		}
		logger.info(LOG_EXITING);
		return clientId;
	}
	
	public static String getClientIdByLoginTypeAndBackButtonAction(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String clientId = "";
		final String loginType = request.getParameter(LOGIN_TYPE);
		final String isFromBackButton = request.getParameter("isFromBackButton");
		if (GUEST.equalsIgnoreCase(loginType)) {
			clientId = TRUE.equalsIgnoreCase(isFromBackButton) ? VV_MBR_GUEST_BACK_BTN : VV_MBR_GUEST;
		} else if (SSO.equalsIgnoreCase(loginType)) {
			clientId = TRUE.equalsIgnoreCase(isFromBackButton) ? VV_MBR_SSO_BACK_BTN : VV_MBR_SSO_WEB;
		} else {
			clientId = TRUE.equalsIgnoreCase(isFromBackButton) ? VV_MBR_BACK_BUTTON : VV_MBR_WEB;
		}
		logger.info(LOG_EXITING);
		return clientId;
	}

	
	public static void loadAllBrowserBlockProperties(final Map<String, String> properties) {
		//Browser blocks for desktop
		final String BLOCK_CHROME_BROWSER = AppProperties.getExtPropertiesValueByKey("BLOCK_CHROME_BROWSER");
		properties.put("BLOCK_CHROME_BROWSER", StringUtils.isNotBlank(BLOCK_CHROME_BROWSER) ? BLOCK_CHROME_BROWSER : "false");
		final String BLOCK_FIREFOX_BROWSER = AppProperties.getExtPropertiesValueByKey("BLOCK_FIREFOX_BROWSER");
		properties.put("BLOCK_FIREFOX_BROWSER", StringUtils.isNotBlank(BLOCK_FIREFOX_BROWSER) ? BLOCK_FIREFOX_BROWSER : "false");
		final String BLOCK_EDGE_BROWSER = AppProperties.getExtPropertiesValueByKey("BLOCK_EDGE_BROWSER");
		properties.put("BLOCK_EDGE_BROWSER", StringUtils.isNotBlank(BLOCK_EDGE_BROWSER) ? BLOCK_EDGE_BROWSER : "false");
		final String BLOCK_SAFARI_BROWSER = AppProperties.getExtPropertiesValueByKey("BLOCK_SAFARI_BROWSER");
		properties.put("BLOCK_SAFARI_BROWSER", StringUtils.isNotBlank(BLOCK_SAFARI_BROWSER) ? BLOCK_SAFARI_BROWSER : "false");
		final String BLOCK_IE_BROWSER = AppProperties.getExtPropertiesValueByKey("BLOCK_IE_BROWSER");
		properties.put("BLOCK_IE_BROWSER", StringUtils.isNotBlank(BLOCK_IE_BROWSER) ? BLOCK_IE_BROWSER : "true");
		//Browser versions for desktop
		final String BLOCK_CHROME_VERSION = AppProperties.getExtPropertiesValueByKey("BLOCK_CHROME_VERSION");
		properties.put("BLOCK_CHROME_VERSION", StringUtils.isNotBlank(BLOCK_CHROME_VERSION) ? BLOCK_CHROME_VERSION : "61");
		final String BLOCK_FIREFOX_VERSION = AppProperties.getExtPropertiesValueByKey("BLOCK_FIREFOX_VERSION");
		properties.put("BLOCK_FIREFOX_VERSION", StringUtils.isNotBlank(BLOCK_FIREFOX_VERSION) ? BLOCK_FIREFOX_VERSION : "60");
		final String BLOCK_EDGE_VERSION = AppProperties.getExtPropertiesValueByKey("BLOCK_EDGE_VERSION");
		properties.put("BLOCK_EDGE_VERSION", StringUtils.isNotBlank(BLOCK_EDGE_VERSION) ? BLOCK_EDGE_VERSION : "18");
		final String BLOCK_SAFARI_VERSION = AppProperties.getExtPropertiesValueByKey("BLOCK_SAFARI_VERSION");
		properties.put("BLOCK_SAFARI_VERSION", StringUtils.isNotBlank(BLOCK_SAFARI_VERSION) ? BLOCK_SAFARI_VERSION : "12");
		final String BLOCK_IE_VERSION = AppProperties.getExtPropertiesValueByKey("BLOCK_IE_VERSION");
		properties.put("BLOCK_IE_VERSION", StringUtils.isNotBlank(BLOCK_IE_VERSION) ? BLOCK_IE_VERSION : "");

		//Browser blocks for mobile
		final String MOBILE_BLOCK_CHROME_BROWSER = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_CHROME_BROWSER");
		properties.put("MOBILE_BLOCK_CHROME_BROWSER", StringUtils.isNotBlank(MOBILE_BLOCK_CHROME_BROWSER) ? MOBILE_BLOCK_CHROME_BROWSER : "false");
		final String MOBILE_BLOCK_FIREFOX_BROWSER = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_FIREFOX_BROWSER");
		properties.put("MOBILE_BLOCK_FIREFOX_BROWSER", StringUtils.isNotBlank(MOBILE_BLOCK_FIREFOX_BROWSER) ? MOBILE_BLOCK_FIREFOX_BROWSER : "false");
		final String MOBILE_BLOCK_EDGE_BROWSER = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_EDGE_BROWSER");
		properties.put("MOBILE_BLOCK_EDGE_BROWSER", StringUtils.isNotBlank(MOBILE_BLOCK_EDGE_BROWSER) ? MOBILE_BLOCK_EDGE_BROWSER : "false");
		final String MOBILE_BLOCK_SAFARI_BROWSER = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_SAFARI_BROWSER");
		properties.put("MOBILE_BLOCK_SAFARI_BROWSER", StringUtils.isNotBlank(MOBILE_BLOCK_SAFARI_BROWSER) ? MOBILE_BLOCK_SAFARI_BROWSER : "false");
		final String MOBILE_BLOCK_IE_BROWSER = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_IE_BROWSER");
		properties.put("MOBILE_BLOCK_IE_BROWSER", StringUtils.isNotBlank(MOBILE_BLOCK_IE_BROWSER) ? MOBILE_BLOCK_IE_BROWSER : "true");
		//Browser versions for mobile
		final String MOBILE_BLOCK_CHROME_VERSION = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_CHROME_VERSION");
		properties.put("MOBILE_BLOCK_CHROME_VERSION", StringUtils.isNotBlank(MOBILE_BLOCK_CHROME_VERSION) ? MOBILE_BLOCK_CHROME_VERSION : "61");
		final String MOBILE_BLOCK_FIREFOX_VERSION = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_FIREFOX_VERSION");
		properties.put("MOBILE_BLOCK_FIREFOX_VERSION", StringUtils.isNotBlank(MOBILE_BLOCK_FIREFOX_VERSION) ? MOBILE_BLOCK_FIREFOX_VERSION : "67");
		final String MOBILE_BLOCK_EDGE_VERSION = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_EDGE_VERSION");
		properties.put("MOBILE_BLOCK_EDGE_VERSION", StringUtils.isNotBlank(MOBILE_BLOCK_EDGE_VERSION) ? MOBILE_BLOCK_EDGE_VERSION : "18");
		final String MOBILE_BLOCK_SAFARI_VERSION = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_SAFARI_VERSION");
		properties.put("MOBILE_BLOCK_SAFARI_VERSION", StringUtils.isNotBlank(MOBILE_BLOCK_SAFARI_VERSION) ? MOBILE_BLOCK_SAFARI_VERSION : "12.2");
		final String MOBILE_BLOCK_IE_VERSION = AppProperties.getExtPropertiesValueByKey("MOBILE_BLOCK_IE_VERSION");
		properties.put("MOBILE_BLOCK_IE_VERSION", StringUtils.isNotBlank(MOBILE_BLOCK_IE_VERSION) ? MOBILE_BLOCK_IE_VERSION : "");
		
		// Browser version for ipad
		final String BLOCK_CHROME_BROWSER_IPAD = AppProperties.getExtPropertiesValueByKey("BLOCK_CHROME_BROWSER_IPAD");
		properties.put("BLOCK_CHROME_BROWSER_IPAD",
				StringUtils.isNotBlank(BLOCK_CHROME_BROWSER_IPAD) ? BLOCK_CHROME_BROWSER_IPAD : "true");

		// OS version for ipad
		final String IPAD_OS_VERSION = AppProperties.getExtPropertiesValueByKey("IPAD_OS_VERSION");
		properties.put("IPAD_OS_VERSION", StringUtils.isNotBlank(IPAD_OS_VERSION) ? IPAD_OS_VERSION : "12");
	}
	
	public static String convertMapToJsonString(final Map<String, String> map) {
		logger.info(LOG_ENTERED);
		String jsonString = null;
		final Gson gson = new GsonBuilder().serializeNulls().create();
		if(MapUtils.isNotEmpty(map)) {
			jsonString = gson.toJson(map);
		}
		logger.info(LOG_EXITING);
		return jsonString;
	}
	
	public static boolean isOk(String val) {
		return "OK".equalsIgnoreCase(val);
	}
	
	public static boolean isStringContainsEmail(final String source) {
		logger.info(LOG_ENTERED);
		boolean isStringContainsEmail = false;
		Matcher m = Pattern.compile(EMAIL_PATTERN).matcher(source);
		isStringContainsEmail = m.find();
		logger.info(LOG_EXITING);
		return isStringContainsEmail;
	}
	
	/**
	 * @param value String value
	 * @return integer value
	 */
	public static int convertStringToInteger(final String value) {
		int returnVal = 0;
		if (StringUtils.isNotBlank(value)) {
			try {
				returnVal = Integer.parseInt(value);
			} catch (Exception e) {
				logger.warn("Error while converting string value to integer: " + value, e);
			}
		}
		return returnVal;
	}
}
