package org.kp.tpmg.ttg.webcare.videovisits.member.web.utils;

import static org.junit.Assert.assertEquals;

import org.junit.Test;



public class WebUtilTest {

	@Test
	public void testConvertStringToLong() {
		assertEquals(10, WebUtil.convertStringToLong("10"));
	}
}
