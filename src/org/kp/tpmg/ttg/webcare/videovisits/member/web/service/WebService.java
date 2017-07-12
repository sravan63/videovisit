package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil.GET_ACTIVE_MEETINGS_FOR_CAREGIVER;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.rmi.RemoteException;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.kp.tpmg.common.security.Crypto;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
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
import org.kp.tpmg.videovisit.model.notification.VendorMeetingErrorInput;
import org.kp.ttg.sharedservice.client.MemberSSOAuthAPIs;
import org.kp.ttg.sharedservice.domain.AuthorizeRequestVo;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.EsbInfo;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class WebService{
	
	public static Logger logger = Logger.getLogger(WebService.class);
	public static final int MAX_RETRY = 2;
	public static int retry = 0;
	public static boolean status = false;
	//public static VideoVisitMemberServicesStub stub;
	//public static ConfigurationContext axisConfig = null;
	public static boolean simulation = true;
	
	private static String modulePath =  "";
	private static String policyPath =  "";
	private static String serviceSecurityUsername = null;
	private static String serviceSecurityPassword = null;

	//setup wizard related properties
	private static String setupWizardHostNuid;
	private static String setupWizardMemberMrn;
	private static String setupWizardMeetingType;
	private static String setupWizardUserName;
	
	private static String videoVisitRestServiceUrl = null;
	
	//Member SSO related properties
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
	private static String vidyoWebrtcSessionManager = null;
	
	//Parameters for Proxy Appts logic
	private static String secureCodes = null;
	private static boolean isAdhoc = false;
	private static boolean isParrs = true;
	
	public static boolean initWebService(HttpServletRequest request)
	{
		logger.info("Entered initWebService");
		long timeout = 8000l; // milliseconds default
		String serviceURL = "";
		boolean reuseHTTP = true;
		boolean chunked   = false;
		boolean ret 	= true;		

		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			if (rbInfo != null)
			{
				logger.debug("WebService.initWebService -> configuration: resource bundle exists -> video visit external properties file location: " + rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
				//Read external properties file for the web service end point url
				File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
				FileInputStream fileInput = new FileInputStream(file);
	    		Properties appProp = new Properties();
	    		appProp.load(fileInput);
	    		serviceURL = appProp.getProperty("WEBSERVICE_URL");
				
				timeout = Integer.parseInt(appProp.getProperty("WEBSERVICE_TIMEOUT"));
				reuseHTTP = appProp.getProperty("WEBSERVICE_REUSE").equals("true")? true:false;
				chunked = appProp.getProperty("WEBSERVICE_CHUNKED").equals("true")?true:false;
				simulation = appProp.getProperty("WEBSERVICE_SIMULATION").equals("true")?true:false;
				logger.debug("WebService.initWebService -> configuration: serviceURL="+serviceURL+" ,simulation="+simulation);
				modulePath = appProp.getProperty("MODULE_PATH");
				policyPath = appProp.getProperty("POLICY_PATH");
				Crypto crypto = new Crypto();
				serviceSecurityUsername = appProp.getProperty("SERVICE_SECURITY_USERNAME");
				serviceSecurityPassword = crypto.read(appProp.getProperty("SERVICE_SECURITY_PASSWORD"));
				logger.debug("webservice.initWebService -> SecurityUsername:" + serviceSecurityUsername + ", SecurityPassword:" + serviceSecurityPassword);
				
				//setup wizard related values
				setupWizardHostNuid = appProp.getProperty("SETUP_WIZARD_HOST_NUID");
				setupWizardMemberMrn = appProp.getProperty("SETUP_WIZARD_MEMBER_MRN");
				setupWizardMeetingType = appProp.getProperty("SETUP_WIZARD_MEETING_TYPE");
				setupWizardUserName = appProp.getProperty("SETUP_WIZARD_USER_NAME");
				logger.debug("initWebService: setupWizardHostNuid="+setupWizardHostNuid+", setupWizardMemberMrn="+setupWizardMemberMrn+", setupWizardMeetingType="+setupWizardMeetingType+", setupWizardUserName="+setupWizardUserName);
				
				//Proxy Appts parameters
				secureCodes = appProp.getProperty("SECURE_CODES");
				isAdhoc = appProp.getProperty("ADHOC").equals("true") ? true : false;
				isParrs = appProp.getProperty("PARRS").equals ("true") ? true : false;
				logger.debug("initWebService: secureCodes="+secureCodes+", isAdhoc="+isAdhoc+", isParrs="+isParrs);
				
				memberSSOAuthAPIUrl = appProp.getProperty("MEMBER_SSO_AUTH_API_URL");
	    		memberSSOAuthRegionCode = appProp.getProperty("MEMBER_SSO_AUTH_REGION_CODE");
	    		videoVisitRestServiceUrl = appProp.getProperty("VIDEOVISIT_REST_URL");
	    		kpOrgSSOSignOnAPIUrl = appProp.getProperty("KPORG_SSO_SIGNON_API_URL");	    		
	    		kpOrgSSOSignOffAPIUrl = appProp.getProperty("KPORG_SSO_SIGNOFF_API_URL");
	    		kpOrgSSOKeepAliveUrl = appProp.getProperty("KPORG_SSO_KEEP_ALIVE_URL");
	    		kpOrgSSOUserAgentCategoryHeader = System.getProperty ("os.name");
	    		kpOrgSSOOsVersionHeader = System.getProperty ("os.version");
	    		kpOrgSSOUserAgentTypeHeader = WebUtil.getBrowserDetails(request);
	    		kpOrgSSOAPIKeyHeader = crypto.read(appProp.getProperty("KPORG_SSO_API_KEY_HEADER"));
	    		kpOrgSSOAppNameHeader = appProp.getProperty("KPORG_SSO_APP_NAME_HEADER");
	    		vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
	    		if(StringUtils.isBlank(vidyoWebrtcSessionManager)){
	    			vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
	    		}
	    		logger.debug("webservice.initServiceProperties -> kpOrgSSOSignOnAPIUrl:" + kpOrgSSOSignOnAPIUrl);
	    		logger.info("webservice.initServiceProperties -> kpOrgSSOUserAgentCategoryHeader:" + kpOrgSSOUserAgentCategoryHeader + ", kpOrgSSOOsVersionHeader:" + kpOrgSSOOsVersionHeader + ", kpOrgSSOUserAgentTypeHeader:" + kpOrgSSOUserAgentTypeHeader);
	    		logger.debug("webservice.initServiceProperties -> kpOrgSSOAppNameHeader:" + kpOrgSSOAppNameHeader + ",  kpOrgSSOAPIKeyHeader:" + kpOrgSSOAPIKeyHeader);
	    		logger.debug("webservice.initServiceProperties -> kpOrgSSOSignOffAPIUrl:" + kpOrgSSOSignOffAPIUrl);
	    		logger.debug("webservice.initServiceProperties -> memberSSOAuthAPIUrl:" + memberSSOAuthAPIUrl);
	    		logger.debug("webservice.initServiceProperties -> videoVisitRestServiceUrl:" + videoVisitRestServiceUrl);
	    		logger.debug("webservice.initServiceProperties -> kpOrgSSOKeepAliveUrl:" + kpOrgSSOKeepAliveUrl);
	    		logger.debug("webservice.initServiceProperties -> vidyoWebrtcSessionManger:" + vidyoWebrtcSessionManager);
			}
			
			if (simulation)
				return true;
			
			String policyFilePath = request.getSession().getServletContext().getRealPath(policyPath);
			logger.debug("WebService.initWebService policyFilePath: " + policyFilePath);
			String moduleFilePath = request.getSession().getServletContext().getRealPath(modulePath);
			logger.debug("WebService.initWebService modulePath: " + moduleFilePath);
			
			logger.debug("webservice.initWebService -> System property trustStore: " + System.getProperty("javax.net.ssl.trustStore"));
			logger.debug("webservice.initWebService -> System property trustStorePassword: " + System.getProperty("javax.net.ssl.trustStorePassword"));
            
		}
		catch(RemoteException re)
		{
			re.printStackTrace();
			String message = "Remote exception constructor failed to create axisConfig";
			logger.error("System Error" + re.getMessage(),re);
			ret = false;
			throw new RuntimeException(message, re);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			String message = "Exception while reading properties file in initWebService";  
			logger.error("System Error" + e.getMessage(),e);
			ret = false;
			throw new RuntimeException(message, e);
		}
		logger.info("Exit initWebService");
		return ret;
	}
		
	
	/**
	 * @return the setupWizardHostNuid
	 */
	public static String getSetupWizardHostNuid() {
		return setupWizardHostNuid;
	}
	

	/**
	 * @param setupWizardHostNuid the setupWizardHostNuid to set
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
	 * @param setupWizardMemberMrn the setupWizardMemberMrn to set
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
	 * @param setupWizardMeetingType the setupWizardMeetingType to set
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
	 * @param setupWizardUserName the setupWizardUserName to set
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
	 * @return the vidyoWebrtcSessionManger
	 */
	public static String getVidyoWebrtcSessionManager() {
		return vidyoWebrtcSessionManager;
	}

	/**
	 * This method invokes updateMemberMeetingStatus rest service and updates the member meeting status. 
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
		logger.info("Entered WebService.memberEndMeetingLogout with MeetingID : " + meetingID + ", memberName : " + memberName);
		logger.debug("memberEndMeetingLogout with mrn: " + mrn8Digit);

		ServiceCommonOutput output = null;
		String responseJsonStr = "";

		try {
			if (meetingID <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID) || StringUtils.isBlank(memberName) ) {
				logger.warn("memberEndMeetingLogout --> empty input attributes.");
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
				logger.info("memberEndMeetingLogout -> jsonInptString : " + inputJsonString);

				responseJsonStr = callVVRestService(ServiceUtil.UPDATE_MEMBER_MEETING_STATUS, inputJsonString);

				JsonParser parser = new JsonParser();
				JsonObject jobject = new JsonObject();
				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
			}

		} catch (Exception e) {
			logger.error("memberEndMeetingLogout -> Web Service API error :" + e.getMessage());
			throw new Exception("memberEndMeetingLogout -> Web Service API error :", e);
		}
		logger.debug("memberEndMeetingLogout with MeetingID : " + meetingID + ", memberName : " + memberName);
		logger.info("Exit memberEndMeetingLogout");
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
		logger.info("Entered Webservice -> retrieveMeetingForCaregiver");
		logger.debug("retrieveMeetingForCaregiver -> Inputs meetingHash:" + meetingHash + " , sessionId:" + sessionId
				+ " ,clientId:" + clientId);
		String jsonString = "";
		MeetingDetailsOutput output = null;
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
				logger.warn("retrieveMeetingForCaregiver -> Missing Inputs: meetingHash" + meetingHash + ", sessionId"
						+ sessionId + ", clientId" + clientId);
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
				logger.debug("retrieveMeetingForCaregiver --> jsonInputString " + inputJsonStr);

				jsonString = callVVRestService(GET_ACTIVE_MEETINGS_FOR_CAREGIVER, inputJsonStr);
				logger.debug("retrieveMeetingForCaregiver --> jsonResponseString" + jsonString);

				final JsonParser parser = new JsonParser();
				JsonObject jobject = new JsonObject();
				jobject = (JsonObject) parser.parse(jsonString);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
		} catch (Exception e) {
			logger.error("retrieveMeetingForCaregiver: Web Service API error:" + e.getMessage(), e);
			throw new Exception("retrieveMeetingForCaregiver: Web Service API error", e);
		}
		String responseCodeAndMsg = "Empty reponse";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null ? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info("Exit retrieveMeetingForCaregiver --> getActiveMeetingsForCaregiver rest response message & code: "
				+ responseCodeAndMsg);
		return output;
	}
	
	public static MeetingDetailsOutput IsMeetingHashValid(String meetingHash, String clientId, String sessionId) 
				throws RemoteException, Exception {
		logger.info("Entered WebService->IsMeetingHashValid");
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(meetingHash) || StringUtils.isBlank(clientId) || StringUtils.isBlank(sessionId)) {
				logger.warn("WebService->IsMeetingHashValid --> missing input attributes.");
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
			logger.info("WebService->IsMeetingHashValid -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.IS_MEETING_HASH_VALID, inputJsonString);
			logger.info("WebService->IsMeetingHashValid -> jsonResponseString : " + responseJsonStr);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("WebService->IsMeetingHashValid: Web Service API error:" + e.getMessage());
			throw new Exception("WebService->IsMeetingHashValid: Web Service API error", e.getCause());
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(
				"Exiting WebService->IsMeetingHashValid --> IsMeetingHashValid rest response message & code: " + responseCodeAndMsg);

		return output;		
	}
	
	public static LaunchMeetingForMemberGuestOutput createCaregiverMeetingSession(String meetingHash, String patientLastName,boolean isMobileFlow, String sessionId) 
			throws Exception {
		logger.info("Entered WebService->createCaregiverMeetingSession" + "  "+  meetingHash + " "+ patientLastName +" " + isMobileFlow );
		LaunchMeetingForMemberGuestOutput output = null;
		String responseJsonStr = "";
		try{
			if(StringUtils.isBlank(meetingHash) || StringUtils.isBlank(patientLastName) || StringUtils.isBlank(sessionId)){
				logger.warn("WebService->createCaregiverMeetingSession --> missing input attributes.");
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
			input.setClientId(WebUtil.clientId);
			input.setSessionId(sessionId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("WebService->createCaregiverMeetingSession -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_GUEST_DESKTOP, inputJsonString);
			logger.info("WebService->createCaregiverMeetingSession -> jsonResponseString : " + responseJsonStr);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), LaunchMeetingForMemberGuestOutput.class);

		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("createCaregiverMeetingSession: Web Service API error:" + e.getMessage());
			throw new Exception("createCaregiverMeetingSession: Web Service API error", e.getCause());
			
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info("Exit WebService->createCaregiverMeetingSession --> createCaregiverMeetingSession rest response message & code: "
				+ responseCodeAndMsg);
		return output;
	}
	
	public static ServiceCommonOutput endCaregiverMeetingSession(String meetingHash, String megaMeetingNameDisplayName, boolean isParticipantDel, String sessionId) 
			throws Exception {
		logger.info("entered WebService -> endCaregiverMeetingSession - received input attributes as [meetingHash=" + meetingHash + ", megaMeetingNameDisplayName=" + megaMeetingNameDisplayName + ", isParticipantDel=" + isParticipantDel + "]");
		ServiceCommonOutput output = null;
		String responseJsonStr = "";
		try{
			if(StringUtils.isBlank(meetingHash) || StringUtils.isBlank(megaMeetingNameDisplayName) || StringUtils.isBlank(sessionId)){
				logger.warn("WebService->endCaregiverMeetingSession --> missing input attributes.");
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
			input.setClientId(WebUtil.clientId);
			input.setSessionId(sessionId);
			
			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("WebService->endCaregiverMeetingSession -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.END_MEETING_FOR_MEMBER_GUEST_DESKTOP, inputJsonString);
			logger.info("WebService->endCaregiverMeetingSession -> jsonResponseString : " + responseJsonStr);
			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
		}

		catch (Exception e) {
			e.printStackTrace();
			logger.error("WebService -> endCaregiverMeetingSession: Web Service API error:" + e.getMessage());
			throw new Exception("endCaregiverMeetingSession: Web Service API error", e.getCause());

		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info("Exit WebService -> endCaregiverMeetingSession --> endCaregiverMeetingSession rest response message & code: "
				+ responseCodeAndMsg);
		return output;
	}
	
	public static ServiceCommonOutput terminateInstantMeeting(long meetingId, String vendorConfId, String updaterNUID, String sessionId) throws Exception
	{
		logger.info("Entered WebService.terminateInstantMeeting received input attributes as [meetingId=" + meetingId + ", vendorConfId=" + vendorConfId + ", updaterNUID=" + updaterNUID + ", sessionId=" + sessionId + "]");
		
		ServiceCommonOutput output = null;
		String responseJsonStr = "";
		try {
			if (meetingId <= 0  || StringUtils.isBlank(updaterNUID) || StringUtils.isBlank(sessionId)) {
				logger.warn("terminateInstantMeeting --> missing input attributes.");
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
			input.setClientId(WebUtil.clientId);

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("terminateInstantMeeting -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.TERMINATE_INSTANT_VENDOR_MEETING, inputJsonString);
			logger.info("terminateInstantMeeting -> jsonResponseString : " + responseJsonStr);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
		}

		catch (Exception e) {
			e.printStackTrace();
			logger.error("WebService.terminateInstantMeeting: Web Service API error:" + e.getMessage());
			throw new Exception("terminateInstantMeeting: Web Service API error", e.getCause());

		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info("Exit WebService.terminateInstantMeeting --> terminateInstantMeeting rest response message & code: "
				+ responseCodeAndMsg);
		return output;
	}
	
	/** This method will upload the file contents to the database using service API
	 * @param meetingId
	 * @param userId
	 * @param deviceType
	 * @param deviceOS
	 * @param deviceOsVersion
	 * @param callingAppName
	 * @param fileName
	 * @param binaryData
	 * @param fileDatetime
	 * @param sessionId
	 * @return String
	 * @throws Exception
	 */
	/**public static String fileUpload(String meetingId, String userId, String deviceType, String deviceOS, String deviceOsVersion, String callingAppName, String fileName, Base64Binary binaryData, long fileDatetime, String sessionId) throws Exception
	{
		logger.info("Enetered fileUpload -> Received input attributes [meetingId: "+ meetingId + ", userId: " + userId + ", fileName: " + fileName + ", binaryData: " + binaryData + ", callingApp: " + callingAppName + "]");

		org.kp.tpmg.videovisit.member.FileUpload query =  new org.kp.tpmg.videovisit.member.FileUpload();
		String returnStatus = "";
		
		try
		{
			String missingParam = null;
			if(StringUtils.isBlank(meetingId))
			{
				missingParam = "Meeting_Id";
			}else if(StringUtils.isBlank(userId))
			{
				missingParam = "User_Id";
			}else if(StringUtils.isBlank(callingAppName))
			{
				missingParam = "Calling_App_Name";
			}else if(StringUtils.isBlank(fileName))
			{
				missingParam = "File_Name";
			}else if(binaryData == null)
			{
				missingParam = "File_Binary_Data";
			}else if(fileDatetime <= 0)
			{
				missingParam = "File_Date_Time";
			}
			
			if(missingParam != null)
			{
				logger.error("fileUpload -> Input parameter " + missingParam + " is required.");
				JsonObject jsonObj = new JsonObject();				
				jsonObj.addProperty("result","failure");
				jsonObj.addProperty("success","false");
				jsonObj.addProperty("errorIdentifier","4000");
				jsonObj.addProperty("errorMessage","Input parameter " + missingParam + " is required");
				returnStatus = GsonUtil.getJsonAsString(jsonObj);
				logger.info("Exiting fileUpload -> return " + returnStatus);
				return returnStatus;
			}
	       
			query.setMeetingId(meetingId);			
			query.setUserId(userId);
			query.setDeviceType(deviceType);
			query.setDeviceOS(deviceOS);
			query.setDeviceOsVersion(deviceOsVersion);
			query.setCallingAppName(callingAppName);
			query.setFileName(fileName);
			query.setBinaryData(binaryData);
			query.setFileDatetime(fileDatetime);			
			query.setSessionId(sessionId);
			FileUploadResponse fileUploadResp = stub.fileUpload(query);
			if(fileUploadResp != null)
			{
				returnStatus = fileUploadResp.get_return();
			}   
			
		}
		catch(Exception e)
		{
			logger.error("Error in fileUpload API", e);
			if(StringUtils.isBlank(returnStatus))
			{
				JsonObject jsonObj = new JsonObject();				
				jsonObj.addProperty("result","failure");
				jsonObj.addProperty("success","false");
				jsonObj.addProperty("errorIdentifier","4300");
				jsonObj.addProperty("errorMessage","System Error");
				returnStatus = GsonUtil.getJsonAsString(jsonObj);				
			}
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exiting WebService.fileUpload -> returnStatus = " + returnStatus);
        return returnStatus;
    }**/
	
	//KP Org sign on API
	public static KpOrgSignOnInfo performKpOrgSSOSignOn(String userId, String password) throws Exception
	{
		 logger.info("Entered performKpOrgSSOSignOn");
		 HttpURLConnection connection = null; 
		 Scanner scanner = null; 
		 InputStream content = null;	
		 InputStream errorStream = null;		 
		 String output = null;	
		 String kpSsoSession = null;
		 KpOrgSignOnInfo kpOrgSignOnInfo = null;
		 try
		 {	        	
			URL url = new URL(kpOrgSSOSignOnAPIUrl);            		            
            String authStr = userId + ":" + password; // qa			        
            String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");		            
            connection.setRequestProperty("Authorization", "Basic " + authEncoded.trim());
            connection.setRequestProperty("X-useragentcategory", kpOrgSSOUserAgentCategoryHeader);
            connection.setRequestProperty("X-osversion", kpOrgSSOOsVersionHeader);
            connection.setRequestProperty("X-useragenttype", kpOrgSSOUserAgentTypeHeader);
            connection.setRequestProperty("X-apiKey", kpOrgSSOAPIKeyHeader);
            connection.setRequestProperty("X-appName", kpOrgSSOAppNameHeader);
            connection.setRequestProperty("Accept","*/*");
            connection.setDoOutput(true);
            
            int statusCode = connection.getResponseCode();
            logger.info("performKpOrgSSOSignOn -> Status code : " + statusCode);
            if (statusCode != 200 && statusCode != 201 && statusCode != 202)
            {
	            errorStream = connection.getErrorStream();
	            if (errorStream != null) 
	            {
	              String errorMessage = convertInputStreamToString(errorStream);
	              logger.info("performKpOrgSSOSignOn -> Error message :" + errorMessage);
	            }
	            kpSsoSession = connection.getHeaderField("ssosession");				
            }
            else
            {		   
	            content = connection.getInputStream();				
				scanner = new Scanner(content);
				scanner.useDelimiter("\\Z");
				output = scanner.next();
				scanner.close();  
				logger.info("performKpOrgSSOSignOn -> output from service: " + output);
				kpSsoSession = connection.getHeaderField("ssosession");
				logger.info("performKpOrgSSOSignOn -> kpSsoSession from response header=" + kpSsoSession);
            }
            
            if(StringUtils.isNotBlank(output))
            {
            	try
            	{
	            	Gson gson = new Gson();
	            	kpOrgSignOnInfo = gson.fromJson(output, KpOrgSignOnInfo.class);
	            	kpOrgSignOnInfo.setSsoSession(kpSsoSession);
            	}
            	catch(Exception ex)
            	{
            		logger.warn("performKpOrgSSOSignOn -> JSON parsing failed:" + ex.getMessage(), ex);
            		if(kpOrgSignOnInfo == null)
            		{
            			kpOrgSignOnInfo = new KpOrgSignOnInfo();
            			kpOrgSignOnInfo.setSsoSession(kpSsoSession);
            			JSONObject obj = new JSONObject(output);
        				if(obj != null && obj.get("user") != null && obj.get("user") instanceof JSONObject)
        				{
        					UserInfo userInfo = new UserInfo();
        					userInfo.setGuid(obj.getJSONObject("user").getString("guid"));
        					kpOrgSignOnInfo.setUser(userInfo);
        				}        				
            		}
            	}
            }
            logger.info("performKpOrgSSOSignOn -> SignOn Info=" + kpOrgSignOnInfo);
				
        }
        catch (Exception e) {
        	logger.warn("performKpOrgSSOSignOn -> Web Service API error:" + e.getMessage(), e);
        }
        finally
        {
        	try
        	{
        		if ( errorStream != null )
        		{
        			errorStream.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("performKpOrgSSOSignOn -> error while closing error inputStream.");
        	}
        	
        	try
        	{
        		if ( content != null )
        		{
        			content.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("performKpOrgSSOSignOn -> error while closing inputStream.");
        	}
        	
        	try
        	{
        		if ( scanner != null )
        		{
        			scanner.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("performKpOrgSSOSignOn -> error while closing scanner.");        		
        	}        	
        	
        	disconnectURLConnection(connection);
        }
		logger.info("Exiting performKpOrgSSOSignOn");
	    return kpOrgSignOnInfo;
		
	}
	
	public static KpOrgSignOnInfo validateKpOrgSSOSession(String ssoSession) throws Exception
	{
		 logger.info("Entered validateKpOrgSSOSession");
		 HttpURLConnection connection = null; 
		 Scanner scanner = null; 
		 InputStream content = null;	
		 InputStream errorStream = null;		 
		 String output = null;	
		 String kpSsoSession = null;
		 KpOrgSignOnInfo kpOrgSignOnInfo = null;
		 try
		 {			  	           	
		    URL url = new URL(kpOrgSSOSignOffAPIUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");		            
            connection.setRequestProperty("X-useragentcategory", kpOrgSSOUserAgentCategoryHeader);
            connection.setRequestProperty("X-osversion", kpOrgSSOOsVersionHeader);
            connection.setRequestProperty("X-useragenttype", kpOrgSSOUserAgentTypeHeader);
            connection.setRequestProperty("X-apiKey", kpOrgSSOAPIKeyHeader);
            connection.setRequestProperty("X-appName", kpOrgSSOAppNameHeader);
            connection.setRequestProperty("ssosession", ssoSession);
            connection.setRequestProperty("Accept","*/*");
            connection.setDoOutput(true);
            
            int statusCode = connection.getResponseCode();
            logger.info("validateKpOrgSSOSession -> Status code : " + statusCode);
            if (statusCode != 200 && statusCode != 201 && statusCode != 202)
            {
	            errorStream = connection.getErrorStream();
	            if (errorStream != null) 
	            {
	              String errorMessage = convertInputStreamToString(errorStream);
	              logger.info("validateKpOrgSSOSession -> Error message :" + errorMessage);
	            }
	            kpSsoSession = connection.getHeaderField("ssosession");				
            }
            else
            {		   
	            content = connection.getInputStream();				
				scanner = new Scanner(content);
				scanner.useDelimiter("\\Z");
				output = scanner.next();
				scanner.close();  
				logger.info("validateKpOrgSSOSession -> output from service: " + output);
				kpSsoSession = connection.getHeaderField("ssosession");
				logger.debug("validateKpOrgSSOSession -> kpSsoSession from response header=" + kpSsoSession);
            }
            
            if(StringUtils.isNotBlank(output))
            {
            	try
            	{
	            	Gson gson = new Gson();
	            	kpOrgSignOnInfo = gson.fromJson(output, KpOrgSignOnInfo.class);
	            	kpOrgSignOnInfo.setSsoSession(kpSsoSession);
            	}
            	catch(Exception ex)
            	{
            		logger.warn("validateKpOrgSSOSession -> JSON parsing failed:" + ex.getMessage(), ex);
            		if(kpOrgSignOnInfo == null)
            		{
            			kpOrgSignOnInfo = new KpOrgSignOnInfo();
            			kpOrgSignOnInfo.setSsoSession(kpSsoSession);
            			JSONObject obj = new JSONObject(output);
        				if(obj != null && obj.get("user") != null && obj.get("user") instanceof JSONObject)
        				{
        					UserInfo userInfo = new UserInfo();
        					userInfo.setGuid(obj.getJSONObject("user").getString("guid"));
        					kpOrgSignOnInfo.setUser(userInfo);
        				}        				
            		}
            	}
            }
            logger.info("validateKpOrgSSOSession -> SignOn Info=" + kpOrgSignOnInfo);
				
        }
        catch (Exception e) {
        	logger.warn("validateKpOrgSSOSession -> Web Service API error:" + e.getMessage(), e);
        }
        finally
        {
        	try
        	{
        		if ( errorStream != null )
        		{
        			errorStream.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("validateKpOrgSSOSession -> error while closing error inputStream.");
        	}
        	
        	try
        	{
        		if ( content != null )
        		{
        			content.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("validateKpOrgSSOSession -> error while closing inputStream.");
        	}
        	
        	try
        	{
        		if ( scanner != null )
        		{
        			scanner.close();	
        		}
        	}
        	catch(Exception e)
        	{
        		logger.warn("validateKpOrgSSOSession -> error while closing scanner.");        		
        	}        	
        	
        	disconnectURLConnection(connection);
        }
		logger.info("Exiting validateKpOrgSSOSession");
	    return kpOrgSignOnInfo;
		
	}
	
	//Authorize Member by passing guid to Member SSO Auth API
	public static AuthorizeResponseVo authorizeMemberSSOByGuid(String guid, String regionCode) throws Exception
	{
		logger.info("Entered authorizeMemberSSOByGuid -> guid=" + guid + ", regionCode=" + regionCode + ", memberSSOAuthRegionCode=" + memberSSOAuthRegionCode);
		AuthorizeResponseVo response = null;
		try
		{
			EsbInfo esbInfo = new EsbInfo();
			esbInfo.setEndpoint(memberSSOAuthAPIUrl);
			esbInfo.setUserName(serviceSecurityUsername);
			esbInfo.setPassword(serviceSecurityPassword);
			
			AuthorizeRequestVo req = new AuthorizeRequestVo();		    
			req.setGuid(guid);
			if(StringUtils.isBlank(regionCode))
			{
				regionCode = memberSSOAuthRegionCode;
			}
			req.setRegionCode(regionCode);
		    response = MemberSSOAuthAPIs.authorize(esbInfo, req);
			
		}
		catch(Exception e)
		{
			logger.error("authorizeMemberSSOByGuid -> Web Service API error:" + e.getMessage(), e);
			
		}
		logger.info("Exiting authorizeMemberSSOByGuid");
		return response;		
	}
	
	//perform SSO sign off from Kp org API
	public static boolean performKpOrgSSOSignOff(String ssoSession)
	{
		 logger.info("Entered performKpOrgSSOSignOff");
		 HttpURLConnection connection = null; 		 
		 InputStream errorStream = null;		 
		 String kpSsoSession = null;
		 boolean isSignedOff = false;
		 try
		 {			  	           	
		   URL url = new URL(kpOrgSSOSignOffAPIUrl);           
           connection = (HttpURLConnection) url.openConnection();
           connection.setRequestMethod("DELETE");
           connection.setRequestProperty("Content-Type", "application/json");		            
           connection.setRequestProperty("X-useragentcategory", kpOrgSSOUserAgentCategoryHeader);
           connection.setRequestProperty("X-osversion", kpOrgSSOOsVersionHeader);
           connection.setRequestProperty("X-useragenttype", kpOrgSSOUserAgentTypeHeader);
           connection.setRequestProperty("X-apiKey", kpOrgSSOAPIKeyHeader);
           connection.setRequestProperty("X-appName", kpOrgSSOAppNameHeader);
           connection.setRequestProperty("ssosession", ssoSession);
                      
           int statusCode = connection.getResponseCode();
           logger.info("performKpOrgSSOSignOff -> Status code : " + statusCode);
           if (statusCode != 200 && statusCode != 202 && statusCode != 204)
           {
	            errorStream = connection.getErrorStream();
		        if (errorStream != null) 
		        {
		          String errorMessage = convertInputStreamToString(errorStream);
		          logger.info("performKpOrgSSOSignOff -> Error message :" + errorMessage);
		        }
           }
           else
           {
        	   isSignedOff = true;
           }
	        kpSsoSession = connection.getHeaderField("ssosession");
	        logger.info("performKpOrgSSOSignOff -> ssosession token : " + kpSsoSession);
		 }
		 catch (Exception e) {
       		logger.warn("performKpOrgSSOSignOff -> Web Service API error:" + e.getMessage(), e);
		 }
		 finally
		 {
			try
			{
	       		if (errorStream != null)
	       		{
	       			errorStream.close();	
	       		}
	       	}
	       	catch(Exception e)
	       	{
	       		logger.warn("performKpOrgSSOSignOff -> error while closing error inputStream.");
	       	}      	
	       	
	       	disconnectURLConnection(connection);
		 }
		 logger.info("Exiting performKpOrgSSOSignOff -> isSignedOff=" + isSignedOff);   
		 return isSignedOff;
	}
	
	public static String callVVRestService(String operationName, String input) 
	{
		 logger.info("Entered callVVRestService");
		 HttpURLConnection connection = null; 
		 InputStream content = null;	
		 InputStream errorStream = null;		
		 Scanner scanner = null; 
		 OutputStream os = null;			 
		 String output = null;		
		  try 
		  {
	        	
            URL url = new URL(videoVisitRestServiceUrl + operationName);
            String authStr = serviceSecurityUsername + ":" + serviceSecurityPassword;
            logger.info("callVVRestService url: " + videoVisitRestServiceUrl + operationName);
            String authEncoded = DatatypeConverter.printBase64Binary(authStr.getBytes());
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Authorization", "Basic " + authEncoded.trim());
            connection.setRequestProperty("Accept","*/*");
            connection.setDoOutput(true);
            
         /*   int statusCode = connection.getResponseCode();
            logger.info("callVVRestService -> Status code : " + statusCode);
            if (statusCode != 200 && statusCode != 201 && statusCode != 202)
            {
	            errorStream = connection.getErrorStream();
	            if (errorStream != null) 
	            {
	              String errorMessage = convertInputStreamToString(errorStream);
	              logger.info("callVVRestService -> Error message :" + errorMessage);
	            }
	            				
            }
            else
            {  */         
	            os = connection.getOutputStream();
	            os.write(input.getBytes());
	            os.flush();
	            content = connection.getInputStream();				
				scanner = new Scanner(content);
				scanner.useDelimiter("\\Z");
				output = scanner.next();
				scanner.close();
           // }
				
	      }
		  catch(Exception e) 
		  {
        	logger.error("callVVRestService -> Web Service API error:" + e.getMessage(), e);
		  }
		  finally
		  {
	        	
			    try
	        	{
	        		if ( errorStream != null )
	        		{
	        			errorStream.close();	
	        		}
	        	}
	        	catch(Exception e)
	        	{
	        		logger.warn("callVVRestService -> error while closing error inputStream.");
	        	}
	        	
	        	try
	        	{
	        		if ( content != null )
	        		{
	        			content.close();	
	        		}
	        	}
	        	catch(Exception e)
	        	{
	        		logger.warn("callVVRestService -> error while closing inputStream.");
	        	}
	        	
			    try
	        	{
	        		if ( scanner != null )
	        		{
	        			scanner.close();	
	        		}
	        	}
	        	catch(Exception e)
	        	{
	        		logger.warn("callVVRestService -> error while closing scanner.");        		
	        	}
	        	
	        	try
	        	{
	        		if ( os != null )
	        		{
		        		os.close();	
	        		}
	        	}
	        	catch(Exception e)
	        	{
	        		logger.warn("callVVRestService -> error while closing OutputStream.");
	        	}
	        	disconnectURLConnection(connection);
	       }
		   logger.info("Exiting callVVRestService");
		   return output;
		  
	  }
	 
	private static String convertInputStreamToString(InputStream content)
	{
		String result = "";
		BufferedReader in = null;
	    try {
	      in = new BufferedReader(new InputStreamReader(content));
	      String line;
	      while ((line = in.readLine()) != null) {
	        result = result + line;
	      }	      
	      return result;
	    }
	    catch (Exception ex)
	    {
	      logger.error("convertInputStreamToString -> Error while converting input stream to String");
	      return "";
	    } finally {
	      if (in != null)
	        try {
	          in.close(); 
	          in = null;
	        } catch (IOException e) {
	          logger.warn("convertInputStreamToString -> Error while closing the buffered reader");
	        }
	    }
	  }

	
	  private static void disconnectURLConnection(URLConnection connection)
	  {
		  	logger.info("Entered disconnectURLConnection");
		  	try
			{
				if(connection != null)
				{
					if ((connection instanceof HttpsURLConnection)) {
				      HttpsURLConnection httpsConn = (HttpsURLConnection)connection;
				      if (httpsConn != null) {
				        httpsConn.disconnect();
				        httpsConn = null;
				      }
				    } else if ((connection instanceof HttpURLConnection)) {
				      HttpURLConnection httpConn = (HttpURLConnection)connection;
				      if (httpConn != null) {
				        httpConn.disconnect();
				        httpConn = null;
				      }
				    }
				}
			}
			catch(Exception ex)
			{
				logger.warn("disconnectURLConnection -> Error while disconnecting URL connection.");
			}
		  	logger.info("Exiting disconnectURLConnection");
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
			boolean isProxyMeeting, String careGiverName, String sessionId, String clientId) throws Exception 
    {
		logger.info("Entered setKPHCConferenceStatus -> Inputs [meetingId=" + meetingId + ", joinLeaveStatus="
			+ joinLeaveStatus + ", isProxyMeeting" + isProxyMeeting + ", careGiverName=" + careGiverName + "]");
	
		ServiceCommonOutput output = null;
		String inputJsonString = "";
		String jsonResponseStr = "";
	
		try {
			if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
				logger.warn("setKPHCConferenceStatus --> Missing input attributes.");
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
				logger.info("setKPHCConferenceStatus -> jsonInputString : " + inputJsonString);
				jsonResponseStr = callVVRestService(ServiceUtil.SET_KPHC_CONFERENCE_STATUS, inputJsonString);
				logger.info("setKPHCConferenceStatus -> jsonResponseString : " + jsonResponseStr);
				final JsonParser parser = new JsonParser();
				final JsonObject jobject = (JsonObject) parser.parse(jsonResponseStr);
				output = gson.fromJson(jobject.get("service").toString(), ServiceCommonOutput.class);
			}
		} catch (Exception e) {
			logger.error("setKPHCConferenceStatus -> Web Service API error");
		}
		
		logger.info("Exit setKPHCConferenceStatus");
		return output;
	}
	
	public static MeetingDetailsOutput retrieveActiveMeetingsForMemberAndProxies(String mrn8Digit, boolean getProxyMeetings, String sessionID, String clientId) throws Exception {
		logger.info("Entered WebService->retrieveActiveMeetingsForMemberAndProxies -> received input attributes as [mrn8Digit="
						+ mrn8Digit + ", getProxyMeetings=" + getProxyMeetings + ", sessionId=" + sessionID + ", clientId=" + clientId + "]");
		MeetingDetailsOutput output = null;
		String responseJsonStr = "";
		String inputJsonString = "";
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject jobject = new JsonObject();
		try {
			if (StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID) || StringUtils.isBlank(clientId)) {
				logger.warn("WebService->retrieveActiveMeetingsForMemberAndProxies --> missing input attributes.");
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

			logger.debug("retrieveActiveMeetingsForMemberAndProxies -> after split secure codes: " + secureCodes.split(","));
			RetrieveActiveMeetingsForMemberAndProxiesInput input = new RetrieveActiveMeetingsForMemberAndProxiesInput();
			input.setMrn(mrn8Digit);
			input.setGetProxyMeetings(getProxyMeetings);
			input.setSecureCodes(secureCodes.split(","));
			input.setIsAdhoc(isAdhoc);
			input.setIsParrs(isParrs);
			input.setClientId(clientId);
			input.setSessionId(sessionID);

			inputJsonString = gson.toJson(input);
			logger.info("WebService->retrieveActiveMeetingsForMemberAndProxies -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,inputJsonString);

			logger.info("WebService->retrieveActiveMeetingsForMemberAndProxies -> jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		} catch (Exception e) {
			logger.error("retrieveActiveMeetingsForMemberAndProxies -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES,inputJsonString);

			logger.info("WebService->retrieveActiveMeetingsForMemberAndProxies -> jsonResponseString : " + responseJsonStr);

			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
		}
		String responseCodeAndMsg = "Empty response";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info(
				"Exiting WebService->retrieveActiveMeetingsForMemberAndProxies --> retrieveActiveMeetingsForMemberAndProxies rest response message & code: " + responseCodeAndMsg);

		return output;
	}
	 
	 public static MeetingDetailsOutput retrieveActiveMeetingsForNonMemberProxies(String guid, String sessionID, String clientId) throws Exception 
		{
			logger.info("Entered WebService->retrieveActiveMeetingsForNonMemberProxies -> guid=" + guid+ ", sessionId=" + sessionID + ", clientId=" + clientId + "]");
			MeetingDetailsOutput output = null;
			String responseJsonStr = "";
			String inputJsonString = "";
			Gson gson = new Gson();
			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			try
			{
				if(StringUtils.isBlank(guid) || StringUtils.isBlank(sessionID) || StringUtils.isBlank(clientId))
				{
					logger.warn("WebService->retrieveActiveMeetingsForNonMemberProxies -> guid, sessionID and clientId are required ");
					output = new MeetingDetailsOutput();
					final Status status = new Status();
					status.setCode("300");
					status.setMessage("Missing input attributes.");
					output.setStatus(status);
					return output;
				}
				
				if(secureCodes == null)
				{
					secureCodes = "";
				}
				
				logger.debug("WebService->retrieveActiveMeetingsForNonMemberProxies -> after split secure codes: " + secureCodes.split(","));
				RetrieveActiveMeetingsForNonMemberProxiesInput input = new RetrieveActiveMeetingsForNonMemberProxiesInput();
				input.setGuid(guid);
				input.setSecureCodes(secureCodes.split(","));
				input.setIsAdhoc(isAdhoc);
				input.setIsParrs(isParrs);
				input.setClientId(clientId);
				input.setSessionId(sessionID);
				
				inputJsonString = gson.toJson(input);
				logger.info("WebService->retrieveActiveMeetingsForNonMemberProxies -> jsonInptString : " + inputJsonString);

				responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,inputJsonString);

				logger.info("WebService->retrieveActiveMeetingsForNonMemberProxies -> jsonResponseString : " + responseJsonStr);

				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);	
			}
			catch (Exception e)
			{
				logger.error("retrieveActiveMeetingsForNonMemberProxies -> Web Service API error:" + e.getMessage() + " Retrying...", e);
				responseJsonStr = callVVRestService(ServiceUtil.RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES,inputJsonString);

				logger.info("WebService->retrieveActiveMeetingsForNonMemberProxies -> jsonResponseString : " + responseJsonStr);

				jobject = (JsonObject) parser.parse(responseJsonStr);
				output = gson.fromJson(jobject.get("service").toString(), MeetingDetailsOutput.class);
			}
			String responseCodeAndMsg = "Empty response";
			if (output != null) {
				responseCodeAndMsg = output.getStatus() != null
						? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
						: "No rest response code & message returned from service.";
			}
			logger.info(
					"Exiting WebService->retrieveActiveMeetingsForNonMemberProxies --> retrieveActiveMeetingsForNonMemberProxies rest response message & code: " + responseCodeAndMsg);

			return output;
		}
	
	  /* verifyCaregiver calling the new rest API*/
	  
	  public static VerifyCareGiverOutput verifyCaregiver(String meetingHash, String patientLastName, String sessionId, String clientId) 
				throws Exception {
			logger.info("Entered Webservice:->verifyCaregiver");
			VerifyCareGiverOutput output = new VerifyCareGiverOutput();
			Status status = new Status();
			try{
				if(meetingHash == null || patientLastName == null){
					status.setCode("500");
					status.setMessage("Missing Inputs");
					output.setStatus(status);		
					return output;
				}
				VerifyCareGiverInput input= new VerifyCareGiverInput();
				input.setMeetingHash(meetingHash);
				input.setSessionId(sessionId);
				input.setClientId(clientId);
				input.setPatientLastName(patientLastName);
							
				
				String operationName="verifyCaregiver";
				
				Gson gson = new Gson();
				String inputString = gson.toJson(input);
				logger.info("jsonInptString "+ inputString);
				
				
				String jsonString= callVVRestService(operationName,inputString);
				logger.info("jsonString"+jsonString);
				
				JsonParser parser = new JsonParser();
				JsonObject jobject = new JsonObject();
				jobject = (JsonObject) parser.parse(jsonString);
				logger.info("After jobject parser");
				output = gson.fromJson( jobject.get("service").toString(), VerifyCareGiverOutput.class);
				
				//output= gson.fromJson(jsonString,VerifyCareGiverOutput.class);
				logger.info("verifyCaregverOutput"+output.getEnvelope());
				logger.info("Output in VerifyCaregiver after converting it to class"+ output.toString());
			}
			catch (Exception e)
			{
				e.printStackTrace();
				logger.error("verifyCaregiver: Web Service API error:" + e.getMessage());
				throw new Exception("verifyCaregiver: Web Service API error", e.getCause());
				
			}
			
			logger.info("Exit verifyCaregiver");
			return output;
		}
	  
	  /*launchMeetingForMemberGuest calling the new REst API */
	  
	  public static LaunchMeetingForMemberGuestOutput getMeetingDetailsForMemberGuest(String meetingHash, String patientLastName,String deviceType, String deviceOS, String deviceOSVersion,boolean isMobileFlow, String sessionId, String clientId) throws Exception{
			
		 
			logger.info("Entered WebService: getMeetingDetailsForMemberGuest");	
			LaunchMeetingForMemberGuestOutput launchMeetingForMemberGuest = new LaunchMeetingForMemberGuestOutput();
			
			LaunchMeetingForMemberGuestInput  launchMeetingForMemberGuestInput = new LaunchMeetingForMemberGuestInput();
			try{
				launchMeetingForMemberGuestInput.setMeetingHash(meetingHash);
				launchMeetingForMemberGuestInput.setPatientLastName(patientLastName);
				launchMeetingForMemberGuestInput.setDeviceOs(deviceOS);
				launchMeetingForMemberGuestInput.setDeviceType(deviceType);
				launchMeetingForMemberGuestInput.setDeviceOsVersion(deviceOSVersion);
				launchMeetingForMemberGuestInput.setMobileFlow(isMobileFlow);
				launchMeetingForMemberGuestInput.setClientId(clientId);
				launchMeetingForMemberGuestInput.setSessionId(sessionId);
				
              String operationName="launchMeetingForMemberGuest";
				
				Gson gson = new Gson();
				String inputString = gson.toJson(launchMeetingForMemberGuestInput);
				logger.info("WebService: getMeetingDetailsForMemberGuest->launchMeetingForMemberGuest->jsonInputString "+ inputString);
				
				
				String jsonString= callVVRestService(operationName,inputString);
				logger.info("getMeetingDetailsForMemberGuest->launchMeetingForMemberGuest->OutputjsonString"+jsonString);
				
				JsonParser parser = new JsonParser();
				JsonObject jobject = new JsonObject();
				jobject = (JsonObject) parser.parse(jsonString);
				logger.info("After jobject parser");
				launchMeetingForMemberGuest = gson.fromJson( jobject.get("service").toString(), LaunchMeetingForMemberGuestOutput.class);
				
				logger.info("getMeetingDetailsForMemberGuest->launchMeetingForMemberGuest->json string after converting it to class"+ launchMeetingForMemberGuest.toString());
				
			}
			catch(Exception e){
				e.printStackTrace();
				logger.error("WebService: getMeetingDetailsForMemberGuest -> Web Service API error:" + e.getMessage() + " Retrying...", e);
				throw new Exception("getMeetingDetailsForMemberGuest: Web Service API error", e.getCause());
		
			}
			
			logger.info("Exit WebService: getLaunchMeetingDetails");
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
		logger.info("Entered Webservice -> verifyMember ");
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

			Gson gson = new Gson();
			String inputString = gson.toJson(verifyMeberInput);
			logger.debug("verifyMember -> jsonInputString " + inputString);

			String jsonString = callVVRestService(ServiceUtil.VERIFY_MEMBER, inputString);
			logger.debug("verifyMember -> OutputjsonString" + jsonString);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(jsonString);
			verifyMemberOutput = gson.fromJson(jobject.get("service").toString(), VerifyMemberOutput.class);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("WebService -> verifyMember -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			throw new Exception("verifyMember: Web Service API error", e.getCause());
		}

		logger.info("Exit Webservice -> verifyMember");
		return verifyMemberOutput;
	}
	  
	public static CreateInstantVendorMeetingOutput createInstantVendorMeeting(String hostNuid, String[] participantNuid,
			String memberMrn, String meetingType, String sessionId, String clientId) throws Exception {
		logger.info("Entered WebService.createInstantVendorMeeting -> received input attributes as [hostNuid="
				+ hostNuid + ", participantNuid=" + participantNuid + ", memberMrn=" + memberMrn + ", meetingType="
				+ meetingType + ", sessionId=" + sessionId + ", clientId=" + clientId + "]");
		CreateInstantVendorMeetingOutput output = null;
		String responseJsonStr = "";
		try {
			if (StringUtils.isBlank(hostNuid) || StringUtils.isBlank(memberMrn) || StringUtils.isBlank(meetingType)
					|| StringUtils.isBlank(sessionId) || StringUtils.isBlank(clientId)) {
				logger.warn("createInstantVendorMeeting --> missing input attributes.");
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

			final Gson gson = new Gson();
			final String inputJsonString = gson.toJson(input);
			logger.info("createInstantVendorMeeting -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.CREATE_INSTANT_VENDOR_MEETING, inputJsonString);
			//responseJsonStr = "{\"service\":{\"name\":\"createInstantVendorMeeting\",\"status\":{\"code\":\"200\",\"message\":\"Success\"},\"appVersion\":{\"version\":\"1.4.0\",\"instructions\":null},\"envelope\":{\"vendorMeeting\":{\"conferenceId\":\"78087\",\"callerId\":0,\"entityId\":78087,\"roomUrl\":\"https://thvid.kp.org/flex.html?roomdirect.html&key=X8gvjBn73e5yZKqqm0vEpda4b8E\",\"userId\":0,\"meetingId\":142306}}}}";
			logger.info("createInstantVendorMeeting -> jsonResponseString : " + responseJsonStr);

			JsonParser parser = new JsonParser();
			JsonObject jobject = new JsonObject();
			jobject = (JsonObject) parser.parse(responseJsonStr);
			output = gson.fromJson(jobject.get("service").toString(), CreateInstantVendorMeetingOutput.class);
		}

		catch (Exception e) {
			e.printStackTrace();
			logger.error("WebService.createInstantVendorMeeting: Web Service API error:" + e.getMessage());
			throw new Exception("createInstantVendorMeeting: Web Service API error", e.getCause());

		}
		String responseCodeAndMsg = "Empty reponse";
		if (output != null) {
			responseCodeAndMsg = output.getStatus() != null
					? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
					: "No rest response code & message returned from service.";
		}
		logger.info("Exit WebService.createInstantVendorMeeting --> createInstantVendorMeeting rest response message & code: "
				+ responseCodeAndMsg);
		return output;

	}
	    
	public static ServiceCommonOutputJson testDbRoundTrip() throws Exception
	{
		logger.info("Entered testDbRoundTrip");
		String responseJsonStr = null;
		final Gson gson = new Gson();
		ServiceCommonOutputJson testDbRoundTripJson = new ServiceCommonOutputJson();
		try
		{
			responseJsonStr = callVVRestService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}");
			testDbRoundTripJson = gson.fromJson(responseJsonStr, ServiceCommonOutputJson.class);
		}
		catch (Exception e)
		{
			logger.error("testDbRoundTrip -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.TEST_DB_ROUND_TRIP, "{}");
			testDbRoundTripJson = gson.fromJson(responseJsonStr, ServiceCommonOutputJson.class);
		}
		logger.info("Exit testDbRoundTrip");
		return testDbRoundTripJson;
	}
	
	public static JoinLeaveMeetingJSON memberLeaveProxyMeeting(String meetingId, String careGiverName, String sessionId)
	throws Exception
	{
		logger.info("Entered memberLeaveProxyMeeting - received input attributes as [meetingId=" + meetingId + ", sessionID=" + sessionId + ", careGiverName=" + careGiverName + "]");
		JoinLeaveMeetingJSON output = null;
		String responseJsonStr = null;
		final Gson gson = new Gson();
		String inputJsonString = null;
		try
		{
			if(StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId))
			{
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
			joinLeaveMeetingInput.setClientId(WebUtil.clientId);
			joinLeaveMeetingInput.setIsPatient(false);
			joinLeaveMeetingInput.setDeviceType(WebUtil.DEFAULT_DEVICE);
			joinLeaveMeetingInput.setDeviceOs(WebUtil.getDeviceOs());
			joinLeaveMeetingInput.setDeviceOsVersion(WebUtil.getDeviceOsVersion());
			inputJsonString = gson.toJson(joinLeaveMeetingInput);
			logger.info("memberLeaveProxyMeeting -> jsonInptString : " + inputJsonString);

			responseJsonStr = callVVRestService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString);
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
			
		}
		catch (Exception e)
		{
			logger.error("memberLeaveProxyMeeting -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, inputJsonString);
			output = gson.fromJson(responseJsonStr, JoinLeaveMeetingJSON.class);
		}
		logger.info("Exit memberLeaveProxyMeeting");
		return output;
	}

	public static String launchMemberOrProxyMeetingForMember(long meetingId, String mrn8Digit,
			String inMeetingDisplayName, boolean isProxyMeeting, String sessionId) throws Exception {
		logger.info("Entered launchMemberOrProxyMeetingForMember -> meetingId= " + meetingId + ", inMeetingDisplayName="
				+ inMeetingDisplayName + ", isProxyMeeting=" + isProxyMeeting);
		final Gson gson = new Gson();
		String responseJsonStr = null;
		String inputJsonString = null;
		LaunchMemberOrProxyMeetingForMemberInput input = null;
		try {
			boolean isNonMember = false;
			if (isProxyMeeting && StringUtils.isBlank(mrn8Digit)) {
				isNonMember = true;
			}
			logger.info("launchMemberOrProxyMeetingForMember -> isNonMember= " + isNonMember);
			if ((!isNonMember && StringUtils.isBlank(mrn8Digit)) || meetingId <= 0 || StringUtils.isBlank(sessionId)
					|| StringUtils.isBlank(inMeetingDisplayName)) {
				logger.warn("launchMemberOrProxyMeetingForMember --> missing input attributes.");
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
			input.setClientId(WebUtil.clientId);
			inputJsonString = gson.toJson(input);
			logger.info("launchMemberOrProxyMeetingForMember -> inputJsonString : " + inputJsonString);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString);
		} catch (Exception e) {
			logger.error("launchMemberOrProxyMeetingForMember -> Web Service API error:" + e.getMessage() 
			+ " Retrying...",e);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, inputJsonString);
		}
		logger.info("Exiting launchMemberOrProxyMeetingForMember");
		return responseJsonStr;
	}

	public static String launchMeetingForMemberDesktop(long meetingId, String inMeetingDisplayName, String mrn8Digit,
			String sessionId) throws Exception {
		logger.info("Entered launchMeetingForMemberDesktop");
		final Gson gson = new Gson();
		String responseJsonStr = null;
		String inputJsonString = null;
		LaunchMeetingForMemberDesktopInput input = null;
		if (meetingId <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionId)
				|| StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("launchMeetingForMemberDesktop --> missing input attributes.");
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
			input.setClientId(WebUtil.clientId);
			inputJsonString = gson.toJson(input);
			logger.info("launchMeetingForMemberDesktop -> inputJsonString : " + inputJsonString);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString);
		} catch (Exception e) {
			logger.error("launchMeetingForMemberDesktop -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			responseJsonStr = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, inputJsonString);
		}
		logger.info("Exiting launchMeetingForMemberDesktop");
		return responseJsonStr;

	}
	
	public static MeetingDetailsJSON retrieveMeeting(String mrn8Digit,int pastMinutes,int futureMinutes,String sessionID) throws Exception 
	{
		logger.info("Entered retrieveMeeting");
		MeetingDetailsJSON meetingDetailsJSON = null;
		Gson gson = new Gson();
		String output = null;
		ActiveMeetingsForMemberInput jsonInput = new ActiveMeetingsForMemberInput();
		try
		{
			if(mrn8Digit == null || sessionID == null)
			{
				logger.warn("retrieveMeeting --> missing input attributes.");
				MeetingDetailsJSON detailsJSON = new MeetingDetailsJSON();
				detailsJSON.setService(new MeetingDetailsOutput());
				final Status status = new Status();
				status.setCode("300");
				status.setMessage("Missing input attributes.");
				detailsJSON.getService().setStatus(status);
				return detailsJSON;
			}
			jsonInput.setMrn(mrn8Digit);
			jsonInput.setClientId(WebUtil.clientId);
			jsonInput.setSessionId(sessionID);
			logger.info("retrieveMeeting -> inputJsonString : " + gson.toJson(jsonInput));		
			output = callVVRestService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput));
			meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
		}
		catch (Exception e)
		{
			logger.error("retrieveMeeting -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callVVRestService(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_MEMBER, gson.toJson(jsonInput));
			meetingDetailsJSON = gson.fromJson(output, MeetingDetailsJSON.class);
		}
		logger.info("Exit retrieveMeeting");
		return meetingDetailsJSON;
	}

	public static String getLaunchMeetingDetails(long meetingID,
			String inMeetingDisplayName,String sessionID,String mrn8Digit,String deviceType, String deviceOS, String deviceOSversion,boolean isMobileFlow) throws Exception {
		logger.info("Entered WebService: getLaunchMeetingDetails");	
	    LaunchMeetingForMemberInput jsonInput = new LaunchMeetingForMemberInput();
	    Gson gson = new Gson();
	    String output = null;
	    
		logger.info("Entered WebService: getLaunchMeetingDetails:MeetingID=" + meetingID + " sessionId=" + sessionID +" inMeetingDisplayName"+ inMeetingDisplayName + " mrn8Digit=" + mrn8Digit+ " deviceType" + deviceType +" deviceOS" +deviceOS+ " deviceOSversion" +deviceOSversion +" isMobileFlow" +isMobileFlow);
		if (meetingID <= 0 || StringUtils.isBlank(mrn8Digit) || StringUtils.isBlank(sessionID)
				|| StringUtils.isBlank(inMeetingDisplayName)) {
			logger.warn("getLaunchMeetingDetails --> missing input attributes.");
			LaunchMeetingForMemberGuestJSON memberOutput = new LaunchMeetingForMemberGuestJSON();
			memberOutput.setService(new LaunchMeetingForMemberGuestOutput());
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberOutput.getService().setStatus(status);
			return gson.toJson(memberOutput);
		}
		try
		{
			jsonInput.setMrn(mrn8Digit);
			jsonInput.setMeetingID(meetingID);
			jsonInput.setSessionId(sessionID);
			jsonInput.setInMeetingDisplayName(inMeetingDisplayName);
			jsonInput.setDeviceType(deviceType);
			jsonInput.setDeviceOS(deviceOS);
			jsonInput.setDeviceOSversion(deviceOSversion);
			jsonInput.setMobileFlow(isMobileFlow);
			jsonInput.setClientId(WebUtil.clientId);
			
			logger.info("getLaunchMeetingDetails -> inputJsonString : " + gson.toJson(jsonInput));
			output = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput));
		}
		catch (Exception e)
		{
			logger.error("WebService: getLaunchMeetingDetails -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callVVRestService(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, gson.toJson(jsonInput));
		}
		logger.info("Exit WebService: getLaunchMeetingDetails");
		return output;
	}

	public static String memberLogout(String mrn8Digit, String sessionID) throws Exception
	{
		logger.info("Entered memberLogout -> input attributes: sessionId ="+ sessionID +"mrn8Digit"+ mrn8Digit);
		MemberLogoutInput input = new MemberLogoutInput();
	    Gson gson = new Gson();
	    String output = null;
	    if(StringUtils.isBlank(mrn8Digit)){
	    	mrn8Digit = WebUtil.NON_MEMBER;
	    }
		if (StringUtils.isBlank(sessionID)) 
		{
			logger.warn("memberLogout --> missing input attributes.");
			ServiceCommonOutputJson memberLogoutOutput = new ServiceCommonOutputJson();
			memberLogoutOutput.setService(new ServiceCommonOutput());
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			memberLogoutOutput.getService().setStatus(status);
			return gson.toJson(memberLogoutOutput);
		}

		try
		{
			input.setMrn8Digit(mrn8Digit);
			input.setSessionId(sessionID);
			logger.info("memberLogout -> inputJsonString : " + gson.toJson(input));
			output = callVVRestService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input));
		}
		catch (Exception e)
		{
			logger.error("memberLogout -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			output = callVVRestService(ServiceUtil.MEMBER_LOGOUT, gson.toJson(input));
		}
		logger.info("Exit memberLogout");
		return output;
	}
	
	/**
	 * @param meetingId
	 * @param sessionId
	 * @return
	 */
	public static String getProviderRunningLateDetails(final String meetingId, final String sessionId) {
		logger.info("Entered getProviderRunningLateDetails");

		final Gson gson = new Gson();
		String jsonOutput = null;
		MeetingRunningLateInput input = null;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(sessionId)) {
			logger.warn("getProviderRunningLateDetails -> missing input attributes");
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
			input.setClientId(WebUtil.clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.debug("getProviderRunningLateDetails -> inputJsonStr " + inputJsonStr);
			jsonOutput = callVVRestService(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS, inputJsonStr);
			logger.debug("getProviderRunningLateDetails -> jsonOutput " + jsonOutput);
		} catch (Exception e) {
			logger.error("getProviderRunningLateDetails -> Web Service API error ", e);
		}
		logger.info("Exiting getProviderRunningLateDetails");
		return jsonOutput;
	}
	
	/**
	 * @param meetingId
	 * @param meetingHash
	 * @param joinOrLeave
	 * @param sessionId
	 * @return
	 */
	public static String caregiverJoinLeaveMeeting(final String meetingId, final String meetingHash, final String joinOrLeave, final String sessionId) {
		logger.info("Entered caregiverJoinLeaveMeeting");

		final Gson gson = new Gson();
		String jsonOutput = null;
		JoinLeaveMeetingForMemberGuestInput input = null;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(meetingHash) || StringUtils.isBlank(joinOrLeave)
				|| StringUtils.isBlank(sessionId)) {
			logger.warn("caregiverJoinLeaveMeeting -> missing input attributes");
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
			input.setClientId(WebUtil.clientId);
			input.setSessionId(sessionId);

			final String inputJsonStr = gson.toJson(input);
			logger.info("caregiverJoinLeaveMeeting -> inputJsonStr " + inputJsonStr);
			jsonOutput = callVVRestService(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST, inputJsonStr);
			logger.info("caregiverJoinLeaveMeeting -> jsonOutput " + jsonOutput);
		} catch (Exception e) {
			logger.error("caregiverJoinLeaveMeeting -> Web Service API error ", e);
		}
		logger.info("Exiting caregiverJoinLeaveMeeting");
		return jsonOutput;
	}
	
	public static String updateEmailAction(String meetingId, String userType, String action, String sessionId) {
		logger.info("Entered updateEmailAction");
		final Gson gson = new Gson();
		String jsonOutput = null;
		UpdateEmailActionInput input = null;

		if (StringUtils.isBlank(meetingId) || StringUtils.isBlank(userType) || StringUtils.isBlank(sessionId)) {
			logger.warn("updateEmailAction -> missing input attributes");
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
				input.setAction(action);
				input.setClientId(WebUtil.clientId);
				input.setSessionId(sessionId);
				final String inputJsonStr = gson.toJson(input);
				logger.info("updateEmailAction -> inputJsonStr: " + inputJsonStr);
				jsonOutput = callVVRestService(ServiceUtil.UPDATE_EMAIL_ACTION, inputJsonStr);
				logger.info("updateEmailAction -> jsonOutput: " + jsonOutput);

			} catch (Exception e) {
				logger.error("updateEmailAction -> Web Service API error", e);
			}
		}
		logger.info("Exiting updateEmailAction");
		return jsonOutput;
	}
	
	public static String logVendorMeetingErrors(final long meetingId, final String userType, final String userId ,final String eventName, 
			final String errorDescription, final String sessionId) {
		logger.info("Entered logVendorMeetingErrors");
		final Gson gson = new Gson();
		String jsonOutput = null;
		VendorMeetingErrorInput input = null;

		if (meetingId <= 0 || StringUtils.isBlank(sessionId)) {
			logger.warn("logVendorMeetingErrors -> missing input attributes");
			final ServiceCommonOutputJson output = new ServiceCommonOutputJson();
			final ServiceCommonOutput service = new ServiceCommonOutput();
			service.setName(ServiceUtil.LOG_VENDOR_MEETING_ERRORS);
			output.setService(service);
			final Status status = new Status();
			status.setCode("300");
			status.setMessage("Missing input attributes.");
			output.getService().setStatus(status);
			jsonOutput = gson.toJson(output);
		} else {
			try {
				input = new VendorMeetingErrorInput();
				input.setMeetingId(meetingId);
				input.setUserType(userType);
				input.setUserId(userId);
				input.setEventName(eventName);
				input.setErrorDescription(errorDescription);
				input.setClientId(WebUtil.clientId);
				input.setSessionId(sessionId);

				final String inputJsonStr = gson.toJson(input);
				logger.info("logVendorMeetingErrors -> inputJsonStr: " + inputJsonStr);
				jsonOutput = callVVRestService(ServiceUtil.LOG_VENDOR_MEETING_ERRORS, inputJsonStr);
				logger.info("logVendorMeetingErrors -> jsonOutput: " + jsonOutput);

			} catch (Exception e) {
				logger.error("logVendorMeetingErrors -> Web Service API error", e);
			}
		}
		logger.info("Exiting logVendorMeetingErrors");
		return jsonOutput;
	}
}
