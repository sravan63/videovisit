package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

@Controller
public class MobileLaunchVideoVisitController {

	public static final Logger logger = LoggerFactory.getLogger(MobileLaunchVideoVisitController.class);

	@RequestMapping(value = "/mobilelaunchvv.htm", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView mobilelaunchvv(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		final ModelAndView modelAndView = new ModelAndView("videoVisitMobilePexip");
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String mobileBandwidth;
		if (ctx == null) {
			logger.info("context is null");
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
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
				return new ModelAndView("mauthError");
			}

			ctx.setMeetingId(meetingId);
			ctx.setClientId(clientId);

			final String output = WebService.getMeetingDetailsForMeetingId(meetingId, request.getSession().getId(),
					clientId);

			logger.debug("Output json string : " + output);
			final Gson gson = new Gson();
			final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON meetingDetailsForMeetingIdJSON = gson.fromJson(output,
					org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON.class);

			final VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();
			videoVisitParams.setWebrtc(String.valueOf(WebUtil.isChromeOrFFBrowser(request)));

			if (meetingDetailsForMeetingIdJSON != null && meetingDetailsForMeetingIdJSON.getService() != null
					&& meetingDetailsForMeetingIdJSON.getService().getEnvelope() != null
					&& meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting() != null) {
				final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO meetingDo = meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting();
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
				modelAndView.setViewName("mauthError");
			}
		}
		logger.info(LOG_EXITING);
		return modelAndView;
	}

}
