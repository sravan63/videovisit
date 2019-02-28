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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.jwt.util.JwtUtil;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.FaqParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.IconPromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.PromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.VideoLinkParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdJSON;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.google.gson.Gson;

public class MobileLaunchVideoVisitController implements Controller {

	public static final Logger logger = Logger.getLogger(MobileLaunchVideoVisitController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String errorViewName;
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
		logger.info(LOG_ENTERED);
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
		logger.info(LOG_EXITING);
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
		} else {
			logger.info("Context is not null");
		}	
		
		ctx.setWebrtcSessionManager(vidyoWebrtcSessionManager);
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
		
		try {
			final String mblLaunchToken = request.getHeader("mblLaunchToken");
			final long meetingId = WebUtil.convertStringToLong(request.getHeader("meetingId"));
			final String mrn = request.getHeader("mrn");
			final String inMeetingDisplayName = request.getHeader("proxyName");
			String output = null;
			final boolean isProxyMeeting = "Y".equalsIgnoreCase(request.getHeader("isProxy")) ? true : false;
			final String clientId = request.getHeader("clientId");

			if (StringUtils.isBlank(mblLaunchToken) || !JwtUtil.validateAuthToken(mblLaunchToken, String.valueOf(meetingId), mrn)) {
				logger.info("Invalid auth token so sending sc_unauthorized error");
				return new ModelAndView(errorViewName);
			}

			ctx.setMeetingId(meetingId);
			ctx.setClientId(clientId);
			
			logger.debug("Input : meetingId=" + meetingId + ", isProxyMeeting="
					+ isProxyMeeting + ", inMeetingDisplayName=" + inMeetingDisplayName + ", mrn=" + mrn
					+ ", mblLaunchToken=" + mblLaunchToken + ", clientId=" + clientId);

			WebService.initWebService(request);
			output = WebService.getMeetingDetailsForMeetingId(meetingId, request.getSession().getId(), clientId);
			
			logger.info("Output json string : " + output);
			Gson gson = new Gson();
			final MeetingDetailsForMeetingIdJSON meetingDetailsForMeetingIdJSON = gson.fromJson(output, MeetingDetailsForMeetingIdJSON.class);
	  	   
			final VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();	
			videoVisitParams.setWebrtc(String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
			
			if(meetingDetailsForMeetingIdJSON != null && meetingDetailsForMeetingIdJSON.getService() != null && meetingDetailsForMeetingIdJSON.getService().getEnvelope() != null &&
					meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting() != null)
			{
				final MeetingDO meetingDo = meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting();
				logger.debug("MeetingDO: " + meetingDo.toString());
				videoVisitParams.setMeetingId(meetingDo.getMeetingId());
				videoVisitParams.setHostFirstName(meetingDo.getHost().getFirstName());
				videoVisitParams.setHostLastName(meetingDo.getHost().getLastName());
				if (StringUtils.isNotBlank(meetingDo.getHost().getTitle())) {
					videoVisitParams.setHostTitle(meetingDo.getHost().getTitle());
				} else {
					videoVisitParams.setHostTitle("");
				}
				videoVisitParams.setVidyoUrl(meetingDo.getRoomJoinUrl());
				videoVisitParams.setVendorConfId(meetingDo.getMeetingVendorId());
				videoVisitParams.setGuestUrl(meetingDo.getRoomJoinUrl());
				videoVisitParams.setIsProvider("false");
				videoVisitParams.setVendor(meetingDo.getVendor());
				
				if (!isProxyMeeting) {						
					videoVisitParams.setUserName(meetingDo.getMember().getInMeetingDisplayName());
					videoVisitParams.setGuestName(meetingDo.getMember().getInMeetingDisplayName());
					videoVisitParams.setIsMember("true");
					videoVisitParams.setIsProxyMeeting("false");
				} else {					
					videoVisitParams.setUserName(inMeetingDisplayName);
					videoVisitParams.setGuestName(inMeetingDisplayName);
					videoVisitParams.setIsMember("false");
					videoVisitParams.setIsProxyMeeting("true");					
				}
				WebUtil.addMeetingDateTime(meetingDo, videoVisitParams);
			}
			
			ctx.setVideoVisit(videoVisitParams);
			logger.debug("Video Visit param data:" + videoVisitParams.toString());
		} catch (Exception e) {
			logger.error("System error:" + e.getMessage(), e);
		}
		
		final ModelAndView modelAndView = new ModelAndView(getViewName());
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
	
	/**
	 * @return the errorViewName
	 */
	public String getErrorViewName() {
		return errorViewName;
	}

	/**
	 * @param errorViewName the errorViewName to set
	 */
	public void setErrorViewName(String errorViewName) {
		this.errorViewName = errorViewName;
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

