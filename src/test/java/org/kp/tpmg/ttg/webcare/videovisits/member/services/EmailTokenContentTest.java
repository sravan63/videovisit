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
	
	@Test
	public void getEmailTokenContentCareGiver_Success() throws Exception {

		
		new Expectations() {
			{
				request.getHeader("authtoken");
				result = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzNDMwNTgxNDQwNDA4MCIsIm1lZXRpbmdJZCI6IjM0MzA1OCIsImVtYWlsVHlwZSI6ImNhcmVnaXZlcl9pbnN0cnVjdGlvbmFsX2VtYWlsIiwic3ViamVjdCI6IkdldCBSZWFkeSBmb3IgeW91ciBWaWRlb-KAr1Zpc2l0IHwgUHJlcMOhcmVzZSBwYXJhIHN1IHZpZGVvY29uc3VsdGEgIHwg54K66KaW6KiK5bCx6Ki65YGa5aW95rqW5YKZIChEVikiLCJndWVzdEhlbHBVcmwiOiJodHRwOi8va3Bkb2Mub3JnL3ZpZGVvdmlzaXRzIiwibWVldGluZ1VSTCI6Imh0dHBzOi8vZHYxLm15ZG9jdG9yLmthaXNlcnBlcm1hbmVudGUub3JnL3ZpZGVvdmlzaXQvIy9ndWVzdGxvZ2luP21lZXRpbmdjb2RlPUQyRkFBQS0yOEVBLTQ1N0EtQjE0OS00N0JFMTEzMDYyOUQiLCJtZWV0aW5nVGltZSI6Ik1vbiwgU2VwIDI3IGF0IDI6MzAgQU0gUERUIiwibWVtYmVyRmlyc3ROYW1lIjoiQWxleGFuZGVyIiwibGFzdE5hbWVGaXJzdENoYXJNZW1iZXIiOiJCIiwiZG9jdG9yRmlyc3ROYW1lIjoiR3VycHJlZXQiLCJkb2N0b3JMYXN0TmFtZSI6Ildzc29BIiwiZG9jdG9yVGl0bGUiOiIsIE1EIn0.p5WhQq-Z5KhJGUQppy_Wcx7UaKmpR-D1gg-6sJ41bfjiq4I4Gmd0PRiCokhGoprjOGOczPSWrFI7bm7ghqycWw";

			}
		};
		final String outputStr = memberRestController.getEmailTokenInfo(request, response);
		assertNotNull(outputStr);
	}
}
