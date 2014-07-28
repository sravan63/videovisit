package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import java.io.PrintWriter;
import java.rmi.RemoteException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VendorPluginDTO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.CaregiverWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.ProviderWSO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.RetrieveMeetingResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.StringResponseWrapper;
import org.kp.tpmg.videovisit.webserviceobject.xsd.VerifyMemberResponseWrapper;


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
			boolean success = WebService.initWebService();

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
		boolean success = WebService.initWebService();		
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
	boolean success = WebService.initWebService();		
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
	
	public static String verifyCaregiver(HttpServletRequest request, HttpServletResponse response) 
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
	}
	
	public static String createCaregiverMeetingSession(HttpServletRequest request, HttpServletResponse response) 
			throws Exception {
		StringResponseWrapper ret = null;
		try {
			// parse parameters
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getParameter("patientLastName");
			
			if (meetingCode != null && !meetingCode.isEmpty()) {
				ret = WebService.createCaregiverMeetingSession(meetingCode, patientLastName);
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
			logger.error("Error in createCaregiverMeetingSession " + e.getMessage(), e);
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
			logger.error("Error in createCaregiverMeetingSession " + e.getMessage(), e);
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
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		
		
		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
				!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			
			//grab data from web services
			ret= WebService.createMobileMeetingSession(meetingId);
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
			
			
			//grab data from web services
			ret= WebService.createCareGiverMobileSession(patientName,meetingCode);
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
		boolean success = WebService.initWebService();
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
			}
			if (StringUtils.isNotBlank(request.getParameter("vendorConfId"))) {
				vendorConfId = request.getParameter("vendorConfId");
			}
			
			String hostNuid = WebService.getSetupWizardHostNuid();			
			
			if(hostNuid == null){
				boolean isReady = WebService.initWebService();
				if(isReady){
					hostNuid = WebService.getSetupWizardHostNuid();		
				}
			}
			
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

}
