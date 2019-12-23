package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberEnvelope;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberRestController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(MemberRestController.class);

	@RequestMapping(value = "/ssosubmitlogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssosubmitlogin(final HttpServletRequest request, final HttpServletResponse response)
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

	@RequestMapping(value = "/submitlogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String submitlogin(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		VerifyMemberEnvelope verifyMemberEnvelope = null;
		String output = null;
		try {
			verifyMemberEnvelope = MeetingCommand.verifyMember(request);
			response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(verifyMemberEnvelope.getMember()));
			logger.debug("data = " + verifyMemberEnvelope);
			output = WebUtil.prepareCommonOutputJson("submitlogin", "200", "success", verifyMemberEnvelope);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	@RequestMapping(value = "/ssosignoff.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssosignoff(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			boolean isSignedOff = MeetingCommand.performSSOSignOff(request, response);
			if (isSignedOff) {
				output = WebUtil.prepareCommonOutputJson("ssosignoff", "200", "success", "");
			}
			logger.debug("output = " + output);
		} catch (Exception e) {
			logger.error("System Error : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

}
