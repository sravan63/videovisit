package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.net.URI;
import java.net.URISyntaxException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.kp.tpmg.common.security.Crypto;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.ActiveMeetingsForMemberInput;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsJSON;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.ttg.videovisitsec.model.AuthorizeECCodeOutput;
import org.kp.tpmg.ttg.videovisitsec.model.AuthorizeECCodeOutputJson;
import org.kp.tpmg.ttg.videovisitsec.model.GetECMeetingDetailsByIdInput;
import org.kp.tpmg.ttg.videovisitsec.model.GetECMeetingDetailsByIdOutput;
import org.kp.tpmg.ttg.videovisitsec.model.GetECMeetingDetailsByIdOutputJson;
import org.kp.tpmg.ttg.videovisitsec.model.Status;
import org.kp.tpmg.ttg.videovisitsec.model.UpdateGuestParticipantInput;
import org.kp.tpmg.ttg.videovisitsec.model.ValidateECCodeInput;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.ActiveSurveysResponse;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.InputUserAnswers;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.Response;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.SurveyResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.APIToken;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.ttg.sharedservice.client.MemberSSOAuthAPIs;
import org.kp.ttg.sharedservice.domain.AuthorizeRequestVo;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.EsbInfo;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class WebService {

	public static final Logger logger = Logger.getLogger(WebService.class);

	private static String serviceSecurityUsername = null;
	private static String serviceSecurityPassword = null;

	// setup wizard related properties
	private static String setupWizardHostNuid;
	private static String setupWizardMemberMrn;
	private static String setupWizardMeetingType;

	private static String videoVisitRestServiceUrl = null;
	private static String videoVisitMeetingRestServiceUrl = null;

	// Member SSO related properties
	private static String memberSSOAuthAPIUrl = null;
	private static String memberSSOAuthRegionCode = null;
	private static String kpOrgSSOSignOnAPIUrl = null;
	private static String kpOrgSSOSignOffAPIUrl = null;
	private static String kpOrgSSOUserAgentCategoryHeader = null;
	private static String kpOrgSSOOsVersionHeader = null;
	private static String kpOrgSSOUserAgentTypeHeader = null;
	private static String kpOrgSSOAPIKeyHeader = null;
	private static String kpOrgSSOAppNameHeader = null;
	
	private static String accessToken = null;
	
	private static final String CONSUMER_KEY_INTERNAL = "y2DYp8nCJf2JzQbWAKqo5bguehca";
	private static final String CONSUMER_SECRET_INTERNAL = "_vH1qNttJMivnD8FaMI3bvcQaKUa";
	
	private static final char VVINTEGRATION = 'I';
	private static final char MAPPOINTMENT = 'A';
	private static final char MCONFERENCE = 'C';
	private static final char VV_EC = 'E';
	private static final char MEETINGAPI = 'M';
	private static final char MEMBERSOAUTH = 'O';

	// Parameters for Proxy Appts logic
	private static String secureCodes = null;
	private static boolean isAdhoc = false;
	private static boolean isParrs = true;

	private static RestTemplate restTemplate = new RestTemplate();

	/**
	 * @return the setupWizardHostNuid
	 */
	public static String getSetupWizardHostNuid() {
		return setupWizardHostNuid;
	}

	/**
	 * @param setupWizardHostNuid
	 *            the setupWizardHostNuid to set
	 */
	public static void setSetupWizardHostNuid(String setupWizardHostNuid) {
		WebService.setupWizardHostNuid = setupWizardHostNuid;
	}

	/**
	 * @return the setupWizardMemberMrn
	 */
	public static String getSetupWizardMemberMrn() {
		return setupWizardMemberMrn;
	}

	/**
	 * @param setupWizardMemberMrn
	 *            the setupWizardMemberMrn to set
	 */
	public static void setSetupWizardMemberMrn(String setupWizardMemberMrn) {
		WebService.setupWizardMemberMrn = setupWizardMemberMrn;
	}

	/**
	 * @return the setupWizardMeetingType
	 */
	public static String getSetupWizardMeetingType() {
		return setupWizardMeetingType;
	}

	/**
	 * @param setupWizardMeetingType
	 *            the setupWizardMeetingType to set
	 */
	public static void setSetupWizardMeetingType(String setupWizardMeetingType) {
		WebService.setupWizardMeetingType = setupWizardMeetingType;
	}
	
	
	public static String testIntgService() throws Exception {
		logger.info(LOG_ENTERED);
		String responseStr = null;
		try {
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", VVINTEGRATION, ServiceUtil.GET, null);
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", VVINTEGRATION, ServiceUtil.GET, null);
		}
		logger.info(LOG_EXITING);
		return responseStr;
	}

	public static String testMApptService() throws Exception {
		logger.info(LOG_ENTERED);
		String responseStr = null;
		try {
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", MAPPOINTMENT, ServiceUtil.GET, null);
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", MAPPOINTMENT, ServiceUtil.GET, null);
		}
		logger.info(LOG_EXITING);
		return responseStr;
	}

	public static String testMConfService() throws Exception {
		logger.info(LOG_ENTERED);
		String responseStr = null;
		try {
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", MCONFERENCE, ServiceUtil.GET, null);
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseStr = callAPIManagerService(ServiceUtil.TEST_IS_ALIVE, "{}", MCONFERENCE, ServiceUtil.GET, null);
		}
		logger.info(LOG_EXITING);
		return responseStr;
	}
	
	

	/**
	 * This method invokes updateMemberMeetingStatus rest service and updates the
	 * member meeting status.
	 * 
	 * @param mrn8Digit
	 * @param meetingID
	 * @param sessionID
	 * @param memberName
	 * @param notifyVideoForMeetingQuit
	 * @return
	 * @throws Exception
	 */
	public static org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput memberEndMeetingLogout(String mrn8Digit, long meetingID, String sessionID,
			String memberName, boolean notifyVideoForMeetingQuit, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " MeetingID : " + meetingID);
		logger.debug("mrn: " + mrn8Digit + ", memberName : " + memberName);

		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		String responseJsonStr = "";

		try {
			if (meetingID <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID)
					|| StringUtils.isBlank(memberName)) {
				logger.warn("Missing input attributes.");
				output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput();
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
			} else {

				final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.UpdateMemberMeetingStatusInput input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.UpdateMemberMeetingStatusInput();
				input.setMeetingId(meetingID);
				input.setSessionId(sessionID);
				input.setMrn(mrn8Digit);
				input.setMemberName(memberName);
				input.setClientId(clientId);
				input.setNotifyVideoForMeetingQuit(notifyVideoForMeetingQuit);

				final Gson gson = new Gson();
				final String inputJsonString = gson.toJson(input);
				logger.debug("jsonInptString : " + inputJsonString);

				responseJsonStr = callAPIManagerService(ServiceUtil.UPDATE_MEMBER_MEETING_STATUS, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
				if (StringUtils.isNotBlank(responseJsonStr)) {
					final JsonParser parser = new JsonParser();
					final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
					output = gson.fromJson(jobject.get("service").toString(), org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput.class);
				}
			}

		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingID);
			throw new Exception("Web Service API error :", e);
		}
		logger.info(LOG_EXITING + "jsonOutput : " + responseJsonStr);
		return output;
	}

	public static MeetingDetailsOutput IsMeetingHashValid(String meetingHash, String clientId, String sessionId)
			throws RemoteException, Exception {
		logger.info(LOG_ENTERED + "meetingHash:" + meetingHash);
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new MeetingDetailsOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.ActiveMeetingsForCaregiverInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.ActiveMeetingsForCaregiverInput();

			input.setMeetingHash(meetingHash);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("jsonInptString : " + inputJsonString);

			responseJsonStr = callAPIManagerService(ServiceUtil.IS_MEETING_HASH_VALID, inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);
			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error : " + e);
			throw new Exception("Web Service API error", e.getCause());
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput endCaregiverMeetingSession(String meetingHash, String megaMeetingNameDisplayName,
			boolean isParticipantDel, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " [meetingHash=" + meetingHash + ", isParticipantDel=" + isParticipantDel + "]");
		logger.debug("megaMeetingNameDisplayName=" + megaMeetingNameDisplayName);
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(megaMeetingNameDisplayName)
					|| StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput();
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			org.kp.tpmg.ttg.videovisit.mconference.model.meeting.EndMeetingForMemberGuestDesktopInput input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.EndMeetingForMemberGuestDesktopInput();
			input.setMeetingHash(meetingHash);
			input.setPatientLastName(megaMeetingNameDisplayName);
			input.setIsDeleteMeetingFromVidyo((isParticipantDel));
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callAPIManagerService(ServiceUtil.END_MEETING_FOR_MEMBER_GUEST_DESKTOP, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			logger.info("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput.class);
			}
		}

		catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());

		}
		logger.info(LOG_EXITING);
		return output;
	}

	// KP Org sign on API
	public static KpOrgSignOnInfo performKpOrgSSOSignOn(String userId, String password) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		String kpSsoSession = null;
		KpOrgSignOnInfo kpOrgSignOnInfo = null;
		int statusCode = 0;
		ResponseEntity<?> responseEntity = null;
		if (StringUtils.isBlank(kpOrgSSOSignOnAPIUrl)) {
			kpOrgSSOSignOnAPIUrl = AppProperties.getExtPropertiesValueByKey("KPORG_SSO_SIGNON_API_URL");
		}
		URI uri = new URI(kpOrgSSOSignOnAPIUrl);
		String authStr = userId + ":" + password;
		String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());
		final HttpHeaders headers = getJsonHttpHeaders();
		headers.set("Accept", "*/*");
		headers.set("Authorization", "Basic " + authEncoded.trim());
		try {
			responseEntity = callRestService(headers, uri, HttpMethod.POST, String.class);
		} catch (HttpClientErrorException ex) {
			logger.info("HttpClient error, Status code : " + ex.getRawStatusCode() + ", Status text : "
					+ ex.getStatusText());
		} catch (HttpServerErrorException ex1) {
			logger.info("HttpServer error, Status code : " + ex1.getRawStatusCode() + ", Status text : "
					+ ex1.getStatusText());
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage(), e);
		}
		if (responseEntity != null) {
			statusCode = responseEntity.getStatusCodeValue();
			logger.info("Status code : " + statusCode);
			output = (String) responseEntity.getBody();
			logger.debug("output from service: " + output);
			HttpHeaders responseHeaders = responseEntity.getHeaders();
			kpSsoSession = responseHeaders.getFirst("ssosession");
			logger.info("kpSsoSession from response header=" + kpSsoSession);
			if (statusCode == 200 || statusCode == 201 || statusCode == 202) {
				if (StringUtils.isNotBlank(output)) {
					try {
						final Gson gson = new Gson();
						kpOrgSignOnInfo = gson.fromJson(output, KpOrgSignOnInfo.class);
						if (kpOrgSignOnInfo != null) {
							kpOrgSignOnInfo.setSsoSession(kpSsoSession);
						}
					} catch (Exception ex) {
						logger.warn("JSON parsing failed:" + ex.getMessage(), ex);
						if (kpOrgSignOnInfo == null) {
							kpOrgSignOnInfo = new KpOrgSignOnInfo();
							kpOrgSignOnInfo.setSsoSession(kpSsoSession);
							final JSONObject obj = new JSONObject(output);
							if (obj != null && obj.get("user") != null && obj.get("user") instanceof JSONObject) {
								UserInfo userInfo = new UserInfo();
								userInfo.setGuid(obj.getJSONObject("user").getString("guid"));
								kpOrgSignOnInfo.setUser(userInfo);
							}
						}
					}
				}
			}
		}
		logger.debug("SignOn Info=" + kpOrgSignOnInfo);
		logger.info(LOG_EXITING);
		return kpOrgSignOnInfo;
	}

	private static ResponseEntity<?> callRestService(final HttpHeaders headers, final URI uri,
			final HttpMethod httpMethod, final Class<?> responseType) {
		final HttpEntity<?> entity = new HttpEntity<Object>(headers);
		final ResponseEntity<?> responseEntity = restTemplate.exchange(uri, httpMethod, entity, responseType);
		return responseEntity;
	}

	private static HttpHeaders getJsonHttpHeaders() {
		final HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("X-useragentcategory", kpOrgSSOUserAgentCategoryHeader);
		headers.set("X-osversion", kpOrgSSOOsVersionHeader);
		headers.set("X-useragenttype", kpOrgSSOUserAgentTypeHeader);
		headers.set("X-apiKey", kpOrgSSOAPIKeyHeader);
		headers.set("X-appName", kpOrgSSOAppNameHeader);
		return headers;
	}

	public static KpOrgSignOnInfo validateKpOrgSSOSession(final String ssoSession) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		String kpSsoSession = null;
		KpOrgSignOnInfo kpOrgSignOnInfo = null;
		ResponseEntity<?> responseEntity = null;
		int statusCode = 0;
		initializeKpOrgSSOSignOffProperty();
		final URI uri = new URI(kpOrgSSOSignOffAPIUrl);
		final HttpHeaders headers = getJsonHttpHeaders();
		headers.set("Accept", "*/*");
		headers.set("ssosession", ssoSession);
		try {
			responseEntity = callRestService(headers, uri, HttpMethod.GET, String.class);
		} catch (HttpClientErrorException ex) {
			logger.info("HttpClient error, Status code : " + ex.getRawStatusCode() + ", Status text : "
					+ ex.getStatusText());
		} catch (HttpServerErrorException ex1) {
			logger.info("HttpServer error, Status code : " + ex1.getRawStatusCode() + ", Status text : "
					+ ex1.getStatusText());
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage(), e);
		}
		if (responseEntity != null) {
			statusCode = responseEntity.getStatusCodeValue();
			logger.info("Status code : " + statusCode);
			output = (String) responseEntity.getBody();
			logger.debug("output from service: " + output);
			final HttpHeaders responseHeaders = responseEntity.getHeaders();
			kpSsoSession = responseHeaders.getFirst("ssosession");
			logger.info("kpSsoSession from response header=" + kpSsoSession);
			if (statusCode == 200 || statusCode == 201 || statusCode == 202) {
				if (StringUtils.isNotBlank(output)) {
					try {
						final Gson gson = new Gson();
						kpOrgSignOnInfo = gson.fromJson(output, KpOrgSignOnInfo.class);
						if (kpOrgSignOnInfo != null) {
							kpOrgSignOnInfo.setSsoSession(kpSsoSession);
						}
					} catch (Exception ex) {
						logger.warn("JSON parsing failed:" + ex.getMessage(), ex);
						if (kpOrgSignOnInfo == null) {
							kpOrgSignOnInfo = new KpOrgSignOnInfo();
							kpOrgSignOnInfo.setSsoSession(kpSsoSession);
							JSONObject obj = new JSONObject(output);
							if (obj != null && obj.get("user") != null && obj.get("user") instanceof JSONObject) {
								UserInfo userInfo = new UserInfo();
								userInfo.setGuid(obj.getJSONObject("user").getString("guid"));
								kpOrgSignOnInfo.setUser(userInfo);
							}
						}
					}
				}
			}
		}
		logger.debug("SignOn Info=" + kpOrgSignOnInfo);
		logger.info(LOG_EXITING);
		return kpOrgSignOnInfo;

	}
	
	
	// Authorize Member by passing guid to Member SSO Auth API
		public static AuthorizeResponseVo authorizeMemberSSOByGuid(String guid, String regionCode) throws Exception {
			logger.info(LOG_ENTERED);
			logger.debug(
					"guid=" + guid + ", regionCode=" + regionCode + ", memberSSOAuthRegionCode=" + memberSSOAuthRegionCode);
			
			AuthorizeResponseVo response = null;
			/*
			try {
				initializeMemberSSOAuthProperties();
				EsbInfo esbInfo = new EsbInfo();
				esbInfo.setEndpoint(memberSSOAuthAPIUrl);
				esbInfo.setUserName(serviceSecurityUsername);
				esbInfo.setPassword(serviceSecurityPassword);

				AuthorizeRequestVo req = new AuthorizeRequestVo();
				req.setGuid(guid);
				if (StringUtils.isBlank(regionCode)) {
					regionCode = memberSSOAuthRegionCode;
				}
				req.setRegionCode(regionCode);
				response = MemberSSOAuthAPIs.authorize(esbInfo, req);

			} catch (Exception e) {
				logger.error("Web Service API error:" + e.getMessage(), e);

			}
			*/
			try {
				initializeMemberSSOAuthProperties();
				final Gson gson = new Gson();
				AuthorizeRequestVo req = new AuthorizeRequestVo();
				req.setGuid(guid);
				if (StringUtils.isBlank(regionCode)) {
					regionCode = memberSSOAuthRegionCode;
				}
				req.setRegionCode(regionCode);
				final String inputString = gson.toJson(req);
				String jsonResponse  = callAPIManagerService(ServiceUtil.AUTHORIZE_MEMBER_OAUTH, inputString, MEMBERSOAUTH, ServiceUtil.POST,null);
				response = gson.fromJson(jsonResponse, AuthorizeResponseVo.class);
			}catch(Exception e) {
				logger.error("Web Service API error:" + e.getMessage(), e);
			}
			
			logger.info(LOG_EXITING);
			return response;
		}

	// perform SSO sign off from Kp org API
	public static boolean performKpOrgSSOSignOff(final String ssoSession) {
		logger.info(LOG_ENTERED);
		String kpSsoSession = null;
		boolean isSignedOff = false;
		ResponseEntity<?> responseEntity = null;
		int statusCode = 0;
		final HttpHeaders headers = getJsonHttpHeaders();
		headers.set("ssosession", ssoSession);
		try {
			initializeKpOrgSSOSignOffProperty();
			final URI uri = new URI(kpOrgSSOSignOffAPIUrl);
			responseEntity = callRestService(headers, uri, HttpMethod.DELETE, String.class);
			if (responseEntity != null) {
				statusCode = responseEntity.getStatusCodeValue();
				logger.info("Status code : " + statusCode);
				final HttpHeaders responseHeaders = responseEntity.getHeaders();
				kpSsoSession = responseHeaders.getFirst("ssosession");
			}
			if (statusCode == 200 || statusCode == 202 || statusCode == 204) {
				isSignedOff = true;
			}
			logger.info("ssosession token : " + kpSsoSession);
		} catch (HttpClientErrorException ex) {
			logger.info("HttpClient error, Status code : " + ex.getRawStatusCode() + ", Status text : "
					+ ex.getStatusText());
		} catch (HttpServerErrorException ex1) {
			logger.info("HttpServer error, Status code : " + ex1.getRawStatusCode() + ", Status text : "
					+ ex1.getStatusText());
		} catch (Exception e) {
			logger.warn("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING + " isSignedOff=" + isSignedOff);
		return isSignedOff;
	}

	public static void initializeKpOrgSSOSignOffProperty() {
		logger.info(LOG_ENTERED);
		try {
			if (StringUtils.isBlank(kpOrgSSOSignOffAPIUrl)) {
				kpOrgSSOSignOffAPIUrl = AppProperties.getExtPropertiesValueByKey("KPORG_SSO_SIGNOFF_API_URL");
				logger.debug("kpOrgSSOSignOffAPIUrl : " + kpOrgSSOSignOffAPIUrl);
			}
		} catch (Exception e) {
			logger.warn("Failed to get initializeKpOrgSSOSignOffProperty from external properties file");
		}
		logger.info(LOG_EXITING);
	}
	
	public static void initializeRestProperties() {
		logger.info(LOG_ENTERED);
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			logger.info("videoVisitRestServiceUrl is empty. Reading it from properties file.");
			videoVisitRestServiceUrl = appProp.getProperty("VIDEOVISIT_REST_URL");
			serviceSecurityUsername = appProp.getProperty("SERVICE_SECURITY_USERNAME");
			serviceSecurityPassword = Crypto.decrypt(appProp.getProperty("SERVICE_SECURITY_PASSWORD"));
			logger.debug("videoVisitRestServiceUrl : " + videoVisitRestServiceUrl + "SecurityUsername:"
					+ serviceSecurityUsername + ", SecurityPassword:" + serviceSecurityPassword);

			videoVisitMeetingRestServiceUrl = appProp.getProperty("VIDEOVISIT_MEETING_REST_URL");
		} catch (Exception e) {
			logger.warn("Failed to get videoVisitRestServiceUrl from external properties file");
		}
		logger.info(LOG_EXITING + " videoVisitRestServiceUrl :  " + videoVisitRestServiceUrl
				+ ", videoVisitMeetingRestServiceUrl : " + videoVisitMeetingRestServiceUrl);
	}
	
	public static void initializeSetupWizardProperties() {
		logger.info(LOG_ENTERED);
		try {
			if (StringUtils.isBlank(setupWizardHostNuid) || StringUtils.isBlank(setupWizardMemberMrn)
					|| StringUtils.isBlank(setupWizardMeetingType)) {
				final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
				setupWizardHostNuid = appProp.getProperty("SETUP_WIZARD_HOST_NUID");
				setupWizardMemberMrn = appProp.getProperty("SETUP_WIZARD_MEMBER_MRN");
				setupWizardMeetingType = appProp.getProperty("SETUP_WIZARD_MEETING_TYPE");
				logger.debug("setupWizardHostNuid=" + setupWizardHostNuid + ", setupWizardMemberMrn=" + setupWizardMemberMrn
						+ ", setupWizardMeetingType=" + setupWizardMeetingType);
			}
		} catch (Exception e) {
			logger.warn("Failed to initializeSetupWizardProperties from external properties file");
		}
		logger.info(LOG_EXITING);
	}
	
	public static void initializeProxyProperties() {
		logger.info(LOG_ENTERED);
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			secureCodes = appProp.getProperty("SECURE_CODES");
			isAdhoc = "true".equals(appProp.getProperty("ADHOC")) ? true : false;
			isParrs = "true".equals(appProp.getProperty("PARRS")) ? true : false;
			logger.debug("secureCodes=" + secureCodes + ", isAdhoc=" + isAdhoc + ", isParrs=" + isParrs);
		} catch (Exception e) {
			logger.warn("Failed to initializeProxyProperties from external properties file");
		}
		logger.info(LOG_EXITING);
	}

	public static void initializeMemberSSOAuthProperties() {
		logger.info(LOG_ENTERED);
		try {
			if (StringUtils.isBlank(memberSSOAuthAPIUrl) || StringUtils.isBlank(memberSSOAuthRegionCode)
					|| StringUtils.isBlank(serviceSecurityUsername) || StringUtils.isBlank(serviceSecurityPassword)) {
				final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
				memberSSOAuthAPIUrl = appProp.getProperty("MEMBER_SSO_AUTH_API_URL");
				memberSSOAuthRegionCode = appProp.getProperty("MEMBER_SSO_AUTH_REGION_CODE");
				serviceSecurityUsername = appProp.getProperty("SERVICE_SECURITY_USERNAME");
				serviceSecurityPassword = Crypto.decrypt(appProp.getProperty("SERVICE_SECURITY_PASSWORD"));
				logger.debug("memberSSOAuthAPIUrl : " + memberSSOAuthAPIUrl + ", memberSSOAuthRegionCode : "
						+ memberSSOAuthRegionCode + "SecurityUsername:" + serviceSecurityUsername + ", SecurityPassword:"
						+ serviceSecurityPassword);
			}
		} catch (Exception e) {
			logger.warn("Failed to initializeMemberSSOAuthProperties from external properties file");
		}
		logger.info(LOG_EXITING);
	}
	
	public static void initializekpOrgSSOHeaders(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			kpOrgSSOUserAgentTypeHeader = WebUtil.getBrowserDetails(request);
			if (StringUtils.isBlank(kpOrgSSOUserAgentCategoryHeader) || StringUtils.isBlank(kpOrgSSOOsVersionHeader)
					|| StringUtils.isBlank(kpOrgSSOAPIKeyHeader) || StringUtils.isBlank(kpOrgSSOAppNameHeader)) {
				kpOrgSSOUserAgentCategoryHeader = System.getProperty("os.name");
				kpOrgSSOOsVersionHeader = System.getProperty("os.version");
				kpOrgSSOAPIKeyHeader = Crypto.decrypt(appProp.getProperty("KPORG_SSO_API_KEY_HEADER"));
				kpOrgSSOAppNameHeader = appProp.getProperty("KPORG_SSO_APP_NAME_HEADER");
				logger.debug("kpOrgSSOUserAgentTypeHeader : " + kpOrgSSOUserAgentTypeHeader
						+ ", kpOrgSSOUserAgentCategoryHeader : " + kpOrgSSOUserAgentCategoryHeader
						+ "kpOrgSSOOsVersionHeader:" + kpOrgSSOOsVersionHeader + ", kpOrgSSOAPIKeyHeader:"
						+ kpOrgSSOAPIKeyHeader + ", kpOrgSSOAppNameHeader:" + kpOrgSSOAppNameHeader);
			}
		} catch (Exception e) {
			logger.warn("Failed to initializekpOrgSSOHeaders from external properties file");
		}
		logger.info(LOG_EXITING);
	}

	/**
	 * @param operationName
	 * @param input
	 * @return
	 */
	public static String callVVRestService(final String operationName, final String input) {
		logger.info(LOG_ENTERED);
		String output = null;
		ResponseEntity<?> responseEntity = null;
		try {
			logger.info("videoVisitRestServiceUrl url: " + videoVisitRestServiceUrl + operationName);
			if (StringUtils.isBlank(videoVisitRestServiceUrl) || StringUtils.isBlank(serviceSecurityUsername)
					|| StringUtils.isBlank(serviceSecurityPassword)) {
				initializeRestProperties();
			}
			final URI uri = new URI(videoVisitRestServiceUrl + operationName);
			logger.info("videoVisitRestServiceUrl : " + uri);
			final String authStr = serviceSecurityUsername + ":" + serviceSecurityPassword;
			logger.debug("authStr : " + authStr);
			final String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());

			final HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("Accept", "*/*");
			headers.set("Authorization", "Basic " + authEncoded.trim());
			final HttpEntity<?> entity = new HttpEntity<Object>(input, headers);
			responseEntity = restTemplate.postForEntity(uri, entity, String.class);
			if (responseEntity != null) {
				output = (String) responseEntity.getBody();
			}

		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	/**
	 * @param meetingId
	 * @param joinLeaveStatus
	 * @param isProxyMeeting
	 * @param careGiverName
	 * @param sessionId
	 * @param clientId
	 * @return
	 * @throws Exception
	 */
	public static org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput setKPHCConferenceStatus(long meetingId, String joinLeaveStatus,
			boolean isProxyMeeting, String careGiverName, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId + ", joinLeaveStatus=" + joinLeaveStatus
				+ ", isProxyMeeting" + isProxyMeeting);
		logger.debug("careGiverName=" + careGiverName);
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		String inputJsonString = "";
		String jsonResponseStr = "";

		try {
			if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput();
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
			} else {
				final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.SetKPHCConferenceStatusInput input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.SetKPHCConferenceStatusInput();
				input.setCareGiverName(careGiverName);
				input.setClientId(clientId);
				input.setJoinLeaveStatus(joinLeaveStatus);
				input.setMeetingId(meetingId);
				input.setProxyMeeting(isProxyMeeting);
				input.setSessionId(sessionId);

				final Gson gson = new Gson();
				inputJsonString = gson.toJson(input);
				logger.debug("jsonInputString : " + inputJsonString);
				jsonResponseStr = callAPIManagerService(ServiceUtil.SET_KPHC_CONFERENCE_STATUS, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
				logger.info("jsonResponseString : " + jsonResponseStr);
				if (StringUtils.isNotBlank(jsonResponseStr)) {
					final JsonParser parser = new JsonParser();
					final JsonObject jobject = (JsonObject) parser.parse(jsonResponseStr);
					output = gson.fromJson(jobject.get("service").toString(), org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput.class);
				}
			}
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId, e);
		}

		logger.info(LOG_EXITING);
		return output;
	}

	public static MeetingDetailsOutput retrieveActiveMeetingsForMemberAndProxies(String mrn8Digit,
			boolean getProxyMeetings, String sessionID, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " getProxyMeetings=" + getProxyMeetings);
		logger.debug("mrn8Digit=" + mrn8Digit);
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		String inputJsonString = "";
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject jobject = new JsonObject();
		try {
			if (StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID) || StringUtils.isBlank(clientId)) {
				logger.warn("Missing input attributes.");
				output = new MeetingDetailsOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			initializeProxyProperties();
			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.RetrieveActiveMeetingsForMemberAndProxiesInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.RetrieveActiveMeetingsForMemberAndProxiesInput();
			input.setMrn(mrn8Digit);
			input.setGetProxyMeetings(getProxyMeetings);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setClientId(clientId);
			input.setSessionId(sessionID);

			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);
			logger.debug("MAPPOINTMENT : " + MAPPOINTMENT);
			responseJsonStr = callAPIManagerService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);
			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);

			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(LOG_EXITING + "Rest response message & code: " + responseCodeAndMsg);
		return output;
	}

	public static MeetingDetailsOutput retrieveActiveMeetingsForNonMemberProxies(String guid, String sessionID,
			String clientId) throws Exception {
		logger.info(LOG_ENTERED);
		logger.debug("guid=" + guid);
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		String inputJsonString = "";
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject jobject = new JsonObject();
		try {
			if (StringUtils.isBlank(guid) || StringUtils.isBlank(sessionID) || StringUtils.isBlank(clientId)) {
				logger.warn("Missing input attributes.");
				output = new MeetingDetailsOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			initializeProxyProperties();
			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.RetrieveActiveMeetingsForNonMemberProxiesInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.RetrieveActiveMeetingsForNonMemberProxiesInput();
			input.setGuid(guid);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setClientId(clientId);
			input.setSessionId(sessionID);

			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callAPIManagerService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);

			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);

			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(LOG_EXITING + "Rest response message & code: " + responseCodeAndMsg);
		return output;
	}

	/**
	 * @param lastName
	 * @param mrn
	 * @param birth_month
	 * @param birth_year
	 * @param birth_day
	 * @param sessionId
	 * @param clientId
	 * @return
	 * @throws Exception
	 */
	public static org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput verifyMember(String lastName, String mrn, String birth_month, String birth_year,
			String birth_day, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput verifyMemberOutput = null;
		final String Dob = birth_month + "/" + birth_year;
		org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberInput verifyMeberInput = new org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberInput();
		logger.debug("lastName: " + lastName);
		try {
			if (StringUtils.isNotBlank(mrn) && StringUtils.isNotBlank(sessionId) && StringUtils.isNotBlank(lastName)) {
				if (WebUtil.isDOBMMYYYYFormat(Dob)) {
					verifyMeberInput.setMrn(mrn);
					verifyMeberInput.setLastName(lastName);
					verifyMeberInput.setDateOfBirth(Dob);
					verifyMeberInput.setSessionID(sessionId);
					verifyMeberInput.setClientId(clientId);

					final Gson gson = new Gson();
					String inputString = gson.toJson(verifyMeberInput);
					logger.debug("jsonInputString " + inputString);

					String jsonString = callAPIManagerService(ServiceUtil.VERIFY_MEMBER, inputString, VVINTEGRATION, ServiceUtil.POST, null);
					logger.debug("outputjsonString" + jsonString);
					if (StringUtils.isNotBlank(jsonString)) {
						final JsonParser parser = new JsonParser();
						final JsonObject jobject = (JsonObject) parser.parse(jsonString);
						verifyMemberOutput = gson.fromJson(jobject.get("service").toString(), org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput.class);
					}
				} else {
					logger.warn("DOB has to be in the format of MM/YYYY but is [" + Dob + "]");
				}
			} else {
				logger.warn("One of required fields are null or empty");
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
			throw new Exception("Web Service API error", e.getCause());
		}
		logger.info(LOG_EXITING);
		return verifyMemberOutput;
	}

	public static org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingOutput createInstantVendorMeeting(String hostNuid, String[] participantNuid,
			String memberMrn, String meetingType, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + "meetingType: " + meetingType);
		logger.debug("hostNuid=" + hostNuid + ", participantNuid=" + participantNuid + ", memberMrn=" + memberMrn);
		org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(hostNuid) || StringUtils.isBlank(memberMrn) || StringUtils.isBlank(meetingType)
					|| StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
				logger.warn("Missing input attributes.");
				output = new org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingInput();
			input.setHostNuid(hostNuid);
			input.setParticipantNuid(participantNuid);
			input.setMemberMrn(memberMrn);
			input.setMeetingType(meetingType);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			final Gson gson = new GsonBuilder().serializeNulls().create();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);
			responseJsonStr = callAPIManagerService(ServiceUtil.CREATE_INSTANT_VENDOR_MEETING, inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);
			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
				if (jobject != null && jobject.get("service") != null) {
					output = gson.fromJson(jobject.get("service").toString(), org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingOutput.class);
				}
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson testDbRoundTrip() throws Exception {
		logger.info(LOG_ENTERED);
		String responseJsonStr = null;
		final Gson gson = new Gson();
		org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson testDbRoundTripJson = new org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson();
		try {
			responseJsonStr = callAPIManagerService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}", MAPPOINTMENT, ServiceUtil.POST, null);
			testDbRoundTripJson = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}", MAPPOINTMENT, ServiceUtil.POST, null);
			testDbRoundTripJson = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson.class);
		}
		logger.info(LOG_EXITING);
		return testDbRoundTripJson;
	}

	public static org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON memberLeaveProxyMeeting(String meetingId, String careGiverName, String sessionId,
			String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId);
		logger.debug("careGiverName=" + careGiverName);
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new Gson();
		String inputJsonString = null;
		try {
			if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId)) {
				output = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON();
				org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput joinLeaveMeetingOutput = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput();
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setService(joinLeaveMeetingOutput);
				output.getService().setStatus(status);
				return output;
			}
			org.kp.tpmg.ttg.videovisit.mconference.model.JoinLeaveMeetingInput joinLeaveMeetingInput = new org.kp.tpmg.ttg.videovisit.mconference.model.JoinLeaveMeetingInput();
			joinLeaveMeetingInput.setMeetingId(Long.parseLong(meetingId));
			joinLeaveMeetingInput.setInMeetingDisplayName(careGiverName);
			joinLeaveMeetingInput.setSessionId(sessionId);
			joinLeaveMeetingInput.setClientId(clientId);
			joinLeaveMeetingInput.setIsPatient(false);
			joinLeaveMeetingInput.setDeviceType(WebUtil.DEFAULT_DEVICE);
			joinLeaveMeetingInput.setDeviceOs(WebUtil.getDeviceOs());
			joinLeaveMeetingInput.setDeviceOsVersion(WebUtil.getDeviceOsVersion());
			inputJsonString = gson.toJson(joinLeaveMeetingInput);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callAPIManagerService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON.class);
			}
			logger.info("jsonResponseString : " + responseJsonStr);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON.class);
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String launchMemberOrProxyMeetingForMember(long meetingId, String mrn8Digit,
			String inMeetingDisplayName, boolean isProxyMeeting, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId + ", isProxyMeeting" + isProxyMeeting);
		logger.debug("mrn8Digit=" + mrn8Digit + ", inMeetingDisplayName" + inMeetingDisplayName);
		final Gson gson = new Gson();
		String responseJsonStr = null;
		String inputJsonString = null;
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMemberOrProxyMeetingForMemberInput input = null;
		try {
			boolean isNonMember = false;
			if (isProxyMeeting && StringUtils.isBlank(mrn8Digit)) {
				isNonMember = true;
			}
			logger.info("isNonMember= " + isNonMember);
			if ((!isNonMember && StringUtils.isBlank(mrn8Digit)) || meetingId <= 0 || StringUtils.isBlank(sessionId)
					|| StringUtils.isBlank(inMeetingDisplayName)) {
				logger.warn("Missing input attributes.");
				org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON output = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON();
				output.setService(new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestOutput());
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.getService().setStatus(status);
				return gson.toJson(output);
			}

			input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMemberOrProxyMeetingForMemberInput();
			input.setMeetingId(meetingId);
			input.setMrn(mrn8Digit);
			input.setInMeetingDisplayName(inMeetingDisplayName);
			input.setGetProxyMeeting(isProxyMeeting);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			inputJsonString = gson.toJson(input);
			logger.debug("inputJsonString : " + inputJsonString);
			responseJsonStr = callAPIManagerService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return responseJsonStr;
	}

	public static String launchMeetingForMemberDesktop(long meetingId, String inMeetingDisplayName, String mrn8Digit,
			String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId);
		logger.debug("mrn8Digit=" + mrn8Digit + ", inMeetingDisplayName" + inMeetingDisplayName);
		final Gson gson = new Gson();
		String responseJsonStr;
		String inputJsonString = null;
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopInput input;
		if (meetingId <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionId)
				|| StringUtils.isBlank(clientId) || StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("Missing input attributes.");
			org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON output = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON();
			output.setService(new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestOutput());
			final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			return gson.toJson(output);
		}

		try {
			input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopInput();
			input.setMeetingId(meetingId);
			input.setInMeetingDisplayName(inMeetingDisplayName);
			input.setMrn(mrn8Digit);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			inputJsonString = gson.toJson(input);
			logger.debug("inputJsonString : " + inputJsonString);
			responseJsonStr = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return responseJsonStr;

	}

	public static String launchMeetingForMember(long meetingId, String inMeetingDisplayName, String sessionId,
			String mrn, String deviceType, String deviceOS, String deviceOSversion, boolean isMobileFlow)
			throws Exception {
		logger.info(LOG_ENTERED + " meetingID: " + meetingId + ", isMobileFlow :" + isMobileFlow + ", deviceType :"
				+ deviceType + ", deviceOS :" + deviceOS + ", deviceOSversion :" + deviceOSversion);
		logger.debug("mrn=" + mrn + ", inMeetingDisplayName" + inMeetingDisplayName);

		org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberInput jsonInput = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberInput();
		Gson gson = new Gson();
		String output;
		if (meetingId <= 0 || StringUtils.isBlank(mrn) || StringUtils.isBlank(sessionId)
				|| StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("Missing input attributes.");
			org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON memberOutput = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON();
			memberOutput.setService(new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestOutput());
			final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberOutput.getService().setStatus(status);
			return gson.toJson(memberOutput);
		}
		try {
			jsonInput.setMrn(mrn);
			jsonInput.setMeetingID(meetingId);
			jsonInput.setSessionId(sessionId);
			jsonInput.setInMeetingDisplayName(inMeetingDisplayName);
			jsonInput.setDeviceType(deviceType);
			jsonInput.setDeviceOS(deviceOS);
			jsonInput.setDeviceOSversion(deviceOSversion);
			jsonInput.setMobileFlow(isMobileFlow);
			jsonInput.setClientId(WebUtil.MOB_CLIENT_ID);
			logger.debug("inputJsonString : " + gson.toJson(jsonInput));
			output = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput), MCONFERENCE, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			output = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput), MCONFERENCE, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String memberLogout(String mrn, String sessionId) throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisit.mappointment.model.MemberLogoutInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.MemberLogoutInput();
		Gson gson = new Gson();
		String output;
		if (StringUtils.isBlank(mrn)) {
			mrn = WebUtil.NON_MEMBER;
		}
		if (StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson memberLogoutOutput = new org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson();
			memberLogoutOutput.setService(new org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutput());
			final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberLogoutOutput.getService().setStatus(status);
			return gson.toJson(memberLogoutOutput);
		}

		try {
			input.setMrn8Digit(mrn);
			input.setSessionId(sessionId);
			logger.debug("inputJsonString : " + gson.toJson(input));
			output = callAPIManagerService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input), MAPPOINTMENT, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callAPIManagerService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input), MAPPOINTMENT, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	/**
	 * @param meetingId
	 * @param sessionId
	 * @return
	 */
	public static String getProviderRunningLateDetails(final String meetingId, final String sessionId,
			final String clientId) {
		logger.info(LOG_ENTERED + " meetingId: " + meetingId);
		final Gson gson = new Gson();
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateInput input;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutputJson output = new org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutputJson();
			final org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutput service = new org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutput();
			service.setName(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS);
			output.setService(service);
			final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateInput();
			input.setMeetingId(meetingId);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr " + inputJsonStr);
			jsonOutput = callAPIManagerService(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS, inputJsonStr, MAPPOINTMENT, ServiceUtil.POST, null);
			logger.info("jsonOutput " + jsonOutput);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}

	/**
	 * @param meetingId
	 * @param meetingHash
	 * @param joinOrLeave
	 * @param sessionId
	 * @return
	 */
	public static String caregiverJoinLeaveMeeting(final String meetingId, final String meetingHash,
			final String joinOrLeave, final String sessionId, final String clientId) {
		logger.info(LOG_ENTERED + "meetingHash: " + meetingHash + ", meetingId :" + meetingId + ", joinOrLeave :"
				+ joinOrLeave);
		final Gson gson = new Gson();
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingForMemberGuestInput input;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(meetingHash) || StringUtils.isBlank(joinOrLeave)
				|| StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON output = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON();
			final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput service = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput();
			service.setName(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST);
			output.setService(service);
			final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingForMemberGuestInput();
			input.setMeetingId(meetingId);
			input.setMeetingHash(meetingHash);
			input.setJoinLeaveMeeting(joinOrLeave);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr " + inputJsonStr);
			jsonOutput = callAPIManagerService(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST, inputJsonStr, MCONFERENCE, ServiceUtil.POST, null);
			logger.info("jsonOutput " + jsonOutput);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}

	public static String updateEmailAction(String meetingId, String userType, String action, String sessionId) {
		logger.info(LOG_ENTERED + " meetingId: " + meetingId + ", userType :" + userType + ", action :" + action);
		final Gson gson = new Gson();
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.UpdateEmailActionInput input;

		if (StringUtils.isBlank(meetingId)) {
			logger.warn("Missing input attributes.");
			final org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson();
			final org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutput service = new org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutput();
			service.setName(ServiceUtil.UPDATE_EMAIL_ACTION);
			output.setService(service);
			final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		} else {
			try {
				input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.UpdateEmailActionInput();
				input.setMeetingId(meetingId);
				input.setUserType(userType);
				input.setUserAction(action);
				input.setClientId(WebUtil.VV_MBR_WEB);
				input.setSessionId(sessionId);
				final String inputJsonStr = gson.toJson(input);
				logger.info("inputJsonStr: " + inputJsonStr);
				jsonOutput = callAPIManagerService(ServiceUtil.UPDATE_EMAIL_ACTION, inputJsonStr, MAPPOINTMENT, ServiceUtil.POST, null);
				logger.info("jsonOutput: " + jsonOutput);

			} catch (Exception e) {
				logger.error("Web Service API error for meeting:" + meetingId, e);
			}
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}

	public static String logVendorMeetingEvents(final long meetingId, final String userType, final String userId,
			final String eventName, final String eventDescription, final String logType, final String sessionId,
			final String clientId) {
		logger.info(LOG_ENTERED + " meetingId: " + meetingId + " userType: " + userType);
		final Gson gson = new Gson();
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisitsintegration.model.notification.VendorMeetingEventInput input;

		if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutputJson();
			final org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutput service = new org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutput();
			service.setName(ServiceUtil.LOG_VENDOR_MEETING_EVENTS);
			output.setService(service);
			final org.kp.tpmg.ttg.videovisitsintegration.model.Status status = new org.kp.tpmg.ttg.videovisitsintegration.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonOutput = gson.toJson(output);
		} else {
			try {
				input = new org.kp.tpmg.ttg.videovisitsintegration.model.notification.VendorMeetingEventInput();
				input.setMeetingId(meetingId);
				input.setUserType(userType);
				input.setUserId(userId);
				input.setEventName(eventName);
				input.setEventDescription(eventDescription);
				input.setLogType(logType);
				input.setClientId(clientId);
				input.setSessionId(sessionId);

				final String inputJsonStr = gson.toJson(input);
				logger.debug("inputJsonStr: " + inputJsonStr);
				jsonOutput = callAPIManagerService(ServiceUtil.LOG_VENDOR_MEETING_EVENTS, inputJsonStr, VVINTEGRATION, ServiceUtil.POST, null);
				logger.info("jsonOutput: " + jsonOutput);

			} catch (Exception e) {
				logger.error("Web Service API error for meeting:" + meetingId + " : ", e);
			}
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}

	/**
	 * @param mrn8Digit
	 * @param isNonMember
	 * @param sessionId
	 * @return
	 */
	public static MeetingDetailsOutput getActiveMeetingsForSSOSimulation(final String mrn8Digit,
			final boolean isNonMember, final String sessionId, final String clientId) {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		String inputJsonString = "";
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject jobject = new JsonObject();
		try {
			final List<String> proxyMrns = new ArrayList<String>();
			String adultProxy = null;
			String childProxy = null;
			String teenProxy = null;
			boolean isMember = true;
			if (isNonMember) {
				adultProxy = AppProperties.getExtPropertiesValueByKey("NON_MEMBER_ADULT_PROXY_MRN");
				childProxy = AppProperties.getExtPropertiesValueByKey("NON_MEMBER_CHILD_PROXY_MRN");
				teenProxy = AppProperties.getExtPropertiesValueByKey("NON_MEMBER_TEEN_PROXY_MRN");
				isMember = false;
			} else {
				adultProxy = AppProperties.getExtPropertiesValueByKey("MEMBER_ADULT_PROXY_MRN");
				childProxy = AppProperties.getExtPropertiesValueByKey("MEMBER_CHILD_PROXY_MRN");
				teenProxy = AppProperties.getExtPropertiesValueByKey("MEMBER_TEEN_PROXY_MRN");
			}
			if (StringUtils.isNotBlank(adultProxy)) {
				proxyMrns.add(adultProxy);
			}
			if (StringUtils.isNotBlank(childProxy)) {
				proxyMrns.add(childProxy);
			}
			if (StringUtils.isNotBlank(teenProxy)) {
				proxyMrns.add(teenProxy);
			}
			if (StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionId)
					|| CollectionUtils.isEmpty(proxyMrns)) {
				logger.warn("Missing input attributes.");
				output = new MeetingDetailsOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			initializeProxyProperties();
			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.GetMeetingsForMemberAndNonMemberProxiesInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.GetMeetingsForMemberAndNonMemberProxiesInput();
			input.setMemberMrn(mrn8Digit);
			input.setProxyMrns(proxyMrns);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setIsMember(isMember);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callAPIManagerService(ServiceUtil.GET_MEETINGS_FOR_MEMBER_AND_NON_MEMBER_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);

			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callAPIManagerService(ServiceUtil.GET_MEETINGS_FOR_MEMBER_AND_NON_MEMBER_PROXIES,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);

			logger.debug("jsonResponseString : " + responseJsonStr);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(LOG_EXITING + "Rest response message & code: " + responseCodeAndMsg);
		return output;
	}
	
	/**
	 * @param meetingId
	 * @param sessionId
	 * @return
	 */
	public static String getMeetingDetailsForMeetingId(final long meetingId, final String sessionId, final String clientId) {
		logger.info(LOG_ENTERED);

		final Gson gson = new Gson();
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdInput input;
		if (meetingId <= 0 || StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
			logger.warn("Missing input attributes");
			final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON output = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON();
	    	final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdOutput service = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdOutput();
			service.setName(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID);
			output.setService(service);
			final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdInput();
			input.setMeetingId(meetingId);
			input.setClientId(WebUtil.VV_MBR_WEB);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr: " + inputJsonStr);
			jsonOutput = callAPIManagerService(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID, inputJsonStr, MAPPOINTMENT, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error ", e);
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}
	
	public static org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON joinLeaveMeeting(final long meetingId, final String inMeetingDisplayName,
			boolean isPatient, final String joinLeaveMeeting, final String deviceType, final String deviceOS,
			final String deviceOSversion, final String clientId, final String sessionId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId);
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new Gson();
		String inputJsonString = null;
		try {
			if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
				output = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON();
				final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput joinLeaveMeetingOutput = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingOutput();
				final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setService(joinLeaveMeetingOutput);
				output.getService().setStatus(status);
				return output;
			}
			final org.kp.tpmg.ttg.videovisit.mconference.model.JoinLeaveMeetingInput joinLeaveMeetingInput = new org.kp.tpmg.ttg.videovisit.mconference.model.JoinLeaveMeetingInput();
			joinLeaveMeetingInput.setMeetingId(meetingId);
			joinLeaveMeetingInput.setInMeetingDisplayName(inMeetingDisplayName);
			joinLeaveMeetingInput.setSessionId(sessionId);
			joinLeaveMeetingInput.setClientId(clientId);
			joinLeaveMeetingInput.setIsPatient(isPatient);
			joinLeaveMeetingInput.setDeviceType(deviceType);
			joinLeaveMeetingInput.setDeviceOs(deviceOS);
			joinLeaveMeetingInput.setDeviceOsVersion(deviceOSversion);
			inputJsonString = gson.toJson(joinLeaveMeetingInput);
			logger.debug("jsonInptString : " + inputJsonString);

			if ("J".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callAPIManagerService(ServiceUtil.JOIN_MEETING, inputJsonString, MCONFERENCE,ServiceUtil.POST, null);
			} else if ("L".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callAPIManagerService(ServiceUtil.LEAVE_MEETING, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			}// else part to be decided by ranjeet
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON.class);
			}
			logger.info("jsonResponseString : " + responseJsonStr);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			if ("J".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callAPIManagerService(ServiceUtil.JOIN_MEETING, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			} else if ("L".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callAPIManagerService(ServiceUtil.LEAVE_MEETING, inputJsonString, MCONFERENCE, ServiceUtil.POST, null);
			}
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON.class);
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON guestLoginJoinMeeting(final String meetingHash,
			final String patientLastName, final boolean isMobileFlow, final String deviceType, final String deviceOS,
			final String deviceOSversion, final String clientId, final String sessionId) throws Exception {
		logger.info(LOG_ENTERED + " meetingHash=" + meetingHash);
		org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new GsonBuilder().serializeNulls().create();
		String inputJsonString = null;
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(patientLastName)
					|| StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId)) {
				output = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdOutput meetingDetailsForMeetingIdOutput = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdOutput();
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setService(meetingDetailsForMeetingIdOutput);
				output.getService().setStatus(status);
				return output;
			}
			final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.VerifyAndLaunchMeetingForMemberGuestInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.VerifyAndLaunchMeetingForMemberGuestInput();
			input.setMeetingHash(meetingHash);
			input.setPatientLastName(patientLastName);
			input.setMobileFlow(isMobileFlow);
			input.setDeviceType(deviceType);
			input.setDeviceOs(deviceOS);
			input.setDeviceOsVersion(deviceOSversion);
			input.setClientId(clientId);
			input.setSessionId(sessionId);
			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);
			responseJsonStr = callAPIManagerService(ServiceUtil.VERIFY_AND_LAUNCH_MEETING_FOR_MEMBER_GUEST,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON.class);
			}
			logger.debug("jsonResponseString : " + responseJsonStr);
		} catch (Exception e) {
			logger.error(
					"Web Service API error for guestLoginJoinMeeting for meetingHash:" + meetingHash + " Retrying...",
					e);
			responseJsonStr = callAPIManagerService(ServiceUtil.VERIFY_AND_LAUNCH_MEETING_FOR_MEMBER_GUEST,
					inputJsonString, MAPPOINTMENT, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(responseJsonStr)) {
				output = gson.fromJson(responseJsonStr, org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON.class);
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static MeetingDetailsJSON retrieveMeeting(String mrn8Digit, int pastMinutes, int futureMinutes,
			String sessionID, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " pastMinutes=" + pastMinutes + " pastMinutes=" + pastMinutes);
		logger.debug("mrn8Digit=" + mrn8Digit);

		MeetingDetailsJSON meetingDetailsJSON = null;
		Gson gson = new Gson();
		String output = null;
		ActiveMeetingsForMemberInput jsonInput = new ActiveMeetingsForMemberInput();
		try {
			if (mrn8Digit == null || sessionID == null) {
				logger.warn("Missing input attributes.");
				MeetingDetailsJSON detailsJSON = new MeetingDetailsJSON();
				detailsJSON.setService(new MeetingDetailsOutput());
				final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				detailsJSON.getService().setStatus(status);
				return detailsJSON;
			}
			jsonInput.setMrn(mrn8Digit);
			jsonInput.setClientId(clientId);
			jsonInput.setSessionId(sessionID);
			logger.debug("inputJsonString : " + gson.toJson(jsonInput));
			output = callAPIManagerService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput), MAPPOINTMENT, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(output)) {
				meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callAPIManagerService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput), MAPPOINTMENT, ServiceUtil.POST, null);
			if (StringUtils.isNotBlank(output)) {
				meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
			}
		}
		logger.info(LOG_EXITING);
		return meetingDetailsJSON;
	}
	
	public static String getLaunchMeetingDetails(long meetingID, String inMeetingDisplayName, String sessionID,
			String mrn8Digit, String deviceType, String deviceOS, String deviceOSversion, boolean isMobileFlow)
			throws Exception {
		logger.info(LOG_ENTERED + " meetingID: " + meetingID + ", isMobileFlow :" + isMobileFlow + ", deviceType :"
				+ deviceType + ", deviceOS :" + deviceOS + ", deviceOSversion :" + deviceOSversion);
		logger.debug("mrn8Digit=" + mrn8Digit + ", inMeetingDisplayName" + inMeetingDisplayName);

		org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberInput jsonInput = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberInput();
		Gson gson = new Gson();
		String output;
		if (meetingID <= 0 || StringUtils.isBlank(sessionID)) {
			logger.warn("Missing input attributes.");
			org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON memberOutput = new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON();
			memberOutput.setService(new org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestOutput());
			final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberOutput.getService().setStatus(status);
			return gson.toJson(memberOutput);
		}
		try {
			jsonInput.setMrn(mrn8Digit);
			jsonInput.setMeetingID(meetingID);
			jsonInput.setSessionId(sessionID);
			jsonInput.setInMeetingDisplayName(inMeetingDisplayName);
			jsonInput.setDeviceType(deviceType);
			jsonInput.setDeviceOS(deviceOS);
			jsonInput.setDeviceOSversion(deviceOSversion);
			jsonInput.setMobileFlow(isMobileFlow);
			jsonInput.setClientId(WebUtil.MOB_CLIENT_ID);
			logger.debug("inputJsonString : " + gson.toJson(jsonInput));
			output = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput), MCONFERENCE, ServiceUtil.POST, null);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingID + " Retrying...", e);
			output = callAPIManagerService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput), MCONFERENCE, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String submitSurvey(final Gson gson, InputUserAnswers input) {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			if (input != null && input.getMeetingId() == 0 || StringUtils.isBlank(input.getSessionId())
					|| StringUtils.isBlank(input.getClientId()) || input.getUserAnswers() == null
					|| input.getUserAnswers().isEmpty() || StringUtils.isBlank(input.getUserType())
					|| StringUtils.isBlank(input.getUserValue())) {
				final Response response = new Response();
				response.setCode(WebUtil.BAD_REQUEST_400);
				output = gson.toJson(response);
			} else {
				logger.debug("inputJsonString : " + gson.toJson(input));
				//output = callVVMeetingRestService(HttpMethod.POST, null, ServiceUtil.SUBMIT_SURVEY, gson.toJson(input));
				output =callAPIManagerService( ServiceUtil.SUBMIT_SURVEY, gson.toJson(input), MEETINGAPI, ServiceUtil.POST, null);
				logger.debug("response : " + output);
			}
		} catch (Exception e) {
			logger.error("Web Service API Error while submitting the survey for meeting : " + input.getMeetingId(), e);
		}
		logger.info(LOG_EXITING);
		return output;

	}

	/*
	public static String callVVMeetingRestService(final HttpMethod httpMethod, HttpHeaders headers,
			final String operationName, final String input) {
		logger.info(LOG_ENTERED);
		String output = null;
		ResponseEntity<?> responseEntity = null;
		try {
			logger.info("videoVisitMeetingRestServiceUrl url: " + videoVisitMeetingRestServiceUrl + operationName);
			if (StringUtils.isBlank(videoVisitMeetingRestServiceUrl) || StringUtils.isBlank(serviceSecurityUsername)
					|| StringUtils.isBlank(serviceSecurityPassword)) {
				initializeRestProperties();
			}
			final URI uri = new URI(videoVisitMeetingRestServiceUrl + operationName);
			logger.info("videoVisitMeetingRestServiceUrl : " + uri);
			final String authStr = serviceSecurityUsername + ":" + serviceSecurityPassword;
			logger.debug("authStr : " + authStr);
			final String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());

			if (headers == null) {
				headers = new HttpHeaders();
			}
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("Authorization", "Basic " + authEncoded.trim());
			final HttpEntity<?> entity = new HttpEntity<Object>(input, headers);
			responseEntity = restTemplate.exchange(uri, httpMethod, entity, String.class);
			if (responseEntity != null) {
				output = (String) responseEntity.getBody();
			}

		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return output;
	}*/

	public static String getActiveSurveys(final Gson gson, final boolean memberFl, final boolean providerFl,
			final String meetingId, final String userType, final String userValue, final String sessionId) {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			if (StringUtils.isBlank(sessionId) || StringUtils.isBlank(meetingId) || "0".equalsIgnoreCase(meetingId) || StringUtils.isBlank(userType)
					|| StringUtils.isBlank(userValue)) {
				final ActiveSurveysResponse response = new ActiveSurveysResponse();
				response.setCode(WebUtil.BAD_REQUEST_400);
				output = gson.toJson(response);
			} else {
              /*
				final HttpHeaders headers = new HttpHeaders();
				headers.set("X-clientId", WebUtil.VV_MBR_WEB);
				headers.set("X-sessionId", sessionId);
				headers.set("X-providerFl", Boolean.toString(providerFl));
				headers.set("X-memberFl", Boolean.toString(memberFl));
				headers.set("X-meetingId", meetingId);
				headers.set("X-userType", userType);
				headers.set("X-userValue", userValue);
				*/
				
				Map<String, String> headers = new HashMap<String, String>();
				headers.put("X-clientId", WebUtil.VV_MBR_WEB);
				headers.put("X-sessionId", sessionId);
				headers.put("X-providerFl", Boolean.toString(providerFl));
				headers.put("X-memberFl", Boolean.toString(memberFl));
				headers.put("X-meetingId", meetingId);
				headers.put("X-userType", userType);
				headers.put("X-userValue", userValue);
				
				//output = callVVMeetingRestService(HttpMethod.GET, headers, ServiceUtil.GET_ACTIVE_SURVEYS, null);
				output =callAPIManagerService( ServiceUtil.GET_ACTIVE_SURVEYS, null, MEETINGAPI, ServiceUtil.GET, headers);
				logger.debug("response : " + output);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static String insertVendorMeetingMediaCDR(final String meetingId, final String meetingVmr, final String callUUID,
			final String partipantName, final String mediaStats, final String sessionId, final String clientId) {
		logger.info(LOG_ENTERED);
		String jsonResponse = null;
		final Gson gson = new Gson();
		if (StringUtils.isBlank(sessionId)
				|| (StringUtils.isBlank(meetingId) && StringUtils.isBlank(meetingVmr)
				&& StringUtils.isBlank(callUUID))) {
			logger.warn("Missing input attributes");
			final org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson();
			final org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput service = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput();
			final org.kp.tpmg.ttg.videovisit.mconference.model.Status status = new org.kp.tpmg.ttg.videovisit.mconference.model.Status();
			service.setName(ServiceUtil.INSERT_VENODR_MEETING_MEDIA_CDR);
			output.setService(service);
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonResponse = gson.toJson(output);
		} else {
			final org.kp.tpmg.ttg.videovisit.mconference.model.mediastats.InsertVendorMeetingMediaCDRInput input = new org.kp.tpmg.ttg.videovisit.mconference.model.mediastats.InsertVendorMeetingMediaCDRInput();
			input.setMeetingId(meetingId);
			input.setMeetingVmr(meetingVmr);
			input.setCallUUID(callUUID);
			input.setMediaStats(mediaStats);
			input.setClientId(clientId);
			input.setParticipantName(partipantName);
			input.setSessionId(sessionId);

			final String inputString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputString);
			jsonResponse = callAPIManagerService(ServiceUtil.INSERT_VENODR_MEETING_MEDIA_CDR, inputString, VVINTEGRATION, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return jsonResponse;
	}

	public static String authorizeVVCode(String authtoken, String sessionId, String clientId) {
		logger.info(LOG_ENTERED);
		String jsonResponse = null;
		final Gson gson = new Gson();
		if (StringUtils.isBlank(authtoken) || (StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId))) {
			logger.warn("Missing input attributes");
			final org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutputJson output = new org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutputJson();
			final org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutput service = new org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutput();
			final org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = new org.kp.tpmg.ttg.videovisit.mappointment.model.Status();
			service.setName(ServiceUtil.AUTHORIZE_VV_CODE);
			output.setService(service);
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonResponse = gson.toJson(output);
		} else {
			final org.kp.tpmg.ttg.videovisit.mappointment.model.ValidateVVCodeInput input = new org.kp.tpmg.ttg.videovisit.mappointment.model.ValidateVVCodeInput();
			input.setAccessCode(authtoken);
			input.setClientId(clientId);
			input.setSessionId(sessionId);
			final String inputString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputString);
			jsonResponse = callAPIManagerService(ServiceUtil.AUTHORIZE_VV_CODE, inputString, MAPPOINTMENT, ServiceUtil.POST, null);
		}
		logger.info(LOG_EXITING);
		return jsonResponse;
	}
	
	public static String getSurveyQuestions(final Gson gson, final String surveyName, final String meetingId, 
			final String userType, final String userValue, final String sessionId) {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			if (StringUtils.isBlank(sessionId) || StringUtils.isBlank(meetingId) || "0".equalsIgnoreCase(meetingId) || StringUtils.isBlank(userType)
					|| StringUtils.isBlank(userValue)) {
				final SurveyResponse response = new SurveyResponse();
				response.setCode(WebUtil.BAD_REQUEST_400);
				output = gson.toJson(response);
			} else {
				//final HttpHeaders headers = new HttpHeaders();
			/*  headers.set("X-clientId", WebUtil.VV_MBR_WEB);
				headers.set("X-sessionId", sessionId);
				headers.set("X-surveyclientname", WebUtil.VV_MBR_WEB);
				headers.set("X-surveyname", surveyName);
				headers.set("X-meetingId", meetingId);
				headers.set("X-userType", userType);
				headers.set("X-userValue", userValue);
				*/
				
				Map<String, String> headers = new HashMap<String, String>();
				headers.put("X-clientId", WebUtil.VV_MBR_WEB);
				headers.put("X-sessionId", sessionId);
				headers.put("X-surveyclientname", WebUtil.VV_MBR_WEB);
				headers.put("X-surveyname", surveyName);
				headers.put("X-meetingId", meetingId);
				headers.put("X-userType", userType);
				headers.put("X-userValue", userValue);

				//output = callVVMeetingRestService(HttpMethod.GET, headers, ServiceUtil.GET_SURVEY_QUESTIONS, null);
				output =callAPIManagerService(ServiceUtil.GET_SURVEY_QUESTIONS, null, MEETINGAPI, ServiceUtil.GET, headers);
				logger.debug("response : " + output);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static String authorizeECCode(String authtoken, String sessionId, String clientId) {
		logger.info(LOG_ENTERED);
		String jsonResponse = null;
		final Gson gson = new Gson();
		if (StringUtils.isBlank(authtoken) || (StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId))) {
			logger.warn("Missing input attributes");
			final AuthorizeECCodeOutputJson output = new AuthorizeECCodeOutputJson();
			final AuthorizeECCodeOutput service = new AuthorizeECCodeOutput();
			final org.kp.tpmg.ttg.videovisitsec.model.Status status = new org.kp.tpmg.ttg.videovisitsec.model.Status();
			service.setName(ServiceUtil.AUTHORIZE_EC_CODE);
			output.setService(service);
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonResponse = gson.toJson(output);
		} else {
			final ValidateECCodeInput input = new ValidateECCodeInput();
			input.setAccessCode(authtoken);
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("X-CLIENTID", clientId);
			headers.put("X-SESSIONID", sessionId);
			final String inputString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputString);
			jsonResponse = callAPIManagerService(ServiceUtil.AUTHORIZE_EC_CODE, inputString, VV_EC, ServiceUtil.POST, headers);
		}
		logger.info(LOG_EXITING);
		return jsonResponse;
	}
	
	public static String updateGuestParticipant(String careGiverId,String meetingId, String joinLeaveStatus, String sessionId, String clientId,String firstName,String lastName) {
		logger.info(LOG_ENTERED);
		String jsonResponse = null;
		final Gson gson = new Gson();
		if((StringUtils.isBlank(careGiverId)  && (StringUtils.isBlank(firstName) || StringUtils.isBlank(lastName)))
	        || StringUtils.isBlank(meetingId) || StringUtils.isBlank(joinLeaveStatus)
		    || StringUtils.isBlank(clientId)  ||  StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes");
			final org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutputJson();
			final org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutput service = new org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutput();
			final org.kp.tpmg.ttg.videovisitsec.model.Status status = new org.kp.tpmg.ttg.videovisitsec.model.Status();
			service.setName(ServiceUtil.UPDATE_GUEST_PARTICIPANT);
			output.setService(service);
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonResponse = gson.toJson(output);
		} else {
			final UpdateGuestParticipantInput input = new UpdateGuestParticipantInput();
			input.setCareGiverId(careGiverId);
			input.setMeetingId(meetingId);
			input.setJoinLeaveStatus(joinLeaveStatus);
			input.setFirstName(firstName);
			input.setLastName(lastName);
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("X-CLIENTID", clientId);
			headers.put("X-SESSIONID", sessionId);
			final String inputString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputString);
			jsonResponse = callAPIManagerService(ServiceUtil.UPDATE_GUEST_PARTICIPANT, inputString, VV_EC, ServiceUtil.POST, headers);
			logger.debug("jsonOutputString : " + jsonResponse);
		}
		logger.info(LOG_EXITING);
		return jsonResponse;
	}
	
	public static String getECMeetingDetailsById(String meetingId, String clientId, String sessionId) {
		logger.info(LOG_ENTERED);
		String jsonResponse = null;
		final Gson gson = new Gson();
		try {
			if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId)) {
				logger.warn(ServiceUtil.MISSING_INPUT_ATTRIBUTES);
				final GetECMeetingDetailsByIdOutputJson outputJson = new GetECMeetingDetailsByIdOutputJson();
				final GetECMeetingDetailsByIdOutput output = new GetECMeetingDetailsByIdOutput();
				final Status status = new Status();
				status.setCode(ServiceUtil.CODE_300);
				status.setMessage(ServiceUtil.MISSING_INPUT_ATTRIBUTES);
				output.setName(ServiceUtil.GET_EC_MEETING_DETAILS_BY_ID);
				output.setStatus(status);
				outputJson.setService(output);
				jsonResponse = gson.toJson(outputJson);
			} else {
				final GetECMeetingDetailsByIdInput getECMeetingDetailsByIdInput = new GetECMeetingDetailsByIdInput();
				getECMeetingDetailsByIdInput.setMeetingId(meetingId);
				Map<String, String> headers = new HashMap<String, String>();
				headers.put(ServiceUtil.X_CLIENTID, clientId);
				headers.put(ServiceUtil.X_SESSIONID, sessionId);
				final String input = gson.toJson(getECMeetingDetailsByIdInput);
				logger.debug("jsonInput : " + input);
				jsonResponse = callAPIManagerService(ServiceUtil.GET_EC_MEETING_DETAILS_BY_ID, input, VV_EC,
						ServiceUtil.POST, headers);
				logger.debug("jsonResponse : " + jsonResponse);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return jsonResponse;
	}
	
	public static String callAPIManagerService(final String operationName, final String input, final char opFlag, final String opType, final Map<String, String> inputHeaders) {
		logger.info(LOG_ENTERED);
		String output = null;

		try {
			if(StringUtils.isNotBlank(accessToken)) {
				output = callVVAPIManagerRestService(operationName, input, accessToken, opType, inputHeaders, opFlag);
			} else {
				output = getNewTokenApiResponse(operationName, input,opFlag, opType, inputHeaders);
			}
		} catch (HttpClientErrorException e) {
			logger.warn("status code: " + e.getRawStatusCode());
			if(e.getRawStatusCode() == 401) {
				//Retry to connect again by creating a new api token
				logger.warn("received 401, so retrying with new token");
				try {
					output = getNewTokenApiResponse(operationName, input,opFlag, opType, inputHeaders);
				}
				catch (Exception e1) {
					logger.error("Web Service API error : " + e1.getMessage(), e1);
				}
			}
		}
		catch(Exception e) {
			logger.warn("Web Service API error : " + e.getMessage(), e);
			//retry again
			try {
				if(StringUtils.isNotBlank(accessToken)) {
					logger.warn("received error so, retrying with existing token member token");
					output = callVVAPIManagerRestService(operationName, input, accessToken, opType, inputHeaders, opFlag);
				}
			} catch (Exception e1) {
				logger.error("Web Service API error : " + e1.getMessage(), e1);
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static String getNewTokenApiResponse(final String operationName, final String input,  final char opFlag, 
			 final String opType,final Map<String, String> inputHeaders) throws Exception {
		APIToken apiToken = null;
		String output = null;
		Crypto crypto = new Crypto();
		String consumerKey = null;
		String consumerSecret = null;
		consumerKey = AppProperties.getExtPropertiesValueByKey("consumer_key_internal");
		consumerSecret = crypto.read(AppProperties.getExtPropertiesValueByKey("consumer_secret_internal"));
		apiToken = getAPIToken(consumerKey, consumerSecret);
		if (apiToken != null) {
			accessToken = apiToken.getAccessToken();
		}
		if(StringUtils.isNotBlank(accessToken)) {
			output = callVVAPIManagerRestService(operationName, input, accessToken, opType, inputHeaders, opFlag);
		}
		return output;
	}
	
	public static APIToken getAPIToken(String consumerKey, String consumerSecret) throws Exception {
		logger.info(LOG_ENTERED);
		APIToken output = null;
		for(int i = 0; i < 3; i++) {
			try {
				final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
				final String internalUrl = appProp.getProperty("api_manager_internal_url");
				final String tokenApi = appProp.getProperty("token_api");
				if (StringUtils.isBlank(consumerKey) || StringUtils.isBlank(consumerSecret)) {
					consumerKey = CONSUMER_KEY_INTERNAL;
					consumerSecret = CONSUMER_SECRET_INTERNAL;
				}  
				final URI uri = new URI(internalUrl + tokenApi);
				logger.info("tokenUrl : " + uri);
				final String authStr = consumerKey + ":" + consumerSecret;
				logger.debug("authStr : " + authStr);
				final String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());
				final HttpHeaders httpHeaders = new HttpHeaders();
				httpHeaders.set("Accept", "*/*");
				httpHeaders.set("Authorization", "Basic " + authEncoded.trim());
				final HttpEntity<?> entity = new HttpEntity<Object>(httpHeaders);
				final ResponseEntity<?> responseEntity = restTemplate.postForEntity(uri, entity, String.class);
				if (responseEntity != null) {
					String outputJson = (String) responseEntity.getBody();
					output = new Gson().fromJson(outputJson, APIToken.class);
				}
				break;
			} catch (Exception e) {
				logger.warn("Web Service API error : " + e.getMessage(), e);
				if(i < 2) {
					logger.warn("retry no." + i);
				} else {
					logger.error("Web Service API retry error : " + e.getMessage(), e);
					throw e;
				}
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static String callVVAPIManagerRestService(final String operationName, final String input, String accessToken,
			 final String opType,final Map<String, String> inputHeaders,final char opFlag) throws URISyntaxException {
		//final String uriContext
		
		logger.info(LOG_ENTERED);
		logger.debug("accessToken : " + accessToken);
		String output = null;
		String uriContext = null;
		HttpHeaders headers = getJsonHttpHeaders(accessToken);
		switch(opFlag) {
		case VVINTEGRATION:
			uriContext = AppProperties.getExtPropertiesValueByKey("integration_service_context");
			break;
		case MAPPOINTMENT:
			uriContext = AppProperties.getExtPropertiesValueByKey("mappointment_service_context");
			break;
		case MCONFERENCE:
			uriContext = AppProperties.getExtPropertiesValueByKey("mconference_service_context");
			break;
		case MEMBERSOAUTH:
			  uriContext = AppProperties.getExtPropertiesValueByKey("members_oauth_service_context");
			  break;
		case VV_EC:
			for (Map.Entry<String, String> entry : inputHeaders.entrySet()) {
				headers.set(entry.getKey(), entry.getValue());
			}
			uriContext = AppProperties.getExtPropertiesValueByKey("videovisitsec_service_context");
			break;
		case MEETINGAPI: 
			if(inputHeaders!=null) {
				for (Map.Entry<String, String> entry : inputHeaders.entrySet()) {
					headers.set(entry.getKey(), entry.getValue());
				}
			}
			uriContext = AppProperties.getExtPropertiesValueByKey("videovisitsmeeting_service_context");
			break;
		default:
		}
		final String internalUrl = AppProperties.getExtPropertiesValueByKey("api_manager_internal_url");
		final URI uri = new URI(internalUrl + uriContext + operationName);
		logger.info("serviceUrl : " + uri);
		ResponseEntity<String> responseEntity = null;
		if(StringUtils.isNotBlank(opType) && opType.equalsIgnoreCase(ServiceUtil.GET)) {
			final HttpEntity<?> entity = new HttpEntity<Object>(headers);
			responseEntity =	restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
		}
		else {
			final HttpEntity<?> entity = new HttpEntity<Object>(input, headers);
			responseEntity = restTemplate.postForEntity(uri, entity, String.class);
		}
		if (responseEntity != null) {
			output = (String) responseEntity.getBody();
		}
		logger.info(LOG_ENTERED);
		return output;
	}
	
	public static HttpHeaders getJsonHttpHeaders(final String accessToken) {
		logger.info(LOG_ENTERED);
		final HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + accessToken.trim());
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("Accept", "*/*");
		return headers;
	}
	
	public static void main(String[] args) {
		Crypto crypto = new Crypto();
		System.out.println(crypto.read("mUPPWvaOgQ1a0QV3AJVF+vMGmACt6YuuEp0MHh97jpw="));
	}
}