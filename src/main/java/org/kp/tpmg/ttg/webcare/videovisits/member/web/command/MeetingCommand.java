package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants.SIP;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants.TELEPHONY;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.FAILURE_900;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.FAILURE;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.SSOSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.ServiceCommonOutput;
import org.kp.tpmg.videovisit.model.ServiceCommonOutputJson;
import org.kp.tpmg.videovisit.model.meeting.CreateInstantVendorMeetingOutput;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingJSON;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberDesktopJSON;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingsEnvelope;
import org.kp.tpmg.videovisit.model.meeting.SipParticipant;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberOutput;
import org.kp.tpmg.videovisit.model.notification.MeetingRunningLateOutputJson;
import org.kp.tpmg.videovisit.model.user.Caregiver;
import org.kp.tpmg.videovisit.model.user.Member;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.MemberInfo;
import org.kp.ttg.sharedservice.domain.MemberSSOAuthorizeResponseWrapper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.sf.json.JSONObject;
import net.sourceforge.wurfl.core.Device;

public class MeetingCommand {
	
	public static final Logger logger = Logger.getLogger(MeetingCommand.class);
	public static final int PAST_MINUTES = 120;
	public static final int FUTURE_MINUTES = 15;
	
	private MeetingCommand() {
	}

	public static String verifyMember(final HttpServletRequest request, final HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		VerifyMemberOutput verifyMemberOutput = new VerifyMemberOutput();
		String output = null;
		try {
			String lastName = request.getParameter("last_name");
			String birth_month = request.getParameter("birth_month");
			String birth_year = request.getParameter("birth_year");
			String birth_day = request.getParameter("birth_day");
			String mrn8Digit = "";

			if (StringUtils.isNotBlank(request.getParameter("mrn"))) {
				mrn8Digit = fillToLength(request.getParameter("mrn"), '0', 8);
			}

			if (StringUtils.isNotBlank(lastName)) {
				lastName = WebUtil.replaceSpecialCharacters(lastName);
			}
			verifyMemberOutput = WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, birth_day,
					request.getSession().getId(), WebUtil.VV_MBR_WEB);

			if (verifyMemberOutput != null && verifyMemberOutput.getStatus() != null
					&& WebUtil.SUCCESS_200.equals(verifyMemberOutput.getStatus().getCode())
					&& verifyMemberOutput.getEnvelope() != null
					&& verifyMemberOutput.getEnvelope().getMember() != null) {
				output = WebUtil.prepareCommonOutputJson(ServiceUtil.VERIFY_MEMBER, WebUtil.SUCCESS_200, WebUtil.SUCCESS, verifyMemberOutput.getEnvelope().getMember());
				if(StringUtils.isNotBlank(verifyMemberOutput.getEnvelope().getMember().getMrn())) {
					response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(verifyMemberOutput.getEnvelope().getMember().getMrn()));
				}
			}
			if (StringUtils.isBlank(output)) {
				output = WebUtil.prepareCommonOutputJson(ServiceUtil.VERIFY_MEMBER, FAILURE_900, FAILURE, null);
			}
		} catch (Exception e) {
			logger.error("Error while verifyMember", e);
		}
		return output;
	}
	
	public static String updateEndMeetingLogout(HttpServletRequest request,
			String memberName, boolean notifyVideoForMeetingQuit) throws Exception {
		logger.info(LOG_ENTERED + "notifyVideoForMeetingQuit=" + notifyVideoForMeetingQuit + "]");
		ServiceCommonOutput output = null;
		String result = null;
		long meetingId = 0;
		String mrn = null;
		String clientId = null;
		String loginType = null;
		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			if (StringUtils.isNotBlank(request.getHeader("mrn"))) {
				mrn = request.getHeader("mrn");
			}
			if (StringUtils.isNotBlank(request.getParameter("loginType"))) {
				loginType = request.getParameter("loginType");
			}
			if (StringUtils.isNotBlank(loginType)) {
				clientId = WebUtil.getClientIdByLoginType(loginType);
			}
			if (StringUtils.isNotBlank(request.getHeader("memberName"))) {
				memberName = request.getHeader("memberName");
			}
//					String clientId = notifyVideoForMeetingQuit ? ctx.getBackButtonClientId() : ctx.getClientId();
			output = WebService.memberEndMeetingLogout(mrn, meetingId, request.getSession().getId(), memberName,
					notifyVideoForMeetingQuit, clientId);
			if (output != null) {
				final String responseDesc = output.getStatus() != null
						? output.getStatus().getMessage() + ": " + output.getStatus().getCode()
						: "No reponse from rest service";
				logger.debug("response : " + responseDesc);
			}
			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(output.getName(), output.getStatus().getCode(),
						output.getStatus().getMessage(), "");
			}
		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
			result = JSONObject.fromObject(new SystemError()).toString();
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.UPDATE_MEMBER_MEETING_STATUS, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	/**
	 * Method to invokes rest retrieveMeetingForCaregiver service and adds the
	 * meeting information into the web context and returns MeetingDetailsOutput
	 * JSOn
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public static String retrieveMeetingForCaregiver(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output = null;
		String meetingCode;
		String result = null;
		meetingCode = request.getHeader("meetingHash");
		try {
			output = WebService.retrieveMeetingForCaregiver(meetingCode, request.getSession().getId(),
					WebUtil.VV_MBR_GUEST);
			if (isMyMeetingsAvailable(output)) {
				final List<MeetingDO> myMeetings = output.getEnvelope().getMeetings();
				logger.info("Meetings Size: " + myMeetings.size());
				if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
						&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_CAREGIVER,
							output.getStatus().getCode(), output.getStatus().getMessage(),
							output.getEnvelope() != null ? myMeetings : null);
				}
			}

		} catch (Exception e) {
			logger.error("Error while getActiveMeetingsForCaregiver : " + e.getMessage(), e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_ACTIVE_MEETINGS_FOR_CAREGIVER, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
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

	public static String createCaregiverMeetingSession(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		LaunchMeetingForMemberGuestOutput output = null;
		String result = null;
		try {
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getHeader("patientLastName"));
			boolean isMobileFlow;
			if (WebUtil.TRUE.equalsIgnoreCase(request.getParameter("isMobileFlow"))) {
				isMobileFlow = true;
				logger.info("mobile flow is true");
			} else {
				isMobileFlow = false;
				logger.info("mobile flow is false");
			}
			output = WebService.createCaregiverMeetingSession(meetingCode, patientLastName, isMobileFlow,
					request.getSession().getId(), WebUtil.VV_MBR_GUEST);
			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_GUEST_DESKTOP,
						output.getStatus().getCode(), output.getStatus().getMessage(),
						output.getLaunchMeetingEnvelope() != null ? output.getLaunchMeetingEnvelope().getLaunchMeeting()
								: null);
			}
		} catch (Exception e) {
			logger.error("Error while launchMeetingForMemberGuestDesktop : " + e.getMessage(), e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_GUEST_DESKTOP, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;

	}

	public static String endCaregiverMeetingSession(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String result = null;
		try {
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getHeader("patientLastName");
			logger.info("meetingCode = " + meetingCode);
			output = WebService.endCaregiverMeetingSession(meetingCode, patientLastName, false,
					request.getSession().getId(), WebUtil.VV_MBR_GUEST);

			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.END_MEETING_FOR_MEMBER_GUEST_DESKTOP,
						output.getStatus().getCode(), output.getStatus().getMessage(), "");
			}
		} catch (Exception e) {
			logger.error("Error while endMeetingForMemberGuestDesktop : " + e.getMessage(), e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.END_MEETING_FOR_MEMBER_GUEST_DESKTOP, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String endCaregiverMeetingSession(String meetingCode, String megaMeetingNameDisplayName,
			String sessionId, HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String jsonString = null;
		try {
			final WebAppContext ctx = WebAppContext.getWebAppContext(request);
			final String clientId = ctx != null ? ctx.getBackButtonClientId() : WebUtil.VV_MBR_BACK_BUTTON;
			logger.info("meetingCode = " + meetingCode);
			if (StringUtils.isNotBlank(meetingCode)) {
				output = WebService.endCaregiverMeetingSession(meetingCode, megaMeetingNameDisplayName, true,
						sessionId, clientId);
			}
			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.info("json output" + jsonString);
			}

		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;

	}

	private static String fillToLength(String src, char fillChar, int total_length) {
		String ret;
		if (src.length() < total_length) {
			int count = total_length - src.length();
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < count; i++) {
				sb.append(fillChar);
			}
			sb.append(src);
			ret = sb.toString();
		} else {
			ret = src;
		}
		return ret;
	}

	public static String createInstantVendorMeeting(HttpServletRequest request,
			String hostNuid, String[] participantNuid, String memberMrn, String meetingType) throws Exception {
		logger.info(LOG_ENTERED);
		CreateInstantVendorMeetingOutput output = null;
		String result = null;
		try {
			output = WebService.createInstantVendorMeeting(hostNuid, participantNuid, memberMrn, meetingType,
					request.getSession().getId(), WebUtil.VV_MBR_WEB);
			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.CREATE_INSTANT_VENDOR_MEETING,
						output.getStatus().getCode(), output.getStatus().getMessage(),
						output.getEnvelope() != null ? output.getEnvelope().getMeeting() : null);
			}
		} catch (Exception e) {
			logger.error("Error while createInstantVendorMeeting : " + e.getMessage(), e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.CREATE_INSTANT_VENDOR_MEETING, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String terminateSetupWizardMeeting(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String jsonString = null;
		long meetingId = 0;
		String vendorConfId = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			} else {
				return "MeetingCommand.terminateSetupWizardMeeting -> Validation Error: Meeting Id can not be null or blank.";
			}

			if (StringUtils.isNotBlank(request.getParameter("vendorConfId"))) {
				vendorConfId = request.getParameter("vendorConfId");
			}

			WebService.initWebService(request);
			String hostNuid = WebService.getSetupWizardHostNuid();
			final String clientId = WebUtil.getClientIdFromContext(ctx);
			output = WebService.terminateInstantMeeting(meetingId, vendorConfId, hostNuid,
					request.getSession().getId(), clientId);

			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.info("json output" + jsonString);
			}

		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;
	}

	public static String performSSOSignOn(final HttpServletRequest request, final HttpServletResponse response) throws Exception {logger.info(LOG_ENTERED);
	String strResponse = null;
	try {
		WebService.initWebService(request);
		String userName = request.getParameter("username");
		String password = request.getParameter("password");

		logger.debug("userName= " + userName + ",password=" + password);
		KpOrgSignOnInfo kpOrgSignOnInfo = null;
		if (StringUtils.isNotBlank(userName) && StringUtils.isNotBlank(password)) {
			if (!WebUtil.isSsoSimulation()) {
				kpOrgSignOnInfo = WebService.performKpOrgSSOSignOn(userName, password);
				if (kpOrgSignOnInfo == null) {
					logger.warn("SSO Sign on failed due to KP org signon Service unavailability.");
				} else {
					if (!kpOrgSignOnInfo.isSuccess() || StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
							|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError())) {
						logger.warn("SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
					} else if (kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null
							&& StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid()))) {
						logger.warn("SSO Sign on service failed to return GUID for a user");
					} else if (StringUtils.isBlank(kpOrgSignOnInfo.getSsoSession())) {
						logger.warn("SSO Sign on service failed to return SSOSESSION for a user");
					} else {
						final AuthorizeResponseVo authorizeMemberResponse = WebService
								.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
						if (authorizeMemberResponse == null) {
							logger.warn("SSO Sign on failed due to unavailability of Member SSO Auth API");
						} else {
							if (authorizeMemberResponse.getResponseWrapper() == null) {
								logger.warn("SSO Sign on failed due to Member SSO Auth API authorization failure");
							} else {
								if (validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper())) {
									logger.info("SSO Sign on successful and setting member info into web app context");
									final SSOSignOnInfo signOnOutput = new SSOSignOnInfo();
									signOnOutput.setMemberInfo(authorizeMemberResponse.getResponseWrapper().getMemberInfo());
									signOnOutput.setKpOrgSignOnInfo(kpOrgSignOnInfo);
									signOnOutput.setSsoSession(kpOrgSignOnInfo.getSsoSession());
									strResponse = WebUtil.prepareCommonOutputJson("ssoSubmitLogin", "200", "success", signOnOutput);
									logger.info("ssosession to be set in cookie:" + kpOrgSignOnInfo.getSsoSession());
									WebUtil.setCookie(response, WebUtil.getSSOCookieName(), kpOrgSignOnInfo.getSsoSession());
								}
							}

						}
					}
				}
			} else {
				final String memberName = getExtPropertiesValueByKey("MEMBER_USERNAME");
				final String memberPassword = getExtPropertiesValueByKey("MEMBER_PASSWORD");
				kpOrgSignOnInfo = new KpOrgSignOnInfo();
				kpOrgSignOnInfo.setSsoSession(request.getSession().getId());
				final MemberInfo memberInfo = new MemberInfo();
				if (StringUtils.isNotBlank(memberName) && StringUtils.isNotBlank(memberPassword)
						&& memberName.equalsIgnoreCase(userName) && memberPassword.equalsIgnoreCase(password)) {
					final UserInfo user = new UserInfo();
					user.setLastName(getExtPropertiesValueByKey("MEMBER_LAST_NAME"));
					user.setGuid(getExtPropertiesValueByKey("MEMBER_GUID"));
					user.setEmail(getExtPropertiesValueByKey("MEMBER_EMAIL"));
					user.setAge(Integer.parseInt(getExtPropertiesValueByKey("MEMBER_AGE")));
					user.setFirstName(getExtPropertiesValueByKey("MEMBER_FIRST_NAME"));
					user.setServiceArea(null);

					kpOrgSignOnInfo.setSystemError(null);
					kpOrgSignOnInfo.setSuccess(true);
					kpOrgSignOnInfo.setBusinessError(null);
					kpOrgSignOnInfo.setUser(user);
					kpOrgSignOnInfo.setFailureInfo(null);

					memberInfo.setMrn(getExtPropertiesValueByKey("MEMBER_MRN"));
					memberInfo.setDateOfBirth(getExtPropertiesValueByKey("MEMBER_DATE_OF_BIRTH"));
					memberInfo.setFirstName(getExtPropertiesValueByKey("MEMBER_FIRST_NAME"));
					memberInfo.setLastName(getExtPropertiesValueByKey("MEMBER_LAST_NAME"));
					memberInfo.setMiddleName(getExtPropertiesValueByKey("MEMBER_MIDDLE_NAME"));
					memberInfo.setEmail("");
					memberInfo.setGender(getExtPropertiesValueByKey("MEMBER_GENDER"));

				} 
				final SSOSignOnInfo signOnOutput = new SSOSignOnInfo();
				signOnOutput.setMemberInfo(memberInfo);
				signOnOutput.setKpOrgSignOnInfo(kpOrgSignOnInfo);
				signOnOutput.setSsoSession(kpOrgSignOnInfo.getSsoSession());
				strResponse = WebUtil.prepareCommonOutputJson("ssoSubmitLogin", "200", "success", signOnOutput);
				logger.info("ssosession to be set in cookie:" + kpOrgSignOnInfo.getSsoSession());
				WebUtil.setCookie(response, WebUtil.getSSOCookieName(), kpOrgSignOnInfo.getSsoSession());
			}
		}
	} catch (Exception e) {
		logger.error("System Error" + e.getMessage(), e);
	}
	if(StringUtils.isBlank(strResponse)) {
		strResponse = WebUtil.prepareCommonOutputJson("ssoSubmitLogin", "400", "failure", null);
	}
	logger.info(LOG_EXITING);
	return strResponse;}

	
	private static boolean validateMemberSSOAuthResponse(MemberSSOAuthorizeResponseWrapper responseWrapper) {
		logger.info(LOG_ENTERED);
		boolean isValid = false;

		if (responseWrapper.getMemberAuthResponseStatus() != null
				&& !responseWrapper.getMemberAuthResponseStatus().isSuccess()) {
			logger.warn("SSO Sign on failed due to Member SSO Auth API authorization failure.");

		} else if (responseWrapper.getMemberInfo() == null) {
			logger.warn("SSO Sign on failed as Member SSO Auth API failed to return valid Member info.");

		} else {
			logger.debug("Account Role from Member SSO Auth API = " + responseWrapper.getMemberInfo().getAccountRole());

			if ("MBR".equalsIgnoreCase(responseWrapper.getMemberInfo().getAccountRole())
					&& StringUtils.isBlank(responseWrapper.getMemberInfo().getMrn())) {
				logger.warn("SSO Sign on failed as Member SSO Auth API failed to return MRN for a Member.");

			} else if (StringUtils.isBlank(responseWrapper.getMemberInfo().getAccountRole())
					|| (!"MBR".equalsIgnoreCase(responseWrapper.getMemberInfo().getAccountRole()))) {
				logger.info("Non Member Sign on.");
				isValid = true;
			} else {
				isValid = true;
			}
		}
		logger.info(LOG_EXITING + "isValid =" + isValid);
		return isValid;
	}

	public static void setWebAppContextMemberInfo(WebAppContext ctx, MemberInfo memberInfo) {
		final Member memberDO = new Member();
		try {
			final String dateStr = memberInfo.getDateOfBirth();
			if (StringUtils.isNotBlank(dateStr)) {
				if (dateStr.endsWith("Z")) {
					Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime(dateStr);
					memberDO.setDateOfBirth(String.valueOf(cal.getTimeInMillis()));
				} else {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					Date date = sdf.parse(memberInfo.getDateOfBirth());
					memberDO.setDateOfBirth(String.valueOf(date.getTime()));
				}
			}
		} catch (Exception e) {
			logger.warn("error while parsing string date to long.");
		}
		memberDO.setEmail(memberInfo.getEmail());
		memberDO.setFirstName(WordUtils.capitalizeFully(memberInfo.getFirstName()));
		memberDO.setGender(memberInfo.getGender());
		memberDO.setLastName(WordUtils.capitalizeFully(memberInfo.getLastName()));
		memberDO.setMiddleName(WordUtils.capitalizeFully(memberInfo.getMiddleName()));

		if (StringUtils.isBlank(memberInfo.getMrn())) {
			ctx.setNonMember(true);
		} else {
			memberDO.setMrn(WebUtil.fillToLength(memberInfo.getMrn(), '0', 8));
		}
		ctx.setMemberDO(memberDO);
	}

	public static String validateKpOrgSSOSession(HttpServletRequest request,
			String ssoSession) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebService.initWebService(request);
				KpOrgSignOnInfo kpOrgSignOnInfo = WebService.validateKpOrgSSOSession(ssoSession);

				if (kpOrgSignOnInfo == null) {
					logger.warn("SSO Sign on failed due to KP org signon Service unavailability.");
				} else {
					if (!kpOrgSignOnInfo.isSuccess() && (StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
							|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError()))) {
						logger.warn(
								"SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
					} else if (kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null
							&& StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid()))) {
						logger.warn("SSO Sign on service failed to return GUID for a user");
					} else {

						AuthorizeResponseVo authorizeMemberResponse = WebService
								.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
						if (authorizeMemberResponse == null) {
							logger.warn("SSO Sign on failed due to unavailability of Member SSO Auth API");
						} else {
							// check for errors returned
							if (authorizeMemberResponse.getResponseWrapper() == null) {
								logger.warn("SSO Sign on failed due to Member SSO Auth API authorization failure");
							} else {
								if (validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper())) {
									logger.info("validateKpOrgSSOSession successful");
									SSOSignOnInfo signOnOutput = new SSOSignOnInfo();
									signOnOutput.setMemberInfo(authorizeMemberResponse.getResponseWrapper().getMemberInfo());
									signOnOutput.setKpOrgSignOnInfo(kpOrgSignOnInfo);
									signOnOutput.setSsoSession(kpOrgSignOnInfo.getSsoSession());
									strResponse = WebUtil.prepareCommonOutputJson("ssoPreLogin", "200", "success", signOnOutput);
								}

							}

						}
					}
				}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		if(StringUtils.isBlank(strResponse)) {
			strResponse = WebUtil.prepareCommonOutputJson("ssoPreLogin", "400", "failure", null);
		}
		logger.info(LOG_EXITING);
		return strResponse;
	}

	public static String logout(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			if (WebUtil.SSO.equalsIgnoreCase(request.getParameter(WebUtil.LOGIN_TYPE))
					&& StringUtils.isNotBlank(request.getHeader(WebUtil.SSO_SESSION))) {
				WebService.initWebService(request);
				WebService.performKpOrgSSOSignOff(request.getHeader(WebUtil.SSO_SESSION));
			}
			WebUtil.removeCookie(request, response, WebUtil.getSSOCookieName());
			WebUtil.removeCookie(request, response, WebUtil.HSESSIONID_COOKIE_NAME);
			WebUtil.removeCookie(request, response, WebUtil.S_COOKIE_NAME);
			output = WebUtil.prepareCommonOutputJson("logout", "200", "success", "");
			final String loginType = request.getParameter(WebUtil.LOGIN_TYPE);
			if (WebUtil.SSO.equalsIgnoreCase(loginType) || WebUtil.TEMP_ACCESS.equalsIgnoreCase(loginType)) {
				memberLogout(request);
			}
		} catch (Exception e) {
			logger.error("Error while logout : ", e);
		}
		if (StringUtils.isBlank(output)) {
			output = WebUtil.prepareCommonOutputJson("logout", FAILURE_900, FAILURE, "");
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static void performSSOSignOff(HttpServletRequest request, HttpServletResponse response, final String ssoSession) {
		logger.info(LOG_ENTERED);
		try {
			WebService.initWebService(request);
			WebService.performKpOrgSSOSignOff(ssoSession);
			WebUtil.removeCookie(request, response, WebUtil.getSSOCookieName());
			WebUtil.removeCookie(request, response, WebUtil.HSESSIONID_COOKIE_NAME);
			WebUtil.removeCookie(request, response, WebUtil.S_COOKIE_NAME);
		} catch (Exception e) {
			logger.error("Error while performSSOSignOff : ", e);
		}
		logger.info(LOG_EXITING);
	}

	public static String setKPHCConferenceStatus(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		long meetingId = 0;
		String result = null;
		String clientId = null;
		final String loginType = request.getParameter("loginType");
		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			if (StringUtils.isNotBlank(loginType)) {
				clientId = WebUtil.getClientIdByLoginType(loginType);
			}
			final String status = request.getParameter("status");
			final String careGiverName = request.getHeader("careGiverName");
			logger.info("meetingId=" + meetingId + ", status=" + status);

			boolean isProxyMeeting = false;
			if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
				isProxyMeeting = true;
			}

			output = WebService.setKPHCConferenceStatus(meetingId, status, isProxyMeeting, careGiverName,
					request.getSession().getId(), clientId);
			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.SET_KPHC_CONFERENCE_STATUS,
						output.getStatus().getCode(), output.getStatus().getMessage(), "");
			}

		} catch (Exception e) {
			logger.error("Error while setKPHCConferenceStatus for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.SET_KPHC_CONFERENCE_STATUS, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING + "Result: " + result);
		return result;
	}

	public static String retrieveActiveMeetingsForMemberAndProxies(HttpServletRequest request) throws Exception {logger.info(LOG_ENTERED);
	MeetingDetailsOutput output = null;
	String jsonStr = null;
	try {
		final String guid = request.getHeader("guid");
		final String mrn = request.getHeader("mrn");
		final boolean isNonMember = "true".equalsIgnoreCase(request.getHeader("isNonMember"));
		final String proxyMeetings = request.getParameter("getProxyMeetings");
		if (WebUtil.isSsoSimulation()) {
			output = WebService.getActiveMeetingsForSSOSimulation(mrn, isNonMember,
					request.getSession().getId(), WebUtil.VV_MBR_SSO_SIM_WEB);
		} else {
			if (isNonMember) {
				output = WebService.retrieveActiveMeetingsForNonMemberProxies(guid, request.getSession().getId(), WebUtil.VV_MBR_SSO_WEB);
			} else if (StringUtils.isNotBlank(mrn)) {
				boolean getProxyMeetings = false;
				if ("true".equalsIgnoreCase(proxyMeetings)) {
					getProxyMeetings = true;
				}
				output = WebService.retrieveActiveMeetingsForMemberAndProxies(mrn, getProxyMeetings, request.getSession().getId(), WebUtil.VV_MBR_SSO_WEB);
			}
		}
		if (output != null && "200".equals(output.getStatus().getCode())) {
			if (isMyMeetingsAvailable(output)) {
				final List<MeetingDO> meetings = output.getEnvelope().getMeetings();
				final Gson gson = new GsonBuilder().serializeNulls().create();
				jsonStr = gson.toJson(meetings);
				jsonStr = WebUtil.prepareCommonOutputJson("retrieveActiveMeetingsForMemberAndProxies", "200", "success", meetings);
			}
		}
	} catch (Exception e) {
		logger.error("System Error" + e.getMessage(), e);
	}
	logger.info(LOG_EXITING);
	return jsonStr;}


	public static String launchMemberOrProxyMeetingForMember(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		LaunchMeetingForMemberDesktopJSON output = new LaunchMeetingForMemberDesktopJSON();
		String mrn = null;
		String jsonOutput = null;
		Gson gson = new GsonBuilder().serializeNulls().create();
		String inMeetingDisplayName = null;
		String result = null;
		String desktopBandwidth = null;
		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			if (StringUtils.isNotBlank(request.getHeader("mrn"))) {
				mrn = request.getHeader("mrn");
			}
			if (StringUtils.isNotBlank(request.getHeader("inMeetingDisplayName"))) {
				inMeetingDisplayName = request.getHeader("inMeetingDisplayName");
			}
			logger.info("meetingId=" + meetingId + ", isProxyMeeting=" + request.getParameter("isProxyMeeting"));
			boolean isProxyMeeting;
			if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
				isProxyMeeting = true;
			} else {
				isProxyMeeting = false;
			}
			if (AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH") != null) {
				desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			} else {
				desktopBandwidth = WebUtil.BANDWIDTH_1024_KBPS;
			}
			jsonOutput = WebService.launchMemberOrProxyMeetingForMember(meetingId, mrn, inMeetingDisplayName,
					isProxyMeeting, request.getSession().getId(), WebUtil.VV_MBR_WEB);
			output = gson.fromJson(jsonOutput, LaunchMeetingForMemberDesktopJSON.class);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getLaunchMeetingEnvelope() != null
								? output.getService().getLaunchMeetingEnvelope().getLaunchMeeting()
								: null);
				result = WebUtil.setBandWidth(result, desktopBandwidth, "data");
			}
		} catch (Exception e) {
			logger.error("Error while launchMemberOrProxyMeetingForMember for meetingId:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String memberLeaveProxyMeeting(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		JoinLeaveMeetingJSON output = null;
		String result = null;
		try {
			output = WebService.memberLeaveProxyMeeting(request.getHeader("meetingId"), request.getHeader("memberName"),
					request.getSession().getId(), false, WebUtil.VV_MBR_WEB);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
			}
		} catch (Exception e) {
			logger.error("Error while leaveMeeting : " + e.getMessage(), e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String getLaunchMeetingDetailsForMemberGuest(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		LaunchMeetingForMemberGuestOutput launchMeetingForMemberGuest = new LaunchMeetingForMemberGuestOutput();
		String meetingCode = null;
		String patientLastName = null;
		String json = "";
		String deviceType = null;

		try {
			logger.info("meetingCode=" + request.getParameter("meetingCode") + ", isMobileFlow="
					+ request.getParameter("isMobileFlow"));
			logger.debug("patientLastName before replace special characters =" + request.getParameter("patientLastName"));

			meetingCode = request.getParameter("meetingCode");
			patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			logger.debug("patientLastName after replace special characters =" + patientLastName);
			boolean isMobileFlow;
			if ("true".equalsIgnoreCase(request.getParameter("isMobileFlow"))) {
				isMobileFlow = true;
				logger.info("mobile flow is true");
			} else {
				isMobileFlow = false;
				logger.info("mobile flow is false");
			}
			Device device = DeviceDetectionService.checkForDevice(request);
			Map<String, String> capabilities = device.getCapabilities();

			String brandName = capabilities.get("brand_name");
			String modelName = capabilities.get("model_name");
			String deviceOs = capabilities.get("device_os");
			String deviceOsVersion = capabilities.get("device_os_version");

			if (brandName != null && modelName != null) {
				deviceType = brandName + " " + modelName;
			}
			launchMeetingForMemberGuest = WebService.getMeetingDetailsForMemberGuest(meetingCode, patientLastName,
					deviceType, deviceOs, deviceOsVersion, isMobileFlow, request.getSession().getId(),
					ctx.getClientId());
			if (launchMeetingForMemberGuest != null) {
				String statusCode = launchMeetingForMemberGuest.getStatus().getCode();
				if (statusCode != "200") {
					ctx.setCareGiver(false);

				}
				ctx.setCareGiver(true);
				Gson gson = new Gson();
				json = gson.toJson(launchMeetingForMemberGuest);
				logger.debug("json output" + json);
				return json;
			}

		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String launchMeetingForMemberDesktop(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		String megaMeetingDisplayName = null;
		LaunchMeetingForMemberDesktopJSON output = new LaunchMeetingForMemberDesktopJSON();
		String mrn = null;
		String jsonOutput = null;
		String result = null;
		Gson gson = new GsonBuilder().serializeNulls().create();
		String desktopBandwidth = null;
		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}
			if (StringUtils.isNotBlank(request.getHeader("megaMeetingDisplayName"))) {
				megaMeetingDisplayName = request.getHeader("megaMeetingDisplayName");
			}
			if (StringUtils.isNotBlank(request.getHeader("mrn"))) {
				mrn = request.getHeader("mrn");
			}
			if (AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH") != null) {
				desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			} else {
				desktopBandwidth = WebUtil.BANDWIDTH_1024_KBPS;
			}
			jsonOutput = WebService.launchMeetingForMemberDesktop(meetingId, megaMeetingDisplayName, mrn,
					request.getSession().getId(), WebUtil.VV_MBR_WEB);
			output = gson.fromJson(jsonOutput, LaunchMeetingForMemberDesktopJSON.class);

			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getLaunchMeetingEnvelope() != null
								? output.getService().getLaunchMeetingEnvelope().getLaunchMeeting()
								: null);
				result = WebUtil.setBandWidth(result, desktopBandwidth, "data");
			}
			logger.debug("json output: = " + output);
		} catch (Exception e) {
			logger.error("Error while launchMeetingForMemberDesktop for meetingId:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}


	public static String getLaunchMeetingDetailsForMember(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		String deviceType = null;
		boolean isMobileflow = true;
		String output = null;
		String inMeetingDisplayName = null;
		String mrn = null;
		try {
			logger.info("meetingid=" + request.getParameter("meetingId"));
			logger.debug("In meetingdisplayname=" + request.getParameter("inMeetingDisplayName"));
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			}

			if (StringUtils.isNotBlank(request.getParameter("inMeetingDisplayName"))) {
				inMeetingDisplayName = request.getParameter("inMeetingDisplayName");
			}
			if (StringUtils.isNotBlank(request.getParameter("mrn"))) {
				inMeetingDisplayName = request.getParameter("mrn");
			}
			Device device = DeviceDetectionService.checkForDevice(request);
			Map<String, String> capabilities = device.getCapabilities();

			logger.debug("Mobile capabilities" + capabilities);
			String brandName = capabilities.get("brand_name");
			String modelName = capabilities.get("model_name");
			String deviceOs = capabilities.get("device_os");
			String deviceOsVersion = capabilities.get("device_os_version");

			if (brandName != null && modelName != null) {
				deviceType = brandName + " " + modelName;
			}
			output = WebService.getLaunchMeetingDetails(meetingId, inMeetingDisplayName, request.getSession().getId(),
					mrn, deviceType, deviceOs, deviceOsVersion, isMobileflow);
			if (output != null) {
				logger.debug("json output:" + output);
				logger.info(LOG_EXITING);
				return output;
			}

		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String memberLogout(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			output = WebService.memberLogout(request.getParameter("mrn"), request.getSession().getId());
		} catch (Exception e) {
			logger.error("Error while memberLogout", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	/**
	 * @param request
	 * @param response
	 * @return
	 */
	public static String getProviderRunningLateDetails(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final String meetingId = request.getParameter("meetingId");
		final Gson gson = new Gson();
		String jsonOutput = null;
		String result = null;
		MeetingRunningLateOutputJson output = new MeetingRunningLateOutputJson();
		try {
			jsonOutput = WebService.getProviderRunningLateDetails(meetingId, request.getSession().getId(),
					WebUtil.VV_MBR_WEB);
			output = gson.fromJson(jsonOutput, MeetingRunningLateOutputJson.class);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getRunningLateEnvelope() != null
								? output.getService().getRunningLateEnvelope()
								: null);
			}

		} catch (Exception e) {
			logger.error("Error while getProviderRunningLateDetails for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String caregiverJoinLeaveMeeting(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		final String meetingId = request.getParameter("meetingId");
		final String meetingHash = request.getParameter("meetingHash");
		String joinOrLeave = request.getParameter("status");
		ServiceCommonOutputJson output = new ServiceCommonOutputJson();
		Gson gson = new GsonBuilder().serializeNulls().create();
		String desktopBandwidth = null;
		if (StringUtils.isNotEmpty(joinOrLeave)) {
			joinOrLeave = joinOrLeave.trim();
		}
		try {
			jsonOutput = WebService.caregiverJoinLeaveMeeting(meetingId, meetingHash, joinOrLeave,
					request.getSession().getId(), WebUtil.VV_MBR_GUEST);
			output = gson.fromJson(jsonOutput, ServiceCommonOutputJson.class);
			if (AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH") != null) {
				desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			}
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
				result = WebUtil.setBandWidth(result, desktopBandwidth, "");
			}
		} catch (Exception e) {
			logger.error("Error while joinLeaveMeetingForMemberGuest for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static void updateEmailAction(final String meetingId, final String userType, final String action,
			final String sessionId) {
		logger.info(LOG_ENTERED);
		final Gson gson = new Gson();
		String statusCode = "";
		try {
			String output = WebService.updateEmailAction(meetingId, userType, action, sessionId);
			final ServiceCommonOutputJson outputJson = gson.fromJson(output, ServiceCommonOutputJson.class);
			if (outputJson != null && outputJson.getService() != null && outputJson.getService().getStatus() != null) {
				statusCode = outputJson.getService().getStatus().getCode();
				if ("200".equalsIgnoreCase(statusCode)) {
					logger.info("Successfully updated about email interaction for meeting : " + meetingId);
				} else {
					logger.info("Failed to update about email interaction for meeting : " + meetingId
							+ ", Status from Servcie API : [Code : " + outputJson.getService().getStatus().getCode()
							+ ", Message : " + outputJson.getService().getStatus().getMessage() + "].");
				}
			}
		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
	}
	
	public static String logVendorMeetingEvents(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		String clientId = null;
		final String meetingId = request.getParameter("meetingId");
		final String userType = request.getParameter("userType");
		final String userId = request.getParameter("userId");
		final String eventName = request.getParameter("eventName");
		final String eventDescription = request.getParameter("eventDescription");
		final String logType = request.getParameter("logType");
		final String sessionId = request.getSession().getId();
		final String loginType = request.getParameter("loginType");
		ServiceCommonOutputJson output = new ServiceCommonOutputJson();
		final Gson gson = new Gson();
		try {
			if (StringUtils.isNotBlank(loginType)) {
				clientId = WebUtil.getClientIdByLoginType(loginType);
			}
			jsonOutput = WebService.logVendorMeetingEvents(WebUtil.convertStringToLong(meetingId), userType, userId,
					eventName, eventDescription, logType, sessionId, clientId);
			output = gson.fromJson(jsonOutput, ServiceCommonOutputJson.class);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.LOG_VENDOR_MEETING_EVENTS,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
			}
		} catch (Exception e) {
			logger.error("Error while logVendorMeetingEvents for meeting :" + meetingId + " : ", e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.LOG_VENDOR_MEETING_EVENTS, FAILURE_900, FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	/**
	 * @param request
	 */
	public static void updateWebappContext(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		final String meetingId = request.getParameter("meetingId");
		final String userType = request.getParameter("userType");
		final String firstName = request.getParameter("firstName");
		final String email = request.getParameter("email");
		final String displayName = request.getParameter("displayName");
		final String destination = request.getParameter("destination");
		final String participantType = request.getParameter("participantType");
		if (ctx != null && StringUtils.isNotBlank(meetingId) && StringUtils.isNotBlank(userType)) {
			if (TELEPHONY.equalsIgnoreCase(userType)) {
				addCaregiverToContext(ctx, meetingId, firstName, MemberConstants.AUDIO_PARTICIPANT, email);
			} else if (SIP.equalsIgnoreCase(userType)) {
				addSipParticipantToContext(ctx, meetingId, displayName, destination, participantType);
			}
		}
		logger.info(LOG_EXITING);
	}

	private static void addCaregiverToContext(final WebAppContext ctx, final String meetingId, final String firstName,
			final String lastName, final String email) {
		final Caregiver caregiver = new Caregiver();
		caregiver.setFirstName(firstName);
		caregiver.setLastName(lastName);
		caregiver.setEmailAddress(email);
		final MeetingDO meeting = ctx.getMyMeetingByMeetingId(meetingId);
		if (meeting != null) {
			List<Caregiver> caregivers = meeting.getCaregiver();
			if (CollectionUtils.isNotEmpty(caregivers)) {
				if (!ctx.isCaregiverExist(meetingId, firstName, lastName, email)) {
					caregivers.add(caregiver);
				}
			} else {
				caregivers = new ArrayList<Caregiver>(1);
				caregivers.add(caregiver);
			}
		}
	}
	
	private static void addSipParticipantToContext(final WebAppContext ctx, final String meetingId,
			final String displayName, final String destination, final String participantType) {
		final SipParticipant sipParticipant = new SipParticipant();
		sipParticipant.setDestination(destination);
		sipParticipant.setDisplayName(displayName);
		sipParticipant.setParticipantType(participantType);
		final MeetingDO meeting = ctx.getMyMeetingByMeetingId(meetingId);
		if (meeting != null) {
			List<SipParticipant> sipParticipants = meeting.getSipParticipants();
			if (CollectionUtils.isNotEmpty(sipParticipants)) {
				final SipParticipant locSipParticipant = getSipParticipant(meeting, destination);
				if (locSipParticipant == null) {
					sipParticipants.add(sipParticipant);
				} else {
					locSipParticipant.setDisplayName(displayName);
				}
			} else {
				sipParticipants = new ArrayList<SipParticipant>(1);
				sipParticipants.add(sipParticipant);
				meeting.setSipParticipants(sipParticipants);
			}
		}
	}
	
	/**
	 * @param meetingId
	 * @param destination
	 * @return
	 */
	private static SipParticipant getSipParticipant(final MeetingDO meeting, final String destination) {
		SipParticipant sipParticipant = null;
		if (StringUtils.isNotBlank(destination) && CollectionUtils.isNotEmpty(meeting.getSipParticipants())) {
			for (SipParticipant locSipParticipant : meeting.getSipParticipants()) {
				if (destination.equalsIgnoreCase(locSipParticipant.getDestination())) {
					sipParticipant = locSipParticipant;
					break;
				}
			}
		}
		return sipParticipant;
	}
	
	/**
	 * @param request
	 *            request
	 */
	public static String getMeetingDetails(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final String meetingId = request.getParameter("meetingId");
		String result = null;
		String jsonOutput = null;
		MeetingDetailsForMeetingIdJSON output = new MeetingDetailsForMeetingIdJSON();
		String clientId = null;
		String loginType = request.getParameter("loginType");
		final Gson gson = new Gson();
		try {
			if (StringUtils.isNotBlank(loginType)) {
				clientId = WebUtil.getClientIdByLoginType(loginType);
			}
			jsonOutput = WebService.getMeetingDetailsForMeetingId(Long.parseLong(meetingId),
					request.getSession().getId(), clientId);
			output = gson.fromJson(jsonOutput, MeetingDetailsForMeetingIdJSON.class);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getEnvelope() != null ? output.getService().getEnvelope().getMeeting()
								: null);
			}
		} catch (Exception e) {
			logger.error("Error while getMeetingDetailsForMeetingId for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String joinLeaveMeeting(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String output = null;
		String deviceType = null;
		final String meetingId = request.getParameter("meetingId");
		final String inMeetingDisplayName = request.getParameter("inMeetingDisplayName");
		final boolean isPatient = "true".equalsIgnoreCase(request.getParameter("isPatient")) ? true : false;
		final String joinLeaveMeeting = request.getParameter("joinLeaveMeeting");
		final String sessionId = request.getSession().getId();
		final String clientId = WebUtil.KPPC;
		
		try {
			final Gson gson = new GsonBuilder().serializeNulls().create();
			final Device device = DeviceDetectionService.checkForDevice(request);
			final Map<String, String> capabilities = device.getCapabilities();
			final String brandName = capabilities.get("brand_name");
			final String modelName = capabilities.get("model_name");
			final String deviceOs = StringUtils.isNotBlank(capabilities.get("device_os"))
					? capabilities.get("device_os")
					: WebUtil.getDeviceOs();
			final String deviceOsVersion = StringUtils.isNotBlank(capabilities.get("device_os_version"))
					? capabilities.get("device_os_version")
					: WebUtil.getDeviceOsVersion();

			if (brandName != null && modelName != null) {
				deviceType = brandName + " " + modelName;
			}
			if (StringUtils.isBlank(deviceType)) {
				deviceType = WebUtil.DEFAULT_DEVICE;
			}
			final JoinLeaveMeetingJSON joinLeaveMeetingJSON = WebService.joinLeaveMeeting(WebUtil.convertStringToLong(meetingId), inMeetingDisplayName,
					isPatient,joinLeaveMeeting, deviceType, deviceOs, deviceOsVersion, clientId, sessionId);
			if(joinLeaveMeetingJSON != null && joinLeaveMeetingJSON.getService() != null 
					&& joinLeaveMeetingJSON.getService().getStatus() != null) {
				output = gson.toJson(joinLeaveMeetingJSON.getService().getStatus());
			}
		} catch (Exception e) {
			output = new Gson().toJson(new SystemError());
			logger.error("System Error for meeting :" + meetingId + " : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
	
	public static void updateWebappContextWithPexipMobileBrowserDetails(WebAppContext ctx) {
		if (ctx != null) {
			final String pexMobBlockSafariVer = getExtPropertiesValueByKey("PEXIP_MOBILE_BLOCK_SAFARI_VERSION");
			final String pexMobBlockChromeVer = getExtPropertiesValueByKey("PEXIP_MOBILE_BLOCK_CHROME_VERSION");
			final String pexMobBlockFirefoxVer = getExtPropertiesValueByKey("PEXIP_MOBILE_BLOCK_FIREFOX_VERSION");
			if (StringUtils.isNotBlank(pexMobBlockSafariVer)) {
				ctx.setPexMobBlockSafariVer(pexMobBlockSafariVer);
			}
			if (StringUtils.isNotBlank(pexMobBlockChromeVer)) {
				ctx.setPexMobBlockChromeVer(pexMobBlockChromeVer);
			}
			if (StringUtils.isNotBlank(pexMobBlockFirefoxVer)) {
				ctx.setPexMobBlockFirefoxVer(pexMobBlockFirefoxVer);
			}
		}
	}
	
	public static void updateWebappContextWithPexipDesktopBrowserDetails(WebAppContext ctx) {
		if (ctx != null) {
			final String pexDesktopBlockSafariVer = getExtPropertiesValueByKey("PEXIP_BLOCK_SAFARI_VERSION");
			final String pexDesktopBlockChromeVer = getExtPropertiesValueByKey("PEXIP_BLOCK_CHROME_VERSION");
			final String pexDesktopBlockFirefoxVer = getExtPropertiesValueByKey("PEXIP_BLOCK_FIREFOX_VERSION");
			final String pexDesktopBlockEdgeVer = getExtPropertiesValueByKey("PEXIP_BLOCK_EDGE_VERSION");
			if (StringUtils.isNotBlank(pexDesktopBlockSafariVer)) {
				ctx.setPexBlockSafariVer(pexDesktopBlockSafariVer);
			}
			if (StringUtils.isNotBlank(pexDesktopBlockChromeVer)) {
				ctx.setPexBlockChromeVer(pexDesktopBlockChromeVer);
			}
			if (StringUtils.isNotBlank(pexDesktopBlockFirefoxVer)) {
				ctx.setPexBlockFirefoxVer(pexDesktopBlockFirefoxVer);
			}
			if (StringUtils.isNotBlank(pexDesktopBlockEdgeVer)) {
				ctx.setPexBlockEdgeVer(pexDesktopBlockEdgeVer);
			}
		}
	}
	
	public static String isMeetingHashValid(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String result = null;
		final String meetingCode = request.getParameter("meetingCode");
		try {
			final MeetingDetailsOutput output = WebService.IsMeetingHashValid(meetingCode, WebUtil.VV_MBR_GUEST,
					request.getSession().getId());
			if (output != null && output.getStatus() != null && output.getStatus().getCode() != null) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.IS_MEETING_HASH_VALID,
						output.getStatus().getCode(), output.getStatus().getMessage(),
						output.getEnvelope() != null ? output.getEnvelope().getMeetings() : null);
			}
		} catch (Exception e) {
			logger.error("Error while isMeetingHashValid for meetingCode : " + meetingCode, e);
		}

		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.IS_MEETING_HASH_VALID, WebUtil.FAILURE_900,
					WebUtil.FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String guestLoginJoinMeeting(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		String result = null;
		String deviceType = null;
		String brandName = null;
		String modelName = null;
		String deviceOs = null;
		String deviceOsVersion = null;
		final String meetingCode = request.getParameter("meetingCode");
		try {
			final String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			boolean isMobileFlow = false;
			try {
				Device device = DeviceDetectionService.checkForDevice(request);
				Map<String, String> capabilities = device.getCapabilities();
				if (WebUtil.TRUE.equals(capabilities.get("is_wireless_device"))
						|| WebUtil.TRUE.equals(capabilities.get("is_tablet"))) {
					isMobileFlow = true;
					logger.info("isMobileFlow is true");
					brandName = capabilities.get("brand_name");
					modelName = capabilities.get("model_name");
					deviceOs = capabilities.get("device_os");
					deviceOsVersion = capabilities.get("device_os_version");

					if (StringUtils.isNotBlank(brandName) && StringUtils.isNotBlank(modelName)) {
						deviceType = brandName + " " + modelName;
					}
				}
			} catch (Exception e) {
				logger.warn("Error while detecting device type for meetingCode : " + meetingCode, e);
			}
			final MeetingDetailsForMeetingIdJSON outputJson = WebService.guestLoginJoinMeeting(meetingCode,
					patientLastName, isMobileFlow, deviceType, deviceOs, deviceOsVersion, WebUtil.VV_MBR_GUEST,
					request.getSession().getId());
			if (outputJson != null && outputJson.getService() != null && outputJson.getService().getStatus() != null
					&& outputJson.getService().getStatus().getCode() != null) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.VERIFY_AND_LAUNCH_MEETING_FOR_MEMBER_GUEST,
						outputJson.getService().getStatus().getCode(), outputJson.getService().getStatus().getMessage(),
						outputJson.getService().getEnvelope() != null
								? outputJson.getService().getEnvelope().getMeeting()
								: null);
			}
		} catch (Exception e) {
			logger.error("Error while verifyAndLaunchMeetingForMemberGuest for meetingCode : " + meetingCode, e);
		}

		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.VERIFY_AND_LAUNCH_MEETING_FOR_MEMBER_GUEST, WebUtil.FAILURE_900,
					WebUtil.FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

}

