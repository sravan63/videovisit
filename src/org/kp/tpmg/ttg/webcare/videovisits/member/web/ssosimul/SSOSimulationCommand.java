package org.kp.tpmg.ttg.webcare.videovisits.member.web.ssosimul;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingsEnvelope;
import org.kp.tpmg.videovisit.model.user.Member;

import net.sf.json.JSONObject;

public class SSOSimulationCommand {

	public SSOSimulationCommand() {
	}

	public static final Logger logger = Logger.getLogger(SSOSimulationCommand.class);

	public static String retrieveActiveMeetingsForMemberAndProxiesForSSOSimul(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				if (ctx.isNonMember()) {
					output = WebService.retrieveActiveMeetingsForNonMemberProxies(
							ctx.getKpOrgSignOnInfo().getUser().getGuid(), request.getSession().getId(),
							WebUtil.clientId);
				} else {
					boolean getProxyMeetings = false;
					if (ctx.getKpOrgSignOnInfo() != null) {
						getProxyMeetings = true;
					}

					output = WebService.retrieveActiveMeetingsForMemberAndProxies(ctx.getMemberDO().getMrn(),
							getProxyMeetings, request.getSession().getId(), WebUtil.clientId);
				}

				if (output != null && "200".equals(output.getStatus().getCode())) {
					List<MeetingDO> memberMeetings = output.getEnvelope().getMeetings();
					if (!isMyMeetingsAvailable(output)) {
						ctx.setTotalmeetings(0);
					} else {
						for (MeetingDO myMeeting : memberMeetings) {
							normalizeMeetingData(myMeeting, ctx.getMeetingCode(), ctx);
							logger.info("Meeting ID = " + myMeeting.getMeetingId());
							logger.debug("Vendor meeting id = " + myMeeting.getMeetingVendorId());
						}
						ctx.setTotalmeetings(memberMeetings.size());
					}
					ctx.setMyMeetings(memberMeetings);
				} else {
					ctx.setMyMeetings(null);
					ctx.setTotalmeetings(0);
				}
				return JSONObject.fromObject(output).toString();
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String performSSOSimulationSignOn(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			WebService.initWebService(request);
			if (ctx != null) {
				String userName = request.getParameter("username");
				String password = request.getParameter("password");

				logger.debug("userName= " + userName + ",password=" + password);
				// check username & password are match with values in properties file values
				// if match ,build KpOrgSignOnInfo object and set it to context
				List<Object> interruptList = new ArrayList<Object>();
				interruptList.add("TNC 365");
				UserInfo user = new UserInfo();
				user.setRegion("MRN");
				user.setEbizAccountRoles(null);
				user.setLastName("ACNCSBPRODS");
				user.setTermsAndCondAccepted("1.6#1460048827682");
				user.setActivationStatusCode("ACTIVE");
				user.setPreferredFirstName("AnthonyAH");
				user.setGuid("410029851");
				user.setEmail("benkponline@yahoom.com");
				user.setAge(41);
				user.setDisabledReasonCode(null);
				user.setEpicEmail("");
				user.setFirstName("ANTHONYAH");
				user.setServiceArea(null);

				KpOrgSignOnInfo kpSignOnInfo = new KpOrgSignOnInfo();
				kpSignOnInfo.setSystemError(null);
				kpSignOnInfo.setInterruptList(interruptList);
				kpSignOnInfo.setSuccess(true);
				kpSignOnInfo.setBusinessError(null);
				kpSignOnInfo.setUser(user);
				kpSignOnInfo.setFailureInfo(null);

				// use below line if enetered credentials does not match with the ones read from properties file
				// strResponse = invalidateWebAppContext(ctx);

				setWebAppContextMemberInfoForSSOSimul(ctx);
				ctx.setKpOrgSignOnInfo(kpSignOnInfo);
				ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());

				strResponse = "200";

			} else {
				logger.warn("SSO Sign on failed as webapp context from the rquest is null");
				strResponse = "400";
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
			if (StringUtils.isBlank(strResponse)) {
				strResponse = "400";
			}

		}
		logger.info(LOG_EXITING);
		return strResponse;
	}

	/**
	 * Check and return true if meetings present. If not return false
	 * 
	 * @param meetingDetails
	 * @return
	 */
	private static boolean isMyMeetingsAvailable(final MeetingDetailsOutput meetingDetails) {
		boolean isMyMeetingsAvailable = false;
		if (meetingDetails != null) {
			final MeetingsEnvelope meetingsEnvelope = meetingDetails.getEnvelope();
			if (meetingsEnvelope != null) {
				final List<MeetingDO> meetingDOs = meetingsEnvelope.getMeetings();
				if (CollectionUtils.isNotEmpty(meetingDOs)) {
					isMyMeetingsAvailable = true;
				}
			}
		}
		return isMyMeetingsAvailable;
	}

	private static void normalizeMeetingData(MeetingDO meeting, String meetingHash, WebAppContext ctx) {
		if (meeting == null) {
			return;
		}
		meeting.setParticipant(meeting.getParticipant());
		meeting.setCaregiver(meeting.getCaregiver());
	}
	
	private static void setWebAppContextMemberInfoForSSOSimul(WebAppContext ctx) {
		Member memberDO = new Member();
		try {
			String dateStr ="2018-01-01";
			if (StringUtils.isNotBlank(dateStr)) {
				if (dateStr.endsWith("Z")) {
					Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime(dateStr);
					memberDO.setDateOfBirth(String.valueOf(cal.getTimeInMillis()));
				} else {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					Date date = sdf.parse("2018-01-01");
					memberDO.setDateOfBirth(String.valueOf(date.getTime()));
				}
			}
		} catch (Exception e) {
			logger.warn("error while parsing string date to long.");
		}
		memberDO.setEmail("umamaheshwar.marripudi@kp.org");
		memberDO.setFirstName(WordUtils.capitalizeFully("UMA"));
		memberDO.setGender("Male");
		memberDO.setLastName(WordUtils.capitalizeFully("M"));
		memberDO.setMiddleName(WordUtils.capitalizeFully("Mahesh"));

		if (StringUtils.isBlank("14404080")) {
			ctx.setNonMember(false);
		} else {
			memberDO.setMrn(WebUtil.fillToLength("14404080", '0', 8));
		}
		ctx.setMemberDO(memberDO);
		ctx.setNonMember(false);//remove it later
	}

}
