package org.kp.tpmg.ttg.webcare.videovisits.member.services;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberGuestJSON;

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
	public void LaunchMeetingForMemberDesktopTest_300() throws Exception {
		LaunchMeetingForMemberGuestJSON output = new LaunchMeetingForMemberGuestJSON();
		new Expectations()
		{{
			request.getHeader("mrn");
			result="291307";
		}};
		System.out.println(request.getHeader("mrn"));
		String result = WebService.launchMeetingForMemberDesktop(WebUtil.convertStringToLong(meetingId), "mrn",
				"Joe Mama", "", "");
		output = gson.fromJson(result, LaunchMeetingForMemberGuestJSON.class);
		assertEquals(output.getService().getStatus().getCode(), "300");
		assertEquals(output.getService().getStatus().getMessage(), "Missing input attributes.");

	}

}
