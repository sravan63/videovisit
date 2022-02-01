package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
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

public class SSOPreLoginController extends CommonController {

	private WebAppContextCommand webAppContextCommand;
	private String contextIdParameter;
	private String homePageRedirect;

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
			MeetingCommand.updateWebappContextWithBrowserFlags(ctx);
			MeetingCommand.updateWebappContextWithPexipDesktopBrowserDetails(ctx);
			logger.debug("ssoSession in context=" + ssoSession);

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
			}

			logger.info("ssoSession cookie: " + ssoSession);
			if (StringUtils.isNotBlank(ssoSession)) {
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
