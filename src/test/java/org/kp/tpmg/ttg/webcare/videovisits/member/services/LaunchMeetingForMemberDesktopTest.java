package org.kp.tpmg.ttg.webcare.videovisits.member.services;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;

import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.VVResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.google.gson.Gson;

import mockit.Expectations;

public class LaunchMeetingForMemberDesktopTest extends AbstractVideoVisitMemberApiTest {
	static String meetingId = null;
	static String mrn = null;
	static String megaMeetingDisplayName = null;
	final Gson gson = new Gson();

	@BeforeAll
	static void setup() {
		meetingId = "291307";
		mrn = "14404080";
		megaMeetingDisplayName = "Joe Mama";
	}

	@Test
	public void LaunchMeetingForMemberDesktopTest_200() throws Exception {
		VVResponse output = new VVResponse();

		new Expectations() {
			{
				request.getHeader("mrn");
				result = "14404080";

				request.getParameter("meetingId");
				result = "291307";

				request.getHeader("megaMeetingDisplayName");
				result = "Joe Mama";

				request.getSession().getId();
				result = "12345";

				restTemplate.postForEntity((URI) any, (HttpEntity) any, String.class);
				result = new ResponseEntity<String>(
						"{ \"service\": { \"name\": \"launchMeetingForMemberDesktop\", \"status\": { \"code\": \"200\", \"message\": \"Success\" }, \"appVersion\": { \"version\": \"3.0.0\", \"instructions\": null }, \"launchMeetingEnvelope\": { \"launchMeeting\": { \"meetingId\": \"602962\", \"host\": { \"nuid\": \"A444107\", \"firstName\": \"Jimmy\", \"lastName\": \"Trainersjo\", \"title\": \"MD\", \"inMeeting\": \"false\", \"isInvitedMa\": null, \"facilityCode\": \"SSC\", \"departmentCode\": \"MED\", \"resourceId\": \"3450656\", \"role\": null, \"attendDateTime\": null, \"endDateTime\": null, \"inMeetingDisplayName\": \"Trainersjo, Jimmy MD\", \"imageUrl\": \"https://www.permanente.net/pmdb/other/no-photo.jpg\", \"homePageUrl\": null, \"subDepartmentCode\": \"MD3B\", \"facilityName\": \"SO SACRAMENTO MEDICAL CENTER\", \"departmentName\": \"ADULT AND FAMILY MEDICINE\", \"subDepartmentName\": null, \"vendorRole\": \"host\" }, \"participant\": null, \"caregiver\": null, \"member\": { \"mrn\": \"14404080\", \"lastName\": \"Mama\", \"firstName\": \"Joe\", \"middleName\": \"\", \"dateOfBirth\": \"-7318800000\", \"gender\": \"M\", \"email\": \"TEST@KP.ORG\", \"attendDateTime\": null, \"endDateTime\": null, \"inMeeting\": \"false\", \"inMeetingDisplayName\": \"Mama, Joe\", \"age\": null, \"vendorRole\": \"guest\" }, \"meetingType\": \"provider-to-member\", \"meetingTime\": \"1577962500000\", \"meetingJoinTime\": null, \"meetingExpireTime\": null, \"createTimestamp\": \"1577962521043\", \"lastUpdateTimestamp\": \"1577962521723\", \"schedulerNuid\": \"A444107\", \"showJoinNow\": \"true\", \"meetingStatus\": \"mm_scheduled\", \"meetingVendorId\": \"m.ncal.med.0.0.269206.602962\", \"parrsApptId\": null, \"roomJoinUrl\": \"vve-tpmg-dev.kp.org\", \"roomKey\": null, \"inMeeting\": false, \"encounterId\": null, \"hostNuid\": \"A444107\", \"parrsApptType\": null, \"parrsSecureFlag\": null, \"isRunningLate\": false, \"runLateMeetingTime\": null, \"totalRunLateTimeInMin\": null, \"vendor\": \"pexip\", \"vendorHostPin\": \"602962\", \"vendorGuestPin\": \"269206\", \"sipParticipants\": null, \"authToken\": null, \"vendorConfig\": { \"turnServers\": [\"ivv-turn-dev.kp.org:443\"], \"turnUserName\": \"kpturnuser\", \"turnPassword\": \"LLBASGFnsla2312\" }, \"memberEmail\": \"TEST@KP.ORG\", \"parrsFacilityCode\": null, \"parrsDepartmentCode\": null, \"parrsSubDepartmentCode\": null, \"parrsFacilityName\": null, \"parssDepartmentName\": null, \"parssSubDepartmentName\": null, \"memberStatusCode\": null, \"creationNuid\": null, \"lastUpdateDatetime\": null, \"lastUpdateNuid\": null, \"parrsEpicVisitType\": null, \"parrsActivityCode\": null } } } }",
						HttpStatus.OK);

			}
		};
		final String outputStr = memberRestController.launchMeetingForMemberDesktop(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("200", output.getCode());
		assertEquals("Success", output.getMessage());
		assertEquals(ServiceUtil.LAUNCH_MEETING_FOR_MEMBER_DESKTOP, output.getName());
		assertNotNull(output.getData());
	}

	@Test
	public void LaunchMeetingForMemberDesktopTest_300() throws Exception {
		VVResponse output = new VVResponse();
		new Expectations() {
			{
				request.getHeader("mrn");
				result = "14404080";

				request.getParameter("meetingId");
				result = "291307";

				request.getHeader("megaMeetingDisplayName");
				result = null;

				request.getSession().getId();
				result = "12345";
			}
		};
		String outputStr = memberRestController.launchMeetingForMemberDesktop(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("300",output.getCode());
		assertEquals("Missing input attributes.", output.getMessage());

	}

	@Test
	public void LaunchMeetingForMemberDesktopTest_900() throws Exception {
		VVResponse output = new VVResponse();
		new Expectations() {
			{
				request.getHeader("mrn");
				result = "14404080";

				request.getParameter("meetingId");
				result = "291307";

				request.getHeader("megaMeetingDisplayName");
				result = "Joe Mama";

				request.getSession().getId();
				result = "12345";

				restTemplate.postForEntity((URI) any, (HttpEntity) any, String.class);
				result = new Exception();
			}
		};

		final String outputStr = memberRestController.launchMeetingForMemberDesktop(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("900",output.getCode());
		assertEquals(WebUtil.FAILURE,output.getMessage());
		

	}

}
