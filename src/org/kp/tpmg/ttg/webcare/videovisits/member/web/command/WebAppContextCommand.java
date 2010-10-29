package org.kp.tpmg.ttg.webcare.videovisits.member.web.command;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;

public class WebAppContextCommand {

	public static Logger logger = Logger.getLogger(WebAppContextCommand.class);
	
	
	public WebAppContext createContext(HttpServletRequest request) throws Exception {
		WebAppContext ctx = new WebAppContext();
		//ctx.setContextId(contextId);
		
		//TODO: grab data from web services
		//ctx.setFirstName("First" + contextId);
		//ctx.setLastName("Last" + contextId);

		//TODO: add project-specific initialization here
		
		return ctx;
	}

}
