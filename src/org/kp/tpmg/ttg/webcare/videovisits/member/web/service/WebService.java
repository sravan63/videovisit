package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import java.io.File;
import java.io.FileInputStream;
import java.rmi.RemoteException;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;

import org.apache.axis2.client.Options;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.databinding.types.soapencoding.xsd.Base64Binary;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.neethi.Policy;
import org.apache.rampart.RampartMessageData;
import org.kp.tpmg.common.security.Crypto;
import org.kp.tpmg.common.security.ServiceSecurityLoader;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.GsonUtil;
import org.kp.tpmg.videovisit.member.CreateCaregiverMeetingSession;
import org.kp.tpmg.videovisit.member.CreateCaregiverMeetingSessionResponse;
import org.kp.tpmg.videovisit.member.CreateCaregiverMobileMeetingSession;
import org.kp.tpmg.videovisit.member.CreateMeetingSession;
import org.kp.tpmg.videovisit.member.EndCaregiverMeetingSession;
import org.kp.tpmg.videovisit.member.EndCaregiverMeetingSessionResponse;
import org.kp.tpmg.videovisit.member.GetMeetingByMeetingID;
import org.kp.tpmg.videovisit.member.GetMeetingByMeetingIDResponse;
import org.kp.tpmg.videovisit.member.IsMeetingHashValid;
import org.kp.tpmg.videovisit.member.IsMeetingHashValidResponse;
import org.kp.tpmg.videovisit.member.KickUserFromMeeting;
import org.kp.tpmg.videovisit.member.KickUserFromMeetingResponse;
import org.kp.tpmg.videovisit.member.MemberEndMeetingLogout;
import org.kp.tpmg.videovisit.member.MemberEndMeetingLogoutResponse;
import org.kp.tpmg.videovisit.member.MemberLogout;
import org.kp.tpmg.videovisit.member.MemberLogoutResponse;
import org.kp.tpmg.videovisit.member.RetrieveMeetingForCaregiver;
import org.kp.tpmg.videovisit.member.RetrieveMeetingForCaregiverResponse;
import org.kp.tpmg.videovisit.member.RetrieveMeetingsForMember;
import org.kp.tpmg.videovisit.member.RetrieveMeetingsForMemberResponse;
import org.kp.tpmg.videovisit.member.TestDbRoundTrip;
import org.kp.tpmg.videovisit.member.TestDbRoundTripResponse;
import org.kp.tpmg.videovisit.member.UpdateMemberMeetingStatusJoining;
import org.kp.tpmg.videovisit.member.UpdateMemberMeetingStatusJoiningResponse;
import org.kp.tpmg.videovisit.member.UserPresentInMeeting;
import org.kp.tpmg.videovisit.member.UserPresentInMeetingResponse;
import org.kp.tpmg.videovisit.member.VerifyCaregiver;
import org.kp.tpmg.videovisit.member.VerifyCaregiverResponse;
import org.kp.tpmg.videovisit.member.VerifyMember;
import org.kp.tpmg.videovisit.member.VerifyMemberResponse;
import org.kp.tpmg.videovisit.member.GetVendorPluginData;
import org.kp.tpmg.videovisit.member.GetVendorPluginDataResponse;
import org.kp.tpmg.videovisit.member.CreateInstantVendorMeeting;
import org.kp.tpmg.videovisit.member.CreateInstantVendorMeetingResponse;
import org.kp.tpmg.videovisit.member.TerminateInstantMeeting;
import org.kp.tpmg.videovisit.member.TerminateInstantMeetingResponse;
import org.kp.tpmg.videovisit.member.FileUploadResponse;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.RetrieveMeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.VerifyMemberResponseWrapper;
import org.kp.tpmg.webservice.client.videovisit.member.VideoVisitMemberServicesStub;

import com.google.gson.JsonObject;


public class WebService{
	
	public static Logger logger = Logger.getLogger(WebService.class);
	public static final int MAX_RETRY = 2;
	public static int retry = 0;
	public static boolean status = false;
	public static VideoVisitMemberServicesStub stub;
	public static ConfigurationContext axisConfig = null;
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
				
				timeout = Integer.parseInt(rbInfo.getString("WEBSERVICE_TIMEOUT"));
				reuseHTTP = rbInfo.getString("WEBSERVICE_REUSE").equals("true")? true:false;
				chunked = rbInfo.getString("WEBSERVICE_CHUNKED").equals ("true")?true:false;
				simulation = rbInfo.getString ("WEBSERVICE_SIMULATION").equals ("true")?true:false;
				logger.debug("WebService.initWebService -> configuration: serviceURL="+serviceURL+" ,simulation="+simulation);
				modulePath = rbInfo.getString("MODULE_PATH");
				policyPath = rbInfo.getString("POLICY_PATH");
				Crypto crypto = new Crypto();
				serviceSecurityUsername = rbInfo.getString("SERVICE_SECURITY_USERNAME");
				serviceSecurityPassword = crypto.read(rbInfo.getString("SERVICE_SECURITY_PASSWORD"));
				logger.debug("webservice.initWebService -> SecurityUsername:" + serviceSecurityUsername + ", SecurityPassword:" + serviceSecurityPassword);
				
				//setup wizard related values
				setupWizardHostNuid = rbInfo.getString("SETUP_WIZARD_HOST_NUID");
				setupWizardMemberMrn = rbInfo.getString("SETUP_WIZARD_MEMBER_MRN");
				setupWizardMeetingType = rbInfo.getString("SETUP_WIZARD_MEETING_TYPE");
				setupWizardUserName = rbInfo.getString("SETUP_WIZARD_USER_NAME");
				logger.debug("configuration: setupWizardHostNuid="+setupWizardHostNuid+", setupWizardMemberMrn="+setupWizardMemberMrn+", setupWizardMeetingType="+setupWizardMeetingType+", setupWizardUserName="+setupWizardUserName);
			}
			
			if (simulation)
				return true;
			
			String policyFilePath = request.getSession().getServletContext().getRealPath(policyPath);
			logger.debug("WebService.initWebService policyFilePath: " + policyFilePath);
			String moduleFilePath = request.getSession().getServletContext().getRealPath(modulePath);
			logger.debug("WebService.initWebService modulePath: " + moduleFilePath);
			
			logger.debug("webservice.initWebService -> System property trustStore: " + System.getProperty("javax.net.ssl.trustStore"));
			logger.debug("webservice.initWebService -> System property trustStorePassword: " + System.getProperty("javax.net.ssl.trustStorePassword"));
            
			//create axis2 configuration context if not created already.
			axisConfig = ServiceSecurityLoader.getConfigContext(moduleFilePath);			
			
			stub =  new VideoVisitMemberServicesStub(axisConfig, serviceURL);			
			
			Options options = stub._getServiceClient().getOptions();
			
			options.setUserName(serviceSecurityUsername);
            options.setPassword(serviceSecurityPassword);           
          
            //load the policy    	
            Policy utPolicy = ServiceSecurityLoader.getPolicy(policyFilePath);
    	   
    	    //logger.debug("webservice.createStub -> after loadPolicy: : " + utPolicy);
    	    //set rampart policy in service client options.
            options.setProperty(RampartMessageData.KEY_RAMPART_POLICY, utPolicy);
            stub._getServiceClient().engageModule("addressing");
            stub._getServiceClient().engageModule("rampart");           
			
			//this will fix the issue of open file issue.
			//options.setProperty(HTTPConstants.HTTP_PROTOCOL_VERSION, HTTPConstants.HEADER_PROTOCOL_10);
			// we need to create one http connection manager per thread to avoid close wait problems 
			// and we shut down this connection manager after all the invocations. 
			
			MultiThreadedHttpConnectionManager httpConnectionManager = new MultiThreadedHttpConnectionManager(); 
			//Not sure if we need the below 3 lines
			//HttpConnectionManagerParams params = new HttpConnectionManagerParams(); 
            //params.setDefaultMaxConnectionsPerHost(100); 
            //httpConnectionManager.setParams(params);
			HttpClient httpClient = new HttpClient(httpConnectionManager); 
			options.setProperty(HTTPConstants.REUSE_HTTP_CLIENT, reuseHTTP);
			options.setProperty(HTTPConstants.CACHED_HTTP_CLIENT, httpClient); 
			// switch off chuncking this some times gives problems with sending messages through proxy 
			options.setProperty(HTTPConstants.CHUNKED, chunked);
			options.setTimeOutInMilliSeconds(timeout);
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
			String message = "Exception constructor failed to create axisConfig";  
			logger.error("System Error" + e.getMessage(),e);
			ret = false;
			throw new RuntimeException(message, e);
		}
		logger.info("Exit initWebService");
		return ret;
	}
	
	protected static void closeConnectionManager(VideoVisitMemberServicesStub stub)
	{
		try
		{
			if(stub != null)
			{
				if(stub._getServiceClient() != null)
				{
					Options options = stub._getServiceClient().getOptions();
					HttpClient client = (HttpClient)options.getProperty(HTTPConstants.CACHED_HTTP_CLIENT);
					if(client != null && client.getHttpConnectionManager() != null)
					{
						client.getHttpConnectionManager().closeIdleConnections(0);
					}
					stub._getServiceClient().cleanupTransport();
					stub._getServiceClient().cleanup();
				}
				stub.cleanup();
			}
		}
		catch(Throwable th)
		{
			logger.error("closeConnectionManager -> failed to close stub.. this is not critical", th);
		}
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


	public static VerifyMemberResponseWrapper verifyMember(String lastName, String mrn8Digit, //left
							String birth_month, String birth_year, String birth_day,
							String sessionID) throws Exception 
	{
		logger.info("Entered verifyMember");
		VerifyMemberResponseWrapper resp = null; 
		
		VerifyMember query = new VerifyMember();
		String Dob = birth_year + "-" + birth_month + "-" + birth_day;
		try 
		{
			if (mrn8Digit == null || sessionID == null || lastName == null)
			{
				throw new Exception("One of required fields are null");
			}
			if (!WebUtil.isDOBFormat(Dob))
			{
				throw new Exception("DOB has to be in the format of YYYY-MM-DD but is [" + Dob + "]");
			}
			query.setLastName(lastName);
			query.setMrn8Digit(mrn8Digit);
			query.setDob(birth_year + "-" + birth_month + "-" + birth_day);				
			query.setSessionID(sessionID);					
			
			VerifyMemberResponse response = stub.verifyMember(query);
			resp = response.get_return();
		}
		catch (Exception e) 
		{
			logger.error("verifyMember -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			VerifyMemberResponse response = stub.verifyMember(query);
			resp = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit initWebService");
		return resp;
	}
	

	 
	public static RetrieveMeetingResponseWrapper retrieveMeeting(String mrn8Digit,int pastMinutes,int futureMinutes,String sessionID) throws Exception 
	{
		logger.info("Entered retrieveMeeting");
		RetrieveMeetingResponseWrapper toRet = null;
		RetrieveMeetingsForMember query = new RetrieveMeetingsForMember();
		try
		{
			if(mrn8Digit == null || sessionID == null)
			{
				throw new Exception("mrn8Digit and sessionID are required ");
				
			}
			query.setMrn8Digit(mrn8Digit);
			query.setPastMinutes(pastMinutes);
			query.setFutureMinutes(futureMinutes);
			query.setSessionID(sessionID);
			
			RetrieveMeetingsForMemberResponse response = stub.retrieveMeetingsForMember(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("retrieveMeeting -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			RetrieveMeetingsForMemberResponse response = stub.retrieveMeetingsForMember(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit initWebService");
		return toRet;
	}
	
		
	public static StringResponseWrapper memberLogout(String mrn8Digit, String sessionID) throws Exception
	{
		logger.info("Entered memberLogout");
		StringResponseWrapper toRet = null; 
		
		MemberLogout query = new MemberLogout();
		try
		{
			if(mrn8Digit == null || sessionID == null)
			{
				throw new Exception("mrn8Digit and sessionID are required ");
				
			}
			query.setMrn8Digit(mrn8Digit);
			query.setSessionID(sessionID);
		
			MemberLogoutResponse response = stub.memberLogout(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("memberLogout -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			MemberLogoutResponse response = stub.memberLogout(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit initWebService");
		return toRet;
	}
	
	public static StringResponseWrapper quitMeeting(long meetingId, String memberName, long careGiverId, String sessionID) throws Exception
	{
		logger.info("Entered quitMeeting");
		StringResponseWrapper toRet = null; 
		try{		
			KickUserFromMeeting query = new KickUserFromMeeting();
			query.setMeetingId(meetingId);
			query.setMemberName(memberName);
			query.setCaregiverId(careGiverId);
			query.setSessionId(sessionID);
			
			if(memberName == null && careGiverId <= 0){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("No Caregiver or Participant");
				return toRet;
			}
			
			KickUserFromMeetingResponse response = stub.kickUserFromMeeting(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("quitMeeting: Web Service API error:" + e.getMessage());
			throw new Exception("quitMeeting: Web Service API error", e.getCause());
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Quit initWebService");
		return toRet;
		
	}

	public static StringResponseWrapper updateMemberMeetingStatusJoining(long meetingID, String mrn8Digit, String sessionID)
			throws Exception
	{
		logger.info("Entered updateMemberMeetingStatusJoining");
		StringResponseWrapper toRet = null; 
		
		UpdateMemberMeetingStatusJoining query = new UpdateMemberMeetingStatusJoining();
		try
		{
			if(meetingID < 0 || mrn8Digit == null || sessionID == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingID or mrn or SessionID is null");
				return toRet;
			}
			query.setMrn8Digit(mrn8Digit);
			query.setSessionID(sessionID);
			query.setMeetingID(meetingID);
			
			UpdateMemberMeetingStatusJoiningResponse response = stub.updateMemberMeetingStatusJoining(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("updateMemberMeetingStatusJoining -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			UpdateMemberMeetingStatusJoiningResponse response = stub.updateMemberMeetingStatusJoining(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Entered updateMemberMeetingStatusJoining");
		return toRet;
	}

	public static StringResponseWrapper createMeetingSession(long meetingID, String mrn8Digit, String sessionID) throws Exception
	{
		logger.info("Entered createMeetingSession");
		StringResponseWrapper toRet = null; 
		CreateMeetingSession query = new CreateMeetingSession();
		try
		{
			if(meetingID < 0 || mrn8Digit == null || sessionID == null){
				throw new Exception("meetingID or mrn or SessionID is null");
				}
			query.setMrn8Digit(mrn8Digit);
			query.setSessionID(sessionID);
			query.setMeetingID(meetingID);			
			toRet = stub.createMeetingSession(query).get_return();			
		}
		catch (Exception e)
		{
			logger.error("createMeetingSession -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			toRet = stub.createMeetingSession(query).get_return();
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exiting createMeetingSession");
		return toRet;
	}
	
	
	
	/**
	 * Member end the meeting and log out.
	 * @param mrn8Digit
	 * @param meetingID
	 * @param sessionID
	 * @return
	 */
	public static StringResponseWrapper memberEndMeetingLogout(String mrn8Digit, long meetingID, String sessionID, String memberName, boolean notifyVideoForMeetingQuit)
	throws Exception
	{
		logger.info("Entered WebService.memberEndMeetingLogout - received input attributes as [mrn8Digit=" + mrn8Digit + ", meetingID=" + meetingID + ", sessionID=" + sessionID + ", memberName=" + memberName + ", notifyVideoForMeetingQuit=" + notifyVideoForMeetingQuit + "]");
		StringResponseWrapper toRet = null; 
		
		MemberEndMeetingLogout query = new MemberEndMeetingLogout();
		try
		{
			if(meetingID < 0 || mrn8Digit == null || sessionID == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingID or mrn or SessionID is null");
				return toRet;
			}
			query.setMeetingID(meetingID);
			query.setSessionID(sessionID);
			query.setMrn8Digit(mrn8Digit);
			query.setMemberName(memberName);
			query.setNotifyVideoForMeetingQuit(notifyVideoForMeetingQuit);
		
			MemberEndMeetingLogoutResponse response = stub.memberEndMeetingLogout(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("memberEndMeetingLogout -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			MemberEndMeetingLogoutResponse response = stub.memberEndMeetingLogout(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit memberEndMeetingLogout");
		return toRet;
	}
	
	
	/**
	 * Simply test database round trip
	 * @return
	 */
	public static StringResponseWrapper testDbRoundTrip() throws Exception
	{
		logger.info("Entered testDbRoundTrip");
		StringResponseWrapper toRet = null; 
		
		try
		{
		
			TestDbRoundTripResponse response = stub.testDbRoundTrip(new TestDbRoundTrip());
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("testDbRoundTrip -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			TestDbRoundTripResponse response = stub.testDbRoundTrip(new TestDbRoundTrip());
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit testDbRoundTrip");
		return toRet;
	}

	public static RetrieveMeetingResponseWrapper retrieveMeetingForCaregiver(String meetingHash,//left
			int pastMinutes,int futureMinutes) 
				throws RemoteException {
		logger.info("Entered retrieveMeetingForCaregiver");		
		RetrieveMeetingResponseWrapper toRet = null;
		try{
			if(meetingHash == null){
				toRet = new RetrieveMeetingResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingHash is null");
				return toRet;
			}
			RetrieveMeetingForCaregiver query = new RetrieveMeetingForCaregiver();
			query.setMeetingHash(meetingHash);
			query.setPastMinutes(pastMinutes);
			query.setFutureMinutes(futureMinutes);
			RetrieveMeetingForCaregiverResponse response = stub.retrieveMeetingForCaregiver(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("retrieveMeetingForCaregiver: Web Service API error:" + e.getMessage(), e);
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit retrieveMeetingForCaregiver");
		return toRet;		
	}
	
	public static RetrieveMeetingResponseWrapper IsMeetingHashValid(String meetingHash//left
			) 
				throws RemoteException {
		logger.info("Entered IsMeetingHashValid");
		RetrieveMeetingResponseWrapper toRet = null;		
		try{
			if(meetingHash == null){
				toRet = new RetrieveMeetingResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingHash is null");
				return toRet;
			}
			IsMeetingHashValid query = new IsMeetingHashValid();
			query.setMeetingHash(meetingHash);
			
			IsMeetingHashValidResponse response = stub.isMeetingHashValid(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("IsMeetingHashValid: Web Service API error:" + e.getMessage(), e);		
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit IsMeetingHashValid");
		return toRet;		
	}
	
	
	public static StringResponseWrapper verifyCaregiver(String meetingHash, String patientLastName) 
			throws Exception {
		logger.info("Entered verifyCaregiver");
		StringResponseWrapper toRet = null; 
		try{
			if(meetingHash == null || patientLastName == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingHash or patientLastName is null");
				return toRet;
			}
			VerifyCaregiver query = new VerifyCaregiver();
			query.setMeetingHash(meetingHash);
			query.setPatientLastName(patientLastName);
			VerifyCaregiverResponse response = stub.verifyCaregiver(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("verifyCaregiver: Web Service API error:" + e.getMessage());
			throw new Exception("verifyCaregiver: Web Service API error", e.getCause());
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit verifyCaregiver");
		return toRet;
	}
	
	public static StringResponseWrapper createCaregiverMeetingSession(String meetingHash, String patientLastName,boolean isMobileFlow) 
			throws Exception {
		logger.info("Entered createCaregiverMeetingSession" + "  "+  meetingHash + " "+ patientLastName +" " + isMobileFlow );
		StringResponseWrapper toRet = null; 
		try{
			if(meetingHash == null || patientLastName == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingHash or patientLastName is null");
				return toRet;
			}
			
			CreateCaregiverMeetingSession query = new CreateCaregiverMeetingSession();
			query.setMeetingHash(meetingHash);
			query.setPatientLastName(patientLastName);
			query.setIsMobileFlow(isMobileFlow);
			CreateCaregiverMeetingSessionResponse response = stub.createCaregiverMeetingSession(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("createCaregiverMeetingSession: Web Service API error:" + e.getMessage());
			throw new Exception("createCaregiverMeetingSession: Web Service API error", e.getCause());
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit createCaregiverMeetingSession"); 
		return toRet;
	}
	
	public static StringResponseWrapper endCaregiverMeetingSession(String meetingHash, String megaMeetingNameDisplayName, boolean isParticipantDel) 
			throws Exception {
		logger.info("entered WebService.endCaregiverMeetingSession - received input attributes as [meetingHash=" + meetingHash + ", megaMeetingNameDisplayName=" + megaMeetingNameDisplayName + ", isParticipantDel=" + isParticipantDel + "]");
		StringResponseWrapper toRet = null; 
		try{
			if(meetingHash == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingHash is null");
				return toRet;
			}
			EndCaregiverMeetingSession query = new EndCaregiverMeetingSession();
			query.setMeetingHash(meetingHash);
			query.setMegaMeetingDisplayName(megaMeetingNameDisplayName);
			query.setIsDelMeetingFromVidyo(isParticipantDel);
			
			EndCaregiverMeetingSessionResponse response = stub.endCaregiverMeetingSession(query);
			logger.info("WebService.endCaregiverMeetingSession -> toRet=" + toRet);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("endCaregiverMeetingSession: Web Service API error:" + e.getMessage());
			throw new Exception("WebService:endCaregiverMeetingSession: Web Service API error", e.getCause());
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("exiting WebService.endCaregiverMeetingSession");
		return toRet;		
	}
	
	
	/**
	 * This method is used to determine if the user is present in a active mega meeting.
	 *Based on this condition, the user will be prevented from logging into the meeting again
	 * @param meetingId
	 * @param megaMeetingDisplayName
	 * @return
	 * @throws Exception
	 */
	public static StringResponseWrapper userPresentInMeeting(long meetingId,
			String megaMeetingDisplayName) throws Exception
	{
		logger.info("Entered userPresentInMeeting");
		StringResponseWrapper toRet = null; 
		
		UserPresentInMeeting query = new UserPresentInMeeting();
		if(meetingId <=0 || megaMeetingDisplayName == null){
			toRet = new StringResponseWrapper();
			toRet.setSuccess(false);
			toRet.setErrorMessage("meetingId or megaMeetingDisplayName is null");
			return toRet;
		}
		try
		{
			logger.info("Webservice:userPresentInMeeting: query="+query);
			query.setMeetingId (meetingId);
			query.setMegaMeetingDisplayName(megaMeetingDisplayName);
			
			UserPresentInMeetingResponse response = stub.userPresentInMeeting(query);
			
			
			logger.info("toRet=" + toRet);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			logger.error("WebService:userPresentInMeeting: Web Service API error:" + e.getMessage());
			throw new Exception("WebService:userPresentInMeeting: Web Service API error", e.getCause());
			
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit userPresentInMeeting");
		return toRet;

	}
	
	
	/**
	 * Get the meeting by meetingId
	 * @param meetingID
	 * @param sessionID
	 * @return
	 * @throws Exception
	 */
	public static MeetingResponseWrapper getMeetingByMeetingID(long meetingID,
			String sessionID) throws Exception {
		MeetingResponseWrapper toRet = null; 
		
		logger.info("Entered getMeetingByMeetingID");	
		GetMeetingByMeetingID query = new GetMeetingByMeetingID();
		try
		{
			query.setSessionID(sessionID);
			query.setMeetingID (meetingID);
			
			GetMeetingByMeetingIDResponse response = stub.getMeetingByMeetingID(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("getMeetingByMeetingID -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			GetMeetingByMeetingIDResponse response = stub.getMeetingByMeetingID(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit getMeetingByMeetingID");
		return toRet;
		
		
	
	}
	
	public static StringResponseWrapper createMobileMeetingSession(long meetingId, String deviceType, String deviceOS, String deviceOSversion) throws Exception {
		StringResponseWrapper toRet = null; 
		logger.info("Entered createMobileMeetingSession");
		try
		{
			if(meetingId <=0){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingId is null");
				return toRet;
			}
			org.kp.tpmg.videovisit.member.CreateMobileMeetingSession meeting = new org.kp.tpmg.videovisit.member.CreateMobileMeetingSession();
			meeting.setMeetingId(meetingId);
			meeting.setDeviceOS(deviceOS);
			meeting.setDeviceOSversion(deviceOSversion);
			meeting.setDeviceType(deviceType);
			toRet = stub.createMobileMeetingSession(meeting).get_return();			
		}
		catch(Exception e)
		{
			logger.error("createMobileMeetingSession -> Web Service API error:" + e.getMessage(), e);
			toRet = null;
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit createMobileMeetingSession");
		return toRet;
	}

	public static StringResponseWrapper createCareGiverMobileSession(String patientName, String meetingCode,String  deviceType,String deviceOs, String deviceOsVersion) throws Exception {
	StringResponseWrapper toRet = null; 
	
		try
		{
			logger.info("Entered createCareGiverMobileSession");
			if(meetingCode == null || patientName == null){
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("meetingCode or patientName is null");
				return toRet;
			}
			CreateCaregiverMobileMeetingSession createMeeting = new CreateCaregiverMobileMeetingSession();
			createMeeting.setMeetingHash(meetingCode);
			createMeeting.setPatientLastName(patientName);
			createMeeting.setDeviceOs(deviceOs);
			createMeeting.setDeviceOsVersion(deviceOsVersion);
			createMeeting.setDeviceType(deviceType);
			
			toRet = stub.createCaregiverMobileMeetingSession(createMeeting).get_return();			
		}
		catch(Exception e)
		{
			logger.error("createCareGiverMobileSession -> Web Service API error:" + e.getMessage(), e);
			toRet = null;
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit createCareGiverMobileSession");
		return toRet;
	}
	
	/**
	 * This method is to get Vendor Plugin details
	 * 	 
	 * @return StringResponseWrapper
	 * @throws Exception 
	 */
	public static StringResponseWrapper getVendorPluginData(String sessionID) throws Exception {
		StringResponseWrapper toRet = null; 
		
		logger.info("Entered getVendorPluginData");
		GetVendorPluginData query = new GetVendorPluginData();
		try
		{
			if ( sessionID == null)
			{
				toRet = new StringResponseWrapper();
				toRet.setSuccess(false);
				toRet.setErrorMessage("sessionID is null");
				return toRet;
			}
			query.setSessionID(sessionID);
			
			GetVendorPluginDataResponse response = stub.getVendorPluginData(query);
			toRet = response.get_return();
			
		}
		catch (Exception e)
		{
			logger.error("getVendorPluginData -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			GetVendorPluginDataResponse response = stub.getVendorPluginData(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exit getVendorPluginData");
		return toRet;

	}
	
	/**
	 * This method creates instant vendor meeting and returns meeting details
	 * 	 
	 * @return StringResponseWrapper
	 * @throws Exception 
	 */
	public static StringResponseWrapper createInstantVendorMeeting(String hostNuid, String[] participantNuid, String memberMrn, String meetingType, String sessionId) throws Exception {
		logger.info("Entered WebService.createInstantVendorMeeting -> received input attributes as [hostNuid=" + hostNuid + ", participantNuid=" + participantNuid + ", memberMrn=" + memberMrn + ", meetingType=" + meetingType + ", sessionId=" + sessionId + "]");
		StringResponseWrapper toRet = null; 
		
		CreateInstantVendorMeeting query = new CreateInstantVendorMeeting();
		try
		{
			query.setHostNuid(hostNuid);
			query.setParticipantNuid(participantNuid);
			query.setMemberMrn(memberMrn);
			query.setMeetingType(meetingType);
			query.setSessionId(sessionId);
	
			CreateInstantVendorMeetingResponse response = stub.createInstantVendorMeeting(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("createInstantVendorMeeting -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			CreateInstantVendorMeetingResponse response = stub.createInstantVendorMeeting(query);
			toRet = response.get_return();
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exiting WebService.createInstantVendorMeeting");
		return toRet;
	}
	
	public static StringResponseWrapper terminateInstantMeeting(long meetingId, String vendorConfId, String updaterNUID, String sessionId) throws Exception
	{
		logger.info("Entered WebService.terminateInstantMeeting received input attributes as [meetingId=" + meetingId + ", vendorConfId=" + vendorConfId + ", updaterNUID=" + updaterNUID + ", sessionId=" + sessionId + "]");
		StringResponseWrapper toRet = null; 
				
		TerminateInstantMeeting query = new TerminateInstantMeeting();

		try
		{
			query.setSessionId(sessionId);
			query.setMeetingId (meetingId);
			query.setUpdaterNUID (updaterNUID);
			query.setVendorConfId(vendorConfId);
			TerminateInstantMeetingResponse response = stub.terminateInstantMeeting(query);

			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("WebService.terminateInstantMeeting -> Web Service API error:" + e.getMessage() + " Retrying...", e);
			TerminateInstantMeetingResponse response = stub.terminateInstantMeeting(query);
			toRet = response.get_return();	
		}
		finally
		{
			closeConnectionManager(stub);
		}
		logger.info("Exiting WebService.terminateInstantMeeting");
		return toRet;
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
	public static String fileUpload(String meetingId, String userId, String deviceType, String deviceOS, String deviceOsVersion, String callingAppName, String fileName, Base64Binary binaryData, long fileDatetime, String sessionId) throws Exception
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
    }
}

