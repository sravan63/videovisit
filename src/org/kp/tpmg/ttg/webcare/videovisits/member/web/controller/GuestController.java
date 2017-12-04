package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.Properties;
import java.util.ResourceBundle;

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
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.ModelAndView;

public class GuestController extends SimplePageController {

	private final static Logger logger = Logger.getLogger(GuestController.class);

	private final static String GUEST_PAGE = "guest";

	private WebAppContext ctx = null;

	private String vidyoWebrtcSessionManager = null;

	private String blockChrome = null;

	private String blockFF = null;

	public GuestController() {
		try {
			final ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
			logger.debug("Configuration: resource bundle exists video visit external properties file location: "
					+ rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
			final FileInputStream fileInput = new FileInputStream(file);
			final Properties appProp = new Properties();
			appProp.load(fileInput);
			vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
			if (StringUtils.isBlank(vidyoWebrtcSessionManager)) {
				vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
			}
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
		} catch (Exception ex) {
			logger.error("GuestController -> Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		initializeWebappContext(request);
		String data = null;
		try {

			if (ctx != null && StringUtils.isBlank(ctx.getWebrtcSessionManager())) {
				ctx.setWebrtcSessionManager(WebUtil.VIDYO_WEBRTC_SESSION_MANGER);
			}

			MeetingCommand.IsMeetingHashValid(request, response);
		} catch (Exception e) {
			logger.error("System Error - " + e.getMessage(), e);
		}
		logger.info("data - " + data);
		modelAndView.setViewName(GUEST_PAGE);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING);
		return modelAndView;
	}

	private void initializeWebappContext(HttpServletRequest request) throws Exception {
		ctx = WebAppContextCommand.createContext(request, "0");
		WebAppContext.setWebAppContext(request, ctx);
		faq f = FaqParser.parse();
		List<promo> promos = PromoParser.parse();
		List<iconpromo> iconpromos = IconPromoParser.parse();
		videolink videoLink = VideoLinkParser.parse();
		ctx.setFaq(f);
		ctx.setPromo(promos);
		ctx.setIconPromo(iconpromos);
		ctx.setVideoLink(videoLink);
		ctx.setWebrtcSessionManager(vidyoWebrtcSessionManager);
		if (StringUtils.isNotBlank(blockChrome)) {
			ctx.setBlockChrome(blockChrome);
		}
		if (StringUtils.isNotBlank(blockFF)) {
			ctx.setBlockFF(blockFF);
		}
	}

}
