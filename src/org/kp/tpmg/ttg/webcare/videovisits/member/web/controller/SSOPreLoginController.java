package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.http.Cookie;
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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
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
	private String blockChrome = null;
	private String blockFF = null;
	
	public SSOPreLoginController() {
		try {
			final ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("SSOPreLoginController -> configuration: resource bundle exists -> video visit external properties file location: "
							+ rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final FileInputStream fileInput = new FileInputStream(file);
			final Properties appProp = new Properties();
			appProp.load(fileInput);
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
		} catch (Exception ex) {
			logger.error("SSOPreLoginController -> Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}
		
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
			if(StringUtils.isNotBlank(blockChrome)){
				ctx.setBlockChrome(blockChrome);
			}
			if(StringUtils.isNotBlank(blockFF)){
				ctx.setBlockFF(blockFF);
			}
			
			logger.debug("SSOPreLoginController -> ssoSession in context=" + ssoSession);
			
			Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.SSO_COOKIE_NAME);
			
			if(ssoCookie == null || (ssoCookie != null && ("loggedout".equalsIgnoreCase(ssoCookie.getValue()) || StringUtils.isBlank(ssoCookie.getValue()))))
			{
				if("localhost".equalsIgnoreCase(request.getServerName()))
				{
					logger.info("SSOPreLoginController -> cookie validation not required for " + request.getServerName());
				}
				else
				{
					if(StringUtils.isNotBlank(ssoSession))
					{
						MeetingCommand.performSSOSignOff(request, response);
					}
					logger.info("SSOPreLoginController -> invalid cookie, so navigating to SSO login page");
					modelAndView = new ModelAndView(getViewName());
					getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
				}
			}
			
			if(ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue()))
			{
				ssoSession = ssoCookie.getValue();
				logger.debug("SSOPreLoginController -> ssoSession from cookie before decoding=" + ssoSession);
				try
				{
					ssoSession = URLDecoder.decode(ssoSession, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					logger.warn("SSOPreLoginController -> error while decoding a coockie value="+ ssoSession);
				}
				logger.debug("SSOPreLoginController -> ssoSession from cookie after decoding=" + ssoSession);
			}
			logger.info("SSOPreLoginController -> ssoSession after cookie check=" + ssoSession);
			
			//read ssoSession token from either cookie or context...depending upon the flow.
			//Pass the ssoSession token to MeetingCommand.validateKpOrgSSOSession()
			if(StringUtils.isNotBlank(ssoSession))
			{
				String responseCode = MeetingCommand.validateKpOrgSSOSession(request, response, ssoSession);
				if("200".equalsIgnoreCase(responseCode))
				{
					//	 navigate to myMeetings page
					if ((WebUtil.isChromeBrowser(request) && "true".equalsIgnoreCase(blockChrome))
							|| (WebUtil.isFFBrowser(request) && "true".equalsIgnoreCase(blockFF))) 
					{
						logger.info("SSOPreLoginController -> sso session token valid but browser is blocked");
						modelAndView = new ModelAndView(getViewName());
						getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
					} else {
						logger.info("SSOPreLoginController -> sso session token valid, so navigating to my meetings page");
						ctx.setAuthenticated(true);
						modelAndView = new ModelAndView("landingready");
						getEnvironmentCommand().loadDependencies(modelAndView, "landingready", "landingready");
					}
				}
				else
				{
					logger.info("SSOPreLoginController -> invalid SSO session, so navigating to SSO login page");
					modelAndView = new ModelAndView(getViewName());
					getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
				}			
			}
			else
			{
				logger.info("SSOPreLoginController -> SSO session not present, so navigating to SSO login page");
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
