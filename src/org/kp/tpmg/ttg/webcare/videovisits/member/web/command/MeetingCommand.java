package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.rmi.RemoteException;
import java.text.SimpleDateFormat;
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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.ServiceCommonOutput;
import org.kp.tpmg.videovisit.model.ServiceCommonOutputJson;
import org.kp.tpmg.videovisit.model.Status;
import org.kp.tpmg.videovisit.model.meeting.CreateInstantVendorMeetingOutput;
import org.kp.tpmg.videovisit.model.meeting.JoinLeaveMeetingJSON;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsOutput;
import org.kp.tpmg.videovisit.model.meeting.MeetingsEnvelope;
import org.kp.tpmg.videovisit.model.meeting.VerifyCareGiverOutput;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberOutput;
import org.kp.tpmg.videovisit.model.user.Caregiver;
import org.kp.tpmg.videovisit.model.user.Member;
import org.kp.ttg.sharedservice.domain.AuthorizeResponseVo;
import org.kp.ttg.sharedservice.domain.MemberInfo;
import org.kp.ttg.sharedservice.domain.MemberSSOAuthorizeResponseWrapper;

import com.google.gson.Gson;

import net.sf.json.JSONObject;
import net.sourceforge.wurfl.core.Device;

public class MeetingCommand {

	public static final Logger logger = Logger.getLogger(MeetingCommand.class);
	public static final int PAST_MINUTES = 120;
	public static final int FUTURE_MINUTES = 15;

	public static void setupGuestInfo(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		try {

			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			logger.info("patientLastName : " + patientLastName);
			String nocache = request.getParameter("nocache");
			String meetingId = request.getParameter("meetingId");

			WebAppContext ctx = WebAppContext.getWebAppContext(request);

			ctx.setMeetingCode(meetingCode);
			ctx.setPatientLastName(patientLastName);
			ctx.setNocache(nocache);
			ctx.setGuestMeetingId(meetingId);

		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
	}

	public static String verifyMember(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		VerifyMemberOutput verifyMemberOutput = new VerifyMemberOutput();

		try {
			String lastName = "";
			String mrn8Digit = "";
			String birth_month = "";
			String birth_year = "";
			String birth_day = "";
			WebAppContext ctx = WebAppContext.getWebAppContext(request);

			if (request.getParameter("last_name") != null && !request.getParameter("last_name").equals("")) {
				lastName = request.getParameter("last_name");
			}
			if (request.getParameter("mrn") != null && !request.getParameter("mrn").equals("")) {
				mrn8Digit = fillToLength(request.getParameter("mrn"), '0', 8);
			}
			if (request.getParameter("birth_month") != null && !request.getParameter("birth_month").equals("")) {
				birth_month = request.getParameter("birth_month");
			}
			if (request.getParameter("birth_year") != null && !request.getParameter("birth_year").equals("")) {
				birth_year = request.getParameter("birth_year");
			}
			if (request.getParameter("birth_day") != null && !request.getParameter("birth_day").equals("")) {
				birth_day = request.getParameter("birth_day");
			}
			boolean success = WebService.initWebService(request);

			if (ctx != null && success == true) {
				if(StringUtils.isNotBlank(lastName)){
					lastName = WebUtil.replaceSpecialCharacters(lastName);
				}
				verifyMemberOutput = WebService.verifyMember(lastName, mrn8Digit, birth_month, birth_year, birth_day,
						request.getSession().getId(), WebUtil.clientId);

				if (verifyMemberOutput != null && verifyMemberOutput.getStatus() != null
						&& "200".equals(verifyMemberOutput.getStatus().getCode())
						&& verifyMemberOutput.getEnvelope() != null
						&& verifyMemberOutput.getEnvelope().getMember() != null) {
					ctx.setMemberDO(verifyMemberOutput.getEnvelope().getMember());
					return ("1");
				} else {
					ctx.setMemberDO(null);
					return ("3");
				}

			} else {
				return ("3");
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
			return ("3");

		}
	}

	public static String updateEndMeetingLogout(HttpServletRequest request, HttpServletResponse response,
			String memberName, boolean notifyVideoForMeetingQuit) throws Exception {
		logger.info(LOG_ENTERED + "notifyVideoForMeetingQuit=" + notifyVideoForMeetingQuit + "]");
		ServiceCommonOutput ret = null;
		String jsonString = null;
		long meetingId = 0;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			if (ctx != null) {
				if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
				}

				if (meetingId == 0) {
					if (ctx.getMeetingId() <= 0) {
						meetingId = ctx.getVideoVisit() != null
								? WebUtil.convertStringToLong(ctx.getVideoVisit().getMeetingId()) : 0;
					} else {
						meetingId = ctx.getMeetingId();
					}
				}

				if (ctx.getMemberDO() != null) {
					ret = WebService.memberEndMeetingLogout(ctx.getMemberDO().getMrn(), meetingId,
							request.getSession().getId(), memberName, notifyVideoForMeetingQuit, WebUtil.clientId);
					if (ret != null) {
						final String responseDesc = ret.getStatus() != null
								? ret.getStatus().getMessage() + ": " + ret.getStatus().getCode()
								: "No reponse from rest service";
						logger.debug("response : " + responseDesc);
						jsonString = ret.toString();
					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;
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
		MeetingDetailsOutput meetingDetailsOutput = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String meetingCode = null;
		String jsonStr = null;
		if (ctx != null) {
			meetingCode = ctx.getMeetingCode();
			try {
				meetingDetailsOutput = WebService.retrieveMeetingForCaregiver(meetingCode, request.getSession().getId(),
						WebUtil.clientId);
			} catch (Exception e) {
				logger.error("Web Service API error:" + e.getMessage(), e);
			}
			final Gson gson = new Gson();
			if (isMyMeetingsAvailable(meetingDetailsOutput)) {
				final List<MeetingDO> myMeetings = meetingDetailsOutput.getEnvelope().getMeetings();
				logger.info("Meetings Size: " + myMeetings.size());
				for (MeetingDO myMeeting : myMeetings) {
					normalizeMeetingData(myMeeting, meetingCode, ctx);
				}
				ctx.setTotalmeetings(myMeetings.size());

				for (MeetingDO meetingDO : myMeetings) {
					if (meetingDO.getCaregiver() != null) {
						for (Caregiver c : meetingDO.getCaregiver()) {
							if (c.getCareGiverMeetingHash().equalsIgnoreCase(meetingCode)) {
								String name = c.getLastName() + ", " + c.getFirstName();
								ctx.setCareGiverName(name);
								break;
							}
						}
					}
				}
				ctx.setMyMeetings(myMeetings);
			} else {
				// no meeting, we should blank out cached meeting
				ctx.setMyMeetings(null);
				ctx.setTotalmeetings(0);
			}
			jsonStr = gson.toJson(meetingDetailsOutput);
		} else {
			logger.warn("empty web context");
			jsonStr = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonStr;
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

	public static String IsMeetingHashValid(HttpServletRequest request, HttpServletResponse response)
			throws RemoteException, Exception {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String meetingCode = request.getParameter("meetingCode");
		String nocache = request.getParameter("nocache");
		boolean success = WebService.initWebService(request);
		if (ctx != null && success) {
			output = WebService.IsMeetingHashValid(meetingCode, WebUtil.clientId, request.getSession().getId());
			if (output != null && output.getEnvelope() != null) {
				List<MeetingDO> meetings = output.getEnvelope().getMeetings();
				if (meetings != null) {
					if (!isMyMeetingsAvailable(output)) {
						logger.info("setting total meetings = 0");
						ctx.setTotalmeetings(0);
					} else {
						logger.info("setting total meetings = " + meetings.size());
						for (MeetingDO meeting : meetings) {
							normalizeMeetingData(meeting, meetingCode, ctx);
						}
						ctx.setTotalmeetings(meetings.size());
						ctx.setMyMeetings(meetings);
					}
				}

				return JSONObject.fromObject(output).toString();
			}
		}
		logger.info(LOG_EXITING);
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String createCaregiverMeetingSession(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		LaunchMeetingForMemberGuestOutput output = null;
		String jsonString = null;
		Gson gson = new Gson();
		try {
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			boolean isMobileFlow = false;
			if (StringUtils.isNotBlank(request.getParameter("isMobileFlow"))
					&& request.getParameter("isMobileFlow").equalsIgnoreCase("true")) {
				isMobileFlow = true;
				logger.info("mobile flow is true");
			} else {
				isMobileFlow = false;
				logger.info("mobile flow is false");
			}

			if (StringUtils.isNotBlank(meetingCode)) {
				output = WebService.createCaregiverMeetingSession(meetingCode, patientLastName, isMobileFlow,
						request.getSession().getId());
				if (output != null && output.getLaunchMeetingEnvelope().getLaunchMeeting() != null) {
					jsonString = gson.toJson(output);
					logger.debug("json output" + jsonString.toString());
				}
			}
		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			output = new LaunchMeetingForMemberGuestOutput();
			final Status status = new Status();
			status.setCode("900");
			status.setMessage("System error");
			output.setStatus(status);
			jsonString = gson.toJson(output);
		}

		logger.info(LOG_EXITING);
		return jsonString;

	}

	public static String endCaregiverMeetingSession(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String jsonString = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			String meetingCode = request.getParameter("meetingCode");
			logger.info("meetingCode = " + meetingCode);
			if (ctx != null && ctx.getVideoVisit() != null && StringUtils.isNotBlank(meetingCode)) {
				output = WebService.endCaregiverMeetingSession(meetingCode, ctx.getVideoVisit().getPatientLastName(),
						false, request.getSession().getId());
			}
			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.info("json output" + jsonString.toString());
			}

		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;

	}

	public static String endCaregiverMeetingSession(String meetingCode, String megaMeetingNameDisplayName,
			String sessionId) throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String jsonString = null;
		try {
			logger.info("meetingCode = " + meetingCode);
			if (StringUtils.isNotBlank(meetingCode)) {
				output = WebService.endCaregiverMeetingSession(meetingCode, megaMeetingNameDisplayName, true,
						sessionId);
			}
			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.info("json output" + jsonString.toString());
			}

		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;

	}

	private static String fillToLength(String src, char fillChar, int total_length) {
		String ret = null;
		if (src.length() < total_length) {
			int count = total_length - src.length();
			StringBuffer sb = new StringBuffer();
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

	private static void normalizeMeetingData(MeetingDO meeting, String meetingHash, WebAppContext ctx) {
		if (meeting == null) {
			return;
		}
		meeting.setParticipant(meeting.getParticipant());
		meeting.setCaregiver(meeting.getCaregiver());
	}

	public static String createInstantVendorMeeting(HttpServletRequest request, HttpServletResponse response,
			String hostNuid, String[] participantNuid, String memberMrn, String meetingType) throws Exception {
		logger.info(LOG_ENTERED);
		CreateInstantVendorMeetingOutput output = null;
		String jsonString = null;

		try {
			output = WebService.createInstantVendorMeeting(hostNuid, participantNuid, memberMrn, meetingType,
					request.getSession().getId(), WebUtil.clientId);

			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.debug("json output" + jsonString.toString());
			}

		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;
	}

	public static String terminateSetupWizardMeeting(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		String jsonString = null;
		long meetingId = 0;
		String vendorConfId = null;

		try {
			if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
				meetingId = Long.parseLong(request.getParameter("meetingId"));
			} else {
				return "MeetingCommand.terminateSetupWizardMeeting -> Validation Error: Meeting Id can not be null or blank.";
			}

			if (StringUtils.isNotBlank(request.getParameter("vendorConfId"))) {
				vendorConfId = request.getParameter("vendorConfId");
			}

			boolean success = WebService.initWebService(request);
			String hostNuid = WebService.getSetupWizardHostNuid();

			output = WebService.terminateInstantMeeting(meetingId, vendorConfId, hostNuid,
					request.getSession().getId());

			if (output != null) {
				Gson gson = new Gson();
				jsonString = gson.toJson(output);
				logger.info("json output" + jsonString.toString());
			}

		} catch (Exception e) {
			logger.error("System Error for meeting:" + meetingId, e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;
	}

	public static String performSSOSignOn(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			boolean success = WebService.initWebService(request);
			if (ctx != null) {
				String userName = request.getParameter("username");
				String password = request.getParameter("password");

				logger.debug("userName= " + userName + ",password=" + password);

				if (StringUtils.isNotBlank(userName) && StringUtils.isNotBlank(password)) {
					KpOrgSignOnInfo kpOrgSignOnInfo = WebService.performKpOrgSSOSignOn(userName, password);

					if (kpOrgSignOnInfo == null) {
						// TODO not authenticated. Clear the logged in cache.
						logger.warn("SSO Sign on failed due to KP org signon Service unavailability.");
						strResponse = invalidateWebAppContext(ctx);

					} else {
						if (!kpOrgSignOnInfo.isSuccess() || StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
								|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError())) {
							logger.warn(
									"SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
							strResponse = invalidateWebAppContext(ctx);
						} else if (kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null
								&& StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid()))) {
							logger.warn("SSO Sign on service failed to return GUID for a user");
							strResponse = invalidateWebAppContext(ctx);
						} else if (StringUtils.isBlank(kpOrgSignOnInfo.getSsoSession())) {
							logger.warn("SSO Sign on service failed to return SSOSESSION for a user");
							strResponse = invalidateWebAppContext(ctx);
						} else {

							AuthorizeResponseVo authorizeMemberResponse = WebService
									.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
							if (authorizeMemberResponse == null) {
								logger.warn("SSO Sign on failed due to unavailability of Member SSO Auth API");
								strResponse = invalidateWebAppContext(ctx);
							} else {
								// check for errors returned
								if (authorizeMemberResponse.getResponseWrapper() == null) {
									logger.warn("SSO Sign on failed due to Member SSO Auth API authorization failure");
									strResponse = invalidateWebAppContext(ctx);
								} else {
									if (validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper())) {
										logger.info(
												"SSO Sign on successful and setting member info into web app context");
										setWebAppContextMemberInfo(ctx,
												authorizeMemberResponse.getResponseWrapper().getMemberInfo());
										ctx.setKpOrgSignOnInfo(kpOrgSignOnInfo);
										ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());
										strResponse = "200";
									} else {
										strResponse = invalidateWebAppContext(ctx);
									}
								}

							}
						}
					}
				} else {
					logger.warn("SSO Sign on failed as either username or password is not available");
					strResponse = "400";
				}
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

	private static void setWebAppContextMemberInfo(WebAppContext ctx, MemberInfo memberInfo) {
		Member memberDO = new Member();
		try {
			String dateStr = memberInfo.getDateOfBirth();
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

	private static String invalidateWebAppContext(WebAppContext ctx) {
		if (ctx != null) {
			ctx.setMemberDO(null);
			ctx.setKpOrgSignOnInfo(null);
			ctx.setAuthenticated(false);
		}
		return "400";
	}

	public static String validateKpOrgSSOSession(HttpServletRequest request, HttpServletResponse response,
			String ssoSession) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			boolean success = WebService.initWebService(request);
			// Validation
			if (ctx != null) {
				KpOrgSignOnInfo kpOrgSignOnInfo = WebService.validateKpOrgSSOSession(ssoSession);

				if (kpOrgSignOnInfo == null) {
					// TODO not authenticated. Clear the logged in cache.
					logger.warn("SSO Sign on failed due to KP org signon Service unavailability.");
					strResponse = invalidateWebAppContext(ctx);

				} else {
					if (!kpOrgSignOnInfo.isSuccess() || StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
							|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError())) {
						logger.warn(
								"SSO Sign on failed either due to Signon service returned success as false or System or Business Error.");
						strResponse = invalidateWebAppContext(ctx);
					} else if (kpOrgSignOnInfo.getUser() == null || (kpOrgSignOnInfo.getUser() != null
							&& StringUtils.isBlank(kpOrgSignOnInfo.getUser().getGuid()))) {
						logger.warn("SSO Sign on service failed to return GUID for a user");
						strResponse = invalidateWebAppContext(ctx);
					} else {

						AuthorizeResponseVo authorizeMemberResponse = WebService
								.authorizeMemberSSOByGuid(kpOrgSignOnInfo.getUser().getGuid(), null);
						if (authorizeMemberResponse == null) {
							logger.warn("SSO Sign on failed due to unavailability of Member SSO Auth API");
							strResponse = invalidateWebAppContext(ctx);
						} else {
							// check for errors returned
							if (authorizeMemberResponse.getResponseWrapper() == null) {
								logger.warn("SSO Sign on failed due to Member SSO Auth API authorization failure");
								strResponse = invalidateWebAppContext(ctx);
							} else {
								if (validateMemberSSOAuthResponse(authorizeMemberResponse.getResponseWrapper())) {
									logger.info("SSO Sign on successful and setting member info into web app context");
									setWebAppContextMemberInfo(ctx,
											authorizeMemberResponse.getResponseWrapper().getMemberInfo());
									ctx.setKpOrgSignOnInfo(kpOrgSignOnInfo);
									ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());
									strResponse = "200";
								} else {
									strResponse = invalidateWebAppContext(ctx);
								}

							}

						}
					}
				}
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

	public static boolean performSSOSignOff(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		boolean isSignedOff = false;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx != null) {
				if (ctx.getKpOrgSignOnInfo() != null
						&& StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession())) {
					boolean success = WebService.initWebService(request);
					isSignedOff = WebService.performKpOrgSSOSignOff(ctx.getKpOrgSignOnInfo().getSsoSession());
				}
				invalidateWebAppContext(ctx);
				WebUtil.removeCookie(request, response, WebUtil.SSO_COOKIE_NAME);
				WebUtil.removeCookie(request, response, WebUtil.HSESSIONID_COOKIE_NAME);
				WebUtil.removeCookie(request, response, WebUtil.S_COOKIE_NAME);
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return isSignedOff;
	}

	public static String setKPHCConferenceStatus(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		long meetingId = 0;
		String jsonStr = null;
		final Gson gson = new Gson();
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
				}
				if (meetingId == 0) {
					meetingId = ctx.getMeetingId();
				}
				final String status = request.getParameter("status");
				final String careGiverName = request.getParameter("careGiverName");
				logger.info("meetingId=" + meetingId + ", status=" + status);

				boolean isProxyMeeting = false;
				if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
					isProxyMeeting = true;
				}

				output = WebService.setKPHCConferenceStatus(meetingId, status, isProxyMeeting, careGiverName,
						request.getSession().getId(), WebUtil.clientId);
			}
		} catch (Exception e) {
			logger.error("System error for meeting:" + meetingId, e);
		}
		if (output == null) {
			output = new ServiceCommonOutput();
			output.setName("SetKPHCConferenceStatus");
			final Status status = new Status();
			status.setCode("900");
			status.setMessage("System error");
			output.setStatus(status);
		}
		jsonStr = gson.toJson(output);
		logger.info(LOG_EXITING + "Result: " + jsonStr);
		return jsonStr;
	}

	public static String retrieveActiveMeetingsForMemberAndProxies(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
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
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String launchMemberOrProxyMeetingForMember(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		long meetingId = 0;
		String output = null;
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
					ctx.setMeetingId(meetingId);
				}

				logger.info("meetingId=" + meetingId + ", isProxyMeeting=" + request.getParameter("isProxyMeeting"));
				logger.debug("inMeetingDisplayName=" + request.getParameter("inMeetingDisplayName"));
				boolean isProxyMeeting;
				if ("Y".equalsIgnoreCase(request.getParameter("isProxyMeeting"))) {
					isProxyMeeting = true;
				} else {
					isProxyMeeting = false;
				}
				output = WebService.launchMemberOrProxyMeetingForMember(meetingId, ctx.getMemberDO().getMrn(),
						request.getParameter("inMeetingDisplayName"), isProxyMeeting, request.getSession().getId());
				return output;
			}
		} catch (Exception e) {
			logger.error("System error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String memberLeaveProxyMeeting(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		JoinLeaveMeetingJSON output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String responseStr = null;
		try {
			if (ctx != null) {
				output = WebService.memberLeaveProxyMeeting(request.getParameter("meetingId"),
						request.getParameter("memberName"), request.getSession().getId(), false);
				if (output != null && output.getService() != null && output.getService().getStatus() != null) {
					responseStr = output.getService().getStatus().getMessage();
				}
			}
			if (StringUtils.isBlank(responseStr)) {
				responseStr = new SystemError().getErrorMessage();
			}
		} catch (Exception e) {
			responseStr = new SystemError().getErrorMessage();
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return responseStr;
	}

	public static String verifyCaregiver(HttpServletRequest request, HttpServletResponse response)
			throws RemoteException {
		logger.info(LOG_ENTERED);
		String json = "";
		VerifyCareGiverOutput verifyCareGiverOutput = new VerifyCareGiverOutput();

		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			verifyCareGiverOutput = WebService.verifyCaregiver(meetingCode, patientLastName,
					request.getSession().getId(), WebUtil.clientId);
			if (verifyCareGiverOutput != null) {
				String statusCode = verifyCareGiverOutput.getStatus().getCode();
				if (statusCode != "200") {
					ctx.setCareGiver(false);
				}
				ctx.setCareGiver(true);
				if (verifyCareGiverOutput.getEnvelope() != null
						&& verifyCareGiverOutput.getEnvelope().getMeeting() != null) {
					List<Caregiver> caregivers = verifyCareGiverOutput.getEnvelope().getMeeting().getCaregiver();
					if (CollectionUtils.isNotEmpty(caregivers)) {
						for (Caregiver caregiver : caregivers) {
							if (StringUtils.isNotBlank(meetingCode)
									&& meetingCode.equalsIgnoreCase(caregiver.getCareGiverMeetingHash())) {
								ctx.setCareGiverName(caregiver.getLastName() + ", " + caregiver.getFirstName());
								break;
							}
						}
					}
				}
				Gson gson = new Gson();
				json = gson.toJson(verifyCareGiverOutput);
				logger.debug("json output" + json.toString());
			}
		} catch (Exception e) {
			logger.error("System Error : ", e);
			json = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return json;
	}

	public static String getLaunchMeetingDetailsForMemberGuest(HttpServletRequest request, HttpServletResponse response)
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
			if (StringUtils.isNotBlank(request.getParameter("isMobileFlow"))
					&& request.getParameter("isMobileFlow").equalsIgnoreCase("true")) {
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
					WebUtil.clientId);
			if (launchMeetingForMemberGuest != null) {
				String statusCode = launchMeetingForMemberGuest.getStatus().getCode();
				if (statusCode != "200") {
					ctx.setCareGiver(false);

				}
				ctx.setCareGiver(true);
				Gson gson = new Gson();
				json = gson.toJson(launchMeetingForMemberGuest);
				logger.debug("json output" + json.toString());
				return json;
			}

		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String launchMeetingForMemberDesktop(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info(LOG_ENTERED);
		long meetingId = 0;
		String megaMeetingDisplayName = null;
		String output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);

		if (ctx != null) {
			try {
				if (request.getParameter("meetingId") != null && !request.getParameter("meetingId").equals("")) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
				}
				if (request.getParameter("megaMeetingDisplayName") != null
						&& !request.getParameter("megaMeetingDisplayName").equals("")) {
					megaMeetingDisplayName = request.getParameter("megaMeetingDisplayName");
				}

				logger.info("meetingId:" + meetingId);
				logger.debug("megaMeetingDisplayName=" + megaMeetingDisplayName);
				final String mrn = ctx.getMemberDO() != null ? ctx.getMemberDO().getMrn() : null;
				output = WebService.launchMeetingForMemberDesktop(meetingId, megaMeetingDisplayName, mrn,
						request.getSession().getId());
				if (output != null) {
					logger.debug("json output: = " + output.toString());
				}
			} catch (Exception e) {
				logger.error("System Error for meeting:" + meetingId, e);
				output = JSONObject.fromObject(new SystemError()).toString();
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String retrieveMeeting(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		MeetingDetailsJSON meetingDetailsJSON = null;
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				meetingDetailsJSON = WebService.retrieveMeeting(ctx.getMemberDO().getMrn(), PAST_MINUTES,
						FUTURE_MINUTES, request.getSession().getId());
				if (meetingDetailsJSON != null && meetingDetailsJSON.getService() != null
						&& meetingDetailsJSON.getService().getStatus() != null
						&& "200".equals(meetingDetailsJSON.getService().getStatus().getCode())
						&& meetingDetailsJSON.getService().getEnvelope() != null
						&& meetingDetailsJSON.getService().getEnvelope().getMeetings() != null) {
					List<MeetingDO> myMeetings = meetingDetailsJSON.getService().getEnvelope().getMeetings();
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
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String getLaunchMeetingDetailsForMember(HttpServletRequest request, HttpServletResponse response)
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
				meetingId = Long.parseLong(request.getParameter("meetingId"));
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
		return (JSONObject.fromObject(new SystemError()).toString());
	}

	public static String memberLogout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				output = WebService.memberLogout(ctx.getMemberDO().getMrn(), request.getSession().getId());
				if (output != null) {
					logger.info("json output" + output);
					logger.info(LOG_EXITING);
					return output;
				}

			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}

	/**
	 * @param request
	 * @param response
	 * @return
	 */
	public static String getProviderRunningLateDetails(final HttpServletRequest request,
			final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String output = null;

		final String meetingId = request.getParameter("meetingId");
		final String sessionId = request.getSession().getId();

		try {
			if (ctx != null) {
				output = WebService.getProviderRunningLateDetails(meetingId, sessionId);
			}
		} catch (Exception e) {
			output = (new Gson().toJson(new SystemError()));
			logger.error("System Error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String caregiverJoinLeaveMeeting(HttpServletRequest request, HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String output = null;

		final String meetingId = request.getParameter("meetingId");
		final String meetingHash = request.getParameter("meetingHash");
		String joinOrLeave = request.getParameter("status");
		final String sessionId = request.getSession().getId();
		if (StringUtils.isNotEmpty(joinOrLeave)) {
			joinOrLeave = joinOrLeave.trim();
		}
		try {
			if (ctx != null) {
				output = WebService.caregiverJoinLeaveMeeting(meetingId, meetingHash, joinOrLeave, sessionId);
			}
		} catch (Exception e) {
			output = (new Gson().toJson(new SystemError()));
			logger.error("System Error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return output;
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
	
	public static String logVendorMeetingEvents(final HttpServletRequest request, final HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		String output = null;
		final String meetingId = request.getParameter("meetingId");
		final String userType = request.getParameter("userType");
		final String userId = request.getParameter("userId");
		final String eventName = request.getParameter("eventName");
		final String eventDescription = request.getParameter("eventDescription");
		final String logType = request.getParameter("logType");
		final String sessionId = request.getSession().getId();
		try {
			output = WebService.logVendorMeetingEvents(Long.parseLong(meetingId), userType, userId, eventName,
					eventDescription, logType, sessionId);
		} catch (Exception e) {
			output = (new Gson().toJson(new SystemError()));
			logger.error("System Error for meeting :" + meetingId + " : ", e);
		}
		logger.info(LOG_EXITING);
		return output;
	}
}
