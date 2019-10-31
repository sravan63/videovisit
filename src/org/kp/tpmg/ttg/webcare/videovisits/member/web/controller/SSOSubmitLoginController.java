package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.FaqParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.IconPromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.PromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.VideoLinkParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberEnvelope;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class SSOSubmitLoginController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(SSOSubmitLoginController.class);
	private static final String JSONMAPPING = "jsonData";

	@RequestMapping(value = "/ssosubmitlogin.json", produces = { MediaType.APPLICATION_JSON_VALUE }, method = {
			RequestMethod.POST, RequestMethod.GET })
	public String ssosubmitlogin(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String output = MeetingCommand.performSSOSignOn(request);
		logger.info(LOG_EXITING);
		return output;
	}

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null) {
				logger.info("Context is null, so creating new context");
				faq f = FaqParser.parse();
				List<promo> promos = PromoParser.parse();
				List<iconpromo> iconpromos = IconPromoParser.parse();
				videolink videoLink = VideoLinkParser.parse();
				ctx = WebAppContextCommand.createContext(request, "0");
				WebAppContext.setWebAppContext(request, ctx);
				ctx.setFaq(f);
				ctx.setPromo(promos);
				ctx.setIconPromo(iconpromos);
				ctx.setVideoLink(videoLink);
			} else {
				logger.info("Context is not null");

			}

			if (StringUtils.isBlank(ctx.getWebrtcSessionManager())) {
				ctx.setWebrtcSessionManager(WebUtil.VIDYO_WEBRTC_SESSION_MANGER);
			}

			// Perform SSO sign on and authorization
			data = MeetingCommand.performSSOSignOn(request);

			// set ssosession token in cookie
			if ("200".equalsIgnoreCase(data) && ctx.getKpOrgSignOnInfo() != null
					&& StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession())) {
				logger.info("ssosession to be set in cookie:" + ctx.getKpOrgSignOnInfo().getSsoSession());
				WebUtil.setCookie(response, WebUtil.getSSOCookieName(), ctx.getKpOrgSignOnInfo().getSsoSession());
				ctx.setAuthenticated(true);
				ctx.setClientId(WebUtil.VV_MBR_SSO_WEB);
				ctx.setBackButtonClientId(WebUtil.VV_MBR_SSO_BACK_BTN);
				MeetingCommand.updateWebappContextWithBrowserFlags(ctx);
			}
		} catch (Exception e) {
			logger.error("SSOSubmitLoginController -> System Error" + e.getMessage(), e);
		}
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING + "data=" + data);
		return modelAndView;
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
