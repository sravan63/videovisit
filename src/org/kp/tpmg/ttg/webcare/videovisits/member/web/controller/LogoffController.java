package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLDecoder;
import java.util.List;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.DeviceDetectionService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class LogoffController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoffController.class);
	
	private String mobileViewName;
	private String myMeetingsViewName;
	private String blockChrome = null;
	private String blockFF = null;
	
	public LogoffController() {
		try {
			final ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("LogoffController -> configuration: resource bundle exists -> video visit external properties file location: "
							+ rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final FileInputStream fileInput = new FileInputStream(file);
			final Properties appProp = new Properties();
			appProp.load(fileInput);
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
		} catch (Exception ex) {
			logger.error("LogoffController -> Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) {
				
		boolean isWirelessDeviceorTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);
		logger.info("LogoffController -> isWirelessDeviceorTablet = " + isWirelessDeviceorTablet);
		logger.info("LogoffController -> session Id=" + request.getSession().getId());
		if(!isWirelessDeviceorTablet)
		{
			
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if(ctx == null)
			{
				logger.info("LogoffController -> context is null");
				Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.SSO_COOKIE_NAME);
											
				if(ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue()))
				{
					try
					{	
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
						String ssoCookieVal = URLDecoder.decode(ssoCookie.getValue(), "UTF-8");
						
						String responseCode = MeetingCommand.validateKpOrgSSOSession(request, response, ssoCookieVal);
						if("200".equalsIgnoreCase(responseCode))
						{
							logger.info("LogoffController -> sso session token from request cookie valid, navigating to my meetings page");
							//WebService.callKPKeepAliveUrl();
							return new ModelAndView(myMeetingsViewName);
						}
						else
						{
							logger.info("LogoffController -> invalid sso session token, navigating to SSO login page");
							boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(request, response);
							logger.info("LogoffController -> isSSOSignedOff=" + isSSOSignedOff);
							WebAppContext.setWebAppContext(request, null);
						}									
					}
					catch(Exception ex)
					{
						
					}
				}			
			}
			else
			{
				logger.info("LogoffController -> context is not null");
				try
				{
					boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(request, response);
					logger.debug("LogoffController -> isSSOSignedOff=" + isSSOSignedOff);
				} 
				catch (Exception e) {
					logger.warn("LogoffController -> error while SSO sign off");
				}
			}
		}
		request.getSession().invalidate();
		
		if ( request.getSession(false) == null)
			logger.info("LogoffController session is null");
		else
			logger.info("LogoffController session is not null");
		if(isWirelessDeviceorTablet){
			return new ModelAndView(mobileViewName);				
		}
		else{
			logger.info("view name = " + modelAndView.getViewName());
			if(StringUtils.isBlank(blockChrome)){
				blockChrome = "true";
			}
			if(StringUtils.isBlank(blockFF)){
				blockFF = "true";
			}
			modelAndView.addObject("blockChrome", blockChrome);
			modelAndView.addObject("blockFF", blockFF);
			return modelAndView;
		}
	}

	public String getMobileViewName() {
		return mobileViewName;
	}

	public void setMobileViewName(String mobileViewName) {
		this.mobileViewName = mobileViewName;
	}

	/**
	 * @return the myMeetingsViewName
	 */
	public String getMyMeetingsViewName() {
		return myMeetingsViewName;
	}

	/**
	 * @param myMeetingsViewName the myMeetingsViewName to set
	 */
	public void setMyMeetingsViewName(String myMeetingsViewName) {
		this.myMeetingsViewName = myMeetingsViewName;
	}
	
	

}
