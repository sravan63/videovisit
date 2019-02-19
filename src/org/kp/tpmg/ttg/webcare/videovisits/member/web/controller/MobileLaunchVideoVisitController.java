package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.SystemError;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.FaqParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.IconPromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.PromoParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.VideoLinkParser;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.meeting.LaunchMeetingForMemberDesktopJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdJSON;
import org.kp.tpmg.videovisit.model.meeting.MeetingDetailsForMeetingIdOutput;
import org.kp.tpmg.videovisit.model.meeting.provider.ProviderMeetingDO;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import net.sf.json.JSONObject;

public class MobileLaunchVideoVisitController implements Controller {

	public static Logger logger = Logger.getLogger(MobileLaunchVideoVisitController.class);

	private WebAppContextCommand webAppContextCommand;
	private EnvironmentCommand environmentCommand;
	private String contextIdParameter;
	private String homePageRedirect;
	private String viewName;
	private String navigation;
	private String subNavigation;
	//private String megaMeetingURL = null;
	//private String megaMeetingMobileURL = null;
	private String clinicianSingleSignOnURL = null;
	private String vidyoWebrtcSessionManager = null;
	private String blockChrome = null;
	private String blockFF = null;
	
	public MobileLaunchVideoVisitController() {
		try{
			ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("MobileLaunchVideoVisitController -> configuration: resource bundle exists -> video visit external properties file location: " + rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			//Read external properties file for the web service end point url
			File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			FileInputStream fileInput = new FileInputStream(file);
    		Properties appProp = new Properties();
    		appProp.load(fileInput);
    		clinicianSingleSignOnURL = appProp.getProperty("CLINICIAN_SINGLE_SIGNON_URL");
    		logger.info("MobileLaunchVideoVisitController -> clinicianSingleSignOnURL: " + clinicianSingleSignOnURL);
    		vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
    		if(StringUtils.isBlank(vidyoWebrtcSessionManager)){
    			vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
    		}
    		blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
    		blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
		}catch(Exception ex){
			logger.error("MobileLaunchVideoVisitController -> Error while reading external properties file - " + ex.getMessage(), ex);
		}
		
	}
	
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("In MobileLaunchVideoVisitController");
		WebAppContext ctx = WebAppContext.getWebAppContext(request);
		if (ctx == null){
			logger.info("context is null");
			faq f = FaqParser.parse();
			List<promo> promos = PromoParser.parse();
			List<iconpromo> iconpromos = IconPromoParser.parse();
			videolink videoLink = VideoLinkParser.parse();
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
			//ctx.setMegaMeetingURL(megaMeetingURL);	
			//ctx.setMegaMeetingMobileURL(megaMeetingMobileURL);
			ctx.setClinicianSingleSignOnURL(clinicianSingleSignOnURL);
			ctx.setFaq(f);
			ctx.setPromo(promos);
			ctx.setIconPromo(iconpromos);
			ctx.setVideoLink(videoLink);
		}
		else
			logger.info("MobileLaunchVideoVisitController: Context is not null");
		
		//Read request headers sent from mobile webview to launch this url
		Enumeration<String> headerNames = request.getHeaderNames();
		if (headerNames != null) {
			while (headerNames.hasMoreElements()) {
	            String key = (String) headerNames.nextElement();
	            String value = request.getHeader(key);
	            logger.info("MobileLaunchVideoVisitController - request headers: " + key + "=" +  value);
	        }
		}
        
		String mblLaunchToken = null;
		long meetingId = 0;
		String mrn = null;
		String inMeetingDisplayName = null;
		String output = null;
		boolean isProxyMeeting = false;
		String clientId = null;
		try {
			//if (ctx != null && ctx.getMember() != null) {
				// parse parameters
			    
			    //JWT needs to be parsed
				if (StringUtils.isNotBlank(request.getParameter("mblLaunchToken"))) {
					mblLaunchToken = request.getParameter("mblLaunchToken");
					
				} else if(StringUtils.isNotBlank(request.getHeader("mblLaunchToken"))) {
					mblLaunchToken = request.getHeader("mblLaunchToken");
				} else {
					mblLaunchToken = "1234sdrfdfgd";
				}
			
				if (StringUtils.isNotBlank(request.getParameter("meetingId"))) {
					meetingId = Long.parseLong(request.getParameter("meetingId"));
					
				} else if(StringUtils.isNotBlank(request.getHeader("meetingId"))) {
					meetingId = Long.parseLong(request.getHeader("meetingId"));
				} else {
					meetingId = 369627;
				}
				
				ctx.setMeetingId(meetingId);
                
				if(StringUtils.isNotBlank(request.getParameter("mrn"))) {
					mrn = request.getParameter("mrn");
				} else if(StringUtils.isNotBlank(request.getHeader("mrn"))) {
					mrn = request.getHeader("mrn");
				} else {
					mrn = "14404080";
				}
				
				if(StringUtils.isNotBlank(request.getParameter("proxyName"))) {
					inMeetingDisplayName = request.getParameter("proxyName");
				} else if(StringUtils.isNotBlank(request.getHeader("proxyName"))) {
					inMeetingDisplayName = request.getHeader("proxyName");
				} else {
					inMeetingDisplayName = "Joe Mama";
				}
				
				if ("Y".equalsIgnoreCase(request.getParameter("isProxy"))) {
					isProxyMeeting = true;
				} else if("Y".equalsIgnoreCase(request.getHeader("isProxy"))) {
					isProxyMeeting = true;
				} else {
					isProxyMeeting = false;
				}
				
				if(StringUtils.isNotBlank(request.getParameter("clientId"))) {
					clientId = request.getParameter("clientId");
				} else if(StringUtils.isNotBlank(request.getHeader("clientId"))) {
					clientId = request.getHeader("clientId");
				} else {
					clientId = "MDO v5.5 Android";
				}
				logger.info("MobileLaunchVideoVisitController: meetingId=" + meetingId + ", isProxyMeeting="
						+ isProxyMeeting + ", inMeetingDisplayName="
						+ inMeetingDisplayName + ", mrn=" + mrn + ", mblLaunchToken=" + mblLaunchToken + ", clientId=" + clientId);
				
				WebService.initWebService(request);
				// grab data from web services
				// launchMemberOrProxyMeetingResponse =
				// WebService.launchMemberOrProxyMeetingForMember(meetingId,
				// ctx.getMember().getMrn8Digit(),
				// request.getParameter("inMeetingDisplayName"), isProxyMeeting,
				// request.getSession().getId());
				//output = WebService.launchMemberOrProxyMeetingForMember(meetingId, mrn,
						//inMeetingDisplayName, isProxyMeeting, request.getSession().getId());
				output = WebService.getMeetingDetailsForMeetingId(meetingId, request.getSession().getId());
				
				// if (launchMemberOrProxyMeetingResponse != null)
				// {
				// return
				// JSONObject.fromObject(launchMemberOrProxyMeetingResponse).toString();
				// JSONObject.fromObject(launchMeetingForMemberGuestJSON).toString();
				// }
				//return output;
			//}
		} catch (Exception e) {
			logger.error("MobileLaunchVideoVisitController -> System error:" + e.getMessage(), e);
		}
		
		ctx.setWebrtcSessionManager(vidyoWebrtcSessionManager);
		if(StringUtils.isNotBlank(blockChrome)){
			ctx.setBlockChrome(blockChrome);
		}
		if(StringUtils.isNotBlank(blockFF)){
			ctx.setBlockFF(blockFF);
		}
		
		//set 
		logger.info("MobileLaunchVideoVisitController -> OutputjsonString" + output);
		Gson gson = new Gson();
		//JsonParser parser = new JsonParser();
		//JsonObject jobject = new JsonObject();
		//jobject = (JsonObject) parser.parse(output);
		MeetingDetailsForMeetingIdJSON meetingDetailsForMeetingIdJSON = gson.fromJson(output, MeetingDetailsForMeetingIdJSON.class);
  	   
		//LaunchMeetingForMemberDesktopJSON launchMeetingForMemberDesktopJSON = gson.fromJson(output, LaunchMeetingForMemberDesktopJSON.class);
		
		VideoVisitParamsDTO videoVisitParams = new VideoVisitParamsDTO();	
		videoVisitParams.setWebrtc(String.valueOf(WebUtil.isChromeOrFFBrowser(request)));
		/*List<MeetingDO> meetings = ctx.getMyMeetings();
		for(MeetingDO meeting : meetings){
			//MeetingWSO meeting = meetings[i];
			//if(meeting != null && meeting.getMeetingId() == Long.parseLong(request.getParameter("meetingId"))){
			if(meeting != null && meeting.getMeetingId().equals(request.getParameter("meetingId"))){
				videoVisitParams.setHostFirstName(meeting.getHost().getFirstName());
				videoVisitParams.setHostLastName(meeting.getHost().getLastName());
				if(meeting.getHost().getTitle() != null && meeting.getHost().getTitle().length() > 0){
					videoVisitParams.setHostTitle(meeting.getHost().getTitle());
				}else{
					videoVisitParams.setHostTitle("");
				}	
				videoVisitParams.setPatientFirstName(meeting.getMember().getFirstName());
				videoVisitParams.setPatientLastName(meeting.getMember().getLastName());
				videoVisitParams.setPatientMiddleName(meeting.getMember().getMiddleName());
				videoVisitParams.setParticipant(meeting.getParticipant());
				videoVisitParams.setCaregiver(meeting.getCaregiver());
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(Long.parseLong(meeting.getMeetingTime()));
				SimpleDateFormat sfdate = new SimpleDateFormat("MMM dd");
				SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
				//Can be changed to format like e.g. Fri, Jun 06, 2014 03:15 PM using below 
				//SimpleDateFormat sfdate = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm a");	
				videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
				videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));							
			}						
		 }*/
		
		if(meetingDetailsForMeetingIdJSON != null && meetingDetailsForMeetingIdJSON.getService() != null && meetingDetailsForMeetingIdJSON.getService().getEnvelope() != null &&
				meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting() != null)
		{
			MeetingDO meetingDo = meetingDetailsForMeetingIdJSON.getService().getEnvelope().getMeeting();
			logger.info("MobileLaunchVideoVisitController -> MeetingDO: " + meetingDo.toString());
			videoVisitParams.setMeetingId(meetingDo.getMeetingId());
			videoVisitParams.setHostFirstName(meetingDo.getHost().getFirstName());
			videoVisitParams.setHostLastName(meetingDo.getHost().getLastName());
			if(meetingDo.getHost().getTitle() != null && meetingDo.getHost().getTitle().trim().length() > 0){
				videoVisitParams.setHostTitle(meetingDo.getHost().getTitle());
			}else{
				videoVisitParams.setHostTitle("");
			}	
			videoVisitParams.setVidyoUrl(meetingDo.getRoomJoinUrl());
			videoVisitParams.setVendorConfId(meetingDo.getMeetingVendorId());
			videoVisitParams.setGuestUrl(meetingDo.getRoomJoinUrl());
			videoVisitParams.setIsProvider("false");
			
			if(!isProxyMeeting){						
				
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
			
			try {
				if(StringUtils.isNotBlank(meetingDo.getMeetingTime())) {
					Calendar cal = Calendar.getInstance();
					cal.setTimeInMillis(Long.valueOf(meetingDo.getMeetingTime()));
					SimpleDateFormat sfdate = new SimpleDateFormat("MMM dd");
					SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
					//Can be changed to format like e.g. Fri, Jun 06, 2014 03:15 PM using below 
					//SimpleDateFormat sfdate = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm a");	
					videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
					videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));	
				}
			}catch(Exception ex) {
				logger.error("MobileLaunchVideoVisitController -> date conversion error:" + ex.getMessage(), ex);
			}
		}
		
		/*if(launchMeetingForMemberDesktopJSON != null && launchMeetingForMemberDesktopJSON.getService() != null && launchMeetingForMemberDesktopJSON.getService().getLaunchMeetingEnvelope() != null &&
				launchMeetingForMemberDesktopJSON.getService().getLaunchMeetingEnvelope().getLaunchMeeting() != null)
		{
			ProviderMeetingDO meetingDo = launchMeetingForMemberDesktopJSON.getService().getLaunchMeetingEnvelope().getLaunchMeeting();
			logger.info("MobileLaunchVideoVisitController -> ProviderMeetingDO: " + meetingDo.toString());
			videoVisitParams.setMeetingId(meetingDo.getMeetingId());
			videoVisitParams.setVidyoUrl(meetingDo.getRoomJoinUrl());
			videoVisitParams.setVendorConfId(meetingDo.getMeetingVendorId());
			videoVisitParams.setGuestUrl(meetingDo.getRoomJoinUrl());
			videoVisitParams.setIsProvider("false");
			
			if(!isProxyMeeting){						
				
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
			
			try {
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(convertStringToDate(meetingDo.getMeetingTime()).getTime());
				SimpleDateFormat sfdate = new SimpleDateFormat("MMM dd");
				SimpleDateFormat sftime = new SimpleDateFormat("hh:mm a");
				//Can be changed to format like e.g. Fri, Jun 06, 2014 03:15 PM using below 
				//SimpleDateFormat sfdate = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm a");	
				videoVisitParams.setMeetingDate(sfdate.format(cal.getTime()));
				videoVisitParams.setMeetingTime(sftime.format(cal.getTime()));	
			}catch(Exception ex) {
				logger.error("MobileLaunchVideoVisitController -> date conversion error:" + ex.getMessage(), ex);
			}
		}*/
		ctx.setVideoVisit(videoVisitParams);		
		logger.info("MobileLaunchVideoVisitController -> Video Visit param data:" + videoVisitParams.toString());				
	
		ModelAndView modelAndView = new ModelAndView(getViewName());
		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
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
	
	public static Date convertStringToDate (String strDate) throws Exception {
 		//if (StringUtil.isStringEmpty(strDate)) {
 			//throw new Exception("Not a valid date");
 		//}	
 		
 		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
 		Date formattedDate = null;
 		
 		try {
 	 
 			formattedDate = formatter.parse(strDate);
 	 
 		} catch (ParseException e) {
 			e.printStackTrace();
 		}	 		
 		
 		return formattedDate;
 	}

}

