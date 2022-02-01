package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.springframework.web.servlet.mvc.Controller;

public abstract class CommonController extends CommonActionProperties implements Controller {

	protected final Logger logger = Logger.getLogger(getClass());

	private String clinicianSingleSignOnURL = null;

	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			clinicianSingleSignOnURL = appProp.getProperty("CLINICIAN_SINGLE_SIGNON_URL");
			logger.debug("clinicianSingleSignOnURL: " + clinicianSingleSignOnURL);
		} catch (Exception ex) {
			logger.error("Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}

	/**
	 * @return the clinicianSingleSignOnURL
	 */
	public String getClinicianSingleSignOnURL() {
		return clinicianSingleSignOnURL;
	}

	/**
	 * @param clinicianSingleSignOnURL
	 *            the clinicianSingleSignOnURL to set
	 */
	public void setClinicianSingleSignOnURL(String clinicianSingleSignOnURL) {
		this.clinicianSingleSignOnURL = clinicianSingleSignOnURL;
	}

}
