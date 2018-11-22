package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class SSOPreLoginController implements Controller {

	public static final Logger logger = Logger.getLogger(SSOPreLoginController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String navigation;
	private String subNavigation;
	private String vidyoWebrtcSessionManager = null;
	private String blockChrome = null;
	private String blockFF = null;
	private String blockEdge = null;
	private String blockSafari = null;
	private String blockSafariVersion = null;

	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
			if (StringUtils.isBlank(vidyoWebrtcSessionManager)) {
				vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
			}
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
			blockEdge = appProp.getProperty("BLOCK_EDGE_BROWSER");
			blockSafari = appProp.getProperty("BLOCK_SAFARI_BROWSER");
			blockSafariVersion = appProp.getProperty("BLOCK_SAFARI_VERSION");
		} catch (Exception ex) {
			logger.error("Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String ssoSession = null;
		ModelAndView modelAndView = null;
		initProperties();
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null) {
				logger.info("context is null");
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
			} else {
				logger.info("Context is not null");
				if (ctx.getKpOrgSignOnInfo() != null
						&& StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession())) {
					ssoSession = ctx.getKpOrgSignOnInfo().getSsoSession();
				}
			}
			ctx.setWebrtcSessionManager(vidyoWebrtcSessionManager);
			if (StringUtils.isBlank(ctx.getWebrtcSessionManager())) {
				ctx.setWebrtcSessionManager(WebUtil.VIDYO_WEBRTC_SESSION_MANGER);
			}

			if (StringUtils.isNotBlank(blockChrome)) {
				ctx.setBlockChrome(blockChrome);
			}
			if (StringUtils.isNotBlank(blockFF)) {
				ctx.setBlockFF(blockFF);
			}
			if(StringUtils.isNotBlank(blockEdge)){
				ctx.setBlockEdge(blockEdge);
			}
			if(StringUtils.isNotBlank(blockSafari)){
				ctx.setBlockSafari(blockSafari);
			}
			if(StringUtils.isNotBlank(blockSafariVersion)){
				ctx.setBlockSafariVersion(blockSafariVersion);
			}
			logger.debug("ssoSession in context=" + ssoSession);

//			Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.SSO_COOKIE_NAME);
			Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.getSSOCookieName());
			if (ssoCookie == null || (ssoCookie != null && ("loggedout".equalsIgnoreCase(ssoCookie.getValue())
					|| StringUtils.isBlank(ssoCookie.getValue())))) {
				if (StringUtils.containsIgnoreCase(request.getServerName(), "localhost")) {
					logger.info("Cookie validation not required for " + request.getServerName());
				} else {
					if (StringUtils.isNotBlank(ssoSession)) {
						MeetingCommand.performSSOSignOff(request, response);
						logger.info("Setting ssoSession to null");
						ssoSession = null;
					}
					logger.info("Invalid cookie, so navigating to SSO login page");
					modelAndView = new ModelAndView(getViewName());
					getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
				}
			}

			if (ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue())) {
				ssoSession = ssoCookie.getValue();
/*				logger.debug("ssoSession from cookie before decoding=" + ssoSession);
				try {
					ssoSession = URLDecoder.decode(ssoSession, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					logger.warn("Error while decoding a coockie value=" + ssoSession);
				}
				logger.debug("ssoSession from cookie after decoding=" + ssoSession);
*/			}
//			logger.info("ssoSession after cookie check=" + ssoSession);
			
			logger.info("ssoSession cookie: " + ssoSession);
			if ((WebUtil.isChromeBrowser(request) && "true".equalsIgnoreCase(blockChrome))
					|| (WebUtil.isFFBrowser(request) && "true".equalsIgnoreCase(blockFF))
					|| (WebUtil.isEdgeBrowser(request) && "true".equalsIgnoreCase(blockEdge))
					|| (WebUtil.allowSafariBrowser(request, blockSafari, blockSafariVersion))) {
				logger.info("Browser blocked, so navigating to ssologin page");
				modelAndView = new ModelAndView(getViewName());
				getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			} else if (StringUtils.isNotBlank(ssoSession)) {
				String responseCode = MeetingCommand.validateKpOrgSSOSession(request, ssoSession);
				if ("200".equalsIgnoreCase(responseCode)) {
					logger.info("sso session token valid, so navigating to my meetings page");
					ctx.setAuthenticated(true);
					modelAndView = new ModelAndView("landingready");
					getEnvironmentCommand().loadDependencies(modelAndView, "landingready", "landingready");
				} else {
					logger.info("Invalid SSO session, so navigating to SSO login page");
					modelAndView = new ModelAndView(getViewName());
					getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
				}
			} else {
				logger.info("SSO session not present, so navigating to SSO login page");
				modelAndView = new ModelAndView(getViewName());
				getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			}
		} catch (Exception ex) {
			logger.error("System Error", ex);
			if (modelAndView == null) {
				modelAndView = new ModelAndView(getViewName());
				getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
			}
		}
		logger.info(LOG_EXITING);
		return modelAndView;
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
