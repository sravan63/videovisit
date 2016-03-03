package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import java.util.List;

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

public class SSOSubmitLoginController extends SimplePageController
{

	public static Logger logger = Logger.getLogger(SSOSubmitLoginController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request, HttpServletResponse response) throws Exception
	{		
		logger.info("Entering SSOSubmitLoginController");
		String data = null;		
		try
		{
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			if (ctx == null)
			{
				logger.info("SSOSubmitLoginController -> context is null, so creating new context");
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
			}
			else
			{
				logger.info("SSOSubmitLoginController -> Context is not null");
				
			}			
			
			//Perform SSO sign on and authorization
			 data = MeetingCommand.performSSOSignOn(request, response);
			 
			 //set ssosession token in cookie
			 if("200".equalsIgnoreCase(data) && ctx.getKpOrgSignOnInfo() != null && StringUtils.isNotBlank(ctx.getKpOrgSignOnInfo().getSsoSession()))
			 {
				 logger.info("SubmitLoginController: ssosession to be set in cookie:" + ctx.getKpOrgSignOnInfo().getSsoSession());
				 WebUtil.setCookie(response, WebUtil.SSO_COOKIE_NAME, ctx.getKpOrgSignOnInfo().getSsoSession());
			 }
			 logger.info("SubmitLoginController:data:" + data);
		}
		catch (Exception e)
		{
			// log error
			logger.error("SSOSubmitLoginController -> System Error" + e.getMessage(),e);
		}
		//put data into buffer
		logger.info("SSOSubmitLoginController -> handleRequest-data="+data);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", data);
		return (modelAndView);
	}

}
