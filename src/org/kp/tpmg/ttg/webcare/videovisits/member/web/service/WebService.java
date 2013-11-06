package org.kp.tpmg.ttg.webcare.videovisits.member.web.service;

import java.rmi.RemoteException;
import java.util.Date;
import java.util.ResourceBundle;

import org.apache.axis2.AxisFault;
import org.apache.axis2.client.Options;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.log4j.Logger;
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
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MemberWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO;
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
	
	public static boolean initWebService()
	{
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
		return ret;
	}


	public static VerifyMemberResponseWrapper verifyMember(String lastName, String mrn8Digit, //left
							String birth_month, String birth_year, String birth_day,
							String sessionID) throws Exception 
	{
		VerifyMemberResponseWrapper resp = null; 

		VerifyMember query = new VerifyMember();

		try 
		{
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
		return resp;
	}
	

	 
	public static RetrieveMeetingResponseWrapper retrieveMeeting(String mrn8Digit,int pastMinutes,int futureMinutes,String sessionID) throws Exception 
	{
		RetrieveMeetingResponseWrapper toRet = null;
		RetrieveMeetingsForMember query = new RetrieveMeetingsForMember();
		try
		{
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

		return toRet;
	}
	
		
	public static StringResponseWrapper memberLogout(String mrn8Digit, String sessionID) throws Exception
	{
		StringResponseWrapper toRet = null; 
		
		MemberLogout query = new MemberLogout();
		try
		{
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
		return toRet;
	}
	
	public static StringResponseWrapper quitMeeting(long meetingId, String memberName, long careGiverId, String sessionID) throws Exception
	{
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
		
		return toRet;
		
	}

	public static StringResponseWrapper updateMemberMeetingStatusJoining(long meetingID, String mrn8Digit, String sessionID)
			throws Exception
	{
		StringResponseWrapper toRet = null; 
		
		UpdateMemberMeetingStatusJoining query = new UpdateMemberMeetingStatusJoining();
		try
		{
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
		return toRet;
	}

	public static StringResponseWrapper createMeetingSession(long meetingID, String mrn8Digit, String sessionID) throws Exception
	{
		CreateMeetingSession query = new CreateMeetingSession();
		try
		{
			query.setMrn8Digit(mrn8Digit);
			query.setSessionID(sessionID);
			query.setMeetingID(meetingID);
			
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
	public static StringResponseWrapper memberEndMeetingLogout(String mrn8Digit, long meetingID, String sessionID)
	throws Exception
	{
		StringResponseWrapper toRet = null; 
		
		MemberEndMeetingLogout query = new MemberEndMeetingLogout();
		try
		{
			query.setMeetingID(meetingID);
			query.setSessionID(sessionID);
			query.setMrn8Digit(mrn8Digit);
		
			MemberEndMeetingLogoutResponse response = stub.memberEndMeetingLogout(query);
			toRet = response.get_return();
		}
		catch (Exception e)
		{
			logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
			MemberEndMeetingLogoutResponse response = stub.memberEndMeetingLogout(query);
			toRet = response.get_return();
		}
		return toRet;
	}
	
	
	/**
	 * Simply test database round trip
	 * @return
	 */
	public static StringResponseWrapper testDbRoundTrip() throws Exception
	{
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
		return toRet;
	}

	public static RetrieveMeetingResponseWrapper retrieveMeetingForCaregiver(String meetingHash,//left
			int pastMinutes,int futureMinutes) 
				throws RemoteException {
		RetrieveMeetingResponseWrapper toRet = null;
		RetrieveMeetingForCaregiver query = new RetrieveMeetingForCaregiver();
		query.setMeetingHash(meetingHash);
		query.setPastMinutes(pastMinutes);
		query.setFutureMinutes(futureMinutes);
		RetrieveMeetingForCaregiverResponse response = stub.retrieveMeetingForCaregiver(query);
		toRet = response.get_return();
		return toRet;		
	}
	
	public static RetrieveMeetingResponseWrapper IsMeetingHashValid(String meetingHash//left
			) 
				throws RemoteException {
		RetrieveMeetingResponseWrapper toRet = null;
		IsMeetingHashValid query = new IsMeetingHashValid();
		query.setMeetingHash(meetingHash);
		
		IsMeetingHashValidResponse response = stub.isMeetingHashValid(query);
		toRet = response.get_return();
		return toRet;		
	}
	
	
	public static StringResponseWrapper verifyCaregiver(String meetingHash, String patientLastName) 
			throws RemoteException {
		VerifyCaregiver query = new VerifyCaregiver();
		query.setMeetingHash(meetingHash);
		query.setPatientLastName(patientLastName);
		VerifyCaregiverResponse response = stub.verifyCaregiver(query);
		return response.get_return();
	}
	
	public static StringResponseWrapper createCaregiverMeetingSession(String meetingHash, String patientLastName) 
			throws RemoteException {
		CreateCaregiverMeetingSession query = new CreateCaregiverMeetingSession();
		query.setMeetingHash(meetingHash);
		query.setPatientLastName(patientLastName);
		CreateCaregiverMeetingSessionResponse response = stub.createCaregiverMeetingSession(query);
		return response.get_return();
	}
	
	public static StringResponseWrapper endCaregiverMeetingSession(String meetingHash) 
			throws RemoteException {
		EndCaregiverMeetingSession query = new EndCaregiverMeetingSession();
		query.setMeetingHash(meetingHash);
		EndCaregiverMeetingSessionResponse response = stub.endCaregiverMeetingSession(query);
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
		
		StringResponseWrapper toRet = null; 
		
		UserPresentInMeeting query = new UserPresentInMeeting();
		
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
		
		return toRet;
		
		
	
	}
	
	public static StringResponseWrapper createMobileMeetingSession(long meetingId) throws Exception {
		StringResponseWrapper toRet = null; 
		
		try
		{
			org.kp.tpmg.videovisit.member.CreateMobileMeetingSession createMeeting = new org.kp.tpmg.videovisit.member.CreateMobileMeetingSession();
			createMeeting.setMeetingId(meetingId);
			toRet = stub.createMobileMeetingSession(createMeeting).get_return();
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
		
		CreateCaregiverMobileMeetingSession createMeeting = new CreateCaregiverMobileMeetingSession();
		createMeeting.setMeetingHash(meetingCode);
		createMeeting.setPatientLastName(patientName);
		toRet = stub.createCaregiverMobileMeetingSession(createMeeting).get_return();
		return toRet;
	}
	catch(Exception e)
	{
		logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
		return null;
	}
}
}

