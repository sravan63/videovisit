package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

public class GuestController extends CommonController {

	private final static String GUEST_PAGE = "guest";

	private WebAppContext ctx = null;

	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		initProperties();
		initializeWebappContext(request);
		String data = null;
		try {
			MeetingCommand.IsMeetingHashValid(request);
		} catch (Exception e) {
			logger.error("System Error - " + e.getMessage(), e);
		}
		logger.info("data - " + data);
		final ModelAndView modelAndView = new ModelAndView(getViewName());
		getEnvironmentCommand().loadDependencies(modelAndView, getNavigation(), getSubNavigation());
		modelAndView.setViewName(GUEST_PAGE);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING);
		return modelAndView;
	}

	private void initializeWebappContext(HttpServletRequest request) throws Exception {
		ctx = WebAppContextCommand.createContext(request, "0");
		WebAppContext.setWebAppContext(request, ctx);
		final faq f = FaqParser.parse();
		final List<promo> promos = PromoParser.parse();
		final List<iconpromo> iconpromos = IconPromoParser.parse();
		final videolink videoLink = VideoLinkParser.parse();
		ctx.setFaq(f);
		ctx.setPromo(promos);
		ctx.setIconPromo(iconpromos);
		ctx.setVideoLink(videoLink);
		ctx.setClientId(WebUtil.VV_MBR_GUEST);
		ctx.setBackButtonClientId(WebUtil.VV_MBR_GUEST_BACK_BTN);
	}

}
