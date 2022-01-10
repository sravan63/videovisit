package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class VideoVisitMobilePatientController {

	private static final String JSONMAPPING = "jsonData";
	protected final Logger logger = LoggerFactory.getLogger(VideoVisitMobilePatientController.class);

	@RequestMapping(value = "/videoVisitMobile.htm", method = { RequestMethod.POST, RequestMethod.GET })
	public ModelAndView videoVisitMobile(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(WebUtil.LOG_ENTERED);
		final String mobileBandwidth;
		final ModelAndView modelAndView = new ModelAndView(JSONMAPPING);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx != null) {
			mobileBandwidth = AppProperties.getExtPropertiesValueByKey("MOBILE_BANDWIDTH");
			if (StringUtils.isNotBlank(mobileBandwidth)) {
				ctx.setBandwidth(mobileBandwidth);
			} else {
				ctx.setBandwidth(WebUtil.BANDWIDTH_512_KBPS);
			}
			logger.info("mobileBandwidth : " + mobileBandwidth);

			ctx.setShowPexipPrecall(WebUtil.isSafariOrFFBrowser(request));
			final VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();
			videoVisitParams.setWebrtc(String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			final List<org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO> meetings = ctx.getMyMeetings();
			if (meetings != null) {
				for (org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO meeting : meetings) {
					if (meeting != null && meeting.getMeetingId().equals(request.getParameter("meetingId"))) {
						videoVisitParams.setHostFirstName(meeting.getHost().getFirstName());
						videoVisitParams.setHostLastName(meeting.getHost().getLastName());
						if (meeting.getHost().getTitle() != null && meeting.getHost().getTitle().length() > 0) {
							videoVisitParams.setHostTitle(meeting.getHost().getTitle());
						} else {
							videoVisitParams.setHostTitle("");
						}
						videoVisitParams.setPatientFirstName(meeting.getMember().getFirstName());
						videoVisitParams.setPatientLastName(meeting.getMember().getLastName());
						videoVisitParams.setPatientMiddleName(meeting.getMember().getMiddleName());
						videoVisitParams.setParticipant(meeting.getParticipant());
						videoVisitParams.setCaregiver(meeting.getCaregiver());
						final Calendar cal = Calendar.getInstance();
						cal.setTimeInMillis(Long.parseLong(meeting.getMeetingTime()));
						SimpleDateFormat sfdate = new SimpleDateFormat("MMM dd");
						SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
						videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
						videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));
						videoVisitParams.setVendor(meeting.getVendor());
						videoVisitParams.setVendorHostPin(meeting.getVendorHostPin());
						videoVisitParams.setVendorGuestPin(meeting.getVendorGuestPin());
						videoVisitParams.setVendorRole(meeting.getMember().getVendorRole());
						videoVisitParams.setVendorConfId(meeting.getMeetingVendorId());
						videoVisitParams.setVendorConfig(meeting.getVendorConfig());
					}
				}
			}

			if ("Y".equalsIgnoreCase(request.getParameter("isMember"))) {
				videoVisitParams.setRoomUrl(request.getParameter("roomUrl"));
				videoVisitParams.setUserName(request.getParameter("attendeeName"));
				videoVisitParams.setMeetingId(request.getParameter("meetingId"));
				videoVisitParams.setGuestName(request.getParameter("guestName"));
				videoVisitParams.setIsProvider(request.getParameter("isProvider"));
				videoVisitParams.setGuestUrl(request.getParameter("guestUrl"));
				videoVisitParams.setIsMember("true");
				videoVisitParams.setIsProxyMeeting(request.getParameter("isProxyMeeting"));
				ctx.setVideoVisit(videoVisitParams);
			} else {
				videoVisitParams.setRoomUrl(request.getParameter("roomUrl"));
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

			logger.debug("Video Visit data:" + videoVisitParams.toString());
			logger.info("bandwidth:" + ctx.getBandwidth());
		}
		logger.info(WebUtil.LOG_EXITING);
		return modelAndView;
	}

}
