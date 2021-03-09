package org.kp.tpmg.ttg.webcare.videovisits.member.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.net.URI;

import org.junit.jupiter.api.Test;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.APIToken;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.model.VVResponse;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.ServiceUtil;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.google.gson.Gson;

import mockit.Expectations;
import mockit.Mock;
import mockit.MockUp;

public class AuthorizeVVCodeTest extends AbstractVideoVisitMemberApiTest {
	final Gson gson = new Gson();

	@Test
	public void AuthorizeVVCodeTest_Success() throws Exception {
		VVResponse output = new VVResponse();

		final String outputResp = "{ \"service\": { \"name\": \"authorizeVVCode\", \"status\": { \"code\": \"200\", \"message\": \"Success\" }, \"appVersion\": { \"version\": \"4.0.0\", \"instructions\": null }, \"envelope\": { \"meeting\": { \"meetingId\": \"331890\", \"host\": { \"nuid\": \"A444107\", \"firstName\": \"Jan\", \"lastName\": \"WssoG\", \"title\": \"NP\", \"inMeeting\": \"false\", \"isInvitedMa\": null, \"facilityCode\": \"MOD\", \"departmentCode\": \"PSY\", \"resourceId\": \"6602856\", \"role\": null, \"attendDateTime\": null, \"endDateTime\": null, \"inMeetingDisplayName\": \"WssoG, Jan NP\", \"imageUrl\": \"https://www.permanente.net/pmdb/other/no-photo.jpg\", \"homePageUrl\": \"http://www.kp.org/mydoctor/griffin\", \"subDepartmentCode\": \"CPY2\", \"facilityName\": \"MODESTO MEDICAL CENTER\", \"departmentName\": \"PSYCHIATRY\", \"subDepartmentName\": \"Child & Family Psychiatry\", \"vendorRole\": \"host\", \"inMeetingUniqueId\": null }, \"participant\": null, \"caregiver\": null, \"member\": { \"mrn\": \"14404080\", \"lastName\": \"Birdsong\", \"firstName\": \"Alexander\", \"middleName\": null, \"dateOfBirth\": \"837154800000\", \"gender\": \"M\", \"email\": \"GEETHANJALI.GOPALASWAMY@KP.ORG\", \"attendDateTime\": null, \"endDateTime\": null, \"inMeeting\": \"false\", \"inMeetingDisplayName\": \"Birdsong, Alexander\", \"age\": null, \"vendorRole\": \"guest\", \"inMeetingUniqueId\": null }, \"meetingType\": \"provider-to-member\", \"meetingTime\": \"1599453300000\", \"meetingJoinTime\": null, \"meetingExpireTime\": null, \"createTimestamp\": \"1599453027413\", \"lastUpdateTimestamp\": \"1599453028007\", \"schedulerNuid\": \"A444107\", \"showJoinNow\": \"true\", \"meetingStatus\": \"mm_scheduled\", \"meetingVendorId\": \"m.ncal.psy.0.0.098133.331890\", \"parrsApptId\": null, \"roomJoinUrl\": null, \"roomKey\": null, \"inMeeting\": false, \"encounterId\": null, \"hostNuid\": \"A444107\", \"parrsApptType\": null, \"parrsSecureFlag\": null, \"isRunningLate\": false, \"runLateMeetingTime\": null, \"totalRunLateTimeInMin\": null, \"vendor\": \"pexip\", \"vendorHostPin\": \"331890\", \"vendorGuestPin\": \"098133\", \"sipParticipants\": null, \"authToken\": null, \"vendorConfig\": null, \"memberEmail\": \"test@kp.org\", \"parrsFacilityCode\": null, \"parrsDepartmentCode\": null, \"parrsSubDepartmentCode\": null, \"parrsFacilityName\": null, \"parssDepartmentName\": null, \"parssSubDepartmentName\": null, \"memberStatusCode\": null, \"creationNuid\": null, \"lastUpdateDatetime\": null, \"lastUpdateNuid\": null, \"parrsEpicVisitType\": null, \"parrsActivityCode\": null }, \"firstName\": \"Alexander\", \"lastName\": \"Birdsong\", \"userType\": \"patient\" } } }";
		
		APIToken apiToken = new APIToken();
		apiToken.setAccessToken("79e7524f-66ee-32ea-96d9-dfe256b3ecdc");
		
		new MockUp<WebService>() {
			@Mock
			APIToken getAPIToken(final String opFlag) {
				return apiToken;
			}
		};
		
		new Expectations() {
			{
				request.getSession().getId();
				result = "12345";

				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzMzE4OTAxNDQwNDA4MCIsIm1lZXRpbmdJZCI6IjMzMTg5MCIsInVzZXJJZCI6IjE0NDA0MDgwIiwidXNlclR5cGUiOiJQYXRpZW50IiwiZXhwIjoxNTk5NDU0ODQ1fQ.6X-ibBMl0AB2EDwtD1O8Lt0_u7wcrv40tn7WnJkVgyhtoEzqu83vFhXVuSZAsY9qNbCXoPQ4IGlzC8CLSvCcHw";

				restTemplate.postForEntity((URI) any, (HttpEntity) any, String.class);
				result = new ResponseEntity<String>(
						"{ \"service\": { \"name\": \"authorizeVVCode\", \"status\": { \"code\": \"200\", \"message\": \"Success\" }, \"appVersion\": { \"version\": \"4.0.0\", \"instructions\": null }, \"envelope\": { \"meeting\": { \"meetingId\": \"331890\", \"host\": { \"nuid\": \"A444107\", \"firstName\": \"Jan\", \"lastName\": \"WssoG\", \"title\": \"NP\", \"inMeeting\": \"false\", \"isInvitedMa\": null, \"facilityCode\": \"MOD\", \"departmentCode\": \"PSY\", \"resourceId\": \"6602856\", \"role\": null, \"attendDateTime\": null, \"endDateTime\": null, \"inMeetingDisplayName\": \"WssoG, Jan NP\", \"imageUrl\": \"https://www.permanente.net/pmdb/other/no-photo.jpg\", \"homePageUrl\": \"http://www.kp.org/mydoctor/griffin\", \"subDepartmentCode\": \"CPY2\", \"facilityName\": \"MODESTO MEDICAL CENTER\", \"departmentName\": \"PSYCHIATRY\", \"subDepartmentName\": \"Child & Family Psychiatry\", \"vendorRole\": \"host\", \"inMeetingUniqueId\": null }, \"participant\": null, \"caregiver\": null, \"member\": { \"mrn\": \"14404080\", \"lastName\": \"Birdsong\", \"firstName\": \"Alexander\", \"middleName\": null, \"dateOfBirth\": \"837154800000\", \"gender\": \"M\", \"email\": \"GEETHANJALI.GOPALASWAMY@KP.ORG\", \"attendDateTime\": null, \"endDateTime\": null, \"inMeeting\": \"false\", \"inMeetingDisplayName\": \"Birdsong, Alexander\", \"age\": null, \"vendorRole\": \"guest\", \"inMeetingUniqueId\": null }, \"meetingType\": \"provider-to-member\", \"meetingTime\": \"1599453300000\", \"meetingJoinTime\": null, \"meetingExpireTime\": null, \"createTimestamp\": \"1599453027413\", \"lastUpdateTimestamp\": \"1599453028007\", \"schedulerNuid\": \"A444107\", \"showJoinNow\": \"true\", \"meetingStatus\": \"mm_scheduled\", \"meetingVendorId\": \"m.ncal.psy.0.0.098133.331890\", \"parrsApptId\": null, \"roomJoinUrl\": null, \"roomKey\": null, \"inMeeting\": false, \"encounterId\": null, \"hostNuid\": \"A444107\", \"parrsApptType\": null, \"parrsSecureFlag\": null, \"isRunningLate\": false, \"runLateMeetingTime\": null, \"totalRunLateTimeInMin\": null, \"vendor\": \"pexip\", \"vendorHostPin\": \"331890\", \"vendorGuestPin\": \"098133\", \"sipParticipants\": null, \"authToken\": null, \"vendorConfig\": null, \"memberEmail\": \"test@kp.org\", \"parrsFacilityCode\": null, \"parrsDepartmentCode\": null, \"parrsSubDepartmentCode\": null, \"parrsFacilityName\": null, \"parssDepartmentName\": null, \"parssSubDepartmentName\": null, \"memberStatusCode\": null, \"creationNuid\": null, \"lastUpdateDatetime\": null, \"lastUpdateNuid\": null, \"parrsEpicVisitType\": null, \"parrsActivityCode\": null }, \"firstName\": \"Alexander\", \"lastName\": \"Birdsong\", \"userType\": \"patient\" } } }", HttpStatus.OK);
				
			}
		};
		final String outputStr = memberRestController.authorizeVVCode(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("200", output.getCode());
		assertEquals("Success", output.getMessage());
		assertEquals(ServiceUtil.AUTHORIZE_VV_CODE, output.getName());
		assertNotNull(output.getData());
	}
	
	@Test
	public void AuthorizeVVCodeTest_MissingInputAttributes() throws Exception {
		VVResponse output = new VVResponse();

		new Expectations() {
			{
				request.getSession().getId();
				result = "12345";
			}
		};
		final String outputStr = memberRestController.authorizeVVCode(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("300", output.getCode());
		assertEquals("Missing input attributes.", output.getMessage());
		assertEquals(ServiceUtil.AUTHORIZE_VV_CODE, output.getName());
		assertNotNull(output.getData());
	}

	@Test
	public void AuthorizeVVCodeTest_Unauthorized() throws Exception {
		VVResponse output = new VVResponse();

		new Expectations() {
			{
				request.getSession().getId();
				result = "12345";

				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzMzE4OTAxNDQwNDA4MCIsIm1lZXRpbmdJZCI6IjMzMTg5MCIsInVzZXJJZCI6IjE0NDA0MDgwIiwidXNlclR5cGUiOiJQYXRpZW50IiwiZXhwIjoxNTk5NDU0ODQ1fQ.6X-ibBMl0AB2EDwtD1O8Lt0_u7wcrv40tn7WnJkVgyhtoEzqu83vFhXVuSZAsY9qNbCXoPQ4IGlzC8CLSvCcHw";

				restTemplate.postForEntity((URI) any, (HttpEntity) any, String.class);
				result = new ResponseEntity<String>(
						"{ \"service\": { \"name\": \"authorizeVVCode\", \"status\": { \"code\": \"401\", \"message\": \"Unauthorized\" }, \"appVersion\": { \"version\": \"4.0.0\", \"instructions\": null }, \"envelope\": null } }",
						HttpStatus.OK);

			}
		};
		final String outputStr = memberRestController.authorizeVVCode(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("401", output.getCode());
		assertEquals("Unauthorized", output.getMessage());
		assertEquals(ServiceUtil.AUTHORIZE_VV_CODE, output.getName());
		assertNotNull(output.getData());
	}
	
	@Test
	public void AuthorizeVVCodeTest_failure() throws Exception {
		VVResponse output = new VVResponse();

		new Expectations() {
			{
				request.getSession().getId();
				result = "12345";

				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzMzE4OTAxNDQwNDA4MCIsIm1lZXRpbmdJZCI6IjMzMTg5MCIsInVzZXJJZCI6IjE0NDA0MDgwIiwidXNlclR5cGUiOiJQYXRpZW50IiwiZXhwIjoxNTk5NDU0ODQ1fQ.6X-ibBMl0AB2EDwtD1O8Lt0_u7wcrv40tn7WnJkVgyhtoEzqu83vFhXVuSZAsY9qNbCXoPQ4IGlzC8CLSvCcHw";

				restTemplate.postForEntity((URI) any, (HttpEntity) any, String.class);
				result = new Exception();

			}
		};
		final String outputStr = memberRestController.authorizeVVCode(request, response);
		output = gson.fromJson(outputStr, VVResponse.class);
		assertEquals("900", output.getCode());
		assertEquals("failure", output.getMessage());
		assertEquals(ServiceUtil.AUTHORIZE_VV_CODE, output.getName());
		assertNotNull(output.getData());
	}

	
}
