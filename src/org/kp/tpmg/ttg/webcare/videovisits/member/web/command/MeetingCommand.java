package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import java.io.PrintWriter;
import java.rmi.RemoteException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import net.sourceforge.wurfl.core.Device;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VendorPluginDTO;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestOutput;
import org.kp.tpmg.videovisit.model.meeting.VerifyCareGiverOutput;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberOutput;
import org.kp.tpmg.videovisit.webserviceobject.xsd.CaregiverWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingLaunchResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MemberWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.RetrieveMeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.VerifyMemberResponseWrapper;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.MemberInfo;
import org.kp.ttg.sharedservice.domain.MemberSSOAuthorizeResponseWrapper;

import com.google.gson.Gson;

public class MeetingCommand {

	public static Logger logger = Logger.getLogger(MeetingCommand.class);
	public static int PAST_MINUTES =120;
	public static int FUTURE_MINUTES =15;

	public static void setupGuestInfo (HttpServletRequest request) {
	
		try {
			
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getParameter("patientLastName");
			String nocache = request.getParameter("nocache");
			String meetingId = request.getParameter("meetingId");
			
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

			ctx.setMeetingCode(meetingCode);
			ctx.setPatientLastName(patientLastName);
			ctx.setNocache(nocache);
			ctx.setGuestMeetingId(meetingId);
			
			
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(),e);
		}
	}
	
	public static String verifyMember(HttpServletRequest request, HttpServletResponse response) throws Exception 
	{
		VerifyMemberResponseWrapper ret = null;
		PrintWriter out 	= response.getWriter();

		try 
		{
			String lastName  	= "";
			String mrn8Digit	= "";
			String birth_month 	= "";
			String birth_year  	= "";
			String birth_day	= "";
			String answer		= "";			
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

			// DEBUG
			if (request.getParameter("last_name") != null &&
					!request.getParameter("last_name").equals("")) {
				lastName = request.getParameter("last_name");
			} 
			if (request.getParameter("mrn") != null &&
					!request.getParameter("mrn").equals("")) {
				mrn8Digit = fillToLength(request.getParameter("mrn"), '0', 8);
			} 
			if (request.getParameter("birth_month") != null &&
					!request.getParameter("birth_month").equals("")) {
				birth_month = request.getParameter("birth_month");
			} 
			if (request.getParameter("birth_year") != null &&
					!request.getParameter("birth_year").equals("")) {
				birth_year = request.getParameter("birth_year");
			} 
			if (request.getParameter("birth_day") != null &&
					!request.getParameter("birth_day").equals("")) {
				birth_day = request.getParameter("birth_day");
			}						
						
			
			/* captcha no longer needed
			if (request.getParameter("captcha") != null &&
					!request.getParameter("captcha").equals("")) 
			{
				answer = request.getParameter("captcha");
				Captcha captcha = (Captcha) request.getSession().getAttribute(Captcha.NAME);
			    if (captcha == null || !captcha.isCorrect(answer))
			    {
			    		//don't match, return error
						out.println ("4");
						return ("4");
			    }	
			}
			*/ 
			
			// Init web service 	
			boolean success = WebService.initWebService(request);

			// Validation  
			if (ctx != null && success == true)
			{
				//grab data from web services
				ret= WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, birth_day, 
						request.getSession().getId()); 
				if (ret != null && ret.getSuccess()&& ret.getResult()!= null)
				{
					// success logged in. save logged in member in cached
					ctx.setMember(ret.getResult());

					// retrieve meetings status
					return ("1");				
				}
				else if (ret != null && ret.getSuccess())
				{
					// TODO not authenticated. Clear the logged in cache.
					ctx.setMember(null);
					return ("3");
				}
				else 
				{
					// System error, not ret web service record, return retry error.
					return ("3");
				}
			}
			else
			{
				return ("3");
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
			out.println ("3");
			return ("3");

		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		//return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String retrieveMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception 
	{
		RetrieveMeetingResponseWrapper ret = null;
		Pattern p1 = Pattern.compile ("<mmMeetingName>");
		Pattern p2 = Pattern.compile("<guest name>");
		Matcher m1, m2;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		try
		{
			if (ctx != null && ctx.getMember() != null)
			{

				ret= WebService.retrieveMeeting(ctx.getMember().getMrn8Digit(), PAST_MINUTES, FUTURE_MINUTES,request.getSession().getId());
				// determine which meeting is coming up.
				if (ret != null && ret.getSuccess() && ret.getResult()!= null)
				{
					// there is meeting, so save it.
				
					MeetingWSO[] meetings = ret.getResult();
					if (meetings.length == 1 && meetings[0]== null )
					{
						// check to see if it is a null
						ctx.setTotalmeetings(0);
					}
					else
					{
						for (int i = 0; i < meetings.length; i++ )
						{
							if(meetings[i].getMmMeetingName() != null && !"".equals(meetings[i].getMmMeetingName())){
									/*String megaUrl = ctx.getMegaMeetingURL();
									m1 = p1.matcher(megaUrl);
									megaUrl = m1.replaceAll(meetings[i].getMmMeetingName());
									m2 = p2.matcher(megaUrl);
									megaUrl = m2.replaceAll(
															ctx.getMember().getFirstName().replaceAll("[^a-zA-Z0-9 ]", " ") + 
															" " + 
															ctx.getMember().getLastName().replaceAll("[^a-zA-Z0-9 ]", " ")); 
									// copy back to the meeting mmMeetingName
									meetings[i].setMmMeetingName(megaUrl);*/
							}	
							
							meetings[i].setParticipants((ProviderWSO[]) clearNullArray(meetings[i].getParticipants()));
							meetings[i].setCaregivers((CaregiverWSO[]) clearNullArray(meetings[i].getCaregivers()));
							
						    logger.info(" Hostname = " + meetings[i].getProviderHost().getFirstName());
						}
						
						ctx.setTotalmeetings(meetings.length);
					}
					ctx.setMeetings(meetings);

				}
				else
				{
					// no meeting, we should blank out cached meeting
					ctx.setMeetings(null);
					ctx.setTotalmeetings(0);

				}	

				return JSONObject.fromObject(ret).toString();
			}
		} 
		catch (Exception e)
		{	
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		return  (JSONObject.fromObject(new SystemError()).toString());
	}
	
	public static String memberLogout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.memberLogout(ctx.getMember().getMrn8Digit(), request.getSession().getId());
				if (ret != null)
				{
					return ret.getResult();
				}
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return JSONObject.fromObject(new SystemError()).toString();
	}
	
	public static StringResponseWrapper quitMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		
		long meetingId = -1L;
		if (request.getParameter("meetingId") != null &&
				!request.getParameter("meetingId").equals("")) {
			meetingId = Long.parseLong(request.getParameter("meetingId"));
		}
		
		String participantName = null;
		if (request.getParameter("memberName") != null &&
				!request.getParameter("memberName").equals("")) {
			participantName = request.getParameter("memberName");
		}
		
		long careGiverId = -1L;
		if (request.getParameter("caregiverId") != null &&
				!request.getParameter("caregiverId").equals("")) {
			careGiverId = Long.parseLong(request.getParameter("caregiverId"));
		}
		
		String sessionId = request.getSession().getId();
		
		
		try
		{
			ret= WebService.quitMeeting(meetingId, participantName, careGiverId, sessionId);
			
			if (ret != null)
			{
				return ret;
			}
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return null;
	}
	
	
	public static String updateMemberMeetingStatusJoining(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		long meetingId = 0;
		
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			if ( meetingId == 0)
			{
				meetingId = ctx.getMeetingId();
			}
			
			
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.updateMemberMeetingStatusJoining(meetingId, ctx.getMember().getMrn8Digit(), request.getSession().getId());
				if (ret != null)
				{
					return ret.getResult();
				}
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String updateEndMeetingLogout(HttpServletRequest request, HttpServletResponse response, String memberName, boolean notifyVideoForMeetingQuit) throws Exception {
		StringResponseWrapper ret = null;
		long meetingId = 0;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		logger.info("Entered MeetingCommand.updateEndMeetingLogout - received input attributes as [memberName=" + memberName + ", notifyVideoForMeetingQuit=" + notifyVideoForMeetingQuit + "]");
		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			if ( meetingId == 0)
			{
				meetingId = ctx.getMeetingId();
			}
			
			if (ctx != null && ctx.getMember() != null)
			{
				logger.debug("MeetingCommand.updateEndMeetingLogout - before calling webservice.memberEndMeetingLogout");
				//grab data from web services
				ret= WebService.memberEndMeetingLogout(ctx.getMember().getMrn8Digit(), meetingId, request.getSession().getId(), memberName, notifyVideoForMeetingQuit);
				if (ret != null)
				{
					return ret.getResult();
				}
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String createMeetingSession(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		long meetingId = 0;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
				ctx.setMeetingId(meetingId);
			}
			// sample code//
			
			
			
			
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.createMeetingSession(meetingId, ctx.getMember().getMrn8Digit(), request.getSession().getId());
				if (ret != null)
				{
					return ret.getResult();
				}
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String retrieveMeetingForCaregiver(HttpServletRequest request, HttpServletResponse response) 
			throws RemoteException {
		RetrieveMeetingResponseWrapper ret = null;			
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String meetingCode = null;			
		boolean success = WebService.initWebService(request);		
		if (ctx != null && success) {
			meetingCode = ctx.getMeetingCode();
			logger.info("Before retrieving caregiver meetings");
			ret = WebService.retrieveMeetingForCaregiver(meetingCode, PAST_MINUTES, FUTURE_MINUTES);			
			if (ret != null) {
				MeetingWSO[] meetings = ret.getResult();				
				if (meetings != null) {
					logger.info(" length = " + meetings.length);
					if (meetings.length == 1 && meetings[0]== null ) {
						logger.info("setting total meetings = 0");
						ctx.setTotalmeetings(0);
					} else {
						for (int i=0; i<meetings.length; i++) {
							MeetingWSO meeting = meetings[i];
							normalizeMeetingData(meeting, meetingCode, ctx);
						}
						ctx.setTotalmeetings(meetings.length);
						
						for ( MeetingWSO m : meetings)
						{
							if ( m.getCaregivers() != null)
							{
								for (CaregiverWSO c : m.getCaregivers())
								{
									if ( c.getMeetingHash().equalsIgnoreCase(meetingCode))
									{
										String  name = c.getLastName() + ", " + c.getFirstName();
										ctx.setCareGiverName(name);
										break;
									}
								}
							}
						}
						ctx.setMeetings(meetings);
					}
				}	
				else
				{
					// no meeting, we should blank out cached meeting
					ctx.setMeetings(null);
					ctx.setTotalmeetings(0);
				}
				
				return JSONObject.fromObject(ret).toString();
			}
			else
			{
				// no meeting, we should blank out cached meeting
				ctx.setMeetings(null);
				ctx.setTotalmeetings(0);
			}
		}
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	public static String IsMeetingHashValid(HttpServletRequest request, HttpServletResponse response) 
	throws RemoteException {
	RetrieveMeetingResponseWrapper ret = null;			
	WebAppContext ctx = WebAppContext.getWebAppContext(request);
	String meetingCode = request.getParameter("meetingCode");			
	String nocache = request.getParameter("nocache");			
	boolean success = WebService.initWebService(request);		
	if (ctx != null && success) {
		logger.info("Before IsMeetingHashValid");
		ret = WebService.IsMeetingHashValid(meetingCode);			
		if (ret != null) {
			MeetingWSO[] meetings = ret.getResult();				
			if (meetings != null) {
				if (meetings.length == 1 && meetings[0]== null ) {
					logger.info("setting total meetings = 0");
					ctx.setTotalmeetings(0);
				} else {
					logger.info("setting total meetings = " + meetings.length);
					for (int i=0; i<meetings.length; i++) {
						MeetingWSO meeting = meetings[i];
						normalizeMeetingData(meeting, meetingCode, ctx);
					}
					ctx.setTotalmeetings(meetings.length);
					ctx.setMeetings(meetings);
				}
			}

			return JSONObject.fromObject(ret).toString();
		}
	}
	return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	/*public static String verifyCaregiver(HttpServletRequest request, HttpServletResponse response) 
			throws RemoteException {
		String json = "";
		try {
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getParameter("patientLastName");
			StringResponseWrapper ret = WebService.verifyCaregiver(meetingCode, patientLastName);
			if ( ret != null )
			{
				logger.info("setting care giver context true");
				ctx.setCareGiver(ret.getSuccess());
				json = ret.getResult();
			}			

		} catch (Exception e) {
			json = JSONObject.fromObject(new SystemError()).toString();
		}
		return json;
	}*/
	
	public static String createCaregiverMeetingSession(HttpServletRequest request, HttpServletResponse response) 
			throws Exception {
		StringResponseWrapper ret = null;
		try {
			// parse parameters
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getParameter("patientLastName");
			
			boolean isMobileFlow= false;
			if (StringUtils.isNotBlank(request.getParameter("isMobileFlow")) && request.getParameter("isMobileFlow").equalsIgnoreCase("true"))
			{
					isMobileFlow = true;
					logger.info("mobile flow is true");
			}
				else{
					isMobileFlow = false;
					logger.info("mobile flow is false");
			}
					
			
			if (meetingCode != null && !meetingCode.isEmpty()) {
				ret = WebService.createCaregiverMeetingSession(meetingCode, patientLastName,isMobileFlow);
				if (ret != null) {
					return ret.getResult();
				}
			}						
		} catch (Exception e) {
			// log error
			logger.error("Error in createCaregiverMeetingSession " + e.getMessage(), e);
		}
		
		// worst case error returned, no caregiver found, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	public static String endCaregiverMeetingSession(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;		
		try	{
			String meetingCode = request.getParameter("meetingCode");
			logger.info("Entered MeetingCommand.endCaregiverMeetingSession - meetingCode = " + meetingCode);
			if (meetingCode != null && !meetingCode.isEmpty()) {
				ret = WebService.endCaregiverMeetingSession(meetingCode, null, false);
			}				
			if (ret != null) {
				return ret.getResult();
			}			
		} catch (Exception e) {
			// log error
			logger.error("Error in MeetingCommand.endCaregiverMeetingSession " + e.getMessage(), e);
		}
		// worst case error returned, no caregiver found, no web service responded, etc. 
		return JSONObject.fromObject(new SystemError()).toString();
	}
	
	public static String endCaregiverMeetingSession(String meetingCode, String megaMeetingNameDisplayName) throws Exception {
		StringResponseWrapper ret = null;		
		try	{
			logger.info("Entered MeetingCommand.endCaregiverMeetingSession - meetingCode = " + meetingCode + ", megaMeetingNameDisplayName = " + megaMeetingNameDisplayName);
			if (meetingCode != null && !meetingCode.isEmpty()) {
				ret = WebService.endCaregiverMeetingSession(meetingCode, megaMeetingNameDisplayName, true);
			}				
			if (ret != null) {
				return ret.getResult();
			}			
		} catch (Exception e) {
			// log error
			logger.error("Error in MeetingCommand.endCaregiverMeetingSession " + e.getMessage(), e);
		}
		// worst case error returned, no caregiver found, no web service responded, etc. 
		return JSONObject.fromObject(new SystemError()).toString();
	}

	private static String fillToLength(String src, char fillChar, int total_length) {
		String ret=null;
		if (src.length()<total_length) {
			int count=total_length-src.length();
			StringBuffer sb=new StringBuffer();
			for (int i=0; i<count; i++) {
				sb.append(fillChar);
			}
			sb.append(src);
			ret=sb.toString();
		} else {
			ret=src;
		}				
		return ret;
	}

	private static Object[] clearNullArray(Object[] input) {		
		if (input != null && input.length == 1 && input[0] == null) {
			input = null;
		}
		return input;
	}
	
	private static void normalizeMeetingData(MeetingWSO meeting, String meetingHash, WebAppContext ctx) {
		if (meeting == null) {
			return;
		}
		
		String megaMeetingName = meeting.getMmMeetingName();
		/*if (megaMeetingName != null && !megaMeetingName.isEmpty()) {
			Pattern p1 = Pattern.compile ("<mmMeetingName>");
			Pattern p2 = Pattern.compile("<guest name>");
			Matcher m1, m2;
			
			String megaMeetingUrl = ctx.getMegaMeetingURL();
			m1 = p1.matcher(megaMeetingUrl);
			megaMeetingUrl = m1.replaceAll(megaMeetingName);
			m2 = p2.matcher(megaMeetingUrl);
			
			CaregiverWSO[] caregivers = meeting.getCaregiver();
			if (caregivers != null && caregivers.length > 0) {
				for (int i=0; i<caregivers.length; i++) {
					CaregiverWSO caregiver = caregivers[i];
					if (caregiver.getMeetingHash().equals(meetingHash)) {
						megaMeetingUrl = m2.replaceAll(
								caregiver.getFirstName().replaceAll("[^a-zA-Z0-9 ]", " ") + 
								" " + 
								caregiver.getLastName().replaceAll("[^a-zA-Z0-9 ]", " "));
						meeting.setMmMeetingName(megaMeetingUrl);
						break;
					}
				}
			}						
		}*/
		
		meeting.setParticipants((ProviderWSO[]) clearNullArray(meeting.getParticipants()));
		meeting.setCaregivers((CaregiverWSO[]) clearNullArray(meeting.getCaregiver()));
	}	
	
	
	/**
	 * This method is used to determine if the user is present in a active mega meeting.
	 * Based on this condition, the user will be prevented from logging into the meeting again
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String userPresentInMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String userPresentInMeeting = null;
		StringResponseWrapper userPresentInMeetingResponse = null;
		long meetingId = 0;
		String megaMeetingDisplayName = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		
		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			if (request.getParameter("megaMeetingDisplayName") != null &&
					!request.getParameter("megaMeetingDisplayName").equals("")) {
				megaMeetingDisplayName = request.getParameter("megaMeetingDisplayName");
			}
			 
			logger.info("MeetingCommand:userPresentInMeeting: megaMeetingDisplayName="+megaMeetingDisplayName + " meetingId:" + meetingId);
			//grab data from web services
			userPresentInMeetingResponse = WebService.userPresentInMeeting(meetingId, megaMeetingDisplayName);
			if (userPresentInMeetingResponse != null)
			{
				logger.info("userPresentInMeeting: success = " + userPresentInMeetingResponse.getSuccess()); 
				userPresentInMeeting = userPresentInMeetingResponse.getResult();
				logger.info("MeetingCommand:userPresentInMeeting: userPresentInMeeting="+userPresentInMeeting);
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
			userPresentInMeeting = JSONObject.fromObject(new SystemError()).toString();
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return userPresentInMeeting;
	}
	
	/**
	 * Get the status of the meeting
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static String getMeetingStatus(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		long meetingId = 0;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		String meetingStatus = "";
		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			MeetingResponseWrapper meetingResponse = WebService.getMeetingByMeetingID(meetingId, request.getSession().getId());
			
			MeetingWSO meeting =  meetingResponse.getResult();
			if(meeting != null){
				meetingStatus = meeting.getMeetingStatus();
			}
			
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return meetingStatus;
	}
	
	public static String createMobileMeetingSession(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		long meetingId = 0;
		String deviceType = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		
		logger.info("In side command for mobile meeting");
	
		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
				!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			// This code will get the device attributes and capabilities and passes it to webservice
			Device device =	DeviceDetectionService.checkForDevice(request);
			Map<String, String > capabilities = device.getCapabilities();
			
			logger.info("Mobile capabilities ****" + capabilities);
			String brandName = capabilities.get("brand_name");
			String modelName = capabilities.get("model_name");
			String deviceOs = capabilities.get("device_os");
			String deviceOsVersion = capabilities.get("device_os_version");
			
			if (brandName != null && modelName!= null){
			 deviceType = brandName +" " + modelName;
			}
			logger.info("**" + brandName + "**" +modelName  + "**" +deviceOs + "**" + deviceOsVersion);
			
		
			
			//grab data from web services
			ret= WebService.createMobileMeetingSession(meetingId, deviceType, deviceOs, deviceOsVersion);
			if (ret != null)
			{
				//response.addHeader("P3P", "CP=\"NOI ADM DEV PSAi COM NAV OUR OTR STP IND DEM\"");
				logger.info(ret.getResult());
				return ret.getResult();
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	

	public static String CreateCareGiverMobileMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		String patientName = "";
		String meetingCode = "";
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		
		
		try
		{
			// parse parameters
			if (request.getParameter("patientLastName") != null &&
				!request.getParameter("patientLastName").equals("")) {
				patientName = request.getParameter("patientLastName");
			}
			
			if (request.getParameter("meetingCode") != null &&
					!request.getParameter("meetingCode").equals("")) {
				meetingCode = request.getParameter("meetingCode");
				}
			String  deviceType = null;
			// This code will get the device attributes and capabilities and passes it to webservice
			Device device =	DeviceDetectionService.checkForDevice(request);
			Map<String, String > capabilities = device.getCapabilities();
						
			String brandName = capabilities.get("brand_name");
			String modelName = capabilities.get("model_name");
			String deviceOs = capabilities.get("device_os");
			String deviceOsVersion = capabilities.get("device_os_version");
			
			
			if (brandName != null && modelName!= null){
					  deviceType = brandName +" " + modelName;
				}
			//grab data from web services
			ret= WebService.createCareGiverMobileSession(patientName,meetingCode,deviceType,deviceOs,deviceOsVersion);
			if (ret != null)
			{
				//response.addHeader("P3P", "CP=\"NOI ADM DEV PSAi COM NAV OUR OTR STP IND DEM\"");
				logger.info(ret.getResult());
				return ret.getResult();
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	public static String getVendorPluginData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringResponseWrapper ret = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		// Init web service 	
		boolean success = WebService.initWebService(request);
		try {
			logger.info("MeetingCommand.getVendorPluginData WebAppContext: " + ctx + " initWebService: " + success);
			
				//grab data from web services
				ret= WebService.getVendorPluginData(request.getSession().getId()); 
				
				//  web service call returned 
				if (ret != null)
				{
					if (ctx != null)
					{
						
						VendorPluginDTO vendorPluginDTO = new VendorPluginDTO();
						JSONObject pluginJsonObject = JSONObject.fromObject(ret.getResult());
						pluginJsonObject = (JSONObject) pluginJsonObject.get("result");
						vendorPluginDTO.setVendorPluginName((pluginJsonObject.get("vendorPluginName") != null) ? (String) pluginJsonObject.get("vendorPluginName") : "");
						vendorPluginDTO.setVendorNewPlugin((pluginJsonObject.get("vendorNewPlugin") != null) ? (String) pluginJsonObject.get("vendorNewPlugin") : "");
						vendorPluginDTO.setVendorOldPlugins((pluginJsonObject.get("vendorOldPlugins") != null) ? (String) pluginJsonObject.get("vendorOldPlugins") : "");
						
						logger.info("MeetingCommand.getVendorPluginData - setting plugin data from service to context: " + vendorPluginDTO.toString());
						ctx.setVendorPlugin(vendorPluginDTO);
					}
					return ret.getResult();
				}
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	/**
	 * This method is called for creating instant meeting for setup wizard 
	 * This will internally call the web service to make updates.
	 * @param request
	 * @param response
	 * @param hostNuid
	 * @param participantNuid
	 * @param memberMrn
	 * @param meetingType
	 * @return
	 * @throws Exception
	 */
	public static String createInstantVendorMeeting(HttpServletRequest request, HttpServletResponse response, String hostNuid, String[] participantNuid, String memberMrn, String meetingType) throws Exception {
		logger.info("Entered MeetingCommand.createInstantVendorMeeting -> -> received input attributes as [hostNuid=" + hostNuid + ", participantNuid=" + participantNuid + ", memberMrn=" + memberMrn + ", meetingType=" + meetingType + "]");
		StringResponseWrapper ret = null;			
		try
		{
			if (!StringUtils.isNotBlank(hostNuid)) {
				return "MeetingCommand.createInstantVendorMeeting -> Validation Error: Host Nuid can not be null or blank.";
			}
			// Init web service 	
			boolean success = WebService.initWebService(request);
			
			//grab data from web services
			ret = WebService.createInstantVendorMeeting(hostNuid, participantNuid, memberMrn, meetingType, request.getSession().getId());
			
			if (ret != null)
			{
				return ret.getResult();
			}
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String terminateSetupWizardMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("Entered MeetingCommand.terminateSetupWizardMeeting ");
		
		StringResponseWrapper ret = null;
		long meetingId = 0;
		String vendorConfId = null;
				
		try
		{
			// parse parameters
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}else{
				return "MeetingCommand.terminateSetupWizardMeeting -> Validation Error: Meeting Id can not be null or blank.";
			}
			
			if (StringUtils.isNotBlank(request.getParameter("vendorConfId"))) {
				vendorConfId = request.getParameter("vendorConfId");
			}
			
			boolean success = WebService.initWebService(request);
			String hostNuid = WebService.getSetupWizardHostNuid();			
						
			//grab data from web services
			ret= WebService.terminateInstantMeeting(meetingId, vendorConfId, hostNuid, request.getSession().getId());
			if (ret != null)
			{
				return ret.getResult();
			}
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	}
	
	public static String getLaunchMeetingDetailsForMember(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		long meetingId = 0;
		String deviceType = null;
	    boolean isMobileflow= true;
	    
		logger.info("Entered MeetingCommand: getLaunchMeetingDetailsForMember");	
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		String inMeetingDisplayName=null;// ctx.getMember().getLastName()+", "+ctx.getMember().getFirstName();
		
		try
		  {
			logger.info("getLaunchMeetingDetailsForMember: meetingid=" + request.getParameter("meetingId") + ", in meetingdisplayname=" + request.getParameter("inMeetingDisplayName"));
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			if (StringUtils.isNotBlank(request.getParameter("inMeetingDisplayName"))) {
				inMeetingDisplayName = request.getParameter("inMeetingDisplayName");
			}
			Device device =	DeviceDetectionService.checkForDevice(request);
			Map<String, String > capabilities = device.getCapabilities();
			
			logger.info("getLaunchMeetingDetailsForMember -> Mobile capabilities" + capabilities);
			String brandName = capabilities.get("brand_name");
			String modelName = capabilities.get("model_name");
			String deviceOs = capabilities.get("device_os");
			String deviceOsVersion = capabilities.get("device_os_version");
			
			if (brandName != null && modelName!= null){
			 deviceType = brandName +" " + modelName;
			}
			MeetingLaunchResponseWrapper meetingResponse = WebService.getLaunchMeetingDetails(meetingId, inMeetingDisplayName, request.getSession().getId(),ctx.getMember().getMrn8Digit(),deviceType,deviceOs,deviceOsVersion,isMobileflow);
			if (meetingResponse != null)
			{
				logger.info("MeetingCommand:getLaunchMeetingDetailsForMember: result got from webservice:"+ meetingResponse.getResult());
				return meetingResponse.getResult();
			}
			
		}
		catch (Exception e)
		{
			logger.error("System Error" + e.getMessage(),e);
		}
		// worst case error returned, no authenticated user, no web service responded, etc. 
		return (JSONObject.fromObject(new SystemError()).toString());
	 }
  /*
	  public static String getLaunchMeetingDetailsForMemberGuest(HttpServletRequest request, HttpServletResponse response) throws Exception{
		  
		  logger.info("Entered MeetingCommand: getLaunchMeetingDetailsForMemberGuest");	
		  WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		  String meetingCode=null;
		  String patientLastName=null;
		  String json = "";
		  String  deviceType = null;
		  //Gson gson = new Gson();
	      
		  try {
			  logger.info("getLaunchMeetingDetailsForMemberGuest: meetingCode=" + request.getParameter("meetingCode") + ", patientLastName=" + request.getParameter("patientLastName")+", isMobileFlow="+ request.getParameter("isMobileFlow"));
				meetingCode = request.getParameter("meetingCode");
				patientLastName = request.getParameter("patientLastName");
				boolean isMobileFlow;
				if (StringUtils.isNotBlank(request.getParameter("isMobileFlow")) && request.getParameter("isMobileFlow").equalsIgnoreCase("true"))
				{
						isMobileFlow = true;
						logger.info("getLaunchMeetingDetailsForMemberGuest -> mobile flow is true");
				}
					else{
						isMobileFlow = false;
						logger.info("getLaunchMeetingDetailsForMemberGuest -> mobile flow is false");
				}
				
				// This code will get the device attributes and capabilities and passes it to webservice
				Device device =	DeviceDetectionService.checkForDevice(request);
				Map<String, String > capabilities = device.getCapabilities();
							
				String brandName = capabilities.get("brand_name");
				String modelName = capabilities.get("model_name");
				String deviceOs = capabilities.get("device_os");
				String deviceOsVersion = capabilities.get("device_os_version");
				
				
				if (brandName != null && modelName!= null){
						  deviceType = brandName +" " + modelName;
					}
				MeetingLaunchResponseWrapper meetingResponse = WebService.getMeetingDetailsForMemberGuest(meetingCode, patientLastName,deviceType,deviceOs,deviceOsVersion,isMobileFlow);
				if ( meetingResponse != null )
				{
					logger.info("getLaunchMeetingDetailsForMemberGuest -> setting care giver context true");
					ctx.setCareGiver(meetingResponse.getSuccess());
					//logger.info("result from webservice"+meetingResponse.toString());
					logger.info("getLaunchMeetingDetailsForMemberGuest -> result from webservice  webservice URl"+meetingResponse.getResult()+" errorMessage "+meetingResponse.getErrorMessage()+" InMeeting "+meetingResponse.getInMeeting()+" MeetingStatus "+meetingResponse.getMeetingStatus());
				    json=JSONObject.fromObject(meetingResponse).toString();
					logger.info("getLaunchMeetingDetailsForMemberGuest -> result Using JSONObject"+json);
					//jsonResult = gson.toJson(meetingResponse);
					//logger.info("MeetingCommand:getLaunchMeetingDetailsForMemberGuest: jsonResult " + jsonResult);
					return json;
					
				}	
				
				
		  }
		  catch(Exception e){
			  logger.error("getLaunchMeetingDetailsForMemberGuest -> System Error" + e.getMessage(),e);
			  
			  
		  }
		 return (JSONObject.fromObject(new SystemError()).toString());
		  
	   }*/
  
	  public static String performSSOSignOn(HttpServletRequest request, HttpServletResponse response) throws Exception 
	  {
		  logger.info("Entered performSSOSignOn");
		  String strResponse = null;				
		  try 
		  {
				WebAppContext ctx = WebAppContext.getWebAppContext(request);
				// Init web service 	
				boolean success = WebService.initWebService(request);
				// Validation  
				if (ctx != null)
				{
					String userName = request.getParameter("username");
					String password = request.getParameter("password");
					
					if(StringUtils.isNotBlank(userName) && StringUtils.isNotBlank(password))
					{
						//grab data from web services
						KpOrgSignOnInfo kpOrgSignOnInfo = WebService.performKpOrgSSOSignOn(userName, password); 
						
						if(kpOrgSignOnInfo == null)
						{
							// TODO not authenticated. Clear the logged in cache.
							logger.warn("performSSOSignOn -> SSO Sign on failed due to KP org signon Service unavailability.");
							strResponse = invalidateWebAppContext(ctx);
							
						}
						else
						{
							if(!kpOrgSignOnInfo.isSuccess() || StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError()) || StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError()))
							{
								logger.warn("performSSOSignOn -> SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
								strResponse = invalidateWebAppContext(ctx);
							}
							else if(kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null && StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid())))
							{
								logger.warn("performSSOSignOn -> SSO Sign on service failed to return GUID for a user");
								strResponse = invalidateWebAppContext(ctx);
							}
							else if(StringUtils.isBlank(kpOrgSignOnInfo.getSsoSession()))
							{
								logger.warn("performSSOSignOn -> SSO Sign on service failed to return SSOSESSION for a user");
								strResponse = invalidateWebAppContext(ctx);
							}
							else
							{
								
								AuthorizeResponseVo authorizeMemberResponse = WebService.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
								if(authorizeMemberResponse == null)
								{
									logger.warn("performSSOSignOn -> SSO Sign on failed due to unavailability of Member SSO Auth API");
									strResponse = invalidateWebAppContext(ctx);
								}
								else
								{
									//check for errors returned
									if(authorizeMemberResponse.getResponseWrapper() == null)
									{
										logger.warn("performSSOSignOn -> SSO Sign on failed due to Member SSO Auth API authorization failure");
										strResponse = invalidateWebAppContext(ctx);
									}
									else
									{
										if(validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper()))
										{
											logger.info("performSSOSignOn -> SSO Sign on successful and setting member info into web app context");
											setWebAppContextMemberInfo(ctx, authorizeMemberResponse.getResponseWrapper().getMemberInfo());
											ctx.setKpOrgSignOnInfo(kpOrgSignOnInfo);
											ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());
											strResponse = "200";
										}
										else
										{
											strResponse = invalidateWebAppContext(ctx);
										}
									}
										
								}
							}
						}
					}
					else
					{
						logger.warn("performSSOSignOn -> SSO Sign on failed as either username or password is not available");			
						strResponse = "400";       
					}
				}
				else
				{
					logger.warn("performSSOSignOn -> SSO Sign on failed as webapp context from the rquest is null");
					strResponse = "400";
				}
		  }
		  catch (Exception e)
		  {
			  // log error
			  logger.error("performSSOSignOn -> System Error" + e.getMessage(),e);
			  if(StringUtils.isBlank(strResponse))
			  {
				  strResponse= "400";
			  }

		  }
		  return strResponse;			
	  }
	  
	  private static boolean validateMemberSSOAuthResponse(MemberSSOAuthorizeResponseWrapper responseWrapper)
	  {
		  logger.info("Entered validateMemberSSOAuthResponse");
		  boolean isValid = false;
		  
		  if(responseWrapper.getMemberAuthResponseStatus() != null && !responseWrapper.getMemberAuthResponseStatus().isSuccess())
		  {
			  logger.warn("validateMemberSSOAuthResponse -> SSO Sign on failed due to Member SSO Auth API authorization failure.");
			  
		  }
		  else if(responseWrapper.getMemberInfo() == null)
		  {
			  logger.warn("validateMemberSSOAuthResponse -> SSO Sign on failed as Member SSO Auth API failed to return valid Member info.");
			  
		  }
		  else
		  {
			  logger.info("validateMemberSSOAuthResponse -> Account Role from Member SSO Auth API = " + responseWrapper.getMemberInfo().getAccountRole());
			  
			  if("MBR".equalsIgnoreCase(responseWrapper.getMemberInfo().getAccountRole()) && StringUtils.isBlank(responseWrapper.getMemberInfo().getMrn()))
			  {
				  logger.warn("validateMemberSSOAuthResponse -> SSO Sign on failed as Member SSO Auth API failed to return MRN for a Member.");
				  
			  }
			  else if(StringUtils.isBlank(responseWrapper.getMemberInfo().getAccountRole()) || (!"MBR".equalsIgnoreCase(responseWrapper.getMemberInfo().getAccountRole())))
			  {
				  logger.info("validateMemberSSOAuthResponse -> Non Member Sign on.");
				  isValid = true;
			  }
			  else
			  {
				  isValid = true;
			  }
		  }
		  logger.info("Exiting validateMemberSSOAuthResponse -> isValid=" + isValid);
		  return isValid;
	  }
	  	  
		
	  private static void setWebAppContextMemberInfo(WebAppContext ctx, MemberInfo memberInfo)
	  {
		  MemberWSO memberWso = new MemberWSO();
		  try {
			    String dateStr = memberInfo.getDateOfBirth();
			    if(StringUtils.isNotBlank(dateStr))
			    {
			    	if(dateStr.endsWith("Z"))
			    	{
			    		Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime(dateStr);
			    		memberWso.setDateofBirth(cal.getTimeInMillis());
			    	}
			    	else
			    	{
			    		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					    Date date = sdf.parse(memberInfo.getDateOfBirth());
					    memberWso.setDateofBirth(date.getTime());
			    	}
			    	
			    }
			    
			} catch (Exception e) {
				logger.warn("setWebAppContextMemberInfo -> error while parsing string date to long.");
			}
		  
		  memberWso.setEmail(memberInfo.getEmail());//to do: check with Martin which email to be used...email or epic email?
		  memberWso.setFirstName(memberInfo.getFirstName());
		  memberWso.setGender(memberInfo.getGender());
		  memberWso.setLastName(memberInfo.getLastName());
		  memberWso.setMiddleName(memberInfo.getMiddleName());
		  if(StringUtils.isBlank(memberInfo.getMrn()))
		  {
			  ctx.setNonMember(true);
		  }
		  else
		  {
			  memberWso.setMrn8Digit(WebUtil.fillToLength(memberInfo.getMrn(), '0', 8));
		  }
		  ctx.setMember(memberWso);
	  }
  
	  private static String invalidateWebAppContext(WebAppContext ctx)
	  {
		  if(ctx != null)
		  {
			  ctx.setMember(null);
			  ctx.setKpOrgSignOnInfo(null);
			  ctx.setAuthenticated(false);
		  }
		  return "400";
	  }
	  
	  public static String validateKpOrgSSOSession(HttpServletRequest request, HttpServletResponse response, String ssoSession) throws Exception 
	  {
		  logger.info("Entered validateKpOrgSSOSession");
		  String strResponse = null;				
		  try 
		  {
				WebAppContext ctx = WebAppContext.getWebAppContext(request);
				boolean success = WebService.initWebService(request);
				// Validation  
				if (ctx != null)
				{
					//grab data from web services
					KpOrgSignOnInfo kpOrgSignOnInfo = WebService.validateKpOrgSSOSession(ssoSession); 
					
					if(kpOrgSignOnInfo == null)
					{
						// TODO not authenticated. Clear the logged in cache.
						logger.warn("validateKpOrgSSOSession -> SSO Sign on failed due to KP org signon Service unavailability.");
						strResponse = invalidateWebAppContext(ctx);
						
					}
					else
					{
						if(!kpOrgSignOnInfo.isSuccess() || StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError()) || StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError()))
						{
							logger.warn("validateKpOrgSSOSession -> SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
							strResponse = invalidateWebAppContext(ctx);
						}
						else if(kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null && StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid())))
						{
							logger.warn("validateKpOrgSSOSession -> SSO Sign on service failed to return GUID for a user");
							strResponse = invalidateWebAppContext(ctx);
						}
						else
						{
							
							AuthorizeResponseVo authorizeMemberResponse = WebService.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
							if(authorizeMemberResponse == null)
							{
								logger.warn("validateKpOrgSSOSession -> SSO Sign on failed due to unavailability of Member SSO Auth API");
								strResponse = invalidateWebAppContext(ctx);
							}
							else
							{
								//check for errors returned
								if(authorizeMemberResponse.getResponseWrapper() == null)
								{
									logger.warn("validateKpOrgSSOSession -> SSO Sign on failed due to Member SSO Auth API authorization failure");
									strResponse = invalidateWebAppContext(ctx);
								}
								else
								{
									if(validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper()))
									{
										logger.info("validateKpOrgSSOSession -> SSO Sign on successful and setting member info into web app context");
										setWebAppContextMemberInfo(ctx, authorizeMemberResponse.getResponseWrapper().getMemberInfo());
										ctx.setKpOrgSignOnInfo(kpOrgSignOnInfo);
										ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());
										strResponse = "200";
									}
									else
									{
										strResponse = invalidateWebAppContext(ctx);
									}
									
								}
									
							}
						}
					}
				}
				else
				{
					logger.warn("validateKpOrgSSOSession -> SSO Sign on failed as webapp context from the rquest is null");
					strResponse = "400";
				}
		  }
		  catch (Exception e)
		  {
			  // log error
			  logger.error("validateKpOrgSSOSession -> System Error" + e.getMessage(),e);
			  if(StringUtils.isBlank(strResponse))
			  {
				  strResponse= "400";
			  }

		  }
		  return strResponse;			
	  }
	  
	  public static boolean performSSOSignOff(HttpServletRequest request, HttpServletResponse response) 
	  {
		  logger.info("Entered performSSOSignOff");	
		  boolean isSignedOff = false;
		  try 
		  {
				WebAppContext ctx = WebAppContext.getWebAppContext(request);
				// Validation  
				if(ctx != null)
				{
					if(ctx.getKpOrgSignOnInfo() != null && StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession()))
					{
						boolean success = WebService.initWebService(request);
						isSignedOff = WebService.performKpOrgSSOSignOff(ctx.getKpOrgSignOnInfo().getSsoSession());
					}
					invalidateWebAppContext(ctx);
					WebUtil.removeCookie(request, response, WebUtil.SSO_COOKIE_NAME);
				}
		  }
		  catch (Exception e)
		  {
			  // log error
			  logger.error("performSSOSignOff -> System Error" + e.getMessage(),e);
		  }	
		  logger.info("Exiting performSSOSignOff");	
		  return isSignedOff;
      }
	  
	  public static String setKPHCConferenceStatus(HttpServletRequest request, HttpServletResponse response)
	  {
			logger.info("Entered setKPHCConferenceStatus");
			StringResponseWrapper setKPHCConferenceStatusResponse = null; 
			WebAppContext ctx = WebAppContext.getWebAppContext(request);	
			long meetingId = 0;
			
			try
			{
				if (ctx != null && ctx.getMember() != null)
				{
					// parse parameters
					if (StringUtils.isNotBlank(request.getParameter("meetingId"))) 
					{
						meetingId = Long.parseLong(request.getParameter("meetingId"));
					}
					
					if (meetingId == 0)
					{
						meetingId = ctx.getMeetingId();
					}
					
					logger.info("MeetingCommand.setKPHCConferenceStatus: meetingId=" + meetingId + ", status=" + request.getParameter("status") + ", careGiverName=" + request.getParameter("careGiverName"));
					
					boolean isProxyMeeting;
					if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting")))
					{
						isProxyMeeting = true;
					}
					else
					{
						isProxyMeeting = false;
					}
					//grab data from web services
					setKPHCConferenceStatusResponse = WebService.setKPHCConferenceStatus(meetingId, request.getParameter("status"), isProxyMeeting, request.getParameter("careGiverName"), request.getSession().getId());
					if (setKPHCConferenceStatusResponse != null)
					{
						logger.info("MeetingCommand.setKPHCConferenceStatus: result = " + setKPHCConferenceStatusResponse.getResult()); 
						return setKPHCConferenceStatusResponse.getResult();
					}
				}
			}
			catch (Exception e)
			{
				logger.error("setKPHCConferenceStatus -> System error:" + e.getMessage(), e);
				
			}
			logger.info("Exiting setKPHCConferenceStatus");
			// worst case error returned, no authenticated user, no web service responded, etc.
			return (JSONObject.fromObject(new SystemError()).toString());
	   }
	  
	 public static String retrieveActiveMeetingsForMemberAndProxies(HttpServletRequest request, HttpServletResponse response) throws Exception 
	  {
		  	logger.info("Entered retrieveActiveMeetingsForMemberAndProxies");			
		  	RetrieveMeetingResponseWrapper respWrapper = null;
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			try
			{
				if (ctx != null && ctx.getMember() != null)
				{
					if(ctx.isNonMember())
					{
						respWrapper = WebService.retrieveActiveMeetingsForNonMemberProxies(ctx.getKpOrgSignOnInfo().getUser().getGuid(), request.getSession().getId());
					}
					else
					{
						boolean getProxyMeetings = false;
						if(ctx.getKpOrgSignOnInfo() != null)
						{
							getProxyMeetings = true;
						}
					
						respWrapper = WebService.retrieveActiveMeetingsForMemberAndProxies(ctx.getMember().getMrn8Digit(), getProxyMeetings, request.getSession().getId());
					}
					
					if (respWrapper != null && respWrapper.getSuccess())
					{
						MeetingWSO[] memberMeetings = respWrapper.getResult();						
						if (memberMeetings == null || (memberMeetings.length == 1 && memberMeetings[0]== null))
						{
							ctx.setTotalmeetings(0);
						}
						else
						{
							for (int i = 0; i < memberMeetings.length; i++)
							{
								memberMeetings[i].setParticipants((ProviderWSO[]) clearNullArray(memberMeetings[i].getParticipants()));
								memberMeetings[i].setCaregivers((CaregiverWSO[]) clearNullArray(memberMeetings[i].getCaregivers()));
								
								logger.info("retrieveActiveMeetingsForMemberAndProxies -> Member Meeting ID = " + memberMeetings[i].getMeetingId());
							    logger.debug("retrieveActiveMeetingsForMemberAndProxies -> Member Meeting Vendor meeting id = " + memberMeetings[i].getMmMeetingConId());
							}							
							ctx.setTotalmeetings(memberMeetings.length);
						}
						ctx.setMeetings(memberMeetings);								
					}
					else
					{
						// no meeting, we should blank out cached meeting
						ctx.setMeetings(null);
						ctx.setTotalmeetings(0);
					}	
					return JSONObject.fromObject(respWrapper).toString();
				}
			} 
			catch (Exception e)
			{	
				// log error
				logger.error("retrieveActiveMeetingsForMemberAndProxies -> System Error" + e.getMessage(),e);
			}
			logger.info("Exiting retrieveActiveMeetingsForMemberAndProxies");	
			return  (JSONObject.fromObject(new SystemError()).toString());
	  }
	  
	  public static String launchMemberOrProxyMeetingForMember(HttpServletRequest request, HttpServletResponse response)
	  {
			logger.info("Entered launchMemberOrProxyMeetingForMember");
			MeetingLaunchResponseWrapper launchMemberOrProxyMeetingResponse = null; 
			WebAppContext ctx = WebAppContext.getWebAppContext(request);	
			long meetingId = 0;
			
			try
			{
				if (ctx != null && ctx.getMember() != null)
				{
					// parse parameters
					if (StringUtils.isNotBlank(request.getParameter("meetingId"))) 
					{
						meetingId = Long.parseLong(request.getParameter("meetingId"));
						ctx.setMeetingId(meetingId);
					}
					
					logger.info("launchMemberOrProxyMeetingForMember: meetingId=" + meetingId + ", isProxyMeeting=" + request.getParameter("isProxyMeeting") + ", inMeetingDisplayName=" + request.getParameter("inMeetingDisplayName"));
					boolean isProxyMeeting;
					if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting")))
					{
						isProxyMeeting = true;
					}
					else
					{
						isProxyMeeting = false;
					}
					//grab data from web services
					launchMemberOrProxyMeetingResponse = WebService.launchMemberOrProxyMeetingForMember(meetingId, ctx.getMember().getMrn8Digit(), request.getParameter("inMeetingDisplayName"), isProxyMeeting, request.getSession().getId());
					if (launchMemberOrProxyMeetingResponse != null)
					{
						return JSONObject.fromObject(launchMemberOrProxyMeetingResponse).toString();
					}
				}
			}
			catch (Exception e)
			{
				logger.error("launchMemberOrProxyMeetingForMember -> System error:" + e.getMessage(), e);				
			}
			logger.info("Exiting launchMemberOrProxyMeetingForMember");
			// worst case error returned, no authenticated user, no web service responded, etc.
			return (JSONObject.fromObject(new SystemError()).toString());
	  }
	  
	  public static String memberLeaveProxyMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception 
	  {
		  	logger.info("Entered memberLeaveProxyMeeting");
			StringResponseWrapper ret = null;
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
			try
			{
				if (ctx != null)
				{
					//grab data from web services
					ret= WebService.memberLeaveProxyMeeting(request.getParameter("meetingId"), request.getParameter("memberName"), request.getSession().getId());
					if (ret != null)
					{
						logger.info("Exiting memberLeaveProxyMeeting");
						return ret.getResult();
					}
				}
			}
			catch (Exception e)
			{
				// log error
				logger.error("System Error" + e.getMessage(),e);
			}
			logger.info("Exiting memberLeaveProxyMeeting");
			// worst case error returned, no authenticated user, no web service responded, etc. 
			return (JSONObject.fromObject(new SystemError()).toString());
	  }
	  
	  //calling new api 
	  public static String verifyCaregiver(HttpServletRequest request, HttpServletResponse response) 		
				throws RemoteException {		
			String json = "";		
			VerifyCareGiverOutput verifyCareGiverOutput = new VerifyCareGiverOutput();		
					
			try {		
				WebAppContext ctx  	= WebAppContext.getWebAppContext(request);		
				String meetingCode = request.getParameter("meetingCode");		
				String patientLastName = request.getParameter("patientLastName");		
						
				verifyCareGiverOutput = WebService.verifyCaregiver(meetingCode, patientLastName, request.getSession().getId(),WebUtil.clientId);		
				if ( verifyCareGiverOutput != null )		
				{		
					logger.info("setting care giver context true");		
					String statusCode = verifyCareGiverOutput.getStatus().getCode();		
					if(statusCode != "200"){		
					ctx.setCareGiver(false);		
					}		
					ctx.setCareGiver(true);		
					Gson gson = new Gson();		
					json = gson.toJson(verifyCareGiverOutput);		
					logger.info("MeetingCommand->verifyCaregiver->value after converting it to json"+ json.toString());		
				}					
			} catch (Exception e) {		
				json = JSONObject.fromObject(new SystemError()).toString();		
			}		
			return json;		
		}
			
public static String getLaunchMeetingDetailsForMemberGuest(HttpServletRequest request, HttpServletResponse response) throws Exception{		
		  		
		  logger.info("Entered MeetingCommand: getLaunchMeetingDetailsForMemberGuest");			
		  WebAppContext ctx  	= WebAppContext.getWebAppContext(request);		
		  LaunchMeetingForMemberGuestOutput launchMeetingForMemberGuest = new LaunchMeetingForMemberGuestOutput();		
		  String meetingCode=null;		
		  String patientLastName=null;		
		  String json = "";		
		  String  deviceType = null;		
	      		
		  try {		
			  logger.info("getLaunchMeetingDetailsForMemberGuest: meetingCode=" + request.getParameter("meetingCode") + ", patientLastName=" + request.getParameter("patientLastName")+", isMobileFlow="+ request.getParameter("isMobileFlow"));		
				meetingCode = request.getParameter("meetingCode");		
				patientLastName = request.getParameter("patientLastName");		
				boolean isMobileFlow;		
				if (StringUtils.isNotBlank(request.getParameter("isMobileFlow")) && request.getParameter("isMobileFlow").equalsIgnoreCase("true"))		
				{		
						isMobileFlow = true;		
						logger.info("getLaunchMeetingDetailsForMemberGuest -> mobile flow is true");		
				}		
					else{		
						isMobileFlow = false;		
						logger.info("getLaunchMeetingDetailsForMemberGuest -> mobile flow is false");		
				}		
						
				// This code will get the device attributes and capabilities and passes it to webservice		
				Device device =	DeviceDetectionService.checkForDevice(request);		
				Map<String, String > capabilities = device.getCapabilities();		
									
				String brandName = capabilities.get("brand_name");		
				String modelName = capabilities.get("model_name");		
				String deviceOs = capabilities.get("device_os");		
				String deviceOsVersion = capabilities.get("device_os_version");		
						
						
				if (brandName != null && modelName!= null){		
						  deviceType = brandName +" " + modelName;		
					}		
				launchMeetingForMemberGuest = WebService.getMeetingDetailsForMemberGuest(meetingCode, patientLastName,deviceType,deviceOs,deviceOsVersion,isMobileFlow, request.getSession().getId(),WebUtil.clientId);		
				if ( launchMeetingForMemberGuest != null )		
				{		
					logger.info("MeetingCommand->getLaunchMeetingDetailsForMemberGuest -> setting care giver context true");		
					String statusCode = launchMeetingForMemberGuest.getStatus().getCode();		
					if(statusCode != "200"){		
					ctx.setCareGiver(false);		
							
					}		
					ctx.setCareGiver(true);		
					Gson gson = new Gson();		
					json = gson.toJson(launchMeetingForMemberGuest);		
					logger.info("MeetingCommand->getLaunchMeetingDetailsForMemberGuest-> after converting it to json"+ json.toString());		
					 return json;		
				}			
									
		  }		
		  catch(Exception e){		
			  logger.error("getLaunchMeetingDetailsForMemberGuest -> System Error" + e.getMessage(),e);	  		
		  }		
		  return (JSONObject.fromObject(new SystemError()).toString());		
		 		
}	

///calling rest API
/*
 * verifyMember and launchMeetingForMember set the Member details to webcontext, so the variable in we
 * so the variable in web context needs to match the one provided in the rest apis Member instead of MemberWSO. 
 * But if changed for one function, it has to be changed for remaining depending functions
 * Hence cannot commit it
/*
public static String getLaunchMeetingDetailsForMember(HttpServletRequest request, HttpServletResponse response) throws Exception {		
			
	long meetingId = 0;		
	String deviceType = null;		
  boolean isMobileflow= true;		
  String json = "";		
  		
	logger.info("Entered MeetingCommand: getLaunchMeetingDetailsForMember");			
	WebAppContext ctx  	= WebAppContext.getWebAppContext(request);		
	LaunchMeetingForMemberGuestOutput launchMeetingForMemberOutput = new LaunchMeetingForMemberGuestOutput();		
	String inMeetingDisplayName=null;// ctx.getMember().getLastName()+", "+ctx.getMember().getFirstName();		
			
	try		
	  {		
		logger.info("getLaunchMeetingDetailsForMember: meetingid=" + request.getParameter("meetingId") + ", in meetingdisplayname=" + request.getParameter("inMeetingDisplayName"));		
		if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {		
			meetingId = Long.parseLong(request.getParameter("meetingId"));		
		}		
				
		if (StringUtils.isNotBlank(request.getParameter("inMeetingDisplayName"))) {		
			inMeetingDisplayName = request.getParameter("inMeetingDisplayName");		
		}		
		Device device =	DeviceDetectionService.checkForDevice(request);		
		Map<String, String > capabilities = device.getCapabilities();		
				
		logger.info("getLaunchMeetingDetailsForMember -> Mobile capabilities" + capabilities);		
		String brandName = capabilities.get("brand_name");		
		String modelName = capabilities.get("model_name");		
		String deviceOs = capabilities.get("device_os");		
		String deviceOsVersion = capabilities.get("device_os_version");		
				
		if (brandName != null && modelName!= null){		
		 deviceType = brandName +" " + modelName;		
		}		
		launchMeetingForMemberOutput = WebService.getLaunchMeetingDetailsForMember(meetingId, inMeetingDisplayName,ctx.getMember().getMrn8Digit(),deviceType,deviceOs,deviceOsVersion,isMobileflow, request.getSession().getId(),WebUtil.clientId);		
		if (launchMeetingForMemberOutput != null)		
		{		
					
			Gson gson = new Gson();		
			json = gson.toJson(launchMeetingForMemberOutput);		
			logger.info("MeetingCommand->getLaunchMeetingDetailsForMember-> after converting it to json"+ json.toString());		
			return json;		
		}		
				
	}		
	catch (Exception e)		
	{		
		logger.error("System Error" + e.getMessage(),e);		
				
	}		
	// worst case error returned, no authenticated user, no web service responded, etc. 		
	return (JSONObject.fromObject(new SystemError()).toString());			
}		
public static String verifyMember(HttpServletRequest request, HttpServletResponse response) throws Exception 		
{		
	VerifyMemberOutput verifyMemberOutput = new VerifyMemberOutput();		
	String json="";		
	try 		
	{		
		String lastName  	= "";		
		String mrn8Digit	= "";		
		String birth_month 	= "";		
		String birth_year  	= "";		
		String birth_day	= "";					
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);		
		// DEBUG		
		if (request.getParameter("last_name") != null &&		
				!request.getParameter("last_name").equals("")) {		
			lastName = request.getParameter("last_name");		
		} 		
		if (request.getParameter("mrn") != null &&		
				!request.getParameter("mrn").equals("")) {		
			mrn8Digit = fillToLength(request.getParameter("mrn"), '0', 8);		
		} 		
		if (request.getParameter("birth_month") != null &&		
				!request.getParameter("birth_month").equals("")) {		
			birth_month = request.getParameter("birth_month");		
		} 		
		if (request.getParameter("birth_year") != null &&		
				!request.getParameter("birth_year").equals("")) {		
			birth_year = request.getParameter("birth_year");		
		} 		
		if (request.getParameter("birth_day") != null &&		
				!request.getParameter("birth_day").equals("")) {		
			birth_day = request.getParameter("birth_day");		
		}								
		// Init web service 			
		boolean success = WebService.initWebService(request);		
		if(ctx == null && !success){		
			return "3";		
		}		
		else{		
			verifyMemberOutput= WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, birth_day, 		
					request.getSession().getId(),WebUtil.clientId); 		
			if (verifyMemberOutput != null && verifyMemberOutput.getStatus().getCode()=="200")		
			{		
				// success logged in. save logged in member in cached		
				MemberWSO member = new MemberWSO();		
				Member serviceMember = new Member();		
				serviceMember =verifyMemberOutput.getEnvelope().getMember();		
				member.setMrn8Digit(serviceMember.getMrn());		
				member.setLastName(serviceMember.getLastName());		
				member.setFirstName(serviceMember.getFirstName());		
				member.setDateofBirth(Long.parseLong(serviceMember.getDateOfBirth()));		
				member.setEmail(serviceMember.getEmail());		
				member.setGender(serviceMember.getGender());		
				member.setInMeeting(serviceMember.getInMeeting());		
				member.setMiddleName(serviceMember.getMiddleName());		
				ctx.setMember(member);		
				/*Gson gson = new Gson();		
				json = gson.toJson(verifyMemberOutput);		
				logger.info("MeetingCommand->verifyMember-> after converting it to json"+ json.toString());*/		
				/*return "1";						
			}			
			else		
			{		
				ctx.setMember(null);		
				return "3";		
			}			
		}		
	}		
	catch (Exception e)		
	{		
		logger.error("System Error" + e.getMessage(),e);		
	}		
	// worst case error returned, no authenticated user, no web service responded, etc. 		
	return (JSONObject.fromObject(new SystemError()).toString());		
}		
public static String retrieveMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception 		
{		
	logger.info("Entered MeetimgCommand->retrieveMeeting");		
	MeetingDetailsOutput activeMeetingOutput = new MeetingDetailsOutput();		
	String json="";		
	WebAppContext ctx  	= WebAppContext.getWebAppContext(request);		
	try		
	{		
		if (ctx != null && ctx.getMember() != null)		
		{		
			activeMeetingOutput= WebService.getActiveMeetingForMember(ctx.getMember().getMrn8Digit(), PAST_MINUTES, FUTURE_MINUTES,request.getSession().getId(), WebUtil.clientId);		
			// determine which meeting is coming up.		
			if (activeMeetingOutput != null && activeMeetingOutput.getStatus().getCode()=="200")		
			{		
				// there is meeting, so save it.		
				MeetingsEnvelope meetings = activeMeetingOutput.getEnvelope();		
				List<MeetingDO>	meetingDO = meetings.getMeetings();		
				if (meetingDO.size() == 1 && meetingDO.get(0)==null)		
				{		
					// check to see if it is a null		
					ctx.setTotalmeetings(0);		
				}		
				else		
				{		
					ctx.setTotalmeetings(meetingDO.size());		
				}		
						
				ctx.setMeetingDO(meetingDO);		
				Gson gson = new Gson();		
				json = gson.toJson(activeMeetingOutput);		
				logger.info("MeetingCommand->retrieveMeeting-> after converting it to json"+ json.toString());		
				return json;		
			}		
			else		
			{		
				// no meeting, we should blank out cached meeting		
				ctx.setMeetingDO(null);		
				ctx.setTotalmeetings(0);		
			}			
		}		
	} 		
	catch (Exception e)		
	{			
		// log error		
		logger.error("System Error" + e.getMessage(),e);		
	}		
	return  (JSONObject.fromObject(new SystemError()).toString());		
}*/	
		 
}
