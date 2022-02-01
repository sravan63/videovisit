package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class WebAppContextCommand {

	public static final Logger logger = Logger.getLogger(WebAppContextCommand.class);

	public static WebAppContext createContext(HttpServletRequest request, String contextId) throws Exception {

		WebAppContext ctx = new WebAppContext();
		return ctx;
	}

}
