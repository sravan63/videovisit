package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil.GET_ACTIVE_MEETINGS_FOR_CAREGIVER;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.net.URI;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.kp.tpmg.common.security.Crypto;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.MemberLogoutInput;
import org.kp.tpmg.videovisit.model.ServiceCommonOutput;
import org.kp.tpmg.videovisit.model.ServiceCommonOutputJson;
import org.kp.tpmg.videovisit.model.Status;
import org.kp.tpmg.videovisit.model.meeting.ActiveMeetingsForCaregiverInput;
import org.kp.tpmg.videovisit.model.meeting.ActiveMeetingsForMemberInput;
import org.kp.tpmg.videovisit.model.meeting.CreateInstantVendorMeetingInput;
import org.kp.tpmg.videovisit.model.meeting.CreateInstantVendorMeetingOutput;
import org.kp.tpmg.videovisit.model.meeting.EndMeetingForMemberGuestDesktopInput;
import org.kp.tpmg.videovisit.model.meeting.GetMeetingsForMemberAndNonMemberProxiesInput;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingForMemberGuestInput;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingInput;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingJSON;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingOutput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberDesktopInput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestDesktopInput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestInput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestJSON;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestOutput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberInput;
import org.kp.tpmg.videovisit.model.meeting.LaunchMemberOrProxyMeetingForMemberInput;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdInput;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.videovisit.model.meeting.RetrieveActiveMeetingsForMemberAndProxiesInput;
import org.kp.tpmg.videovisit.model.meeting.RetrieveActiveMeetingsForNonMemberProxiesInput;
import org.kp.tpmg.videovisit.model.meeting.SetKPHCConferenceStatusInput;
import org.kp.tpmg.videovisit.model.meeting.TerminateInstantVendorMeetingInput;
import org.kp.tpmg.videovisit.model.meeting.UpdateMemberMeetingStatusInput;
import org.kp.tpmg.videovisit.model.meeting.VerifyCareGiverInput;
import org.kp.tpmg.videovisit.model.meeting.VerifyCareGiverOutput;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberInput;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberOutput;
import org.kp.tpmg.videovisit.model.meeting.provider.UpdateEmailActionInput;
import org.kp.tpmg.videovisit.model.notification.MeetingRunningLateInput;
import org.kp.tpmg.videovisit.model.notification.MeetingRunningLateOutput;
import org.kp.tpmg.videovisit.model.notification.MeetingRunningLateOutputJson;
import org.kp.tpmg.videovisit.model.notification.VendorMeetingEventInput;
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
	public static final int MAX_RETRY = 2;
	public static final int retry = 0;
	public static final boolean status = false;
	public static boolean simulation = true;

	private static String modulePath = "";
	private static String policyPath = "";
	private static String serviceSecurityUsername = null;
	private static String serviceSecurityPassword = null;

	// setup wizard related properties
	private static String setupWizardHostNuid;
	private static String setupWizardMemberMrn;
	private static String setupWizardMeetingType;
	private static String setupWizardUserName;

	private static String videoVisitRestServiceUrl = null;

	// Member SSO related properties
	private static String memberSSOAuthAPIUrl = null;
	private static String memberSSOAuthRegionCode = null;
	private static String kpOrgSSOSignOnAPIUrl = null;
	private static String kpOrgSSOSignOffAPIUrl = null;
	private static String kpOrgSSOKeepAliveUrl = null;
	private static String kpOrgSSOUserAgentCategoryHeader = null;
	private static String kpOrgSSOOsVersionHeader = null;
	private static String kpOrgSSOUserAgentTypeHeader = null;
	private static String kpOrgSSOAPIKeyHeader = null;
	private static String kpOrgSSOAppNameHeader = null;

	// Parameters for Proxy Appts logic
	private static String secureCodes = null;
	private static boolean isAdhoc = false;
	private static boolean isParrs = true;

	private static RestTemplate restTemplate = new RestTemplate();

	public static boolean initWebService(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		boolean ret = true;

		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			simulation = "true".equals(appProp.getProperty("WEBSERVICE_SIMULATION")) ? true : false;
			logger.debug("Simulation:" + simulation);
			modulePath = appProp.getProperty("MODULE_PATH");
			policyPath = appProp.getProperty("POLICY_PATH");
			Crypto crypto = new Crypto();
			serviceSecurityUsername = appProp.getProperty("SERVICE_SECURITY_USERNAME");
			serviceSecurityPassword = crypto.read(appProp.getProperty("SERVICE_SECURITY_PASSWORD"));
			logger.debug(
					"SecurityUsername:" + serviceSecurityUsername + ", SecurityPassword:" + serviceSecurityPassword);

			// setup wizard related values
			setupWizardHostNuid = appProp.getProperty("SETUP_WIZARD_HOST_NUID");
			setupWizardMemberMrn = appProp.getProperty("SETUP_WIZARD_MEMBER_MRN");
			setupWizardMeetingType = appProp.getProperty("SETUP_WIZARD_MEETING_TYPE");
			setupWizardUserName = appProp.getProperty("SETUP_WIZARD_USER_NAME");
			logger.debug("setupWizardHostNuid=" + setupWizardHostNuid + ", setupWizardMemberMrn=" + setupWizardMemberMrn
					+ ", setupWizardMeetingType=" + setupWizardMeetingType + ", setupWizardUserName="
					+ setupWizardUserName);

			// Proxy Appts parameters
			secureCodes = appProp.getProperty("SECURE_CODES");
			isAdhoc = "true".equals(appProp.getProperty("ADHOC")) ? true : false;
			isParrs = "true".equals(appProp.getProperty("PARRS")) ? true : false;
			logger.debug("secureCodes=" + secureCodes + ", isAdhoc=" + isAdhoc + ", isParrs=" + isParrs);

			memberSSOAuthAPIUrl = appProp.getProperty("MEMBER_SSO_AUTH_API_URL");
			memberSSOAuthRegionCode = appProp.getProperty("MEMBER_SSO_AUTH_REGION_CODE");
			videoVisitRestServiceUrl = appProp.getProperty("VIDEOVISIT_REST_URL");
			kpOrgSSOSignOnAPIUrl = appProp.getProperty("KPORG_SSO_SIGNON_API_URL");
			kpOrgSSOSignOffAPIUrl = appProp.getProperty("KPORG_SSO_SIGNOFF_API_URL");
			kpOrgSSOKeepAliveUrl = appProp.getProperty("KPORG_SSO_KEEP_ALIVE_URL");
			kpOrgSSOUserAgentCategoryHeader = System.getProperty("os.name");
			kpOrgSSOOsVersionHeader = System.getProperty("os.version");
			kpOrgSSOUserAgentTypeHeader = WebUtil.getBrowserDetails(request);
			kpOrgSSOAPIKeyHeader = crypto.read(appProp.getProperty("KPORG_SSO_API_KEY_HEADER"));
			kpOrgSSOAppNameHeader = appProp.getProperty("KPORG_SSO_APP_NAME_HEADER");

			logger.debug("kpOrgSSOSignOnAPIUrl : " + kpOrgSSOSignOnAPIUrl);
			logger.info("kpOrgSSOUserAgentCategoryHeader : " + kpOrgSSOUserAgentCategoryHeader
					+ ", kpOrgSSOOsVersionHeader:" + kpOrgSSOOsVersionHeader + ", kpOrgSSOUserAgentTypeHeader:"
					+ kpOrgSSOUserAgentTypeHeader);
			logger.debug("kpOrgSSOAppNameHeader : " + kpOrgSSOAppNameHeader + ",  kpOrgSSOAPIKeyHeader:"
					+ kpOrgSSOAPIKeyHeader);
			logger.debug("kpOrgSSOSignOffAPIUrl : " + kpOrgSSOSignOffAPIUrl);
			logger.debug("memberSSOAuthAPIUrl : " + memberSSOAuthAPIUrl);
			logger.debug("videoVisitRestServiceUrl : " + videoVisitRestServiceUrl);
			logger.debug("kpOrgSSOKeepAliveUrl : " + kpOrgSSOKeepAliveUrl);

			if (simulation)
				return true;

			String policyFilePath = request.getSession().getServletContext().getRealPath(policyPath);
			logger.debug("policyFilePath : " + policyFilePath);
			String moduleFilePath = request.getSession().getServletContext().getRealPath(modulePath);
			logger.debug("modulePath: " + moduleFilePath);

			logger.debug("System property trustStore: " + System.getProperty("javax.net.ssl.trustStore"));
			logger.debug(
					"System property trustStorePassword: " + System.getProperty("javax.net.ssl.trustStorePassword"));

		} catch (Exception e) {
			final String message = "Exception while reading properties file";
			logger.error("System Error : " + e.getMessage(), e);
			ret = false;
			throw new RuntimeException(message, e);
		}
		logger.info(LOG_EXITING);
		return ret;
	}

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

	/**
	 * @return the setupWizardUserName
	 */
	public static String getSetupWizardUserName() {
		return setupWizardUserName;
	}

	/**
	 * @param setupWizardUserName
	 *            the setupWizardUserName to set
	 */
	public static void setSetupWizardUserName(String setupWizardUserName) {
		WebService.setupWizardUserName = setupWizardUserName;
	}

	/**
	 * @return the kpOrgSSOKeepAliveUrl
	 */
	public static String getKpOrgSSOKeepAliveUrl() {
		return kpOrgSSOKeepAliveUrl;
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
	public static ServiceCommonOutput memberEndMeetingLogout(String mrn8Digit, long meetingID, String sessionID,
			String memberName, boolean notifyVideoForMeetingQuit, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " MeetingID : " + meetingID);
		logger.debug("mrn: " + mrn8Digit + ", memberName : " + memberName);

		ServiceCommonOutput output = null;
		String responseJsonStr = "";

		try {
			if (meetingID <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID)
					|| StringUtils.isBlank(memberName)) {
				logger.warn("Missing input attributes.");
				output = new ServiceCommonOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
			} else {

				final UpdateMemberMeetingStatusInput input = new UpdateMemberMeetingStatusInput();
				input.setMeetingId(meetingID);
				input.setSessionId(sessionID);
				input.setMrn(mrn8Digit);
				input.setMemberName(memberName);
				input.setClientId(clientId);
				input.setNotifyVideoForMeetingQuit(notifyVideoForMeetingQuit);

				final Gson gson = new Gson();
				final String inputJsonString = gson.toJson(input);
				logger.debug("jsonInptString : " + inputJsonString);

				responseJsonStr = callVVRestService(ServiceUtil.UPDATE_MEMBER_MEETING_STATUS, inputJsonString);

				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
			}

		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingID);
			throw new Exception("Web Service API error :", e);
		}
		logger.info(LOG_EXITING + "jsonOutput : " + responseJsonStr);
		return output;
	}

	/**
	 * Retrieve meetings for caregiver
	 * 
	 * @param meetingHash
	 * @param sessionId
	 * @param clientId
	 * @return
	 * @throws Exception
	 */
	public static MeetingDetailsOutput retrieveMeetingForCaregiver(final String meetingHash, final String sessionId,
			final String clientId) throws Exception {
		logger.info(LOG_ENTERED + "meetingHash:" + meetingHash);
		String jsonString = "";
		MeetingDetailsOutput output = null;
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
				logger.warn("Missing input attributes.");
				output = new MeetingDetailsOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
			} else {
				final Gson gson = new Gson();
				final ActiveMeetingsForCaregiverInput input = new ActiveMeetingsForCaregiverInput();
				input.setMeetingHash(meetingHash);
				input.setClientId(clientId);
				input.setSessionId(sessionId);
				final String inputJsonStr = gson.toJson(input);
				logger.info("jsonInputString " + inputJsonStr);

				jsonString = callVVRestService(GET_ACTIVE_MEETINGS_FOR_CAREGIVER, inputJsonStr);
				logger.debug("jsonResponseString" + jsonString);

				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(jsonString);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage(), e);
			throw new Exception("Web Service API error", e);
		}
		String responseCodeAndMsg = "Empty reponse";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(LOG_EXITING + "Rest response message & code: " + responseCodeAndMsg);
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
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			ActiveMeetingsForCaregiverInput input = new ActiveMeetingsForCaregiverInput();

			input.setMeetingHash(meetingHash);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.IS_MEETING_HASH_VALID, inputJsonString);
			logger.debug("jsonResponseString : " + responseJsonStr);

			final JsonParser parser = new JsonParser();
			final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error : " + e);
			throw new Exception("Web Service API error", e.getCause());
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

	public static LaunchMeetingForMemberGuestOutput createCaregiverMeetingSession(String meetingHash,
			String patientLastName, boolean isMobileFlow, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + "meetingHash: " + meetingHash + "isMobileFlow :" + isMobileFlow);
		logger.debug("patientLastName: " + patientLastName);
		LaunchMeetingForMemberGuestOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(patientLastName)
					|| StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new LaunchMeetingForMemberGuestOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;

			}

			LaunchMeetingForMemberGuestDesktopInput input = new LaunchMeetingForMemberGuestDesktopInput();
			input.setMeetingHash(meetingHash);
			input.setPatientLastName(patientLastName);
			input.setMobileFlow(isMobileFlow);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_GUEST_DESKTOP, inputJsonString);
			logger.debug("jsonResponseString : " + responseJsonStr);

			final JsonParser parser = new JsonParser();
			final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), LaunchMeetingForMemberGuestOutput.class);

		} catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());

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

	public static ServiceCommonOutput endCaregiverMeetingSession(String meetingHash, String megaMeetingNameDisplayName,
			boolean isParticipantDel, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " [meetingHash=" + meetingHash + ", isParticipantDel=" + isParticipantDel + "]");
		logger.debug("megaMeetingNameDisplayName=" + megaMeetingNameDisplayName);
		ServiceCommonOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(megaMeetingNameDisplayName)
					|| StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new ServiceCommonOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			EndMeetingForMemberGuestDesktopInput input = new EndMeetingForMemberGuestDesktopInput();
			input.setMeetingHash(meetingHash);
			input.setPatientLastName(megaMeetingNameDisplayName);
			input.setIsDeleteMeetingFromVidyo((isParticipantDel));
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.END_MEETING_FOR_MEMBER_GUEST_DESKTOP, inputJsonString);
			logger.info("jsonResponseString : " + responseJsonStr);
			final JsonParser parser = new JsonParser();
			final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
		}

		catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());

		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static ServiceCommonOutput terminateInstantMeeting(long meetingId, String vendorConfId, String updaterNUID,
			String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + "meetingId=" + meetingId + ", vendorConfId=" + vendorConfId);
		logger.debug("updaterNUID=" + updaterNUID);
		ServiceCommonOutput output = null;
		String responseJsonStr = "";
		try {
			if (meetingId <= 0 || StringUtils.isBlank(updaterNUID) || StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new ServiceCommonOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			TerminateInstantVendorMeetingInput input = new TerminateInstantVendorMeetingInput();
			input.setMeetingId(meetingId);
			input.setMeetingVendorId(vendorConfId);
			input.setUpdaterNuid(updaterNUID);
			input.setSessionId(sessionId);
			input.setClientId(clientId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.TERMINATE_INSTANT_VENDOR_MEETING, inputJsonString);
			logger.info("jsonResponseString : " + responseJsonStr);

			final JsonParser parser = new JsonParser();
			final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
		}

		catch (Exception e) {
			logger.error("Web Service API error for meeting : " + meetingId, e);
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
		try {
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

	public static void initializeRestProperties() {
		logger.info(LOG_ENTERED);
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			logger.info("videoVisitRestServiceUrl is empty. Reading it from properties file.");
			final Crypto crypto = new Crypto();
			videoVisitRestServiceUrl = appProp.getProperty("VIDEOVISIT_REST_URL");
			serviceSecurityUsername = appProp.getProperty("SERVICE_SECURITY_USERNAME");
			serviceSecurityPassword = crypto.read(appProp.getProperty("SERVICE_SECURITY_PASSWORD"));
			logger.debug("videoVisitRestServiceUrl : " + videoVisitRestServiceUrl + "SecurityUsername:"
					+ serviceSecurityUsername + ", SecurityPassword:" + serviceSecurityPassword);
		} catch (Exception e) {
			logger.warn("Failed to get videoVisitRestServiceUrl from external properties file");
		}
		logger.info(LOG_EXITING + " videoVisitRestServiceUrl :  " + videoVisitRestServiceUrl);
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
	public static ServiceCommonOutput setKPHCConferenceStatus(long meetingId, String joinLeaveStatus,
			boolean isProxyMeeting, String careGiverName, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId + ", joinLeaveStatus=" + joinLeaveStatus
				+ ", isProxyMeeting" + isProxyMeeting);
		logger.debug("careGiverName=" + careGiverName);
		ServiceCommonOutput output = null;
		String inputJsonString = "";
		String jsonResponseStr = "";

		try {
			if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
				logger.warn("Missing input attributes.");
				output = new ServiceCommonOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
			} else {
				final SetKPHCConferenceStatusInput input = new SetKPHCConferenceStatusInput();
				input.setCareGiverName(careGiverName);
				input.setClientId(clientId);
				input.setJoinLeaveStatus(joinLeaveStatus);
				input.setMeetingId(meetingId);
				input.setProxyMeeting(isProxyMeeting);
				input.setSessionId(sessionId);

				final Gson gson = new Gson();
				inputJsonString = gson.toJson(input);
				logger.debug("jsonInputString : " + inputJsonString);
				jsonResponseStr = callVVRestService(ServiceUtil.SET_KPHC_CONFERENCE_STATUS, inputJsonString);
				logger.info("jsonResponseString : " + jsonResponseStr);
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(jsonResponseStr);
				output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
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
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}

			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			RetrieveActiveMeetingsForMemberAndProxiesInput input = new RetrieveActiveMeetingsForMemberAndProxiesInput();
			input.setMrn(mrn8Digit);
			input.setGetProxyMeetings(getProxyMeetings);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setClientId(clientId);
			input.setSessionId(sessionID);

			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
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
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}

			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			RetrieveActiveMeetingsForNonMemberProxiesInput input = new RetrieveActiveMeetingsForNonMemberProxiesInput();
			input.setGuid(guid);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setClientId(clientId);
			input.setSessionId(sessionID);

			inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
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

	/* verifyCaregiver calling the new rest API */

	public static VerifyCareGiverOutput verifyCaregiver(String meetingHash, String patientLastName, String sessionId,
			String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingHash=" + meetingHash);
		logger.debug("patientLastName = " + patientLastName);
		VerifyCareGiverOutput output = new VerifyCareGiverOutput();
		Status status = new Status();
		try {
			if (meetingHash == null || patientLastName == null) {
				status.setCode("500");
				status.setMessage("Missing Inputs");
				output.setStatus(status);
				return output;
			}
			VerifyCareGiverInput input = new VerifyCareGiverInput();
			input.setMeetingHash(meetingHash);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			input.setPatientLastName(patientLastName);

			String operationName = "verifyCaregiver";

			Gson gson = new Gson();
			String inputString = gson.toJson(input);
			logger.debug("jsonInptString " + inputString);

			String jsonString = callVVRestService(operationName, inputString);
			logger.debug("jsonString" + jsonString);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(jsonString);
			output = gson.fromJson(jobject.get("service").toString(), VerifyCareGiverOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());
		}
		logger.info(LOG_EXITING);
		return output;
	}

	/* launchMeetingForMemberGuest calling the new REst API */

	public static LaunchMeetingForMemberGuestOutput getMeetingDetailsForMemberGuest(String meetingHash,
			String patientLastName, String deviceType, String deviceOS, String deviceOSVersion, boolean isMobileFlow,
			String sessionId, String clientId) throws Exception {

		logger.info(LOG_ENTERED + "meetingHash: " + meetingHash + ", isMobileFlow :" + isMobileFlow + ", deviceType :"
				+ deviceType + ", deviceOS :" + deviceOS + ", deviceOSVersion :" + deviceOSVersion);
		logger.debug("patientLastName: " + patientLastName);

		LaunchMeetingForMemberGuestOutput launchMeetingForMemberGuest = new LaunchMeetingForMemberGuestOutput();

		LaunchMeetingForMemberGuestInput launchMeetingForMemberGuestInput = new LaunchMeetingForMemberGuestInput();
		try {
			launchMeetingForMemberGuestInput.setMeetingHash(meetingHash);
			launchMeetingForMemberGuestInput.setPatientLastName(patientLastName);
			launchMeetingForMemberGuestInput.setDeviceOs(deviceOS);
			launchMeetingForMemberGuestInput.setDeviceType(deviceType);
			launchMeetingForMemberGuestInput.setDeviceOsVersion(deviceOSVersion);
			launchMeetingForMemberGuestInput.setMobileFlow(isMobileFlow);
			launchMeetingForMemberGuestInput.setClientId(clientId);
			launchMeetingForMemberGuestInput.setSessionId(sessionId);

			String operationName = "launchMeetingForMemberGuest";

			Gson gson = new Gson();
			String inputString = gson.toJson(launchMeetingForMemberGuestInput);
			logger.debug("jsonInputString " + inputString);

			String jsonString = callVVRestService(operationName, inputString);
			logger.debug("outputjsonString" + jsonString);

			final JsonParser parser = new JsonParser();
			final JsonObject jobject = (JsonObject) parser.parse(jsonString);
			launchMeetingForMemberGuest = gson.fromJson(jobject.get("service").toString(),
					LaunchMeetingForMemberGuestOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error : " + e.getMessage() + " Retrying...", e);
			throw new Exception("Web Service API error", e.getCause());

		}
		logger.info(LOG_EXITING);
		return launchMeetingForMemberGuest;
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
	public static VerifyMemberOutput verifyMember(String lastName, String mrn, String birth_month, String birth_year,
			String birth_day, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED);
		VerifyMemberOutput verifyMemberOutput = null;
		final String Dob = birth_month + "/" + birth_year;
		VerifyMemberInput verifyMeberInput = new VerifyMemberInput();
		try {
			if (mrn == null || sessionId == null || lastName == null) {
				throw new Exception("One of required fields are null");
			}
			if (!WebUtil.isDOBMMYYYYFormat(Dob)) {
				throw new Exception("DOB has to be in the format of MM/YYYY but is [" + Dob + "]");
			}
			verifyMeberInput.setMrn(mrn);
			verifyMeberInput.setLastName(lastName);
			verifyMeberInput.setDateOfBirth(Dob);
			verifyMeberInput.setSessionID(sessionId);
			verifyMeberInput.setClientId(clientId);

			final Gson gson = new Gson();
			String inputString = gson.toJson(verifyMeberInput);
			logger.debug("jsonInputString " + inputString);

			String jsonString = callVVRestService(ServiceUtil.VERIFY_MEMBER, inputString);
			logger.debug("outputjsonString" + jsonString);
			if (StringUtils.isNotBlank(jsonString)) {
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(jsonString);
				verifyMemberOutput = gson.fromJson(jobject.get("service").toString(), VerifyMemberOutput.class);
			}
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			throw new Exception("Web Service API error", e.getCause());
		}
		logger.info(LOG_EXITING);
		return verifyMemberOutput;
	}

	public static CreateInstantVendorMeetingOutput createInstantVendorMeeting(String hostNuid, String[] participantNuid,
			String memberMrn, String meetingType, String sessionId, String clientId) throws Exception {
		logger.info(LOG_ENTERED + "meetingType: " + meetingType);
		logger.debug("hostNuid=" + hostNuid + ", participantNuid=" + participantNuid + ", memberMrn=" + memberMrn);
		CreateInstantVendorMeetingOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(hostNuid) || StringUtils.isBlank(memberMrn) || StringUtils.isBlank(meetingType)
					|| StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
				logger.warn("Missing input attributes.");
				output = new CreateInstantVendorMeetingOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}
			CreateInstantVendorMeetingInput input = new CreateInstantVendorMeetingInput();
			input.setHostNuid(hostNuid);
			input.setParticipantNuid(participantNuid);
			input.setMemberMrn(memberMrn);
			input.setMeetingType(meetingType);
			input.setSessionId(sessionId);
			input.setClientId(clientId);

			final Gson gson = new GsonBuilder().serializeNulls().create();
			final String inputJsonString = gson.toJson(input);
			logger.debug("jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.CREATE_INSTANT_VENDOR_MEETING, inputJsonString);
			logger.debug("jsonResponseString : " + responseJsonStr);

			if (StringUtils.isNotBlank(responseJsonStr)) {
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(responseJsonStr);
				if(jobject != null && jobject.get("service") != null) {
					output = gson.fromJson(jobject.get("service").toString(), CreateInstantVendorMeetingOutput.class);
				}
				
			}
		}

		catch (Exception e) {
			logger.error("Web Service API error:" + e);
			throw new Exception("Web Service API error", e.getCause());

		}
		String responseCodeAndMsg = "Empty reponse";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(LOG_EXITING + "Rest response message & code: " + responseCodeAndMsg);
		return output;
	}

	public static ServiceCommonOutputJson testDbRoundTrip() throws Exception {
		logger.info(LOG_ENTERED);
		String responseJsonStr = null;
		final Gson gson = new Gson();
		ServiceCommonOutputJson testDbRoundTripJson = new ServiceCommonOutputJson();
		try {
			responseJsonStr = callVVRestService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}");
			testDbRoundTripJson = gson.fromJson(responseJsonStr, ServiceCommonOutputJson.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}");
			testDbRoundTripJson = gson.fromJson(responseJsonStr, ServiceCommonOutputJson.class);
		}
		logger.info(LOG_EXITING);
		return testDbRoundTripJson;
	}

	public static JoinLeaveMeetingJSON memberLeaveProxyMeeting(String meetingId, String careGiverName, String sessionId,
			boolean isFromBackButton, String clientId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId);
		logger.debug("careGiverName=" + careGiverName);
		JoinLeaveMeetingJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new Gson();
		String inputJsonString = null;
		try {
			if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId)) {
				output = new JoinLeaveMeetingJSON();
				JoinLeaveMeetingOutput joinLeaveMeetingOutput = new JoinLeaveMeetingOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setService(joinLeaveMeetingOutput);
				output.getService().setStatus(status);
				return output;
			}
			JoinLeaveMeetingInput joinLeaveMeetingInput = new JoinLeaveMeetingInput();
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

			responseJsonStr = callVVRestService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString);
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
			logger.info("jsonResponseString : " + responseJsonStr);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString);
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
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
		LaunchMemberOrProxyMeetingForMemberInput input = null;
		try {
			boolean isNonMember = false;
			if (isProxyMeeting && StringUtils.isBlank(mrn8Digit)) {
				isNonMember = true;
			}
			logger.info("isNonMember= " + isNonMember);
			if ((!isNonMember && StringUtils.isBlank(mrn8Digit)) || meetingId <= 0 || StringUtils.isBlank(sessionId)
					|| StringUtils.isBlank(inMeetingDisplayName)) {
				logger.warn("Missing input attributes.");
				LaunchMeetingForMemberGuestJSON output = new LaunchMeetingForMemberGuestJSON();
				output.setService(new LaunchMeetingForMemberGuestOutput());
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.getService().setStatus(status);
				return gson.toJson(output);
			}

			input = new LaunchMemberOrProxyMeetingForMemberInput();
			input.setMeetingId(meetingId);
			input.setMrn(mrn8Digit);
			input.setInMeetingDisplayName(inMeetingDisplayName);
			input.setGetProxyMeeting(isProxyMeeting);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			inputJsonString = gson.toJson(input);
			logger.debug("inputJsonString : " + inputJsonString);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString);
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
		LaunchMeetingForMemberDesktopInput input;
		if (meetingId <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionId)
				|| StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("Missing input attributes.");
			LaunchMeetingForMemberGuestJSON output = new LaunchMeetingForMemberGuestJSON();
			output.setService(new LaunchMeetingForMemberGuestOutput());
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			return gson.toJson(output);
		}

		try {
			input = new LaunchMeetingForMemberDesktopInput();
			input.setMeetingId(meetingId);
			input.setInMeetingDisplayName(inMeetingDisplayName);
			input.setMrn(mrn8Digit);
			input.setSessionId(sessionId);
			input.setClientId(clientId);
			inputJsonString = gson.toJson(input);
			logger.debug("inputJsonString : " + inputJsonString);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString);
		}
		logger.info(LOG_EXITING);
		return responseJsonStr;

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
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				detailsJSON.getService().setStatus(status);
				return detailsJSON;
			}
			jsonInput.setMrn(mrn8Digit);
			jsonInput.setClientId(clientId);
			jsonInput.setSessionId(sessionID);
			logger.debug("inputJsonString : " + gson.toJson(jsonInput));
			output = callVVRestService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput));
			meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callVVRestService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput));
			meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
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

		LaunchMeetingForMemberInput jsonInput = new LaunchMeetingForMemberInput();
		Gson gson = new Gson();
		String output;
		if (meetingID <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID)
				|| StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("Missing input attributes.");
			LaunchMeetingForMemberGuestJSON memberOutput = new LaunchMeetingForMemberGuestJSON();
			memberOutput.setService(new LaunchMeetingForMemberGuestOutput());
			final Status status = new Status();
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
			output = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput));
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingID + " Retrying...", e);
			output = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput));
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String memberLogout(String mrn8Digit, String sessionID) throws Exception {
		logger.info(LOG_ENTERED);
		logger.debug("mrn8Digit=" + mrn8Digit);
		MemberLogoutInput input = new MemberLogoutInput();
		Gson gson = new Gson();
		String output;
		if (StringUtils.isBlank(mrn8Digit)) {
			mrn8Digit = WebUtil.NON_MEMBER;
		}
		if (StringUtils.isBlank(sessionID)) {
			logger.warn("Missing input attributes.");
			ServiceCommonOutputJson memberLogoutOutput = new ServiceCommonOutputJson();
			memberLogoutOutput.setService(new ServiceCommonOutput());
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberLogoutOutput.getService().setStatus(status);
			return gson.toJson(memberLogoutOutput);
		}

		try {
			input.setMrn8Digit(mrn8Digit);
			input.setSessionId(sessionID);
			logger.debug("inputJsonString : " + gson.toJson(input));
			output = callVVRestService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input));
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callVVRestService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input));
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
		MeetingRunningLateInput input;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final MeetingRunningLateOutputJson output = new MeetingRunningLateOutputJson();
			final MeetingRunningLateOutput service = new MeetingRunningLateOutput();
			service.setName(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new MeetingRunningLateInput();
			input.setMeetingId(meetingId);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr " + inputJsonStr);
			jsonOutput = callVVRestService(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS, inputJsonStr);
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
		JoinLeaveMeetingForMemberGuestInput input;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(meetingHash) || StringUtils.isBlank(joinOrLeave)
				|| StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final JoinLeaveMeetingJSON output = new JoinLeaveMeetingJSON();
			final JoinLeaveMeetingOutput service = new JoinLeaveMeetingOutput();
			service.setName(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new JoinLeaveMeetingForMemberGuestInput();
			input.setMeetingId(meetingId);
			input.setMeetingHash(meetingHash);
			input.setJoinLeaveMeeting(joinOrLeave);
			input.setClientId(clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr " + inputJsonStr);
			jsonOutput = callVVRestService(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST, inputJsonStr);
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
		UpdateEmailActionInput input;

		if (StringUtils.isBlank(meetingId)) {
			logger.warn("Missing input attributes.");
			final ServiceCommonOutputJson output = new ServiceCommonOutputJson();
			final ServiceCommonOutput service = new ServiceCommonOutput();
			service.setName(ServiceUtil.UPDATE_EMAIL_ACTION);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		} else {
			try {
				input = new UpdateEmailActionInput();
				input.setMeetingId(meetingId);
				input.setUserType(userType);
				input.setUserAction(action);
				input.setClientId(WebUtil.VV_MBR_WEB);
				input.setSessionId(sessionId);
				final String inputJsonStr = gson.toJson(input);
				logger.info("inputJsonStr: " + inputJsonStr);
				jsonOutput = callVVRestService(ServiceUtil.UPDATE_EMAIL_ACTION, inputJsonStr);
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
		VendorMeetingEventInput input;

		if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
			logger.warn("Missing input attributes.");
			final ServiceCommonOutputJson output = new ServiceCommonOutputJson();
			final ServiceCommonOutput service = new ServiceCommonOutput();
			service.setName(ServiceUtil.LOG_VENDOR_MEETING_EVENTS);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonOutput = gson.toJson(output);
		} else {
			try {
				input = new VendorMeetingEventInput();
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
				jsonOutput = callVVRestService(ServiceUtil.LOG_VENDOR_MEETING_EVENTS, inputJsonStr);
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
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setStatus(status);
				return output;
			}

			if (secureCodes == null) {
				secureCodes = "";
			}

			logger.debug("after split secure codes: " + secureCodes.split(","));
			final GetMeetingsForMemberAndNonMemberProxiesInput input = new GetMeetingsForMemberAndNonMemberProxiesInput();
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

			responseJsonStr = callVVRestService(ServiceUtil.GET_MEETINGS_FOR_MEMBER_AND_NON_MEMBER_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.GET_MEETINGS_FOR_MEMBER_AND_NON_MEMBER_PROXIES,
					inputJsonString);

			logger.debug("jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
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
		MeetingDetailsForMeetingIdInput input;
		if (meetingId <= 0 || StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
			logger.warn("Missing input attributes");
			final MeetingDetailsForMeetingIdJSON output = new MeetingDetailsForMeetingIdJSON();
	    	final MeetingDetailsForMeetingIdOutput service = new MeetingDetailsForMeetingIdOutput();
			service.setName(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			service.setStatus(status);
			jsonOutput = gson.toJson(output);
		}
		try {
			input = new MeetingDetailsForMeetingIdInput();
			input.setMeetingId(meetingId);
			input.setClientId(WebUtil.VV_MBR_WEB);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("inputJsonStr: " + inputJsonStr);
			jsonOutput = callVVRestService(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID, inputJsonStr);
			logger.debug("jsonOutput: " + jsonOutput);
		} catch (Exception e) {
			logger.error("Web Service API error ", e);
		}
		logger.info(LOG_EXITING);
		return jsonOutput;
	}
	
	public static JoinLeaveMeetingJSON joinLeaveMeeting(final long meetingId, final String inMeetingDisplayName,
			boolean isPatient, final String joinLeaveMeeting, final String deviceType, final String deviceOS,
			final String deviceOSversion, final String clientId, final String sessionId) throws Exception {
		logger.info(LOG_ENTERED + " meetingId=" + meetingId);
		JoinLeaveMeetingJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new Gson();
		String inputJsonString = null;
		try {
			if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
				output = new JoinLeaveMeetingJSON();
				final JoinLeaveMeetingOutput joinLeaveMeetingOutput = new JoinLeaveMeetingOutput();
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				output.setService(joinLeaveMeetingOutput);
				output.getService().setStatus(status);
				return output;
			}
			final JoinLeaveMeetingInput joinLeaveMeetingInput = new JoinLeaveMeetingInput();
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
				responseJsonStr = callVVRestService(ServiceUtil.JOIN_MEETING, inputJsonString);
			} else if ("L".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callVVRestService(ServiceUtil.LEAVE_MEETING, inputJsonString);
			}// else part to be decided by ranjeet
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
			logger.info("jsonResponseString : " + responseJsonStr);
		} catch (Exception e) {
			logger.error("Web Service API error for meeting:" + meetingId + " Retrying...", e);
			if ("J".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callVVRestService(ServiceUtil.JOIN_MEETING, inputJsonString);
			} else if ("L".equalsIgnoreCase(joinLeaveMeeting)) {
				responseJsonStr = callVVRestService(ServiceUtil.LEAVE_MEETING, inputJsonString);
			}
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
		}
		logger.info(LOG_EXITING);
		return output;
	}

}
