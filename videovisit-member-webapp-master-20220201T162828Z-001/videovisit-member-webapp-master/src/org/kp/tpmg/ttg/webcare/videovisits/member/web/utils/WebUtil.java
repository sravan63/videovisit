package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;

public class WebUtil {

	public static final Logger logger = Logger.getLogger(WebUtil.class);
	private static Pattern DOB_PATTERN = Pattern.compile("\\d\\d\\d\\d-\\d[\\d]-\\d[\\d]");
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
	public static final String VV_MBR_SSO_BACK_BTN = "vv-mbr-sso-back-btn";
	public static final String VV_MBR_WEB = "vv-mbr-web";
	public static final String VV_MBR_GUEST = "vv-mbr-guest";
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
	public static final String ANDROID = "android";

	public static String getCurrentDateTimeZone() {
		logger.info(LOG_ENTERED);
		Calendar calToday = Calendar.getInstance();
		calToday.setTime(new Date());
		TimeZone tz1 = calToday.getTimeZone();
		logger.info("inDayLightSavings = " + tz1.inDaylightTime(new Date()));
		if (tz1.inDaylightTime(new Date()))
			return "PDT";
		else
			return "PST";
	}

	public static boolean isDOBFormat(String value) {
		if (value == null)
			return false;
		else {
			value = value.trim();
			java.util.regex.Matcher m = DOB_PATTERN.matcher(value);
			return m.matches();
		}

	}

	public static boolean isDOBMMYYYYFormat(String value) {
		if (value == null)
			return false;
		else {
			value = value.trim();
			java.util.regex.Matcher m = DOB_MMYYYY_PATTERN.matcher(value);
			return m.matches();
		}

	}

	public static String fillToLength(String src, char fillChar, int total_length) {
		String ret;
		if (StringUtils.isNotBlank(src) && src.length() < total_length) {
			int count = total_length - src.length();
			final StringBuilder sb = new StringBuilder();
			for (int i = 0; i < count; i++) {
				sb.append(fillChar);
			}
			sb.append(src);
			ret = sb.toString();
		} else {
			ret = src;
		}
		return ret;
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

	public static void readAllCookies(HttpServletRequest httpRequest) {
		if (httpRequest.getCookies() != null) {
			for (Cookie cookie : httpRequest.getCookies()) {
				logger.info("Cookie name=" + cookie.getName());
				logger.info("Cookie value=" + cookie.getValue());
				logger.info("Cookie domain=" + cookie.getDomain());
				logger.info("Cookie maxage=" + cookie.getMaxAge());
				logger.info("Cookie path=" + cookie.getPath());
				logger.info("Cookie secure=" + cookie.getSecure());
				logger.info("Cookie version=" + cookie.getVersion());
				logger.info("Cookie comment=" + cookie.getComment());
			}
		}

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

	public static boolean isChromeOrFFBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isChromeOrFFBrowser = false;
		try {
			final String browser = getBrowserDetails(httpRequest).toLowerCase();
			if (StringUtils.isNotBlank(browser) && (browser.contains("firefox") || browser.contains("chrome"))) {
				isChromeOrFFBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is firefox or chrome: ", ex);
		}
		logger.info(LOG_EXITING + " isChromeOrFFBrowser: " + isChromeOrFFBrowser);
		return isChromeOrFFBrowser;
	}
	
	public static boolean isSafariOrFFBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isSafariOrFFBrowser = false;
		try {
			final String browser = getBrowserDetails(httpRequest).toLowerCase();
			if (StringUtils.isNotBlank(browser) && (browser.contains("safari") || browser.contains("firefox"))) {
				isSafariOrFFBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is firefox or chrome: ", ex);
		}
		logger.info(LOG_EXITING + " -> isSafariOrFFBrowser : " + isSafariOrFFBrowser);
		return isSafariOrFFBrowser;
	}

	public static boolean isChromeBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isChromeBrowser = false;
		try {
			final String browser = getBrowserDetails(httpRequest).toLowerCase();
			if (StringUtils.isNotBlank(browser) && browser.contains("chrome")) {
				isChromeBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is chrome: ", ex);
		}
		logger.info(LOG_EXITING + " isChromeBrowser: " + isChromeBrowser);
		return isChromeBrowser;
	}

	public static boolean isFFBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isFFBrowser = false;
		try {
			final String browser = getBrowserDetails(httpRequest).toLowerCase();
			if (StringUtils.isNotBlank(browser) && browser.contains("firefox")) {
				isFFBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is firefox: ", ex);
		}
		logger.info(LOG_EXITING + " isFFBrowser: " + isFFBrowser);
		return isFFBrowser;
	}

	public static boolean isEdgeBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isEdgeBrowser = false;
		try {
			String browser = getBrowserDetails(httpRequest);
			browser = StringUtils.isNotBlank(browser) ? browser.toLowerCase() : "";
			if (EDGE.equalsIgnoreCase(browser)) {
				isEdgeBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is edge: ", ex);
		}
		logger.info(LOG_EXITING + " isEdgeBrowser: " + isEdgeBrowser);
		return isEdgeBrowser;
	}

	public static boolean isSafariBrowser(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		boolean isSafariBrowser = false;
		try {
			String browser = getBrowserDetails(httpRequest);
			browser = StringUtils.isNotBlank(browser) ? browser.toLowerCase() : "";
			if (browser.contains("safari")) {
				isSafariBrowser = true;
			}
		} catch (Exception ex) {
			logger.info("Error while checking the requested browser is safari: ", ex);
		}
		logger.info(LOG_EXITING + " isSafariBrowser: " + isSafariBrowser);
		return isSafariBrowser;
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
		final boolean isSsoSimulation = StringUtils.isNotBlank(ssoSimulation) && "true".equalsIgnoreCase(ssoSimulation);
		return isSsoSimulation;
	}

	public static String getClientIdFromContext(final WebAppContext ctx) {
		return ctx != null ? ctx.getClientId() : VV_MBR_WEB;
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

	public static String getBrowserVersion(HttpServletRequest httpRequest) {
		logger.info(LOG_ENTERED);
		String browserVersion = "";
		String browserDetails = "";
		try {
			browserDetails = getBrowserDetails(httpRequest);
			if (StringUtils.isNotBlank(browserDetails)) {
				final String browserInfo[] = browserDetails.split("-");
				if (!ArrayUtils.isEmpty(browserInfo) && browserInfo.length >= 2) {
					browserVersion = browserInfo[1];
				}
			}
		} catch (Exception ex) {
			logger.warn("Error while getting browser version for browser : " + browserDetails, ex);
		}
		logger.info(LOG_EXITING + ", Browser version : " + browserVersion);
		return browserVersion;
	}

	public static boolean blockSafariBrowser(final HttpServletRequest request, final String blockSafari,
			final String safariVersion) {
		logger.info(LOG_ENTERED);
		boolean blockSafariBrowser = false;
		int browserVersion = 0;
		try {
			if (WebUtil.isSafariBrowser(request) && "true".equalsIgnoreCase(blockSafari)) {
				int blockSafariVersion = Integer.parseInt(safariVersion);
				String bVersion = getBrowserVersion(request);
				if (StringUtils.isNotBlank(bVersion)) {
					final String versionInfo[] = bVersion.split("\\.");
					if (!ArrayUtils.isEmpty(versionInfo)) {
						browserVersion = Integer.parseInt(versionInfo[0]);
					}
				}
				if (browserVersion >= blockSafariVersion) {
					blockSafariBrowser = true;
				}
			}
		} catch (Exception e) {
			logger.warn("Error while processing blockSafariBrowser.");
		}
		logger.info(LOG_EXITING + ", blockSafariBrowser : " + blockSafariBrowser);
		return blockSafariBrowser;
	}

	public static void addMeetingDateTime(final MeetingDO meetingDO, final VideoVisitParamsDTO videoVisitParams) {
		logger.info(LOG_ENTERED);
		try {
			if (StringUtils.isNotBlank(meetingDO.getMeetingTime())) {
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(Long.valueOf(meetingDO.getMeetingTime()));
				SimpleDateFormat sfdate = new SimpleDateFormat("MMM dd");
				SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
				// Can be changed to format like e.g. Fri, Jun 06, 2014 03:15 PM using below
				// SimpleDateFormat sfdate = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm a");
				videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
				videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));
			}
		} catch (Exception ex) {
			logger.error("date conversion error:" + ex.getMessage(), ex);
		}
		logger.info(LOG_EXITING);
	}

	public static boolean isStringContainsEmail(final String source) {
		logger.info(LOG_ENTERED);
		boolean isStringContainsEmail = false;
		Matcher m = Pattern.compile(EMAIL_PATTERN).matcher(source);
		isStringContainsEmail = m.find();
		logger.info(LOG_EXITING);
		return isStringContainsEmail;
	}	
	

	public static void updateWebappContextForAndroidSDK(final WebAppContext ctx, HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final String mobileOs = StringUtils.isNotBlank(request.getParameter("os")) ? request.getParameter("os").trim()
				: null;
		String mobileAppVersion = StringUtils.isNotBlank(request.getParameter("appVersion"))
				? request.getParameter("appVersion").trim()
				: null;
		logger.info(
				"Request parameters from mdo app, mobileOs : " + mobileOs + "mobileAppVersion : " + mobileAppVersion);
		try {
			if (ctx != null && StringUtils.isNotBlank(mobileAppVersion) && WebUtil.ANDROID.equalsIgnoreCase(mobileOs)) {
				String mdoAppLatestVersion = getExtPropertiesValueByKey("MDO_APP_ANDROID_SDK_VERSION");
				if (StringUtils.isBlank(mobileAppVersion)) {
					ctx.setAndroidSDK(false);
					logger.info("Setting android SDK to false");
				} else if (!mobileAppVersion.equalsIgnoreCase(mdoAppLatestVersion)) {
					String entered[] = mobileAppVersion.split("\\.");
					String latest[] = mdoAppLatestVersion.split("\\.");

					if (entered.length != latest.length) {
						if (entered.length > latest.length) {
							mdoAppLatestVersion = mdoAppLatestVersion + ".0";
							latest = mdoAppLatestVersion.split("\\.");
						} else {
							mobileAppVersion = mobileAppVersion + ".0";
							entered = mobileAppVersion.split("\\.");
						}
					}
					if (!mobileAppVersion.equalsIgnoreCase(mdoAppLatestVersion) && entered.length == latest.length) {
						for (int i = 0; i < entered.length; i++) {
							if (convertStringToInteger(entered[i]) > convertStringToInteger(latest[i])) {
								ctx.setAndroidSDK(true);
								logger.info("Setting android SDK to true");
								break;
							} else if (convertStringToInteger(latest[i]) > convertStringToInteger(entered[i])) {
								ctx.setAndroidSDK(false);
								logger.info("Setting android SDK to false");
								break;
							}
						}
					} else {
						ctx.setAndroidSDK(true);
						logger.info("Setting android SDK to true");
					}
				} else {
					ctx.setAndroidSDK(true);
					logger.info("Setting android SDK to true");
				}

			}
		} catch (Exception e) {
			logger.warn("Error while updating WebappContextForAndroidSDK", e);
		}
		logger.info(LOG_EXITING);
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
