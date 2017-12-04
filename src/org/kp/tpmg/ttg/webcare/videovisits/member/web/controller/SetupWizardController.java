package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

import net.sf.json.JSONObject;

public class SetupWizardController extends SimplePageController {

	public static Logger logger = Logger.getLogger(SetupWizardController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		try {
			String hostNuid = null;
			String participantNuid[] = null;
			String memberMrn = null;
			String meetingType = null;
			String userName = "Test, User";
			boolean isReady = WebService.initWebService(request);
			if (isReady) {
				hostNuid = WebService.getSetupWizardHostNuid();
				memberMrn = WebService.getSetupWizardMemberMrn();
				meetingType = WebService.getSetupWizardMeetingType();
				userName = WebService.getSetupWizardUserName();
			}
			String vendorMeetingData = MeetingCommand.createInstantVendorMeeting(request, response, hostNuid,
					participantNuid, memberMrn, meetingType);

			logger.debug("data=" + vendorMeetingData);

			JSONObject instantMeetingJsonObject = JSONObject.fromObject(vendorMeetingData);

			logger.info("instantMeetingJsonObject=" + instantMeetingJsonObject);
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
			logger.debug("setting vendor meeting data from service to object: " + videoVisitParamsDTO.toString());
			modelAndView.setViewName(JSONMAPPING);
			modelAndView.addObject("data", new Gson().toJson(videoVisitParamsDTO));
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return (modelAndView);
	}

}
