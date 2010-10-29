package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class AppRootController implements Controller {

	public static Logger logger = Logger.getLogger(AppRootController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null){
			ctx = new WebAppContext();
			WebAppContext.setWebAppContext(request, ctx);
		}
		
		//TODO add any additional logic here (admin user might go to different starting page, etc...)

		return new ModelAndView(getHomePageRedirect());
	}

	public WebAppContextCommand getWebAppContextCommand() {
		return webAppContextCommand;
	}

	public void setWebAppContextCommand(WebAppContextCommand webAppContextCommand) {
		this.webAppContextCommand = webAppContextCommand;
	}

	public EnvironmentCommand getEnvironmentCommand() {
		return environmentCommand;
	}

	public void setEnvironmentCommand(EnvironmentCommand environmentCommand) {
		this.environmentCommand = environmentCommand;
	}

	public String getContextIdParameter() {
		return contextIdParameter;
	}

	public void setContextIdParameter(String contextIdParameter) {
		this.contextIdParameter = contextIdParameter;
	}

	public String getHomePageRedirect() {
		return homePageRedirect;
	}

	public void setHomePageRedirect(String homePageRedirect) {
		this.homePageRedirect = homePageRedirect;
	}

}
