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
import org.kp.tpmg.videovisit.member.CreateMegameetingSession;
import org.kp.tpmg.videovisit.member.CreateMegameetingSessionResponse;
import org.kp.tpmg.videovisit.member.EndCaregiverMeetingSession;
import org.kp.tpmg.videovisit.member.EndCaregiverMeetingSessionResponse;
import org.kp.tpmg.videovisit.member.IsMeetingHashValid;
import org.kp.tpmg.videovisit.member.IsMeetingHashValidResponse;
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
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MemberWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.RetrieveMeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.UpdateResponseWrapper;
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


	public static VerifyMemberResponseWrapper verifyMember(String lastName, String mrn8Digit, 
							String birth_month, String birth_year, String birth_day,
							String sessionID) throws Exception 
	{
		VerifyMemberResponseWrapper resp = null; 

		if (!simulation)
		{
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
		

		// simulation
		resp = new VerifyMemberResponseWrapper();
		if (lastName.equals("one")|| lastName.equals("two"))
		{
			resp.setSuccess(true);
			MemberWSO fakeresp = new MemberWSO();
			resp.setResult(fakeresp);
			resp.getResult().setLastName(lastName);	
			resp.getResult().setFirstName("John");		
			resp.getResult().setMrn8Digit(mrn8Digit);		
		}
		
		// end simulation
		return resp;
	}
	

	 
	public static RetrieveMeetingResponseWrapper retrieveMeeting(String mrn8Digit,int pastMinutes,int futureMinutes,String sessionID) throws Exception 
	{
		RetrieveMeetingResponseWrapper toRet = null;
		if (!simulation)
		{
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

		// simulation
		 
	 	toRet = new RetrieveMeetingResponseWrapper();												// no meeting.
		toRet.setSuccess(true);
		
		MeetingWSO meeting1 = new MeetingWSO();
		ProviderWSO fakeprovider1 = new ProviderWSO();
		meeting1.setProviderHost(fakeprovider1);
		
		meeting1.setScheduledTimestamp(new Date().getTime()+ 300000);
		meeting1.setMeetingId(1);
		meeting1.getHost().setFirstName("John");
		meeting1.getHost().setLastName("Lim");
		meeting1.getHost().setTitle("PDM");
		meeting1.getProviderHost().setImageUrl("http://www.permanente.net/kaiser/pictures/30290.jpg");
		meeting1.getProviderHost().setHomePageUrl("http://www.permanente.net/homepage/kaiser/pages/c13556-top.html");
		meeting1.setMmMeetingName("385bne");
		
		MeetingWSO meeting2 = new MeetingWSO();
		ProviderWSO fakeprovider2 = new ProviderWSO();
		meeting2.setProviderHost(fakeprovider2);
		
		meeting2.setScheduledTimestamp(new Date().getTime()+ 900000);
		meeting2.setMeetingId(2);
		meeting2.getHost().setFirstName("Samantha");
		meeting2.getHost().setLastName("Strong");
		meeting2.getHost().setTitle("MD");
		meeting2.getProviderHost().setImageUrl("http://www.permanente.net/kaiser/pictures/31250.jpg");
		meeting2.getProviderHost().setHomePageUrl("http://www.permanente.net/homepage/doctor/strong");
		meeting2.setMmMeetingName("385bnsewe");
		
		toRet.setResult (new MeetingWSO[] {meeting1, meeting2});
		
		return toRet;

	}
	
		
	public static UpdateResponseWrapper memberLogout(String mrn8Digit, String sessionID) throws Exception
	{
		UpdateResponseWrapper toRet = null; 
		
		if (!simulation)
		{
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
		
		// simulation
		toRet = new UpdateResponseWrapper();
		toRet.setSuccess(true);
		
		return toRet;
	}

	public static UpdateResponseWrapper updateMemberMeetingStatusJoining(long meetingID, String mrn8Digit, String sessionID)
			throws Exception
	{
		UpdateResponseWrapper toRet = null; 
		
		if (!simulation)
		{
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
		
		// simulation
		toRet = new UpdateResponseWrapper();
		toRet.setSuccess(true);
		toRet.setErrorMessage("http://www.youtube.com/watch?v=ASKnLj2Pp8I");
		
		return toRet;
	}

	public static StringResponseWrapper createMegameetingSession(long meetingID, String mrn8Digit, String sessionID) throws Exception
	{
		StringResponseWrapper toRet = null; 
		
		if (!simulation)
		{
			CreateMegameetingSession query = new CreateMegameetingSession();
			try
			{
				query.setMrn8Digit(mrn8Digit);
				query.setSessionID(sessionID);
				query.setMeetingID(meetingID);
				
				CreateMegameetingSessionResponse response = stub.createMegameetingSession(query);
				toRet = response.get_return();
			}
			catch (Exception e)
			{
				logger.error("Web Service API error:" + e.getMessage() + " Retrying...");
				CreateMegameetingSessionResponse response = stub.createMegameetingSession(query);
				toRet = response.get_return();
			}
			return toRet;
		}
	
		// simulation
		toRet = new StringResponseWrapper();
		toRet.setSuccess(true);
		toRet.setResult("http://www.youtube.com/watch?v=ASKnLj2Pp8I");
		
		return toRet;
	}
	
	
	
	/**
	 * Member end the meeting and log out.
	 * @param mrn8Digit
	 * @param meetingID
	 * @param sessionID
	 * @return
	 */
	public static UpdateResponseWrapper memberEndMeetingLogout(String mrn8Digit, long meetingID, String sessionID)
	throws Exception
	{
		UpdateResponseWrapper toRet = null; 
		
		if (!simulation)
		{
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
		
		// simulation
		toRet = new UpdateResponseWrapper();
		toRet.setSuccess(true);
		
		return toRet;
	}
	
	
	/**
	 * Simply test database round trip
	 * @return
	 */
	public static UpdateResponseWrapper testDbRoundTrip() throws Exception
	{
		UpdateResponseWrapper toRet = null; 
		
		if (!simulation)
		{
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
		
		// simulation
		toRet = new UpdateResponseWrapper();
		toRet.setSuccess(true);
		
		return toRet;
	}

	public static RetrieveMeetingResponseWrapper retrieveMeetingForCaregiver(String meetingHash,
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
	
	public static RetrieveMeetingResponseWrapper IsMeetingHashValid(String meetingHash
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
	
	public static UpdateResponseWrapper endCaregiverMeetingSession(String meetingHash) 
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
			System.out.println("Webservice:userPresentInMeeting: query="+query);
			query.setMeetingId (meetingId);
			query.setMegaMeetingDisplayName(megaMeetingDisplayName);
			
			UserPresentInMeetingResponse response = stub.userPresentInMeeting(query);
			
			System.out.println("response=" + response);
			System.out.println("toRet=" + toRet);
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
	
}
