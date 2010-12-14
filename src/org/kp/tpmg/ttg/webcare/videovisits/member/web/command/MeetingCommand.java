package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.*;

import java.io.PrintWriter;
import java.util.*;

import net.sf.json.JSONObject;
import nl.captcha.Captcha;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.*;
import org.kp.tpmg.videovisit.member.serviceapi.webserviceobject.xsd.*;

public class MeetingCommand {

	public static Logger logger = Logger.getLogger(MeetingCommand.class);
	public static int PAST_MINUTES =300;
	public static int FUTURE_MINUTES =300;

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
			String consentVersion  = "";
			String answer		= "";
			WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

			// DEBUG
			if (request.getParameter("last_name") != null &&
					!request.getParameter("last_name").equals("")) {
				lastName = request.getParameter("last_name");
			} 
			if (request.getParameter("mrn") != null &&
					!request.getParameter("mrn").equals("")) {
				mrn8Digit = request.getParameter("mrn");
			} 
			if (request.getParameter("birth_month") != null &&
					!request.getParameter("birth_month").equals("")) {
				birth_month = request.getParameter("birth_month");
			} 
			if (request.getParameter("birth_year") != null &&
					!request.getParameter("birth_year").equals("")) {
				birth_year = request.getParameter("birth_year");
			} 
			/*
			if (request.getParameter("consentVersion") != null &&
					!request.getParameter("consentVersion").equals("")) {
				consentVersion = request.getParameter("consentVersion");
			}
			 */
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
			
			// Init web service 	
			boolean success = WebService.initWebService();

			// Validation  
			if (ctx != null && success == true)
			{
				//grab data from web services
				ret= WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, ctx.getConsentVersion(),request.getSession().getId()); 
				if (ret != null && ret.getSuccess()&& ret.getResult()!= null)
				{
					// success logged in. save logged in member in cached
					ctx.setMember(ret.getResult());

					// retrieve meetings status
					return ("2");				
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
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);
		try
		{
			if (ctx != null && ctx.getMember() != null)
			{
				Date now = new Date();
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
						ctx.setTotalmeetings(meetings.length);
					}
					ctx.setMeetings(meetings);

				}
				/*
				else
				{
					// no meeting, we should blank out cached meeting
					ctx.setMeetings(null);
					ctx.setTotalmeetings(0);

				}	
				*/
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
		UpdateResponseWrapper ret = null;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.memberLogout(ctx.getMember().getMrn8Digit(), request.getSession().getId());
				if (ret != null)
				{
					return JSONObject.fromObject(ret).toString();
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
	
	
	public static String updateMemberMeetingStatusJoining(HttpServletRequest request, HttpServletResponse response) throws Exception {
		UpdateResponseWrapper ret = null;
		long meetingId = 0;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.updateMemberMeetingStatusJoining(meetingId, ctx.getMember().getMrn8Digit(), request.getSession().getId());
				if (ret != null)
				{
					return JSONObject.fromObject(ret).toString();
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

	public static String updateEndMeetingLogout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		UpdateResponseWrapper ret = null;
		long meetingId = 0;
		WebAppContext ctx  	= WebAppContext.getWebAppContext(request);

		try
		{
			// parse parameters
			if (request.getParameter("meetingId") != null &&
					!request.getParameter("meetingId").equals("")) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			
			if (ctx != null && ctx.getMember() != null)
			{
				//grab data from web services
				ret= WebService.memberEndMeetingLogout(ctx.getMember().getMrn8Digit(), meetingId, request.getSession().getId());
				if (ret != null)
				{
					return JSONObject.fromObject(ret).toString();
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


}
