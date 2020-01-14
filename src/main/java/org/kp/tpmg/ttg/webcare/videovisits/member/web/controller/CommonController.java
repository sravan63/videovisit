package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.mvc.Controller;

public abstract class CommonController extends CommonActionProperties implements Controller {

	protected final Logger logger = Logger.getLogger(getClass());

	private String clinicianSingleSignOnURL = null;
	private String vidyoWebrtcSessionManager = null;

	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			clinicianSingleSignOnURL = appProp.getProperty("CLINICIAN_SINGLE_SIGNON_URL");
			logger.debug("clinicianSingleSignOnURL: " + clinicianSingleSignOnURL);
			vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
			if (StringUtils.isBlank(vidyoWebrtcSessionManager)) {
				vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
			}
		} catch (Exception ex) {
			logger.error("Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}
	
	protected void updateWebappContext(WebAppContext ctx) {
		ctx.setWebrtcSessionManager(getVidyoWebrtcSessionManager());
		if (StringUtils.isBlank(ctx.getWebrtcSessionManager())) {
			ctx.setWebrtcSessionManager(WebUtil.VIDYO_WEBRTC_SESSION_MANGER);
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

	/**
	 * @return the vidyoWebrtcSessionManager
	 */
	public String getVidyoWebrtcSessionManager() {
		return vidyoWebrtcSessionManager;
	}

	/**
	 * @param vidyoWebrtcSessionManager
	 *            the vidyoWebrtcSessionManager to set
	 */
	public void setVidyoWebrtcSessionManager(String vidyoWebrtcSessionManager) {
		this.vidyoWebrtcSessionManager = vidyoWebrtcSessionManager;
	}

}
