package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONObject;

public class LaunchMeetingForMemberGuestController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LaunchMeetingForMemberGuestController.class);
	private static String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) {
		logger.info(LOG_ENTERED);
		String data = "success";
		StringBuilder dataResult = new StringBuilder();
		StringBuilder validationData = new StringBuilder(",");
		JSONObject result = new JSONObject();
		try {
			HttpSession session = request.getSession(false);

			String inAppBrowserFlag = request.getParameter("inAppBrowserFlag");
			logger.info("KPPC In-App Browser flow: inAppBrowserFlag=" + inAppBrowserFlag);

			result.put("isValidUserSession", false);
			result.put("success", false);

			if (session != null) {
				if ("true".equalsIgnoreCase(inAppBrowserFlag)) {
					// KPPC inAppBrowser call
					logger.info("KPPC In-App Browser flow");
					result.put("isValidUserSession", true);
					result.put("success", true);
				} else {
					WebAppContext context = WebAppContext.getWebAppContext(request);
					if (request.getParameter("source") != null
							&& request.getParameter("source").equalsIgnoreCase("caregiver")) {
						if (context != null) {
							dataResult.append(MeetingCommand.getLaunchMeetingDetailsForMemberGuest(request, response));
							dataResult.setLength(dataResult.length() - 1);
							logger.info("dataResult " + dataResult);
							MeetingCommand.setupGuestInfo(request);
							result.put("isValidUserSession", true);
							result.put("success", true);
						} else {
							dataResult.append(JSONObject.fromObject(result).toString());
							modelAndView.setViewName(JSONMAPPING);
							modelAndView.addObject("data", dataResult);
							return modelAndView;
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
		}
		validationData.append(JSONObject.fromObject(result).toString());
		validationData.deleteCharAt(1);
		logger.info("validationData=" + validationData);
		dataResult.append(validationData);
		logger.info("data=" + dataResult);
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", dataResult);
		logger.info(LOG_EXITING);
		return (modelAndView);

	}

}
