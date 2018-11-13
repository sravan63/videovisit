package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;
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

public class AppRootController implements Controller {

	public static final Logger logger = Logger.getLogger(AppRootController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String navigation;
	private String subNavigation;
	private String clinicianSingleSignOnURL = null;
	private String vidyoWebrtcSessionManager = null;
	private String blockChrome = null;
	private String blockFF = null;
	private String blockEdge = null;
	private String blockSafari = null;
	private String blockSafariVersion = null;
	
	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			clinicianSingleSignOnURL = appProp.getProperty("CLINICIAN_SINGLE_SIGNON_URL");
			logger.debug("clinicianSingleSignOnURL: " + clinicianSingleSignOnURL);
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
		initProperties();
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null){
			logger.info("context is null");
			faq f = FaqParser.parse();
			List<promo> promos = PromoParser.parse();
			List<iconpromo> iconpromos = IconPromoParser.parse();
			videolink videoLink = VideoLinkParser.parse();
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
			ctx.setClinicianSingleSignOnURL(clinicianSingleSignOnURL);
			ctx.setFaq(f);
			ctx.setPromo(promos);
			ctx.setIconPromo(iconpromos);
			ctx.setVideoLink(videoLink);
		}
		else
			logger.info("Context is not null");
		
		ctx.setWebrtcSessionManager(vidyoWebrtcSessionManager);
		if(StringUtils.isNotBlank(blockChrome)){
			ctx.setBlockChrome(blockChrome);
		}
		if(StringUtils.isNotBlank(blockFF)){
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
		ModelAndView modelAndView = new ModelAndView(getViewName());
		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
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
