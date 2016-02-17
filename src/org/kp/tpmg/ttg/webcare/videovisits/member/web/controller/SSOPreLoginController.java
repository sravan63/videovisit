package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.FaqParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.IconPromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.PromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.VideoLinkParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class SSOPreLoginController implements Controller {

	public static Logger logger = Logger.getLogger(SSOPreLoginController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String navigation;
	private String subNavigation;
		
		
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception 
	{
		logger.info("In SSOPreLoginController");
		String ssoSession = null;
		ModelAndView modelAndView = null;
		try 
		{
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null)
			{
				logger.info("SSOPreLoginController -> context is null");
				faq f = FaqParser.parse();
				List<promo> promos = PromoParser.parse();
				List<iconpromo> iconpromos = IconPromoParser.parse();
				videolink videoLink = VideoLinkParser.parse();
				ctx = WebAppContextCommand.createContext(request, "0");
				WebAppContext.setWebAppContext(request, ctx);
				ctx.setFaq(f);
				ctx.setPromo(promos);
				ctx.setIconPromo(iconpromos);
				ctx.setVideoLink(videoLink);
			}
			else
			{
				logger.info("SSOPreLoginController -> Context is not null");
				if(ctx.getKpOrgSignOnInfo() != null && StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession()))
				{
					// Init service properties	
					ssoSession = ctx.getKpOrgSignOnInfo().getSsoSession();
				}
			}
			
			//TO DO
			//read ssoSession token from either request header or cookie or context...depending upon the flow.
			//Pass the ssoSession token to MeetingCommand.validateKpOrgSSOSession()
			if(StringUtils.isNotBlank(ssoSession))
			{
				String responseCode = MeetingCommand.validateKpOrgSSOSession(request, response, ssoSession);
				if("200".equalsIgnoreCase(responseCode))
				{
					//	 navigate to myMeetings page
					modelAndView = new ModelAndView("landingready");
					getEnvironmentCommand().loadDependencies(modelAndView, "landingready", "landingready");
				}
				else
				{
					modelAndView = new ModelAndView(getViewName());
					getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
				}			
			}
			else
			{
			    ////TO DO: read ssoSession token from either request header or cookie for mdo and kp.org integration
				modelAndView = new ModelAndView(getViewName());
				getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			}
		}
		catch(Exception ex)
		{
			logger.error("Error in SSOPreLoginController", ex);
			if(modelAndView == null)
			{
				modelAndView = new ModelAndView(getViewName());
				getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			}
		}
				
		return (modelAndView);
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
	public String getViewName() {
		return viewName;
	}
	
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}
	
	public String getNavigation() {
		return navigation;
	}
	
	public void setNavigation(String navigation) {
		this.navigation = navigation;
	}
	
	public String getSubNavigation() {
		return subNavigation;
	}
	
	public void setSubNavigation(String subNavigation) {
		this.subNavigation = subNavigation;
	}
}
