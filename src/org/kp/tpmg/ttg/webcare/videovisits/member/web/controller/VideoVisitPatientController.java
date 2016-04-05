package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.videovisit.webserviceobject.xsd.MeetingWSO;
import org.springframework.web.servlet.ModelAndView;

public class VideoVisitPatientController extends SimplePageController {

	public static Logger logger = Logger.getLogger(VideoVisitPatientController.class);
	private String vidyoUrl;
	private String hostName;

	public String getHostName() {
		return hostName;
	}


	public void setHostName(String hostName) {
		this.hostName = hostName;
	}


	public String getVidyoUrl() {
		return vidyoUrl;
	}


	public void setVidyoUrl(String vidyoUrl) {
		this.vidyoUrl = vidyoUrl;
	}


	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		try
		{
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if(ctx != null){
				VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();			
				MeetingWSO[] meetings = ctx.getMeetings();
				for(int i=0;i< meetings.length;i++){
					MeetingWSO meeting = meetings[i];
					if(meeting != null && meeting.getMeetingId() == Long.parseLong(request.getParameter("meetingId"))){
						videoVisitParams.setHostFirstName(meeting.getProviderHost().getFirstName());
						videoVisitParams.setHostLastName(meeting.getProviderHost().getLastName());
						if(meeting.getProviderHost().getTitle() != null && meeting.getProviderHost().getTitle().length() > 0){
							videoVisitParams.setHostTitle(meeting.getProviderHost().getTitle());
						}else{
							videoVisitParams.setHostTitle("");
						}	
						videoVisitParams.setPatientFirstName(meeting.getMember().getFirstName());
						videoVisitParams.setPatientLastName(meeting.getMember().getLastName());
						videoVisitParams.setParticipants(meeting.getParticipants());
						videoVisitParams.setCaregivers(meeting.getCaregivers());
						Calendar cal = Calendar.getInstance();
						cal.setTimeInMillis(meeting.getScheduledTimestamp());
						SimpleDateFormat sfdate = new SimpleDateFormat("MM-dd-yyyy");
						SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
						//Can be changed to format like e.g. Fri, Jun 06, 2014 03:15 PM using below 
						//SimpleDateFormat sfdate = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm a");	
						videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
						videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));							
					}						
				}
				
				if("Y".equalsIgnoreCase(request.getParameter("isMember"))){						
					videoVisitParams.setVidyoUrl(request.getParameter("vidyoUrl"));
					videoVisitParams.setUserName(request.getParameter("attendeeName"));
					videoVisitParams.setMeetingId(request.getParameter("meetingId"));
					videoVisitParams.setGuestName(request.getParameter("guestName"));
					videoVisitParams.setIsProvider(request.getParameter("isProvider"));
					videoVisitParams.setGuestUrl(request.getParameter("guestUrl"));
					videoVisitParams.setIsMember("true");
					videoVisitParams.setIsProxyMeeting(request.getParameter("isProxyMeeting"));
					ctx.setVideoVisit(videoVisitParams);					
				}
				else{					
					videoVisitParams.setVidyoUrl(request.getParameter("vidyoUrl"));
					videoVisitParams.setMeetingId(request.getParameter("meetingId"));
					videoVisitParams.setMeetingCode(request.getParameter("meetingCode"));
					videoVisitParams.setCaregiverId(request.getParameter("caregiverId"));					
					videoVisitParams.setUserName(request.getParameter("guestName"));
					videoVisitParams.setGuestName(request.getParameter("guestName"));
					videoVisitParams.setIsProvider(request.getParameter("isProvider"));
					videoVisitParams.setGuestUrl(request.getParameter("guestUrl"));
					videoVisitParams.setIsMember("false");
					
					ctx.setVideoVisit(videoVisitParams);					
				}
				logger.info("VideoVisitPatientController -> Video Visit data:" + videoVisitParams.toString());				
			}
			
			//Set Plugin Data to Context - uncomment this once IE activex issues is resolved for plugin upgrade - IE11 onwards
			/**if(ctx != null && ctx.getVendorPlugin() == null){
				String pluginJSON = MeetingCommand.getVendorPluginData(request, response);
				logger.info("VideoVisitPatientController: Plugin data in context has been set: " + pluginJSON);
			}**/
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		return (modelAndView);
	}
}

