
package org.kp.tpmg.ttg.webcare.videovisits.member.services;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.controller.MemberRestController;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.springframework.web.client.RestTemplate;

import mockit.Mocked;

public class AbstractVideoVisitMemberApiTest {

	@Mocked
	HttpServletRequest request;

	@Mocked
	HttpServletResponse response;

	@Mocked
	RestTemplate restTemplate;

	WebService webService = new WebService();

	MemberRestController memberRestController = new MemberRestController();

}
