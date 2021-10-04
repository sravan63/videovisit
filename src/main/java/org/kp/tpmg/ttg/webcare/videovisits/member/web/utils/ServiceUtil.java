package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

public class ServiceUtil {

	private ServiceUtil() {
	}

	public static final String UPDATE_MEMBER_MEETING_STATUS = "updateMemberMeetingStatus";
	public static final String VERIFY_MEMBER = "verifyMember";
	public static final String CREATE_INSTANT_VENDOR_MEETING = "createInstantVendorMeeting";
	public static final String SET_KPHC_CONFERENCE_STATUS = "setKPHCConferenceStatus";
	public static final String TEST_DB_ROUND_TRIP = "testDbRoundTrip";
	public static final String MEMBER_LEAVE_PROXY_MEETING = "leaveMeeting";
	public static final String LAUNCH_MEMBER_OR_PROXY_MEETING_FOR_MEMBER = "launchMemberOrProxyMeetingForMember";
	public static final String LAUNCH_MEETING_FOR_MEMBER_DESKTOP = "launchMeetingForMemberDesktop";
	public static final String RETRIEVE_ACTIVE_MEETINGS_FOR_MEMBER_AND_PROXIES = "retrieveActiveMeetingsForMemberAndProxies";
	public static final String RETRIEVE_ACTIVE_MEETINGS_FOR_NON_MEMBER_AND_PROXIES = "retrieveActiveMeetingsForNonMemberProxies";
	public static final String IS_MEETING_HASH_VALID = "isMeetingHashValid";
	public static final String LAUNCH_MEETING_FOR_MEMBER_GUEST_DESKTOP = "launchMeetingForMemberGuestDesktop";
	public static final String END_MEETING_FOR_MEMBER_GUEST_DESKTOP = "endMeetingForMemberGuestDesktop";
	public static final String GET_ACTIVE_MEETINGS_FOR_MEMBER = "getActiveMeetingsForMember";
	public static final String LAUNCH_MEETING_FOR_MEMBER = "launchMeetingForMember";
	public static final String MEMBER_LOGOUT = "memberLogout";
	public static final String GET_PROVIDER_RUNNING_LATE_DETAILS = "getProviderRunningLateDetails";
	public static final String JOIN_LEAVE_MEETING_FOR_MEMBER_GUEST = "joinLeaveMeetingForMemberGuest";
	public static final String UPDATE_EMAIL_ACTION = "updateEmailAction";
	public static final String LOG_VENDOR_MEETING_EVENTS = "logVendorMeetingEvents";
	public static final String GET_MEETINGS_FOR_MEMBER_AND_NON_MEMBER_PROXIES = "getMeetingsForMemberAndNonMemberProxies";
	public static final String GET_MEETING_DETAILS_FOR_MEETING_ID = "getMeetingDetailsForMeetingId";
	public static final String JOIN_MEETING = "joinMeeting";
	public static final String LEAVE_MEETING = "leaveMeeting";
	public static final String VERIFY_AND_LAUNCH_MEETING_FOR_MEMBER_GUEST = "verifyAndLaunchMeetingForMemberGuest";
	public static final String MOBILE_LAUNCH_VV = "mobilelaunchvv";
	public static final String INSERT_VENODR_MEETING_MEDIA_CDR = "insertVendorMeetingMediaCDR";
	public static final String AUTHORIZE_VV_CODE = "authorizeVVCode";
	public static final String AUTHORIZE_EC_CODE = "authorizeECCode";
	public static final String UPDATE_GUEST_PARTICIPANT = "updateGuestParticipant";
	
	public static final String SUBMIT_SURVEY = "submitSurvey";
	public static final String GET_ACTIVE_SURVEYS = "getActiveSurveys";
	public static final String GET_SURVEY_QUESTIONS = "getSurveyQuestions";
	public static final String TEST_IS_ALIVE = "isAlive";
	public static final String GET = "GET";
	public static final String POST = "POST";
	
	public static final String MEETING_ID = "meetingId";
	public static final String MISSING_INPUT_ATTRIBUTES = "Missing input attributes.";
	public static final String CODE_300 = "300";
	public static final String GET_EC_MEETING_DETAILS_BY_ID = "getECMeetingDetailsById";
	public static final String X_CLIENTID="X-CLIENTID";
	public static final String X_SESSIONID="X-SESSIONID";
	public static final String IS_FROM_MOBILE_STRING="isFromMobile";
	
	public static final String AUTHORIZE_MEMBER_OAUTH = "authorizebyguid";
	
	public static final String PATIENT_INSTRUCTIONAL_EMAIL="patient_instructional_email";
	public static final String EMAIL_TYPE="emailType";
	public static final String SUBJECT="subject";
	public static final String MDO_URL="mdoUrl";
	public static final String PATIENT_HELP_URL="patientHelpUrl";
	public static final String PATIENT_JOIN_URL="patientJoinUrl";
	
	public static final String GUEST_HELP_URL="guestHelpUrl";
	public static final String MEETING_TIME="meetingTime";
	public static final String MEETING_URL="meetingURL";
	public static final String MEMBER_FIRSTNAME="memberFirstName";
	public static final String DOCTOR_LASTNAME="doctorLastName";
	public static final String DOCTOR_FIRSTNAME="doctorFirstName";
	public static final String DOCTOR_TITLE="doctorTitle";
	public static final String MEMBER_LASTNAME_FIRSTCHAR="lastNameFirstCharMember";
	
	public static final String CAREGIVER_INSTRUCTIONAL_EMAIL="caregiver_instructional_email";
	public static final String CAREGIVER_REMINDER_EMAIL="caregiver_reminder_email";
	
	public static final String EMAIL_TYPE_GUEST_EARLYSTART= "GUEST_EARLYSTART";
	public static final String EMAIL_TYPE_MEMBER_EARLYSTART = "MEMBER_EARLYSTART";
	public static final String SIGN_IN_URL="signInUrl";
	public static final String DOWNLOAD_MDO_APP_URL="downloadMdoAppUrl";
	public static final String VV_WEB_PAGE_URL="vvWebPage";
}
