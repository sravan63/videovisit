package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.EnvironmentCommand;

public class CommonActionProperties {

	private EnvironmentCommand environmentCommand;
	private String viewName;
	private String navigation;
	private String subNavigation;

	/**
	 * @return the environmentCommand
	 */
	public EnvironmentCommand getEnvironmentCommand() {
		return environmentCommand;
	}

	/**
	 * @param environmentCommand
	 *            the environmentCommand to set
	 */
	public void setEnvironmentCommand(EnvironmentCommand environmentCommand) {
		this.environmentCommand = environmentCommand;
	}

	/**
	 * @return the viewName
	 */
	public String getViewName() {
		return viewName;
	}

	/**
	 * @param viewName
	 *            the viewName to set
	 */
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}

	/**
	 * @return the navigation
	 */
	public String getNavigation() {
		return navigation;
	}

	/**
	 * @param navigation
	 *            the navigation to set
	 */
	public void setNavigation(String navigation) {
		this.navigation = navigation;
	}

	/**
	 * @return the subNavigation
	 */
	public String getSubNavigation() {
		return subNavigation;
	}

	/**
	 * @param subNavigation
	 *            the subNavigation to set
	 */
	public void setSubNavigation(String subNavigation) {
		this.subNavigation = subNavigation;
	}

}
