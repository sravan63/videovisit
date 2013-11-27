package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

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
			if("Y".equalsIgnoreCase(request.getParameter("isMember"))){
				logger.info("Member:" +request.getParameterMap());
				logger.info("VidyoUrl:"+(request.getParameter("vidyoUrl")));
				logger.info("UserName:"+(request.getParameter("attendeeName")));
				logger.info("MeetingId:"+(request.getParameter("meetingId")));
				
				if ( WebAppContext.getWebAppContext(request) != null )
				{
					VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();
					videoVisitParams.setVidyoUrl(request.getParameter("vidyoUrl"));
					videoVisitParams.setUserName(request.getParameter("attendeeName"));
					videoVisitParams.setMeetingId(request.getParameter("meetingId"));
					
					MeetingWSO[] meetings = WebAppContext.getWebAppContext(request).getMeetings();
					for(int i=0;i< meetings.length;i++){
						MeetingWSO meeting = meetings[i];
						if(meeting.getMeetingId() == Long.parseLong(request.getParameter("meetingId"))){
							videoVisitParams.setHostFirstName(meeting.getProviderHost().getFirstName());
							videoVisitParams.setHostLastName(meeting.getProviderHost().getLastName());
							videoVisitParams.setHostTitle(meeting.getProviderHost().getTitle());
						}
						//System.out.println("meeting host FN:"+meeting.getProviderHost().getFirstName());
						//System.out.println("meeting host ln:"+meeting.getProviderHost().getLastName());
					}
					
					WebAppContext.getWebAppContext(request).setVideoVisit(videoVisitParams);
				}
			}
			else{
				logger.info("Guest:" +request.getParameterMap());
				logger.info("vidyoUrl:"+(request.getParameter("vidyoUrl")));
				logger.info("meetingId:"+(request.getParameter("meetingId")));
				logger.info("meetingCode:"+(request.getParameter("meetingCode")));
				logger.info("patientLastName:"+(request.getParameter("patientLastName")));
				//System.out.println("guestName:"+(request.getParameter("guestName")));
				
				if ( WebAppContext.getWebAppContext(request) != null )
				{
					
					VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();
					videoVisitParams.setVidyoUrl(request.getParameter("vidyoUrl"));
					videoVisitParams.setMeetingId(request.getParameter("meetingId"));
					videoVisitParams.setMeetingCode(request.getParameter("meetingCode"));
					videoVisitParams.setPatientLastName(request.getParameter("patientLastName"));
					videoVisitParams.setUserName(request.getParameter("guestName"));
					
					WebAppContext.getWebAppContext(request).setVideoVisit(videoVisitParams);
				}
			}
		}
		catch (Exception e)
		{
			// log error
			logger.error("System Error" + e.getMessage(),e);
		}
		return (modelAndView);
	}
}

