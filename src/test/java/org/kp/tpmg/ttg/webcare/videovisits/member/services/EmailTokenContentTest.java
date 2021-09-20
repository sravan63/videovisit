package org.kp.tpmg.ttg.webcare.videovisits.member.services;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import mockit.Expectations;

public class EmailTokenContentTest extends AbstractVideoVisitMemberApiTest {
	
	@Test
	public void getEmailTokenContent_Success() throws Exception {

		
		new Expectations() {
			{
				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMzI0NTE0MDcwNjAiLCJtZWV0aW5nSWQiOiIyMzI0NSIsImVtYWlsVHlwZSI6InBhdGllbnRfaW5zdHJ1Y3Rpb25hbF9lbWFpbCIsInN1YmplY3QiOiJzdWJqZWN0IHZhdWUiLCJtZG9VcmwiOiJtZG8gVXJsIHZhbHVlIiwiZXhwIjoxNjMyMTQwMTAwfQ.ifgDhIgiKYI9vmfum0e6h9CuLDObuCC-jnGyais-seoOE8qrlJQTKWgFsrzTsW80HbpJoHd4o_wMfhca_zziAA";

			}
		};
		final String outputStr = memberRestController.getEmailTokenInfo(request, response);
		assertNotNull(outputStr);
	}

	@Test
	public void getEmailTokenContent_Failed() throws Exception {

		
		new Expectations() {
			{
				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMzI0NTE0MDdskgkldscwNjAiLCJtZWV0aW5nSWQiOiIyMzI0NSIsImVtYWlsVHlwZSI6InBhdGllbnRfaW5zdHJ1Y3Rpb25hbF9lbWFpbCIsInN1YmplY3QiOiJzdWJqZWN0IHZhdWUiLCJtZG9VcmwiOiJtZG8gVXJsIHZhbHVlIiwiZXhwIjoxNjMyMTQwMTAwfQ.ifgDhIgiKYI9vmfum0e6h9CuLDObuCC-jnGyais-seoOE8qrlJQTKWgFsrzTsW80HbpJoHd4o_wMfhca_zziAA";

			}
		};
		final String outputStr = memberRestController.getEmailTokenInfo(request, response);
		assertNotNull(outputStr);
	}
}
