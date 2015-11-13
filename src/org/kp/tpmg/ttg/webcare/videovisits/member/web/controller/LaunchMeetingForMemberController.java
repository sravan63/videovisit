package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONObject;

public class LaunchMeetingForMemberController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LaunchMeetingForMemberController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) {
		StringBuilder validationData = new StringBuilder(",");
		JSONObject result = new JSONObject();
		StringBuilder dataResult = new StringBuilder();
		System.out.println("Entered LaunchMeetingForMemberController");
		try {
			HttpSession session = request.getSession(false);

			String inAppBrowserFlag = request.getParameter("inAppBrowserFlag");
			logger.info("LaunchMeetingForMemberControlle: KPPC In-App Browser flow: inAppBrowserFlag="+ inAppBrowserFlag);
			result.put("isValidUserSession", false);
			result.put("success", false);

			if (session != null) {
				if ("true".equalsIgnoreCase(inAppBrowserFlag)) {
					// KPPC inAppBrowser call
					logger.info("launchMeetingforMemberController: KPPC In-App Browser flow");
					result.put("isValidUserSession", true);
					result.put("success", true);
				} else {
					WebAppContext context = WebAppContext.getWebAppContext(request);
					// session is active
					if (request.getParameter("source") != null
							&& request.getParameter("source").equalsIgnoreCase("member")) {
						logger.info("in validateUserSession member");
						if (context != null && context.getMember() != null) {
							dataResult.append(MeetingCommand.getLaunchMeetingDetailsForMember(request, response));
							dataResult.setLength(dataResult.length()-1);
							logger.info("LaunchMeetingForMemberController: dataResult " + dataResult);
							result.put("isValidUserSession", true);
							result.put("success", true);
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		// put data into buffer
		validationData.append(JSONObject.fromObject(result).toString());
		validationData.deleteCharAt(1);
		logger.info("launchMeetingforMemberOrguest-validationData=" + validationData);
		dataResult.append(validationData);
		logger.info("launchMeetingforMemberOrguest-handleRequest-data=" + dataResult);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", dataResult);
		return (modelAndView);
	}
}
