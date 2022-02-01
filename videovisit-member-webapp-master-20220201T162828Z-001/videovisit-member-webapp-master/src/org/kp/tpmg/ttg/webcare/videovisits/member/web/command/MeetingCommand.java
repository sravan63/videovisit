package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants.SIP;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants.TELEPHONY;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.rmi.RemoteException;
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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.MemberConstants;
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
import org.kp.tpmg.videovisit.model.meeting.SipParticipant;
import org.kp.tpmg.videovisit.model.meeting.VerifyCareGiverOutput;
import org.kp.tpmg.videovisit.model.meeting.VerifyMemberOutput;
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
	
	public static void updateWebappContextWithBrowserFlags(WebAppContext ctx) {
		if (ctx != null) {
			final String blockChrome = getExtPropertiesValueByKey("BLOCK_CHROME_BROWSER");
			final String blockFF = getExtPropertiesValueByKey("BLOCK_FIREFOX_BROWSER");
			final String blockEdge = getExtPropertiesValueByKey("BLOCK_EDGE_BROWSER");
			final String blockSafari = getExtPropertiesValueByKey("BLOCK_SAFARI_BROWSER");
			final String blockSafariVersion = AppProperties.getExtPropertiesValueByKey("BLOCK_SAFARI_VERSION");
			final String blockPexipIE = AppProperties.getExtPropertiesValueByKey("BLOCK_PEXIP_IE_BROWSER");
			if (StringUtils.isNotBlank(blockChrome)) {
				ctx.setBlockChrome(blockChrome);
			}
			if (StringUtils.isNotBlank(blockFF)) {
				ctx.setBlockFF(blockFF);
			}
			if (StringUtils.isNotBlank(blockEdge)) {
				ctx.setBlockEdge(blockEdge);
			}
			if (StringUtils.isNotBlank(blockSafari)) {
				ctx.setBlockSafari(blockSafari);
			}
			if (StringUtils.isNotBlank(blockSafariVersion)) {
				ctx.setBlockSafariVersion(blockSafariVersion);
			}
			if (StringUtils.isNotBlank(blockPexipIE)) {
				ctx.setBlockPexipIE(blockPexipIE);
			}
		}
	}

	public static void setupGuestInfo(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		try {
			final String meetingCode = request.getParameter("meetingCode");
			final String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			logger.debug("patientLastName : " + patientLastName);
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

	public static String verifyMember(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		VerifyMemberOutput verifyMemberOutput = new VerifyMemberOutput();

		try {
			String lastName = "";
			String mrn8Digit = "";
			String birth_month = "";
			String birth_year = "";
			String birth_day = "";
			WebAppContext ctx = WebAppContext.getWebAppContext(request);

			if (StringUtils.isNotBlank(request.getParameter("last_name"))) {
				lastName = request.getParameter("last_name");
			}
			if (StringUtils.isNotBlank(request.getParameter("mrn"))) {
				mrn8Digit = fillToLength(request.getParameter("mrn"), '0', 8);
			}
			if (StringUtils.isNotBlank(request.getParameter("birth_month"))) {
				birth_month = request.getParameter("birth_month");
			}
			if (StringUtils.isNotBlank(request.getParameter("birth_year"))) {
				birth_year = request.getParameter("birth_year");
			}
			if (StringUtils.isNotBlank(request.getParameter("birth_day"))) {
				birth_day = request.getParameter("birth_day");
			}
			boolean success = WebService.initWebService(request);

			if (ctx != null && success == true) {
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

	public static String updateEndMeetingLogout(HttpServletRequest request,
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
				String clientId = notifyVideoForMeetingQuit ? ctx.getBackButtonClientId() : ctx.getClientId();
				if (ctx.getMemberDO() != null) {
					ret = WebService.memberEndMeetingLogout(ctx.getMemberDO().getMrn(), meetingId,
							request.getSession().getId(), memberName, notifyVideoForMeetingQuit, clientId);
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
		String meetingCode;
		String jsonStr = null;
		if (ctx != null) {
			meetingCode = ctx.getMeetingCode();
			try {
				meetingDetailsOutput = WebService.retrieveMeetingForCaregiver(meetingCode, request.getSession().getId(),
						ctx.getClientId());
			} catch (Exception e) {
				logger.error("Web Service API error:" + e.getMessage(), e);
			}
			final Gson gson = new GsonBuilder().serializeNulls().create();
			if (isMyMeetingsAvailable(meetingDetailsOutput)) {
				final List<MeetingDO> myMeetings = meetingDetailsOutput.getEnvelope().getMeetings();
				logger.info("Meetings Size: " + myMeetings.size());
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
				jsonStr = gson.toJson(myMeetings);
			} else {
				// no meeting, we should blank out cached meeting
				ctx.setMyMeetings(null);
				ctx.setTotalmeetings(0);
			}
		} else {
			logger.warn("empty web context");
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

	public static String IsMeetingHashValid(HttpServletRequest request)
			throws RemoteException, Exception {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		updateWebappContextWithBrowserFlags(ctx);
		updateWebappContextWithPexipDesktopBrowserDetails(ctx);
		String meetingCode = request.getParameter("meetingCode");
		boolean success = WebService.initWebService(request);
		if (ctx != null && success) {
			output = WebService.IsMeetingHashValid(meetingCode, ctx.getClientId(), request.getSession().getId());
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
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String createCaregiverMeetingSession(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		LaunchMeetingForMemberGuestOutput output = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String jsonString = null;
		Gson gson = new Gson();
		try {
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			boolean isMobileFlow;
			if ("true".equalsIgnoreCase(request.getParameter("isMobileFlow"))) {
				isMobileFlow = true;
				logger.info("mobile flow is true");
			} else {
				isMobileFlow = false;
				logger.info("mobile flow is false");
			}
			final String clientId = WebUtil.getClientIdFromContext(ctx);
			if (StringUtils.isNotBlank(meetingCode)) {
				output = WebService.createCaregiverMeetingSession(meetingCode, patientLastName, isMobileFlow,
						request.getSession().getId(), clientId);
				if (output != null && output.getLaunchMeetingEnvelope().getLaunchMeeting() != null) {
					jsonString = gson.toJson(output);
					logger.debug("json output" + jsonString);
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

	public static String endCaregiverMeetingSession(HttpServletRequest request)
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
						false, request.getSession().getId(), ctx.getClientId());
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

	private static void normalizeMeetingData(MeetingDO meeting, String meetingHash, WebAppContext ctx) {
		if (meeting == null) {
			return;
		}
		meeting.setParticipant(meeting.getParticipant());
		meeting.setCaregiver(meeting.getCaregiver());
	}

	public static String createInstantVendorMeeting(HttpServletRequest request,
			String hostNuid, String[] participantNuid, String memberMrn, String meetingType) throws Exception {
		logger.info(LOG_ENTERED);
		CreateInstantVendorMeetingOutput output = null;
		String jsonString = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		final String clientId = WebUtil.getClientIdFromContext(ctx);
		try {
			output = WebService.createInstantVendorMeeting(hostNuid, participantNuid, memberMrn, meetingType,
					request.getSession().getId(), clientId);

			final Gson gson = new GsonBuilder().serializeNulls().create();
			
			if (output != null && output.getStatus() != null) {
				if ("200".equalsIgnoreCase(output.getStatus().getCode())
						&& output.getEnvelope() != null) {
					jsonString = gson.toJson(output.getEnvelope().getMeeting());
				}
			}

		} catch (Exception e) {
			logger.error("System Error :" + e.getMessage(), e);
			jsonString = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return jsonString;
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

	public static String performSSOSignOn(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			WebService.initWebService(request);
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
						if (!kpOrgSignOnInfo.isSuccess() && (StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
								|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError()))) {
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

	private static String invalidateWebAppContext(WebAppContext ctx) {
		if (ctx != null) {
			ctx.setMemberDO(null);
			ctx.setKpOrgSignOnInfo(null);
			ctx.setAuthenticated(false);
		}
		return "400";
	}

	public static String validateKpOrgSSOSession(HttpServletRequest request,
			String ssoSession) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			WebService.initWebService(request);
			// Validation
			if (ctx != null) {
				KpOrgSignOnInfo kpOrgSignOnInfo = WebService.validateKpOrgSSOSession(ssoSession);

				if (kpOrgSignOnInfo == null) {
					// TODO not authenticated. Clear the logged in cache.
					logger.warn("SSO Sign on failed due to KP org signon Service unavailability.");
					strResponse = invalidateWebAppContext(ctx);

				} else {
					if (!kpOrgSignOnInfo.isSuccess() && (StringUtils.isNotBlank(kpOrgSignOnInfo.getSystemError())
							|| StringUtils.isNotBlank(kpOrgSignOnInfo.getBusinessError()))) {
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
					WebService.initWebService(request);
					isSignedOff = WebService.performKpOrgSSOSignOff(ctx.getKpOrgSignOnInfo().getSsoSession());
				}
				invalidateWebAppContext(ctx);
				WebUtil.removeCookie(request, response, WebUtil.getSSOCookieName());
				WebUtil.removeCookie(request, response, WebUtil.HSESSIONID_COOKIE_NAME);
				WebUtil.removeCookie(request, response, WebUtil.S_COOKIE_NAME);
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return isSignedOff;
	}

	public static String setKPHCConferenceStatus(HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		ServiceCommonOutput output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		long meetingId = 0;
		String jsonStr;
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
						request.getSession().getId(), ctx.getClientId());
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

	public static String retrieveActiveMeetingsForMemberAndProxies(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		MeetingDetailsOutput output = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
//		updateWebappContextWithBrowserFlags(ctx);
		updateWebappContextWithPexipDesktopBrowserDetails(ctx);
		final Gson gson = new GsonBuilder().serializeNulls().create();
		String jsonStr = null;
		try {
			if (ctx != null && ctx.getMemberDO() != null) {
				if (WebUtil.isSsoSimulation() && WebUtil.SSO_SIMULATION.equalsIgnoreCase(ctx.getContextId())) {
					output = WebService.getActiveMeetingsForSSOSimulation(ctx.getMemberDO().getMrn(), ctx.isNonMember(),
							request.getSession().getId(), ctx.getClientId());
				} else {
					if (ctx.isNonMember()) {
						output = WebService.retrieveActiveMeetingsForNonMemberProxies(
								ctx.getKpOrgSignOnInfo().getUser().getGuid(), request.getSession().getId(),
								ctx.getClientId());
					} else {
						boolean getProxyMeetings = false;
						if (ctx.getKpOrgSignOnInfo() != null) {
							getProxyMeetings = true;
						}

						output = WebService.retrieveActiveMeetingsForMemberAndProxies(ctx.getMemberDO().getMrn(),
								getProxyMeetings, request.getSession().getId(), ctx.getClientId());
					}
				}

				if (output != null && "200".equals(output.getStatus().getCode())) {
					
					if (!isMyMeetingsAvailable(output)) {
						ctx.setTotalmeetings(0);
					} else {
						final List<MeetingDO> meetings = output.getEnvelope().getMeetings();
						ctx.setTotalmeetings(meetings != null ? meetings.size() : 0);
						ctx.setMyMeetings(meetings);
						jsonStr = gson.toJson(meetings);
					}
				} else {
					ctx.setMyMeetings(null);
					ctx.setTotalmeetings(0);
				}
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		logger.info(LOG_EXITING);
		return jsonStr;
	}

	public static String launchMemberOrProxyMeetingForMember(HttpServletRequest request) {
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
						request.getParameter("inMeetingDisplayName"), isProxyMeeting, request.getSession().getId(), ctx.getClientId());
				return output;
			}
		} catch (Exception e) {
			logger.error("System error for meeting:" + meetingId, e);
		}
		logger.info(LOG_EXITING);
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String memberLeaveProxyMeeting(HttpServletRequest request)
			throws Exception {
		logger.info(LOG_ENTERED);
		JoinLeaveMeetingJSON output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String responseStr = null;
		try {
			if (ctx != null) {
				output = WebService.memberLeaveProxyMeeting(request.getParameter("meetingId"),
						request.getParameter("memberName"), request.getSession().getId(), false, ctx.getClientId());
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

	public static String verifyCaregiver(HttpServletRequest request)
			throws RemoteException {
		logger.info(LOG_ENTERED);
		String json = "";
		VerifyCareGiverOutput verifyCareGiverOutput = new VerifyCareGiverOutput();

		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			String meetingCode = request.getParameter("meetingCode");
			String patientLastName = WebUtil.replaceSpecialCharacters(request.getParameter("patientLastName"));
			final String clientId = WebUtil.getClientIdFromContext(ctx);
			verifyCareGiverOutput = WebService.verifyCaregiver(meetingCode, patientLastName,
					request.getSession().getId(), clientId);
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
				logger.debug("json output" + json);
			}
		} catch (Exception e) {
			logger.error("System Error : ", e);
			json = JSONObject.fromObject(new SystemError()).toString();
		}
		logger.info(LOG_EXITING);
		return json;
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
		String output = null;
		WebAppContext ctx = WebAppContext.getWebAppContext(request);

		if (ctx != null) {
			try {
				if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
				}
				if (StringUtils.isNotBlank(request.getParameter("megaMeetingDisplayName"))) {
					megaMeetingDisplayName = request.getParameter("megaMeetingDisplayName");
				}

				logger.info("meetingId:" + meetingId);
				logger.debug("megaMeetingDisplayName=" + megaMeetingDisplayName);
				final String mrn = ctx.getMemberDO() != null ? ctx.getMemberDO().getMrn() : null;
				output = WebService.launchMeetingForMemberDesktop(meetingId, megaMeetingDisplayName, mrn,
						request.getSession().getId(), ctx.getClientId());
				if (output != null) {
					logger.debug("json output: = " + output);
				}
			} catch (Exception e) {
				logger.error("System Error for meeting:" + meetingId, e);
				output = JSONObject.fromObject(new SystemError()).toString();
			}
		}
		logger.info(LOG_EXITING);
		return output;
	}

	public static String retrieveMeeting(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		updateWebappContextWithBrowserFlags(ctx);
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
		return JSONObject.fromObject(new SystemError()).toString();
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
		return JSONObject.fromObject(new SystemError()).toString();
	}

	public static String memberLogout(HttpServletRequest request) throws Exception {
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
	public static String getProviderRunningLateDetails(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		String output = null;

		final String meetingId = request.getParameter("meetingId");
		final String sessionId = request.getSession().getId();

		try {
			if (ctx != null) {
				output = WebService.getProviderRunningLateDetails(meetingId, sessionId, ctx.getClientId());
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
				output = WebService.caregiverJoinLeaveMeeting(meetingId, meetingHash, joinOrLeave, sessionId, ctx.getClientId());
			}
		} catch (Exception e) {
			output = new Gson().toJson(new SystemError());
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
	
	public static String logVendorMeetingEvents(final HttpServletRequest request) {
		logger.info(LOG_ENTERED);
		String output = null;
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		final String meetingId = request.getParameter("meetingId");
		final String userType = request.getParameter("userType");
		final String userId = request.getParameter("userId");
		final String eventName = request.getParameter("eventName");
		final String eventDescription = request.getParameter("eventDescription");
		final String logType = request.getParameter("logType");
		final String sessionId = request.getSession().getId();
		final String clientId = WebUtil.getClientIdFromContext(ctx);
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
		final WebAppContext ctx = WebAppContext.getWebAppContext(request);
		final Gson gson = new GsonBuilder().serializeNulls().create();
		final String meetingId = request.getParameter("meetingId");
		String output = null;
		if (StringUtils.isNotBlank(meetingId) && ctx != null) {
			final MeetingDO meeting = ctx.getMyMeetingByMeetingId(meetingId);
			if (meeting != null && meetingId.trim().equalsIgnoreCase(meeting.getMeetingId())) {
				output = gson.toJson(meeting);
			}
		}
		logger.info(LOG_EXITING);
		return output;
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
}

