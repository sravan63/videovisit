package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.FAILURE;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.FAILURE_900;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOGIN_TYPE;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.SSO;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.SSO_SESSION;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.SSO_SUBMIT_LOGIN;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.SUCCESS;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.SUCCESS_200;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.TRUE;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.DATA_NOT_FOUND;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsJSON;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingsEnvelope;
import org.kp.tpmg.ttg.videovisitsec.model.AuthorizeECCodeOutputJson;
import org.kp.tpmg.ttg.videovisitsec.model.GetECMeetingDetailsByIdOutputJson;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.ActiveSurveysResponse;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.InputUserAnswers;
import org.kp.tpmg.ttg.videovisitsmeetingapi.model.Survey;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.EmailDynamicContent;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.EmailDynamicContentOutput;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.EmailDynamicContentOutputEnvelope;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.EmailDynamicContentOutputJson;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.SSOSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.Status;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.MemberInfo;
import org.kp.ttg.sharedservice.domain.MemberSSOAuthorizeResponseWrapper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import io.jsonwebtoken.Claims;
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
		org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput verifyMemberOutput = new org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput();
		String output = null;
		try {
			String lastName = request.getHeader("last_name");
			String birth_month = request.getHeader("birth_month");
			String birth_year = request.getHeader("birth_year");
			String birth_day = request.getHeader("birth_day");
			String mrn8Digit = "";

			if (StringUtils.isNotBlank(request.getHeader("mrn"))) {
				mrn8Digit = fillToLength(request.getHeader("mrn"), '0', 8);
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
		} catch (Exception e) {
			logger.error("Error while verifyMember", e);
		}
		if (StringUtils.isBlank(output)) {
			output = WebUtil.prepareCommonOutputJson(ServiceUtil.VERIFY_MEMBER, FAILURE_900, FAILURE, null);
		}
		return output;
	}
	
	public static String updateEndMeetingLogout(final HttpServletRequest request, final HttpServletResponse response, String memberName,
			boolean notifyVideoForMeetingQuit) throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		String result = null;
		long meetingId = 0;
		try {
			meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
			final String mrn = request.getHeader("mrn");
			final String clientId = WebUtil.getClientIdByLoginTypeAndBackButtonAction(request);
			memberName = request.getHeader("memberName");
			output = WebService.memberEndMeetingLogout(mrn, meetingId, request.getSession().getId(), memberName,
					notifyVideoForMeetingQuit, clientId);
			if (output != null && output.getStatus() != null && StringUtils.isNotBlank(output.getStatus().getCode())
					&& StringUtils.isNotBlank(output.getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(output.getName(), output.getStatus().getCode(),
						output.getStatus().getMessage(), "");
				if(StringUtils.isNotBlank(request.getHeader("mrn"))) {
					response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(request.getHeader("mrn")));
				}
			}
		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.UPDATE_MEMBER_MEETING_STATUS, FAILURE_900, FAILURE,
					null);
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
				final List<org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO> meetingDOs = meetingsEnvelope.getMeetings();
				if (CollectionUtils.isNotEmpty(meetingDOs)) {
					isMyMeetingsAvailable = true;
				}
			}
		}
		return isMyMeetingsAvailable;
	}

	public static String endCaregiverMeetingSession(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		String result = null;
		try {
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = request.getHeader("patientLastName");
			logger.info("meetingCode = " + meetingCode);
			if (TRUE.equalsIgnoreCase(request.getParameter("isFromBackButton"))) {
				output = WebService.endCaregiverMeetingSession(meetingCode, patientLastName, true,
						request.getSession().getId(), WebUtil.VV_MBR_GUEST_BACK_BTN);
			} else {
				output = WebService.endCaregiverMeetingSession(meetingCode, patientLastName, false,
						request.getSession().getId(), WebUtil.VV_MBR_GUEST);
			}
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
		org.kp.tpmg.ttg.videovisit.mappointment.model.CreateInstantVendorMeetingOutput output = null;
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

	public static String performSSOSignOn(final HttpServletRequest request, final HttpServletResponse response) throws Exception {logger.info(LOG_ENTERED);
	String strResponse = null;
	try {
		String userName = request.getHeader("username");
		String password = request.getHeader("password");

		logger.debug("userName= " + userName + ",password=" + password);
		KpOrgSignOnInfo kpOrgSignOnInfo = null;
		if (StringUtils.isNotBlank(userName) && StringUtils.isNotBlank(password)) {
			if (!WebUtil.isSsoSimulation()) {
				WebService.initializekpOrgSSOHeaders(request);
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
									strResponse = WebUtil.prepareCommonOutputJson(SSO_SUBMIT_LOGIN, SUCCESS_200, SUCCESS, signOnOutput);
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

					final SSOSignOnInfo signOnOutput = new SSOSignOnInfo();
					signOnOutput.setMemberInfo(memberInfo);
					signOnOutput.setKpOrgSignOnInfo(kpOrgSignOnInfo);
					signOnOutput.setSsoSession(kpOrgSignOnInfo.getSsoSession());
					strResponse = WebUtil.prepareCommonOutputJson(SSO_SUBMIT_LOGIN, SUCCESS_200, SUCCESS, signOnOutput);
				} 
				
			}
		}
	} catch (Exception e) {
		logger.error("System Error" + e.getMessage(), e);
	}
	if(StringUtils.isBlank(strResponse)) {
		strResponse = WebUtil.prepareCommonOutputJson(SSO_SUBMIT_LOGIN, "400", FAILURE, null);
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

	public static String validateKpOrgSSOSession(HttpServletRequest request,
			String ssoSession) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebService.initializekpOrgSSOHeaders(request);
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
								signOnOutput
										.setMemberInfo(authorizeMemberResponse.getResponseWrapper().getMemberInfo());
								signOnOutput.setKpOrgSignOnInfo(kpOrgSignOnInfo);
								signOnOutput.setSsoSession(kpOrgSignOnInfo.getSsoSession());
								strResponse = WebUtil.prepareCommonOutputJson("ssoPreLogin", "200", "success",
										signOnOutput);
							}

						}

					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		if (StringUtils.isBlank(strResponse)) {
			strResponse = WebUtil.prepareCommonOutputJson("ssoPreLogin", "400", "failure", null);
		}
		logger.info(LOG_EXITING);
		return strResponse;
	}

	public static String logout(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		String output = null;
		try {
			if (WebUtil.SSO.equalsIgnoreCase(request.getParameter(LOGIN_TYPE))
					&& StringUtils.isNotBlank(request.getHeader(SSO_SESSION))) {
				WebService.initializekpOrgSSOHeaders(request);
				WebService.performKpOrgSSOSignOff(request.getHeader(SSO_SESSION));
			}
			WebUtil.removeCookie(request, response, WebUtil.getSSOCookieName());
			WebUtil.removeCookie(request, response, WebUtil.HSESSIONID_COOKIE_NAME);
			WebUtil.removeCookie(request, response, WebUtil.S_COOKIE_NAME);
			output = WebUtil.prepareCommonOutputJson("logout", "200", "success", "");
			final String loginType = request.getParameter(LOGIN_TYPE);
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
			WebService.initializekpOrgSSOHeaders(request);
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
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutput output = null;
		long meetingId = 0;
		String result = null;
		String clientId = null;
		try {
			meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
			clientId = WebUtil.getClientIdByLoginType(request.getParameter(LOGIN_TYPE));
			final String status = request.getParameter("status");
			final String careGiverName = request.getHeader("careGiverName");
			logger.info("meetingId=" + meetingId + ", status=" + status);

			boolean isProxyMeeting = false;
			if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
				isProxyMeeting = true;
			}
			output = WebService.setKPHCConferenceStatus(meetingId, status, isProxyMeeting, careGiverName,
					request.getSession().getId(), clientId);
			if (output != null && output.getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mconference.model.Status outputStatus = output.getStatus();
				if (StringUtils.isNotBlank(outputStatus.getCode())
						&& StringUtils.isNotBlank(outputStatus.getMessage())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.SET_KPHC_CONFERENCE_STATUS,
							outputStatus.getCode(), outputStatus.getMessage(), "");
				}
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
		final String loginType = request.getParameter(LOGIN_TYPE);
		if (WebUtil.isSsoSimulation() && SSO.equalsIgnoreCase(loginType)) {
			output = WebService.getActiveMeetingsForSSOSimulation(mrn, isNonMember,
					request.getSession().getId(), WebUtil.VV_MBR_SSO_SIM_WEB);
		} else {
			if (isNonMember) {
				output = WebService.retrieveActiveMeetingsForNonMemberProxies(guid, request.getSession().getId(), WebUtil.VV_MBR_SSO_WEB);
			} else if (StringUtils.isNotBlank(mrn)) {
				boolean getProxyMeetings = false;
				if (TRUE.equalsIgnoreCase(proxyMeetings)) {
					getProxyMeetings = true;
				}
				output = WebService.retrieveActiveMeetingsForMemberAndProxies(mrn, getProxyMeetings, request.getSession().getId(), WebUtil.VV_MBR_SSO_WEB);
			}
		}
		if (output != null && SUCCESS_200.equals(output.getStatus().getCode())) {
			if (isMyMeetingsAvailable(output)) {
				final List<org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO> meetings = output.getEnvelope().getMeetings();
				final Gson gson = new GsonBuilder().serializeNulls().create();
				jsonStr = gson.toJson(meetings);
				jsonStr = WebUtil.prepareCommonOutputJson("retrieveActiveMeetingsForMemberAndProxies", SUCCESS_200, SUCCESS, meetings);
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
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON output = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON();
		String mrn = null;
		String jsonOutput = null;
		Gson gson = new GsonBuilder().serializeNulls().create();
		String inMeetingDisplayName = null;
		String result = null;
		String desktopBandwidth = null;
		String clientId = null;
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
			if ("Y".equalsIgnoreCase(request.getHeader("isProxyMeeting"))) {
				isProxyMeeting = true;
			} else {
				isProxyMeeting = false;
			}
			if (AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH") != null) {
				desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			} else {
				desktopBandwidth = WebUtil.BANDWIDTH_1024_KBPS;
			}
			if (TRUE.equalsIgnoreCase(request.getParameter("isFromMobile"))) {
				clientId = WebUtil.VV_MBR_SSO_WEB_MOBILE;
			} else {
				clientId = WebUtil.VV_MBR_SSO_WEB;
			}
			jsonOutput = WebService.launchMemberOrProxyMeetingForMember(meetingId, mrn, inMeetingDisplayName,
					isProxyMeeting, request.getSession().getId(), clientId);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON.class);
			}
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getLaunchMeetingEnvelope() != null
								? output.getService().getLaunchMeetingEnvelope().getLaunchMeeting()
								: null);
				if (StringUtils.isNotBlank(result)) {
					result = WebUtil.setBandWidth(result, desktopBandwidth);
				}
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

	public static String memberLeaveProxyMeeting(final HttpServletRequest request, final HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON output = null;
		String result = null;
		try {
			final String clientId = WebUtil.getClientIdByLoginTypeAndBackButtonAction(request);
			output = WebService.memberLeaveProxyMeeting(request.getParameter("meetingId"), request.getHeader("memberName"),
					request.getSession().getId(), clientId);
			if (output != null && output.getService() != null && output.getService().getStatus() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.MEMBER_LEAVE_PROXY_MEETING,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
				if(StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(request.getParameter("meetingId")));
				}
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

	public static String launchMeetingForMemberDesktop(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON output = new org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON();
		String jsonOutput = null;
		String result = null;
		Gson gson = new GsonBuilder().serializeNulls().create();
		long meetingId = 0;
		try {
			meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
			String megaMeetingDisplayName = request.getHeader("megaMeetingDisplayName");
			String mrn = request.getHeader("mrn");
			String desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			desktopBandwidth = StringUtils.isNotBlank(desktopBandwidth) ? desktopBandwidth
					: WebUtil.BANDWIDTH_1024_KBPS;
			final String loginType = request.getParameter(LOGIN_TYPE);
			String clientId = null;
			if(WebUtil.INSTANT_JOIN.equalsIgnoreCase(loginType)) {
				clientId = WebUtil.getClientIdForInstantJoin(request.getParameter(LOGIN_TYPE), request.getParameter("isFromMobile"));
			} else {
				clientId = WebUtil.getClientId(request.getParameter(LOGIN_TYPE), request.getParameter("isFromMobile"));
			}
			jsonOutput = WebService.launchMeetingForMemberDesktop(meetingId, megaMeetingDisplayName, mrn,
					request.getSession().getId(), clientId);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mconference.model.meeting.LaunchMeetingForMemberDesktopJSON.class);
			}

			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mconference.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP,
							status.getCode(), status.getMessage(),
							output.getService().getLaunchMeetingEnvelope() != null
									? output.getService().getLaunchMeetingEnvelope().getLaunchMeeting()
									: null);
					if (StringUtils.isNotBlank(result)) {
						result = WebUtil.setBandWidth(result, desktopBandwidth);
					}
				}
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
		String jsonOutput = null;
		String result = null;
		org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutputJson output = new org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutputJson();
		final Gson gson = new Gson();
		final String meetingId = request.getParameter("meetingId");
		try {
			String clientId = WebUtil.getClientIdByLoginType(request.getParameter(LOGIN_TYPE));
			jsonOutput = WebService.getProviderRunningLateDetails(meetingId, request.getSession().getId(), clientId);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mappointment.model.notification.MeetingRunningLateOutputJson.class);
			}
			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_PROVIDER_RUNNING_LATE_DETAILS,
							status.getCode(), status.getMessage(),
							output.getService().getRunningLateEnvelope() != null
									? output.getService().getRunningLateEnvelope()
									: null);
				}
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
	
	/**
	 * @param request
	 * @param response
	 * @return
	 */
	public static String mobileRunningLateInfo(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String output = null;

		final String meetingId = request.getParameter("meetingId");
		final String sessionId = request.getSession().getId();
		final String clientId = WebUtil.MOB_CLIENT_ID;

		try {
			if (ctx != null) {
				output = WebService.getProviderRunningLateDetails(meetingId, sessionId, clientId);
			}
		} catch (Exception e) {
			output = new Gson().toJson(new SystemError());
			logger.error("System Error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String caregiverJoinLeaveMeeting(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		final String meetingId = request.getParameter("meetingId");
		final String meetingHash = request.getParameter("meetingHash");
		String joinOrLeave = request.getParameter("status");
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson();
		Gson gson = new GsonBuilder().serializeNulls().create();
		String desktopBandwidth = null;
		if (StringUtils.isNotEmpty(joinOrLeave)) {
			joinOrLeave = joinOrLeave.trim();
		}
		try {
			jsonOutput = WebService.caregiverJoinLeaveMeeting(meetingId, meetingHash, joinOrLeave,
					request.getSession().getId(), WebUtil.VV_MBR_GUEST);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson.class);
			}
			if (AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH") != null) {
				desktopBandwidth = AppProperties.getExtPropertiesValueByKey("DESKTOP_BANDWIDTH");
			}
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
				if (StringUtils.isNotBlank(result)) {
					result = WebUtil.setBandWidth(result, desktopBandwidth);
				}
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
			final org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson outputJson = gson.fromJson(output, org.kp.tpmg.ttg.videovisit.mappointment.model.ServiceCommonOutputJson.class);
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
		final String meetingId = request.getHeader("meetingId");
		final String userType = request.getHeader("userType");
		final String userId = request.getHeader("userId");
		final String eventName = request.getHeader("eventName");
		final String eventDescription = request.getHeader("eventDescription");
		final String logType = request.getHeader("logType");
		final String sessionId = request.getSession().getId();
		final String loginType = request.getHeader(LOGIN_TYPE);
		org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutputJson();
		final Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			String clientId = WebUtil.getClientIdByLoginType(loginType);
			jsonOutput = WebService.logVendorMeetingEvents(WebUtil.convertStringToLong(meetingId), userType, userId,
					eventName, eventDescription, logType, sessionId, clientId);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisitsintegration.model.ServiceCommonOutputJson.class);
			}
			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisitsintegration.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.LOG_VENDOR_MEETING_EVENTS, status.getCode(),
							status.getMessage(), "");
				}
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
	
	public static String logMobileVendorMeetingEvents(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String output = null;
		final String meetingId = request.getParameter("meetingId");
		final String userType = request.getParameter("userType");
		final String userId = request.getParameter("userId");
		final String eventName = request.getParameter("eventName");
		final String eventDescription = request.getParameter("eventDescription");
		final String logType = request.getParameter("logType");
		final String sessionId = request.getSession().getId();
		final String clientId = WebUtil.MOB_CLIENT_ID;
		try {
			output = WebService.logVendorMeetingEvents(WebUtil.convertStringToLong(meetingId), userType, userId,
					eventName, eventDescription, logType, sessionId, clientId);
		} catch (Exception e) {
			output = new Gson().toJson(new SystemError());
			logger.error("System Error for meeting :" + meetingId + " : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
	

	/**
	 * @param request
	 *            request
	 */
	public static String getMeetingDetails(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final long meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
		String result = null;
		String jsonOutput = null;
		org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON output = new org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON();
		final Gson gson = new Gson();
		try {
			String clientId = WebUtil.getClientIdByLoginType(request.getParameter(LOGIN_TYPE));
			jsonOutput = WebService.getMeetingDetailsForMeetingId(meetingId, request.getSession().getId(), clientId);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON.class);
			}
			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mappointment.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID,
							status.getCode(), status.getMessage(),
							output.getService().getEnvelope() != null ? output.getService().getEnvelope().getMeeting()
									: null);
				}
			}
		} catch (Exception e) {
			logger.error("Error while getMeetingDetailsForMeetingId for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_MEETING_DETAILS_FOR_MEETING_ID, FAILURE_900,
					FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String joinLeaveMeeting(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String deviceType = null;
		final String meetingId = request.getParameter("meetingId");
		final String inMeetingDisplayName = request.getHeader("inMeetingDisplayName");
		final boolean isPatient = "true".equalsIgnoreCase(request.getParameter("isPatient")) ? true : false;
		final String joinLeaveMeeting = request.getParameter("joinLeaveMeeting");
		final String sessionId = request.getSession().getId();
		final String clientId = WebUtil.KPPC;
		String result = null;
		String operationName = null;
		try {
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
			if ("J".equalsIgnoreCase(joinLeaveMeeting)) {
				operationName = ServiceUtil.JOIN_MEETING;
			} else if ("L".equalsIgnoreCase(joinLeaveMeeting)) {
				operationName = ServiceUtil.LEAVE_MEETING;
			}
			final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON output = WebService.joinLeaveMeeting(WebUtil.convertStringToLong(meetingId), inMeetingDisplayName,
					isPatient,joinLeaveMeeting, deviceType, deviceOs, deviceOsVersion, clientId, sessionId);
			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mconference.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(operationName,
							status.getCode(), status.getMessage(),output.getService().getStatus());
				}
			}
			if (StringUtils.isBlank(result)) {
				result = WebUtil.prepareCommonOutputJson(operationName, FAILURE_900,
						FAILURE, null);
			}
		} catch (Exception e) {
			logger.error("Error while joinLeaveMeeting for meetingId:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String joinLeaveMobileMeeting(final HttpServletRequest request) {
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
			final org.kp.tpmg.ttg.videovisit.mconference.model.meeting.JoinLeaveMeetingJSON joinLeaveMeetingJSON = WebService.joinLeaveMeeting(WebUtil.convertStringToLong(meetingId), inMeetingDisplayName,
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
				if(StringUtils.isNotBlank(meetingCode)) {
					response.setHeader(WebUtil.AUTH_TOKEN, JwtUtil.generateJwtToken(meetingCode));
				}
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
		String clientId = null;
		final String meetingCode = request.getParameter("meetingCode");
		try {
			final String patientLastName = WebUtil.replaceSpecialCharacters(request.getHeader("patientLastName"));
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
			if (isMobileFlow) {
				clientId = WebUtil.VV_MBR_GUEST_MOBILE;
			} else {
				clientId = WebUtil.VV_MBR_GUEST;
			}
			final org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDetailsForMeetingIdJSON outputJson = WebService.guestLoginJoinMeeting(meetingCode,
					patientLastName, isMobileFlow, deviceType, deviceOs, deviceOsVersion, clientId,
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

	public static String loadPropertiesByName(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String result = null;
		Map<String, String> properties = null;
		final String propertyName = request.getParameter("propertyName");
		if (StringUtils.isNotBlank(propertyName)) {
			properties = new HashMap<>();
			if ("browser".equalsIgnoreCase(propertyName)) {
				WebUtil.loadAllBrowserBlockProperties(properties);
			} else if(WebUtil.KEEP_ALIVE.equalsIgnoreCase(propertyName)) {
				WebUtil.loadKeepAliveProperty(properties);
			} else if(WebUtil.SURVEY.equalsIgnoreCase(propertyName)) {
				WebUtil.loadSurveyProperties(properties);
			}
		} else {
			logger.warn("propertyName is blank/empty.");
			properties = new HashMap<>();
			WebUtil.loadAllBrowserBlockProperties(properties);
		}
		if (MapUtils.isNotEmpty(properties)) {
			result = WebUtil.convertMapToJsonString(properties);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String handleHtmRequest(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String redirectUrl = "/videovisit/#/login";
		if (request.getRequestURI().contains("setup.htm")) {
			redirectUrl = "/videovisit/#/setup";
		}
		logger.info(LOG_EXITING);
		return redirectUrl;
	}

	public static String mobileLaunchVV(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String redirectView = "/videovisit/#/videoVisitReady";
		boolean isValidToken = true;
		try {
			
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
				logger.info("Invalid auth token.");
				isValidToken = false;
			}
			redirectView = redirectView + "?isValidToken=" + isValidToken + "&isDirectLaunch=true&meetingId=" + meetingId + "&userDisplayName=" + inMeetingDisplayName + "&isProxy=" + isProxyMeeting;
		} catch (Exception e) {
			logger.error("System error:" + e.getMessage(), e);
		}
		return redirectView;
	}
	
	public static String mobileLaunchRedirect(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String redirectUrl = "/videovisit/#/login";
		boolean isAndroidSDK = false;
		final String mobileOs = StringUtils.isNotBlank(request.getParameter("os")) ? request.getParameter("os").trim()
				: null;
		String mobileAppVersion = StringUtils.isNotBlank(request.getParameter("appVersion"))
				? request.getParameter("appVersion").trim()
				: null;
		String queryString = request.getQueryString();
		logger.info(
				"Request parameters from mdo app, mobileOs : " + mobileOs + "mobileAppVersion : " + mobileAppVersion);
		try {
			if (StringUtils.isNotBlank(mobileAppVersion) && WebUtil.ANDROID.equalsIgnoreCase(mobileOs)) {
				String mdoAppLatestVersion = getExtPropertiesValueByKey("MDO_APP_ANDROID_SDK_VERSION");
				if (StringUtils.isBlank(mobileAppVersion)) {
					logger.info("Setting android SDK to false");
				} else if (!mobileAppVersion.equalsIgnoreCase(mdoAppLatestVersion)) {
					String entered[] = mobileAppVersion.split("\\.");
					String latest[] = mdoAppLatestVersion.split("\\.");

					if (entered.length != latest.length) {
						if (entered.length > latest.length) {
							mdoAppLatestVersion = mdoAppLatestVersion + ".0";
							latest = mdoAppLatestVersion.split("\\.");
						} else {
							mobileAppVersion = mobileAppVersion + ".0";
							entered = mobileAppVersion.split("\\.");
						}
					}
					if (!mobileAppVersion.equalsIgnoreCase(mdoAppLatestVersion) && entered.length == latest.length) {
						for (int i = 0; i < entered.length; i++) {
							if (WebUtil.convertStringToInteger(entered[i]) > WebUtil.convertStringToInteger(latest[i])) {
								isAndroidSDK = true;
								logger.info("Setting android SDK to true");
								break;
							} else if (WebUtil.convertStringToInteger(latest[i]) > WebUtil.convertStringToInteger(entered[i])) {
								logger.info("Setting android SDK to false");
								break;
							}
						}
					} else {
						isAndroidSDK = true;
						logger.info("Setting android SDK to true");
					}
				} else {
					isAndroidSDK = true;
					logger.info("Setting android SDK to true");
				}

			}
			if(StringUtils.isNotBlank(queryString)) {
				queryString = queryString + "&isAndroidSDK=" + isAndroidSDK;
			} else {
				queryString = "isAndroidSDK=" + isAndroidSDK;
			}
		} catch (Exception e) {
			logger.error("Error while mobile launch redirection : " + e.getMessage(), e);
		}
		redirectUrl = redirectUrl + "?" + queryString;
		logger.debug("redirectUrl : " + redirectUrl);
		logger.info(LOG_EXITING);
		return redirectUrl;
	}
	
	public static String launchMeetingForMember(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		String deviceType = null;
		org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON output = null;
		String jsonRes = null;
		String result = null;
		Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
			String inMeetingDisplayName = request.getHeader("megaMeetingDisplayName");
			String mrn = request.getHeader("mrn");
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
			jsonRes = WebService.launchMeetingForMember(meetingId, inMeetingDisplayName, request.getSession().getId(),
					mrn, deviceType, deviceOs, deviceOsVersion, true);
			if (StringUtils.isNotBlank(jsonRes)) {
				output = gson.fromJson(jsonRes, org.kp.tpmg.ttg.videovisit.mconference.model.LaunchMeetingForMemberGuestJSON.class);
			}
			if (output != null && output.getService() != null && output.getService().getStatus() != null) {
				org.kp.tpmg.ttg.videovisit.mconference.model.Status status = output.getService().getStatus();
				if (StringUtils.isNotBlank(status.getCode())) {
					result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, status.getCode(),
							status.getMessage(),
							output.getService().getLaunchMeetingEnvelope() != null
									? output.getService().getLaunchMeetingEnvelope().getLaunchMeeting()
									: null);
				}
			}
			logger.debug("json output: = " + output);
		} catch (Exception e) {
			logger.error("Error while launchMeetingForMember for meetingId:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER, FAILURE_900, FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String retrieveMeeting(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		updateWebappContextWithPexipMobileBrowserDetails(ctx);
		MeetingDetailsJSON meetingDetailsJSON = null;
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				meetingDetailsJSON = WebService.retrieveMeeting(ctx.getMemberDO().getMrn(), PAST_MINUTES,
						FUTURE_MINUTES, request.getSession().getId(), ctx.getClientId());
				if (meetingDetailsJSON != null && meetingDetailsJSON.getService() != null
						&& meetingDetailsJSON.getService().getStatus() != null
						&& "200".equals(meetingDetailsJSON.getService().getStatus().getCode())
						&& meetingDetailsJSON.getService().getEnvelope() != null
						&& meetingDetailsJSON.getService().getEnvelope().getMeetings() != null) {
					List<org.kp.tpmg.ttg.videovisit.mappointment.model.meeting.MeetingDO> myMeetings = meetingDetailsJSON.getService().getEnvelope().getMeetings();
					if (myMeetings.size() == 1 && myMeetings.get(0) == null) {
						ctx.setTotalmeetings(0);
					} else {
						ctx.setTotalmeetings(myMeetings.size());
					}
					ctx.setMyMeetings(myMeetings);
				} else {
					ctx.setMyMeetings(null);
					ctx.setTotalmeetings(0);
				}
				logger.info(LOG_EXITING);
				return JSONObject.fromObject(meetingDetailsJSON).toString();
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}
	
	public static String verifyMember(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		 org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput verifyMemberOutput = new  org.kp.tpmg.ttg.videovisitsintegration.model.VerifyMemberOutput();

		try {
			String lastName = "";
			String mrn8Digit = "";
			String birth_month = "";
			String birth_year = "";
			String birth_day = "";
			WebAppContext ctx = WebAppContext.getWebAppContext(request);

			if (StringUtils.isNotBlank(request.getHeader("last_name"))) {
				lastName = request.getHeader("last_name");
			}
			if (StringUtils.isNotBlank(request.getHeader("mrn"))) {
				mrn8Digit = fillToLength(request.getHeader("mrn"), '0', 8);
			}
			if (StringUtils.isNotBlank(request.getHeader("birth_month"))) {
				birth_month = request.getHeader("birth_month");
			}
			if (StringUtils.isNotBlank(request.getHeader("birth_year"))) {
				birth_year = request.getHeader("birth_year");
			}
			if (StringUtils.isNotBlank(request.getHeader("birth_day"))) {
				birth_day = request.getHeader("birth_day");
			}
			if (ctx != null) {
				if(StringUtils.isNotBlank(lastName)){
					lastName = WebUtil.replaceSpecialCharacters(lastName);
				}
				verifyMemberOutput = WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, birth_day,
						request.getSession().getId(), ctx.getClientId());

				if (verifyMemberOutput != null && verifyMemberOutput.getStatus() != null
						&& "200".equals(verifyMemberOutput.getStatus().getCode())
						&& verifyMemberOutput.getEnvelope() != null
						&& verifyMemberOutput.getEnvelope().getMember() != null) {
					ctx.setMemberDO(verifyMemberOutput.getEnvelope().getMember());
					return "1";
				} else {
					ctx.setMemberDO(null);
					return "3";
				}

			} else {
				return "3";
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
			return "3";

		}
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
	
	public static String getLaunchMeetingDetailsForMember(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		String deviceType = null;
		boolean isMobileflow = true;
		String output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String inMeetingDisplayName = null;
		try {
			logger.info("meetingid=" + request.getParameter("meetingId"));
			logger.debug("In meetingdisplayname=" + request.getParameter("inMeetingDisplayName"));
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = WebUtil.convertStringToLong(request.getParameter("meetingId"));
			}

			if (StringUtils.isNotBlank(request.getParameter("inMeetingDisplayName"))) {
				inMeetingDisplayName = request.getParameter("inMeetingDisplayName");
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
					ctx.getMemberDO().getMrn(), deviceType, deviceOs, deviceOsVersion, isMobileflow);
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

	public static String submitSurvey(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String response = null;
		String inputRequestBody = null;
		final String clientId = WebUtil.VV_MBR_WEB;
		InputUserAnswers input = null;
		long meetingId = 0;
		try {
			if (request != null && request.getSession() != null) {
				final Gson gson = new Gson();
				if (request.getReader() != null && request.getReader().lines() != null) {
					inputRequestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
				}
				logger.debug("inputRequestBody : " + inputRequestBody);

				input = gson.fromJson(inputRequestBody, InputUserAnswers.class);
				if (input != null) {
					input.setClientId(clientId);
					input.setSessionId(request.getSession().getId());
					meetingId = input.getMeetingId();
					response = WebService.submitSurvey(gson, input);
				} else {
					logger.warn("inputRequestBody/Input is null");
				}
			}
		} catch (Exception e) {
			logger.error("System Error while submitting the survey for meeting : " + meetingId, e);
		}
		if (StringUtils.isBlank(response)) {
			response = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return response;
	}

	public static String getActiveSurveys(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String response = null;
		try {
			final Gson gson = new Gson();
			final String meetingId = request.getParameter("meetingId");
			final String userType = request.getParameter("userType");
			final String userValue = request.getParameter("userValue");
			final String surveyName = request.getParameter("surveyName");
			logger.info("input surveyName : " + surveyName);
			response = WebService.getActiveSurveys(gson, true, false, meetingId, userType, userValue,
					request.getSession().getId());
			final ActiveSurveysResponse activeSurveysResponse = gson.fromJson(response, ActiveSurveysResponse.class);
			if (StringUtils.isNotBlank(surveyName) && activeSurveysResponse != null
					&& SUCCESS_200.equalsIgnoreCase(activeSurveysResponse.getCode())
					&& CollectionUtils.isNotEmpty(activeSurveysResponse.getSurveys())) {
				for (Survey survey : activeSurveysResponse.getSurveys()) {
					if (surveyName.equalsIgnoreCase(survey.getSurveyName())) {
						response = gson.toJson(survey);
					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error while getActiveSurveys : ", e);
		}
		if (StringUtils.isBlank(response)) {
			response = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return response;
	}
	
	public static String insertVendorMeetingMediaCDR(final HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		final String meetingId = request.getHeader("meetingId");
		final String meetingVmr = request.getHeader("meetingVmr");
		final String callUUID = request.getHeader("callUUID");
		final String partipantName = request.getHeader("participantName");

		String mediaStats = "";
		org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson();
		Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			if (request.getReader() != null && request.getReader().lines() != null) {
				mediaStats = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
			}
			jsonOutput = WebService.insertVendorMeetingMediaCDR(meetingId, meetingVmr, callUUID, partipantName,
					mediaStats, request.getSession().getId(), WebUtil.VV_MBR_WEB);
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mconference.model.ServiceCommonOutputJson.class);
			}

			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.INSERT_VENODR_MEETING_MEDIA_CDR,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
			}
		} catch (Exception e) {
			logger.error("Error while insertVendorMeetingMediaCDR for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.INSERT_VENODR_MEETING_MEDIA_CDR, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String authorizeVVCode(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		String authtoken = "";
		final Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			if (request.getHeader("authtoken") != null) {
				authtoken = request.getHeader("authtoken");
			}
			String clientId = WebUtil.getClientIdForInstantJoin(request.getParameter(LOGIN_TYPE),
					request.getParameter("isFromMobile"));
			jsonOutput = WebService.authorizeVVCode(authtoken, request.getSession().getId(), clientId);
			final org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutputJson output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisit.mappointment.model.AuthorizeVVCodeOutputJson.class);
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.AUTHORIZE_VV_CODE,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getEnvelope() != null ? output.getService().getEnvelope()
								: null);
			}
		} catch (Exception e) {
			logger.error("Error while authorizeVVCode for authtoken:" + authtoken, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.AUTHORIZE_VV_CODE, FAILURE_900, FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String getSurveyQuestions(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String response = null;
		try {
			final Gson gson = new Gson();
			final String meetingId = request.getHeader("meetingId");
			final String userType = request.getHeader("userType");
			final String userValue = request.getHeader("userValue");
			String surveyName = AppProperties.getExtPropertiesValueByKey("MEMBER_SURVEY_NAME");
			if(StringUtils.isBlank(surveyName)) {
				surveyName = "pt_meeting_quality_feedback";
			}
			logger.info("input surveyName : " + surveyName);
			response = WebService.getSurveyQuestions(gson, surveyName, meetingId, userType, userValue,
					request.getSession().getId());
		} catch (Exception e) {
			logger.error("System Error while getSurveyQuestions : ", e);
		}
		if (StringUtils.isBlank(response)) {
			response = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return response;
	}
	
	public static String authorizeECCode(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		String authtoken = "";
		final Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			if (request.getHeader("authtoken") != null) {
				authtoken = request.getHeader("authtoken");
			}
			String clientId = WebUtil.getClientIdForECInstantJoin(request.getParameter(LOGIN_TYPE),
					request.getParameter("isFromMobile"));
			
			jsonOutput = WebService.authorizeECCode(authtoken, request.getSession().getId(), clientId);
			final AuthorizeECCodeOutputJson output = gson.fromJson(jsonOutput, AuthorizeECCodeOutputJson.class);
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.AUTHORIZE_EC_CODE,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getEnvelope() != null ? output.getService().getEnvelope()
								: null);
			}
		} catch (Exception e) {
			logger.error("Error while authorizeECCode for authtoken:" + authtoken, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.AUTHORIZE_EC_CODE, FAILURE_900, FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}

	public static String updateGuestParticipant(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String jsonOutput = null;
		String result = null;
		String careGiverId = request.getHeader("careGiverId");
		String meetingId = request.getHeader("meetingId");
		String joinLeaveStatus = request.getHeader("joinLeaveStatus");
		String firstName=request.getHeader("firstName");
		String lastName=request.getHeader("lastName");
		org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutputJson output = new org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutputJson();
		final Gson gson = new GsonBuilder().serializeNulls().create();
		try {
			
			String clientId = WebUtil.getClientIdForECInstantJoin(request.getParameter(LOGIN_TYPE),
					request.getParameter("isFromMobile"));
			
			jsonOutput = WebService.updateGuestParticipant(careGiverId, meetingId, joinLeaveStatus, request.getSession().getId(), clientId,firstName,lastName);
			
			if (StringUtils.isNotBlank(jsonOutput)) {
				output = gson.fromJson(jsonOutput, org.kp.tpmg.ttg.videovisitsec.model.ServiceCommonOutputJson.class);
			}
			
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.UPDATE_GUEST_PARTICIPANT,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(), "");
			
			}
		} catch (Exception e) {
			logger.error("Error while updateGuestParticipant for meeting:" + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.UPDATE_GUEST_PARTICIPANT, FAILURE_900, FAILURE, null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String getECMeetingDetailsById(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String result = "";
		String meetingId = request.getHeader(ServiceUtil.MEETING_ID);
		GetECMeetingDetailsByIdOutputJson output = null;
		String outputJson = null;
		final Gson gson = new Gson();
		try {
			String clientId = WebUtil.getClientIdForECInstantJoin(request.getParameter(LOGIN_TYPE),
					request.getParameter(ServiceUtil.IS_FROM_MOBILE_STRING));
			outputJson = WebService.getECMeetingDetailsById(meetingId, clientId, request.getSession().getId());
			if (StringUtils.isNotBlank(outputJson)) {
				output = gson.fromJson(outputJson, GetECMeetingDetailsByIdOutputJson.class);
			}
			if (output != null && output.getService() != null
					&& StringUtils.isNotBlank(output.getService().getStatus().getCode())
					&& StringUtils.isNotBlank(output.getService().getStatus().getMessage())) {
				result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_EC_MEETING_DETAILS_BY_ID,
						output.getService().getStatus().getCode(), output.getService().getStatus().getMessage(),
						output.getService().getEnvelope() != null ? output.getService().getEnvelope() : null);
			}
		} catch (Exception e) {
			logger.error("Error while getting EC meeting details for meeting id : " + meetingId, e);
		}
		if (StringUtils.isBlank(result)) {
			result = WebUtil.prepareCommonOutputJson(ServiceUtil.GET_EC_MEETING_DETAILS_BY_ID, FAILURE_900, FAILURE,
					null);
		}
		logger.info(LOG_EXITING);
		return result;
	}
	
	public static String getEmailTokenInfo(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String result = "";
		final Gson gson = new Gson();
		final EmailDynamicContentOutputJson outputJson = new EmailDynamicContentOutputJson();
		final EmailDynamicContentOutput output = new EmailDynamicContentOutput();
		final Status status = new Status();
		output.setName("DynamicEmailTokenContent");
		try {
			String authtoken = request.getHeader("authtoken");
			if (StringUtils.isBlank(authtoken)) {
				status.setCode(ServiceUtil.CODE_300);
				status.setMessage(ServiceUtil.MISSING_INPUT_ATTRIBUTES);
				output.setStatus(status);
				outputJson.setService(output);
			} else {
				final Claims claims = JwtUtil.validateEmailAuthToken(authtoken);
				if (claims != null && !claims.isEmpty()) {
					setEmailContentOutput(output, claims);
					logger.debug(claims);
					status.setCode(SUCCESS_200);
					status.setMessage(SUCCESS);
				} else {
					status.setCode(DATA_NOT_FOUND);
					status.setMessage(FAILURE);
				}
				output.setStatus(status);
				outputJson.setService(output);
			}
		} catch (Exception e) {
			status.setCode(FAILURE_900);
			status.setMessage(FAILURE);
			output.setStatus(status);
			outputJson.setService(output);
			logger.error("Error while parsing the token : ", e);
		}

		result = gson.toJson(outputJson);
		logger.info(LOG_EXITING);
		return result;
	}

	private static void setEmailContentOutput(final EmailDynamicContentOutput output, final Claims claims) {
		logger.info(LOG_ENTERED);
		final EmailDynamicContentOutputEnvelope enevelope = new EmailDynamicContentOutputEnvelope();
		if (StringUtils.isNotBlank((String) claims.get(ServiceUtil.EMAIL_TYPE))
				&& ServiceUtil.PATIENT_INSTRUCTIONAL_EMAIL
						.equalsIgnoreCase((String) claims.get(ServiceUtil.EMAIL_TYPE))) {
			final EmailDynamicContent emailDynamicContent = new EmailDynamicContent();
			emailDynamicContent.setMeetingId((String) claims.get(ServiceUtil.MEETING_ID));
			emailDynamicContent.setEmailType((String) claims.get(ServiceUtil.EMAIL_TYPE));
			emailDynamicContent.setSubject((String) claims.get(ServiceUtil.SUBJECT));
			emailDynamicContent.setPatientHelpUrl((String) claims.get(ServiceUtil.PATIENT_HELP_URL));
			emailDynamicContent.setPatientJoinUrl((String) claims.get(ServiceUtil.PATIENT_JOIN_URL));
			enevelope.setEmailDynamicContent(emailDynamicContent);
		} else if (StringUtils.isNotBlank((String) claims.get(ServiceUtil.EMAIL_TYPE))
				&& (ServiceUtil.CAREGIVER_INSTRUCTIONAL_EMAIL
						.equalsIgnoreCase((String) claims.get(ServiceUtil.EMAIL_TYPE)) || ServiceUtil.CAREGIVER_REMINDER_EMAIL
						.equalsIgnoreCase((String) claims.get(ServiceUtil.EMAIL_TYPE)))) {
			final EmailDynamicContent emailDynamicContent = new EmailDynamicContent();
			emailDynamicContent.setMeetingId((String) claims.get(ServiceUtil.MEETING_ID));
			emailDynamicContent.setEmailType((String) claims.get(ServiceUtil.EMAIL_TYPE));
			emailDynamicContent.setSubject((String) claims.get(ServiceUtil.SUBJECT));
			emailDynamicContent.setGuestHelpUrl((String) claims.get(ServiceUtil.GUEST_HELP_URL));
			emailDynamicContent.setMeetingURL((String) claims.get(ServiceUtil.MEETING_URL));
			emailDynamicContent.setMeetingTime((String) claims.get(ServiceUtil.MEETING_TIME));
			emailDynamicContent.setMemberFirstName((String) claims.get(ServiceUtil.MEMBER_FIRSTNAME));
			emailDynamicContent.setLastNameFirstCharMember((String) claims.get(ServiceUtil.MEMBER_LASTNAME_FIRSTCHAR));
			emailDynamicContent.setDoctorFirstName((String) claims.get(ServiceUtil.DOCTOR_FIRSTNAME));
			emailDynamicContent.setDoctorLastName((String) claims.get(ServiceUtil.DOCTOR_LASTNAME));
			emailDynamicContent.setDoctorTitle((String) claims.get(ServiceUtil.DOCTOR_TITLE));
			enevelope.setEmailDynamicContent(emailDynamicContent);
		}	else if (StringUtils.isNotBlank((String) claims.get(ServiceUtil.EMAIL_TYPE))
				&& (ServiceUtil.EMAIL_TYPE_GUEST_EARLYSTART
						.equalsIgnoreCase((String) claims.get(ServiceUtil.EMAIL_TYPE)))) {
			final EmailDynamicContent emailDynamicContent = new EmailDynamicContent();
			emailDynamicContent.setMeetingId((String) claims.get(ServiceUtil.MEETING_ID));
			emailDynamicContent.setEmailType((String) claims.get(ServiceUtil.EMAIL_TYPE));
			emailDynamicContent.setSubject((String) claims.get(ServiceUtil.SUBJECT));
			emailDynamicContent.setGuestHelpUrl((String) claims.get(ServiceUtil.GUEST_HELP_URL));
			emailDynamicContent.setMeetingURL((String) claims.get(ServiceUtil.MEETING_URL));
			emailDynamicContent.setMeetingTime((String) claims.get(ServiceUtil.MEETING_TIME));
			emailDynamicContent.setSignInUrl((String) claims.get(ServiceUtil.SIGN_IN_URL));
			enevelope.setEmailDynamicContent(emailDynamicContent);
		} else if (StringUtils.isNotBlank((String) claims.get(ServiceUtil.EMAIL_TYPE))
				&& (ServiceUtil.EMAIL_TYPE_MEMBER_EARLYSTART
						.equalsIgnoreCase((String) claims.get(ServiceUtil.EMAIL_TYPE)))) {
			final EmailDynamicContent emailDynamicContent = new EmailDynamicContent();
			emailDynamicContent.setMeetingId((String) claims.get(ServiceUtil.MEETING_ID));
			emailDynamicContent.setEmailType((String) claims.get(ServiceUtil.EMAIL_TYPE));
			emailDynamicContent.setSubject((String) claims.get(ServiceUtil.SUBJECT));
			emailDynamicContent.setGuestHelpUrl((String) claims.get(ServiceUtil.GUEST_HELP_URL));
			emailDynamicContent.setMeetingURL((String) claims.get(ServiceUtil.MEETING_URL));
			emailDynamicContent.setMeetingTime((String) claims.get(ServiceUtil.MEETING_TIME));
			emailDynamicContent.setSignInUrl((String) claims.get(ServiceUtil.SIGN_IN_URL));
			emailDynamicContent.setDownloadMdoAppUrl((String) claims.get(ServiceUtil.DOWNLOAD_MDO_APP_URL));
			emailDynamicContent.setVvWebPage((String) claims.get(ServiceUtil.VV_WEB_PAGE_URL));
			enevelope.setEmailDynamicContent(emailDynamicContent);
		}
		output.setEnvelope(enevelope);
		logger.info(LOG_EXITING);
	}
}

