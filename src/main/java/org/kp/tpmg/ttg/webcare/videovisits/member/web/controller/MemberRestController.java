package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class MemberRestController{

	public static final Logger logger = Logger.getLogger(MemberRestController.class);
	
	@RequestMapping(value = "/ssoPreLogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssoPreLogin(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String result = null;
		Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.getSSOCookieName());
		if(ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue())) {
			logger.info("ssoCookie Value : "+ssoCookie.getValue());
			result = MeetingCommand.validateKpOrgSSOSession(request, ssoCookie.getValue());
		}
		logger.debug("validateKpOrgSSOSession result : "+result);
		logger.info(LOG_EXITING);
		return result;
	}

	@RequestMapping(value = "/ssoSubmitLogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssoSubmitLogin(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.performSSOSignOn(request, response);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/retrieveActiveMeetingsForMemberAndProxies.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String retrieveActiveMeetingsForMemberAndProxies(final HttpServletRequest request,
			final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			data = MeetingCommand.retrieveActiveMeetingsForMemberAndProxies(request);
			logger.debug("data = " + data);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return data;
	}

	@RequestMapping(value = "/retrieveActiveMeetingsForMember.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String retrieveActiveMeetingsForMember(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			data = MeetingCommand.retrieveActiveMeetingsForMemberAndProxies(request);
			logger.debug("data = " + data);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return data;
	}

	@RequestMapping(value = "/submitLogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String submitLogin(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String	output = MeetingCommand.verifyMember(request, response);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/logout.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String logout(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.logout(request, response);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/launchMeetingForMemberDesktop.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String launchMeetingForMemberDesktop(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.launchMeetingForMemberDesktop(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/launchMeetingForInstantMember.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String launchMeetingForInstantMember(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.launchMeetingForMemberDesktop(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/providerRunningLateInfo.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String providerRunningLateInfo(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.getProviderRunningLateDetails(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/logVendorMeetingEvents.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String logVendorMeetingEvents(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.logVendorMeetingEvents(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/setKPHCConferenceStatus.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String setKPHCConferenceStatus(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.setKPHCConferenceStatus(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/meetingDetails.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String meetingDetails(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.getMeetingDetails(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/launchMemberProxyMeeting.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String launchMemberProxyMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.launchMemberOrProxyMeetingForMember(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/caregiverJoinMeeting.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String caregiverJoinMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.caregiverJoinLeaveMeeting(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/quitMeeting.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String quitMeeting(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		String memberName = request.getHeader("memberName");
		logger.debug("memberName=" + memberName);
		if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
			output = MeetingCommand.memberLeaveProxyMeeting(request, response);
		} else {
			output = MeetingCommand.updateEndMeetingLogout(request, response, memberName, false);
		}
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/endGuestSession.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String endGuestSession(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.endCaregiverMeetingSession(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	//This is for instant join flow to by pass the SSOSessionFilter
	@RequestMapping(value = "/endInstantGuestSession.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String endInstantGuestSession(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.endCaregiverMeetingSession(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/createSetupWizardMeeting.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String createSetupWizardMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String hostNuid = null;
		String participantNuid[] = null;
		String memberMrn = null;
		String meetingType = null;
		WebService.initializeSetupWizardProperties();
		hostNuid = WebService.getSetupWizardHostNuid();
		memberMrn = WebService.getSetupWizardMemberMrn();
		meetingType = WebService.getSetupWizardMeetingType();
		String output = MeetingCommand.createInstantVendorMeeting(request, hostNuid, participantNuid, memberMrn,
				meetingType);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/isMeetingHashValid.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String isMeetingHashValid(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.isMeetingHashValid(request, response);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/guestLoginJoinMeeting.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String guestLoginJoinMeeting(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.guestLoginJoinMeeting(request, response);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/loadPropertiesByName.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String loadPropertiesByName(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final String resJsonStr = MeetingCommand.loadPropertiesByName(request);
		logger.debug("Result in json string format " + resJsonStr);
		logger.info(LOG_EXITING);
		return resJsonStr;
	}
	
	@RequestMapping(value = "/*.htm", method = { RequestMethod.POST, RequestMethod.GET })
	public RedirectView handleHtmRequest(final HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		final String redirectUrl = MeetingCommand.handleHtmRequest(request);
		logger.info(LOG_EXITING);
		return new RedirectView(redirectUrl);
	}
	
	@RequestMapping(value = "/launchMeetingForMember.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String launchMeetingForMember(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.launchMeetingForMember(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/joinLeaveReactMeeting.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String joinLeaveReactMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.joinLeaveMeeting(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/mobileAppPatientMeetings.htm", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView mobilepatientmeetings(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		ModelAndView modelAndView = new ModelAndView("redirect:mobileAppPatientLogin.htm");;
		try {
			HttpSession session = request.getSession(false);
			if (session != null) {
				WebAppContext context = WebAppContext.getWebAppContext(request);
				if (context != null && context.getMemberDO() != null) {
					modelAndView = new ModelAndView("mAppPatientLandingPage");
				}
			}
		} catch (Exception e) {
			logger.warn("Error while redirecting to mAppPatientLandingPage", e);
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}
	
	@RequestMapping(value = "/videovisitmobileready.htm", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView videovisitmobileready(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		ModelAndView modelAndView = new ModelAndView("videoVisitMobilePexip");
		logger.info(LOG_EXITING);
		return modelAndView;
	}
	
	@RequestMapping(value = "/mobileNativeLogout.htm", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView mobileNativeLogout(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		ModelAndView modelAndView = new ModelAndView("mobileNativeLogout");
		logger.info(LOG_EXITING);
		return modelAndView;
	}
	
	@RequestMapping(value = "/autherror.htm", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView authError(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		ModelAndView modelAndView = new ModelAndView("mauthError");
		logger.info(LOG_EXITING);
		return modelAndView;
	}
	
	@RequestMapping(value = "/submitSurvey.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String submitSurvey(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.submitSurvey(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/getActiveSurveys.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String getActiveSurveys(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.getActiveSurveys(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/insertVendorMeetingMediaCDR.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String insertVendorMeetingMediaCDR(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.insertVendorMeetingMediaCDR(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/authorizeVVCode.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String authorizeVVCode(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.authorizeVVCode(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/getSurveyQuestions.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String getSurveyQuestions(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.getSurveyQuestions(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/authorizeECCode.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String authorizeECCode(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.authorizeECCode(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/updateGuestParticipant.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String updateGuestParticipant(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.updateGuestParticipant(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
	
	@RequestMapping(value = "/getECMeetingDetailsById.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String getECMeetingDetailsById(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.getECMeetingDetailsById(request);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
}
