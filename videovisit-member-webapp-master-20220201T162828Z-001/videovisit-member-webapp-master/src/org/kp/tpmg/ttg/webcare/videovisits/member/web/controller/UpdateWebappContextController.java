package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.videovisit.model.Status;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

public class UpdateWebappContextController extends SimplePageController {

	public static final Logger logger = Logger.getLogger(UpdateWebappContextController.class);
	private static final String JSONMAPPING = "jsonData";

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info(LOG_ENTERED);
		final Status status = new Status();
		try {
			MeetingCommand.updateWebappContext(request);
			status.setCode("200");
			status.setMessage("Success");
		} catch (Exception e) {
			status.setCode("900");
			status.setMessage("Failure");
			logger.error("System Error : " + e.getMessage(), e);
		}
		modelAndView.setViewName(JSONMAPPING);
		modelAndView.addObject("data", new Gson().toJson(status));
		logger.info(LOG_EXITING);
		return modelAndView;
	}
}
