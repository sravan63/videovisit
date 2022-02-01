package org.kp.tpmg.ttg.webcare.videovisits.member.web.ssosimulation;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.WebAppContextCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.controller.SimplePageController;
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

public class SSOSimulationSubmitLoginController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(SSOSimulationSubmitLoginController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		String data = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null) {
				logger.info("Context is null, so creating new context");
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

			}

			// Perform SSO sign on and authorization
			data = SSOSimulationCommand.performSSOSimulationSignOn(request);

			if ("200".equalsIgnoreCase(data) && ctx.getKpOrgSignOnInfo() != null
					&& StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession())) {
				ctx.setAuthenticated(false);
				ctx.setContextId(WebUtil.SSO_SIMULATION);
				ctx.setClientId(WebUtil.VV_MBR_SSO_SIM_WEB);
				ctx.setBackButtonClientId(WebUtil.VV_MBR_SSO_SIM_BACK_BTN);
				MeetingCommand.updateWebappContextWithBrowserFlags(ctx);
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}

		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		logger.info(LOG_EXITING + "data=" + data);
		return modelAndView;
	}

}
