package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

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

	public static final Logger logger = Logger.getLogger(LogoffController.class);

	private String mobileViewName;
	private String myMeetingsViewName;

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		boolean isWirelessDeviceorTablet = DeviceDetectionService.isWirelessDeviceorTablet(request);
		logger.info("isWirelessDeviceorTablet = " + isWirelessDeviceorTablet + " ,session Id="
				+ request.getSession().getId());
		if (!isWirelessDeviceorTablet) {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null) {
				logger.info("context is null");
				Cookie ssoCookie = WebUtil.getCookie(request, WebUtil.getSSOCookieName());

				if (ssoCookie != null && StringUtils.isNotBlank(ssoCookie.getValue())) {
					try {
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
						String ssoCookieVal = ssoCookie.getValue();

						String responseCode = MeetingCommand.validateKpOrgSSOSession(request, ssoCookieVal);
						if ("200".equalsIgnoreCase(responseCode)) {
							logger.info("sso session token from request cookie valid, navigating to my meetings page");
							return new ModelAndView(myMeetingsViewName);
						} else {
							logger.info("invalid sso session token, navigating to SSO login page");
							boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(request, response);
							logger.info("isSSOSignedOff=" + isSSOSignedOff);
							WebAppContext.setWebAppContext(request, null);
						}
					} catch (Exception ex) {
						logger.warn("Error while SSO sign off");
					}
				}
			} else {
				logger.info("context is not null");
				try {
					boolean isSSOSignedOff = MeetingCommand.performSSOSignOff(request, response);
					logger.debug("isSSOSignedOff=" + isSSOSignedOff);
				} catch (Exception e) {
					logger.warn("Error while SSO sign off");
				}
			}
		}
		request.getSession().invalidate();
		if (WebAppContext.getWebAppContext(request) != null) {
			logger.info("Setting context to null");
			WebAppContext.setWebAppContext(request, null);
		}

		if (request.getSession(false) == null)
			logger.info("session is null");
		else
			logger.info("session is not null");
		if (isWirelessDeviceorTablet) {
			logger.info(LOG_EXITING);
			return new ModelAndView(mobileViewName);
		} else {
			logger.info(LOG_EXITING + "view name = " + getViewName());
			return new ModelAndView(getViewName());
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
	 * @param myMeetingsViewName
	 *            the myMeetingsViewName to set
	 */
	public void setMyMeetingsViewName(String myMeetingsViewName) {
		this.myMeetingsViewName = myMeetingsViewName;
	}

}
