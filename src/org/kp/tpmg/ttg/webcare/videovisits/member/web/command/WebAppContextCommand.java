package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.*;

public class WebAppContextCommand {

	public static Logger logger = Logger.getLogger(WebAppContextCommand.class);
		
	public static WebAppContext createContext(HttpServletRequest request, String contextId) throws Exception {
		
		WebAppContext ctx = new WebAppContext();
		return ctx;
	}

}
