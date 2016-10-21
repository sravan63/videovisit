package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.controller.SetupWizardController;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;


public class SetupWizardController extends SimplePageController {
	
public static Logger logger = Logger.getLogger(SetupWizardController.class);
private static String JSONMAPPING = "jsonData";
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{	
		try
		{
			logger.info("Entered SetupWizardController.handlePageRequest");			
			String hostNuid = null;
			String participantNuid [] = null;
			String memberMrn = null;
			String meetingType = null;
			String userName = "Test, User";
			boolean isReady = WebService.initWebService(request);
			if(isReady){
				hostNuid = WebService.getSetupWizardHostNuid();
				memberMrn = WebService.getSetupWizardMemberMrn();
				meetingType = WebService.getSetupWizardMeetingType();
				userName = WebService.getSetupWizardUserName();
			}
			//get JSON data from web services
			String vendorMeetingData = MeetingCommand.createInstantVendorMeeting(request, response, hostNuid, participantNuid, memberMrn, meetingType);
			
			logger.debug("SetupWizardController-handleRequest-data="+vendorMeetingData);
		    
			JSONObject instantMeetingJsonObject = JSONObject.fromObject(vendorMeetingData);
			
			logger.info("SetupWizardController-instantMeetingJsonObject="+instantMeetingJsonObject);
			VideoVisitParamsDTO videoVisitParamsDTO = new VideoVisitParamsDTO();
			if ("200".equals(instantMeetingJsonObject.getJSONObject("status").get("code"))) {
				final JSONObject jsonEnvelope = instantMeetingJsonObject.getJSONObject("envelope");
				if (jsonEnvelope != null) {
					final JSONObject jsonVendorMeeting = jsonEnvelope.getJSONObject("vendorMeeting");
					if (jsonVendorMeeting != null) {
						videoVisitParamsDTO.setMeetingId(jsonVendorMeeting.get("meetingId") != null
								? String.valueOf(jsonVendorMeeting.get("meetingId")) : "");
						videoVisitParamsDTO.setVidyoUrl(jsonVendorMeeting.get("roomUrl") != null
								? String.valueOf(jsonVendorMeeting.get("roomUrl")) : "");
						videoVisitParamsDTO.setVendorConfId(jsonVendorMeeting.get("conferenceId") != null
								? String.valueOf(jsonVendorMeeting.get("conferenceId")) : "");
					}
				}
				
			}
			videoVisitParamsDTO.setGuestName(userName);
			videoVisitParamsDTO.setIsProvider("false");
			//videoVisitParamsDTO.setMeetingId((instantMeetingJsonObject.get("meetingId") != null) ? String.valueOf(instantMeetingJsonObject.get("meetingId")) : "");
			//videoVisitParamsDTO.setVidyoUrl((instantMeetingJsonObject.get("vendorConfRoomUrl") != null) ? (String) instantMeetingJsonObject.get("vendorConfRoomUrl") : "");
			//videoVisitParamsDTO.setVendorConfId((instantMeetingJsonObject.get("vendorConferenceId") != null) ? (String) instantMeetingJsonObject.get("vendorConferenceId") : "");
			
			/*videoVisitParamsDTO.setMeetingId((instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("meetingId") != null) ? String.valueOf(instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("meetingId")) : "");
			videoVisitParamsDTO.setVidyoUrl((instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("roomUrl") != null) ? (String) instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("roomUrl") : "");
			videoVisitParamsDTO.setVendorConfId((instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("conferenceId") != null) ? (String) instantMeetingJsonObject.getJSONObject("envelope").getJSONObject("vendorMeeting").get("conferenceId") : "");
			videoVisitParamsDTO.setGuestName(userName);
			videoVisitParamsDTO.setIsProvider("false");*/
			logger.info("SetupWizardController - setting vendor meeting data from service to object: " + videoVisitParamsDTO.toString());
						
			//put data into buffer
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", new Gson().toJson(videoVisitParamsDTO));		
			
		}
		catch (Exception e)
		{
			// log error
			logger.error("SetupWizardController - System Error" + e.getMessage(),e);
		}
		return (modelAndView);
	}

}
