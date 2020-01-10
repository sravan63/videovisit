package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberEnvelope;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberRestController extends SimplePageController {

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
		logger.info("validateKpOrgSSOSession result : "+result);
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
		VerifyMemberEnvelope verifyMemberEnvelope = null;
		String output = null;
		try {
			verifyMemberEnvelope = MeetingCommand.verifyMember(request);
			response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(verifyMemberEnvelope.getMember()));
			logger.debug("data = " + verifyMemberEnvelope);
			output = WebUtil.prepareCommonOutputJson("submitLogin", "200", "success", verifyMemberEnvelope);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/ssoSignOff.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssoSignOff(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			boolean isSignedOff = MeetingCommand.performSSOSignOff(request, response);
			if (isSignedOff) {
				output = WebUtil.prepareCommonOutputJson("ssoSignOff", "200", "success", "");
			}
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/launchMeetingForMemberDesktop.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String launchMeetingForMemberDesktop(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.launchMeetingForMemberDesktop(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/providerRunningLateInfo.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String providerRunningLateInfo(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.getProviderRunningLateDetails(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/logVendorMeetingEvents.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String logVendorMeetingEvents(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.logVendorMeetingEvents(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/setKPHCConferenceStatus.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String setKPHCConferenceStatus(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.setKPHCConferenceStatus(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/meetingDetails.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String meetingDetails(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.getMeetingDetails(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/launchMemberProxyMeeting.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String launchMemberProxyMeeting(final HttpServletRequest request,
			final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.launchMemberOrProxyMeetingForMember(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/createguestsession.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String createguestsession(final HttpServletRequest request,
			final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.createCaregiverMeetingSession(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/caregiverJoinMeeting.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String caregiverJoinMeeting(final HttpServletRequest request,
			final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = MeetingCommand.caregiverJoinLeaveMeeting(request);
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
	@RequestMapping(value = "/createSetupWizardMeeting.json", produces = {
			MediaType.APPLICATION_JSON_VALUE }, method = { RequestMethod.POST, RequestMethod.GET })
	public String createSetupWizardMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		String hostNuid = null;
		String participantNuid[] = null;
		String memberMrn = null;
		String meetingType = null;
		boolean isReady = WebService.initWebService(request);
		if (isReady) {
			hostNuid = WebService.getSetupWizardHostNuid();
			memberMrn = WebService.getSetupWizardMemberMrn();
			meetingType = WebService.getSetupWizardMeetingType();
		}
		output = MeetingCommand.createInstantVendorMeeting(request, hostNuid, participantNuid, memberMrn, meetingType);
		logger.debug("output = " + output);
		logger.info(LOG_EXITING);
		return output;
	}
}
