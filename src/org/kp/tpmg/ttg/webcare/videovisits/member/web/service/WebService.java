package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import java.rmi.RemoteException;
import java.util.ResourceBundle;

import org.apache.axis2.AxisFault;
import org.apache.axis2.client.Options;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
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
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.RetrieveMeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.VerifyMemberResponseWrapper;
import org.kp.tpmg.webservice.client.videovisit.member.VideoVisitMemberServicesStub;


public class WebService{
	
	public static Logger logger = Logger.getLogger(WebService.class);
	public static final int MAX_RETRY = 2;
	public static int retry = 0;
	public static boolean status = false;
	public static VideoVisitMemberServicesStub stub;
	public static boolean simulation = true;
	
	//setup wizard related properties
	private static String setupWizardHostNuid;
	private static String setupWizardMemberMrn;
	private static String setupWizardMeetingType;
	private static String setupWizardUserName;
	
	public static boolean initWebService()
	{
		logger.info("Entered initWebService");
		long timeout = 8000l; // milliseconds default
		String serviceURL = "";
		boolean reuseHTTP = true;
		boolean chunked   = false;
		boolean ret 	= true;
		ConfigurationContext axisConfig = null;

		try
		{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			if (rbInfo != null)
			{
				timeout = Integer.parseInt(rbInfo.getString("WEBSERVICE_TIMEOUT"));
				serviceURL = rbInfo.getString("WEBSERVICE_URL");
				reuseHTTP = rbInfo.getString("WEBSERVICE_REUSE").equals("true")? true:false;
				chunked = rbInfo.getString("WEBSERVICE_CHUNKED").equals ("true")?true:false;
				simulation = rbInfo.getString ("WEBSERVICE_SIMULATION").equals ("true")?true:false;
				logger.info("configuration: serviceURL="+serviceURL+" simulation="+simulation);
				
				//setup wizard related values
				setupWizardHostNuid = rbInfo.getString("SETUP_WIZARD_HOST_NUID");
				setupWizardMemberMrn = rbInfo.getString("SETUP_WIZARD_MEMBER_MRN");
				setupWizardMeetingType = rbInfo.getString("SETUP_WIZARD_MEETING_TYPE");
				setupWizardUserName = rbInfo.getString("SETUP_WIZARD_USER_NAME");
				logger.info("configuration: setupWizardHostNuid="+setupWizardHostNuid+", setupWizardMemberMrn="+setupWizardMemberMrn+", setupWizardMeetingType="+setupWizardMeetingType+", setupWizardUserName="+setupWizardUserName);
			}
			
			if (simulation)
				return true;
			try
			{
				axisConfig = ConfigurationContextFactory.createDefaultConfigurationContext();
			}
			catch(AxisFault af)
			{
				af.printStackTrace();
				String message = "Axis failed to create axisConfig";  
				logger.info(message);
				ret = false;
				logger.error("System Error" + af.getMessage(),af);
				throw new RuntimeException(message, af);
			}
			
			stub =  new VideoVisitMemberServicesStub(axisConfig, serviceURL);
			Options options = stub._getServiceClient().getOptions();
			
			//this will fix the issue of open file issue.
			//options.setProperty(HTTPConstants.HTTP_PROTOCOL_VERSION, HTTPConstants.HEADER_PROTOCOL_10);
			// we need to create one http connection manager per thread to avoid close wait problems 
			// and we shut down this connection manager after all the invocations. 
			
			MultiThreadedHttpConnectionManager httpConnectionManager = new MultiThreadedHttpConnectionManager(); 
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			VerifyMemberResponse response = stub.verifyMember(query);
			resp = response.get_return();
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			RetrieveMeetingsForMemberResponse response = stub.retrieveMeetingsForMember(query);
			toRet = response.get_return();
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			MemberLogoutResponse response = stub.memberLogout(query);
			toRet = response.get_return();
		}
		logger.info("Exit initWebService");
		return toRet;
	}
	
	public static StringResponseWrapper quitMeeting(long meetingId, String memberName, long careGiverId, String sessionID) throws Exception
	{
		logger.info("Entered quitMeeting");
		StringResponseWrapper toRet = null; 
		
		
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			UpdateMemberMeetingStatusJoiningResponse response = stub.updateMemberMeetingStatusJoining(query);
			toRet = response.get_return();
		}
		logger.info("Entered updateMemberMeetingStatusJoining");
		return toRet;
	}

	public static StringResponseWrapper createMeetingSession(long meetingID, String mrn8Digit, String sessionID) throws Exception
	{
		logger.info("Entered createMeetingSession");
		CreateMeetingSession query = new CreateMeetingSession();
		try
		{
			if(meetingID < 0 || mrn8Digit == null || sessionID == null){
				throw new Exception("meetingID or mrn or SessionID is null");
				}
			query.setMrn8Digit(mrn8Digit);
			query.setSessionID(sessionID);
			query.setMeetingID(meetingID);
			logger.info("Exit createMeetingSession");
			return stub.createMeetingSession(query).get_return();
			
		}
		catch (Exception e)
		{
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			return stub.createMeetingSession(query).get_return();
			
		}
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			MemberEndMeetingLogoutResponse response = stub.memberEndMeetingLogout(query);
			toRet = response.get_return();
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
		
			TestDbRoundTripResponse response = stub.testDbRoundTrip();
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			TestDbRoundTripResponse response = stub.testDbRoundTrip();
			toRet = response.get_return();
		}
		logger.info("Exit testDbRoundTrip");
		return toRet;
	}

	public static RetrieveMeetingResponseWrapper retrieveMeetingForCaregiver(String meetingHash,//left
			int pastMinutes,int futureMinutes) 
				throws RemoteException {
		logger.info("Entered retrieveMeetingForCaregiver");
		
		RetrieveMeetingResponseWrapper toRet = null;
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
		logger.info("Exit retrieveMeetingForCaregiver");
		return toRet;		
	}
	
	public static RetrieveMeetingResponseWrapper IsMeetingHashValid(String meetingHash//left
			) 
				throws RemoteException {
		logger.info("Entered IsMeetingHashValid");
		RetrieveMeetingResponseWrapper toRet = null;
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
		logger.info("Exit IsMeetingHashValid");
		return toRet;		
	}
	
	
	public static StringResponseWrapper verifyCaregiver(String meetingHash, String patientLastName) 
			throws RemoteException {
		logger.info("Entered verifyCaregiver");
		if(meetingHash == null || patientLastName == null){
			StringResponseWrapper toRet = new StringResponseWrapper();
			toRet.setSuccess(false);
			toRet.setErrorMessage("meetingHash or patientLastName is null");
			return toRet;
		}
		VerifyCaregiver query = new VerifyCaregiver();
		query.setMeetingHash(meetingHash);
		query.setPatientLastName(patientLastName);
		VerifyCaregiverResponse response = stub.verifyCaregiver(query);
		logger.info("Exit verifyCaregiver");
		return response.get_return();
	}
	
	public static StringResponseWrapper createCaregiverMeetingSession(String meetingHash, String patientLastName) 
			throws RemoteException {
		logger.info("Entered createCaregiverMeetingSession");
		if(meetingHash == null || patientLastName == null){
			StringResponseWrapper toRet = new StringResponseWrapper();
			toRet.setSuccess(false);
			toRet.setErrorMessage("meetingHash or patientLastName is null");
			return toRet;
		}
		
		CreateCaregiverMeetingSession query = new CreateCaregiverMeetingSession();
		query.setMeetingHash(meetingHash);
		query.setPatientLastName(patientLastName);
		CreateCaregiverMeetingSessionResponse response = stub.createCaregiverMeetingSession(query);
		logger.info("Exit createCaregiverMeetingSession"); 
		return response.get_return();
	}
	
	public static StringResponseWrapper endCaregiverMeetingSession(String meetingHash, String megaMeetingNameDisplayName, boolean isParticipantDel) 
			throws RemoteException {
		logger.info("entered WebService.endCaregiverMeetingSession - received input attributes as [meetingHash=" + meetingHash + ", megaMeetingNameDisplayName=" + megaMeetingNameDisplayName + ", isParticipantDel=" + isParticipantDel + "]");
		if(meetingHash == null){
			StringResponseWrapper toRet = new StringResponseWrapper();
			toRet.setSuccess(false);
			toRet.setErrorMessage("meetingHash is null");
			return toRet;
		}
		EndCaregiverMeetingSession query = new EndCaregiverMeetingSession();
		query.setMeetingHash(meetingHash);
		query.setMegaMeetingDisplayName(megaMeetingNameDisplayName);
		query.setIsDelMeetingFromVidyo(isParticipantDel);
		
		EndCaregiverMeetingSessionResponse response = stub.endCaregiverMeetingSession(query);
		logger.info("exiting WebService.endCaregiverMeetingSession");
		return response.get_return();		
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			GetMeetingByMeetingIDResponse response = stub.getMeetingByMeetingID(query);
			toRet = response.get_return();
		}
		logger.info("Exit getMeetingByMeetingID");
		return toRet;
		
		
	
	}
	
	public static StringResponseWrapper createMobileMeetingSession(long meetingId) throws Exception {
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
			org.kp.tpmg.videovisit.member.CreateMobileMeetingSession createMeeting = new org.kp.tpmg.videovisit.member.CreateMobileMeetingSession();
			createMeeting.setMeetingId(meetingId);
			toRet = stub.createMobileMeetingSession(createMeeting).get_return();
			logger.info("Exit createMobileMeetingSession");
			return toRet;
		}
		catch(Exception e)
		{
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			return null;
		}
	}

	public static StringResponseWrapper createCareGiverMobileSession(String patientName, String meetingCode) throws Exception {
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
			toRet = stub.createCaregiverMobileMeetingSession(createMeeting).get_return();
			logger.info("Exit createCareGiverMobileSession");
			return toRet;
		}
		catch(Exception e)
		{
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			return null;
		}
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			GetVendorPluginDataResponse response = stub.getVendorPluginData(query);
			toRet = response.get_return();
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
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			CreateInstantVendorMeetingResponse response = stub.createInstantVendorMeeting(query);
			toRet = response.get_return();
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
			logger.error("WebService.terminateInstantMeeting -> Web Service API error:" + e.getMessage() + " Retrying...");
			TerminateInstantMeetingResponse response = stub.terminateInstantMeeting(query);
			toRet = response.get_return();	
		}
		logger.info("Exiting WebService.terminateInstantMeeting");
		return toRet;
	}
}

