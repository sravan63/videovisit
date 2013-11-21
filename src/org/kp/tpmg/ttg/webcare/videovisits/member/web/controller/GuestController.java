package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.util.List;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import org.springframework.web.servlet.ModelAndView;

public class GuestController extends SimplePageController {

	private final static Logger logger = Logger.getLogger(GuestController.class);
	
	private final static String GUEST_PAGE = "guest";
		
	private String megaMeetingURL = null;
	
	private String megaMeetingMobileURL = null;
	private WebAppContext ctx = null;
	public GuestController() {
		ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
		megaMeetingURL = rbInfo.getString ("MEGA_MEETING_URL");	
		megaMeetingMobileURL = rbInfo.getString ("MEGA_MEETING_MOBILE_URL");	
	}
	
	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) 
			throws Exception {									
		initializeWebappContext(request);
		
		String data = null;
		try {		
			
			MeetingCommand.IsMeetingHashValid(request, response);
//			if ( ctx.getTotalmeetings() > 0)
//				data = MeetingCommand.retrieveMeetingForCaregiver(request, response);
		} catch (Exception e) {
			logger.error("GuestController handleRequest error - " + e.getMessage(), e);
		}		
		logger.info("GuestController handleRequest data - " + data);
		modelAndView.setViewName(GUEST_PAGE);
		modelAndView.addObject("data", data);		
		return modelAndView;
	}
	
	private void initializeWebappContext(HttpServletRequest request) throws Exception {
// This controller is called on calling the url for the guest visit. 
// This is the new guest and web app context needs to be initialized for every guest entry.
//		ctx = WebAppContext.getWebAppContext(request);
//		if (ctx == null){
			logger.info("context is null");
			ctx = WebAppContextCommand.createContext(request, "0");
			WebAppContext.setWebAppContext(request, ctx);
			ctx.setMegaMeetingURL(megaMeetingURL);	
			ctx.setMegaMeetingMobileURL(megaMeetingMobileURL);
			
			
			faq f = FaqParser.parse();
			List<promo> promos = PromoParser.parse();
			List<iconpromo> iconpromos = IconPromoParser.parse();
			videolink videoLink = VideoLinkParser.parse();
			
			ctx.setFaq(f);
			ctx.setPromo(promos);
			ctx.setIconPromo(iconpromos);
			ctx.setVideoLink(videoLink);
		}
//	}
}
