package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.FaqParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.IconPromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.PromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.VideoLinkParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdJSON;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.google.gson.Gson;

public class MobileLaunchVideoVisitController implements Controller {

	public static final Logger logger = Logger.getLogger(MobileLaunchVideoVisitController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String errorViewName;
	private String navigation;
	private String subNavigation;

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		final ModelAndView modelAndView = new ModelAndView(getViewName());
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String mobileBandwidth;
		if (ctx == null) {
			logger.info("context is null");
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
		try {
			ctx.setIsNative(true);
			mobileBandwidth = AppProperties.getExtPropertiesValueByKey("MOBILE_BANDWIDTH");
			if (StringUtils.isNotBlank(mobileBandwidth)) {
				ctx.setBandwidth(mobileBandwidth);
			} else {
				ctx.setBandwidth(WebUtil.BANDWIDTH_512_KBPS);
			}
			logger.info("bandwith : " + ctx.getBandwidth());
			final String mblLaunchToken = request.getHeader("mblLaunchToken");
			final long meetingId = WebUtil.convertStringToLong(request.getHeader("meetingId"));
			final String mrn = request.getHeader("mrn");
			String inMeetingDisplayName = request.getHeader("userDisplayName");
			final boolean isProxyMeeting = "Y".equalsIgnoreCase(request.getHeader("isProxy")) ? true : false;
			final String clientId = request.getHeader("clientId");

			logger.debug("Input : meetingId=" + meetingId + ", isProxyMeeting=" + isProxyMeeting
					+ ", inMeetingDisplayName=" + inMeetingDisplayName + ", mrn=" + mrn + ", mblLaunchToken="
					+ mblLaunchToken + ", clientId=" + clientId);

			if (StringUtils.isBlank(mblLaunchToken)
					|| !JwtUtil.validateAuthToken(mblLaunchToken, String.valueOf(meetingId), mrn)) {
				logger.info("Invalid auth token so sending sc_unauthorized error");
				return new ModelAndView(errorViewName);
			}

			ctx.setMeetingId(meetingId);
			ctx.setClientId(clientId);

			WebService.initWebService(request);
			final String output = WebService.getMeetingDetailsForMeetingId(meetingId, request.getSession().getId(),
					clientId);

			logger.debug("Output json string : " + output);
			final Gson gson = new Gson();
			final MeetingDetailsForMeetingIdJSON meetingDetailsForMeetingIdJSON = gson.fromJson(output,
					MeetingDetailsForMeetingIdJSON.class);

			final VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();
			videoVisitParams.setWebrtc(String.valueOf(WebUtil.isChromeOrFFBrowser(request)));

			if (meetingDetailsForMeetingIdJSON != null && meetingDetailsForMeetingIdJSON.getService() != null
					&& meetingDetailsForMeetingIdJSON.getService().getEnvelope() != null
					&& meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting() != null) {
				final MeetingDO meetingDo = meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting();
				logger.debug("MeetingDO: " + meetingDo.toString());
				videoVisitParams.setMeetingId(meetingDo.getMeetingId());
				videoVisitParams.setHostFirstName(meetingDo.getHost().getFirstName());
				videoVisitParams.setHostLastName(meetingDo.getHost().getLastName());
				if (StringUtils.isNotBlank(meetingDo.getHost().getTitle())) {
					videoVisitParams.setHostTitle(meetingDo.getHost().getTitle());
				} else {
					videoVisitParams.setHostTitle("");
				}
				videoVisitParams.setPatientFirstName(meetingDo.getMember().getFirstName());
				videoVisitParams.setPatientLastName(meetingDo.getMember().getLastName());
				videoVisitParams.setPatientMiddleName(meetingDo.getMember().getMiddleName());
				videoVisitParams.setRoomUrl(meetingDo.getRoomJoinUrl());
				videoVisitParams.setVendorConfId(meetingDo.getMeetingVendorId());
				videoVisitParams.setGuestUrl(meetingDo.getRoomJoinUrl());
				videoVisitParams.setIsProvider("false");
				videoVisitParams.setVendor(meetingDo.getVendor());
				videoVisitParams.setVendorGuestPin(meetingDo.getVendorGuestPin());
				videoVisitParams.setVendorHostPin(meetingDo.getVendorHostPin());
				videoVisitParams.setVendorConfig(meetingDo.getVendorConfig());
				final String guestName = meetingDo.getMember().getLastName() + ", "
						+ meetingDo.getMember().getFirstName();
				if (StringUtils.isBlank(inMeetingDisplayName)) {
					inMeetingDisplayName = guestName;
				}
				if (isProxyMeeting) {
					videoVisitParams.setIsMember("false");
					videoVisitParams.setIsProxyMeeting("true");
					if (StringUtils.isNotBlank(inMeetingDisplayName)
							&& !WebUtil.isStringContainsEmail(inMeetingDisplayName)) {
						inMeetingDisplayName = inMeetingDisplayName + ", (dummy@dummy.com)";
					}
				} else {
					videoVisitParams.setIsMember("true");
					videoVisitParams.setIsProxyMeeting("false");
					if (!inMeetingDisplayName.equalsIgnoreCase(guestName)) {
						inMeetingDisplayName = guestName;
					}
				}
				videoVisitParams.setUserName(inMeetingDisplayName);
				videoVisitParams.setGuestName(inMeetingDisplayName);
				WebUtil.addMeetingDateTime(meetingDo, videoVisitParams);
			}

			ctx.setVideoVisit(videoVisitParams);
			logger.debug("Video Visit param data:" + videoVisitParams.toString());
		} catch (Exception e) {
			logger.error("System error:" + e.getMessage(), e);
			if (ctx.getVideoVisit() == null || StringUtils.isBlank(ctx.getVideoVisit().getMeetingId())
					|| StringUtils.isBlank(ctx.getVideoVisit().getRoomUrl())
					|| StringUtils.isBlank(ctx.getVideoVisit().getVendorConfId())) {
				modelAndView.setViewName(errorViewName);
			}
		}

		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
		logger.info(LOG_EXITING);
		return modelAndView;
	}

	/**
	 * @return the webAppContextCommand
	 */
	public WebAppContextCommand getWebAppContextCommand() {
		return webAppContextCommand;
	}

	/**
	 * @param webAppContextCommand
	 *            the webAppContextCommand to set
	 */
	public void setWebAppContextCommand(WebAppContextCommand webAppContextCommand) {
		this.webAppContextCommand = webAppContextCommand;
	}

	/**
	 * @return the environmentCommand
	 */
	public EnvironmentCommand getEnvironmentCommand() {
		return environmentCommand;
	}

	/**
	 * @param environmentCommand
	 *            the environmentCommand to set
	 */
	public void setEnvironmentCommand(EnvironmentCommand environmentCommand) {
		this.environmentCommand = environmentCommand;
	}

	/**
	 * @return the contextIdParameter
	 */
	public String getContextIdParameter() {
		return contextIdParameter;
	}

	/**
	 * @param contextIdParameter
	 *            the contextIdParameter to set
	 */
	public void setContextIdParameter(String contextIdParameter) {
		this.contextIdParameter = contextIdParameter;
	}

	/**
	 * @return the homePageRedirect
	 */
	public String getHomePageRedirect() {
		return homePageRedirect;
	}

	/**
	 * @param homePageRedirect
	 *            the homePageRedirect to set
	 */
	public void setHomePageRedirect(String homePageRedirect) {
		this.homePageRedirect = homePageRedirect;
	}

	/**
	 * @return the viewName
	 */
	public String getViewName() {
		return viewName;
	}

	/**
	 * @param viewName
	 *            the viewName to set
	 */
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}

	/**
	 * @return the errorViewName
	 */
	public String getErrorViewName() {
		return errorViewName;
	}

	/**
	 * @param errorViewName
	 *            the errorViewName to set
	 */
	public void setErrorViewName(String errorViewName) {
		this.errorViewName = errorViewName;
	}

	/**
	 * @return the navigation
	 */
	public String getNavigation() {
		return navigation;
	}

	/**
	 * @param navigation
	 *            the navigation to set
	 */
	public void setNavigation(String navigation) {
		this.navigation = navigation;
	}

	/**
	 * @return the subNavigation
	 */
	public String getSubNavigation() {
		return subNavigation;
	}

	/**
	 * @param subNavigation
	 *            the subNavigation to set
	 */
	public void setSubNavigation(String subNavigation) {
		this.subNavigation = subNavigation;
	}

}
