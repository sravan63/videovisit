package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

public class LogoutController extends SimplePageController {

	public static Logger logger = Logger.getLogger(LogoutController.class);

	public ModelAndView handlePageRequest(ModelAndView modelAndView, HttpServletRequest request) {
		request.getSession().invalidate();
		return modelAndView;
	}

}
