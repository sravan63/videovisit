package org.kp.tpmg.ttg.webcare.videovisits.member.web.controller;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.common.property.IApplicationProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.springframework.web.servlet.mvc.Controller;

public abstract class CommonController extends CommonActionProperties implements Controller {

	public final Logger logger = Logger.getLogger(getClass());

	private String clinicianSingleSignOnURL = null;
	private String vidyoWebrtcSessionManager = null;
	private String blockChrome = null;
	private String blockFF = null;
	private String blockEdge = null;
	private String blockSafari = null;
	private String blockSafariVersion = null;

	public void initProperties() {
		try {
			final IApplicationProperties appProp = AppProperties.getInstance().getApplicationProperty();
			clinicianSingleSignOnURL = appProp.getProperty("CLINICIAN_SINGLE_SIGNON_URL");
			logger.debug("clinicianSingleSignOnURL: " + clinicianSingleSignOnURL);
			vidyoWebrtcSessionManager = appProp.getProperty("VIDYO_WEBRTC_SESSION_MANAGER");
			if (StringUtils.isBlank(vidyoWebrtcSessionManager)) {
				vidyoWebrtcSessionManager = WebUtil.VIDYO_WEBRTC_SESSION_MANGER;
			}
			blockChrome = appProp.getProperty("BLOCK_CHROME_BROWSER");
			blockFF = appProp.getProperty("BLOCK_FIREFOX_BROWSER");
			blockEdge = appProp.getProperty("BLOCK_EDGE_BROWSER");
			blockSafari = appProp.getProperty("BLOCK_SAFARI_BROWSER");
			blockSafariVersion = appProp.getProperty("BLOCK_SAFARI_VERSION");
		} catch (Exception ex) {
			logger.error("Error while reading external properties file - " + ex.getMessage(), ex);
		}
	}
	
	protected void updateWebappContext(WebAppContext ctx) {
		ctx.setWebrtcSessionManager(getVidyoWebrtcSessionManager());
		if (StringUtils.isBlank(ctx.getWebrtcSessionManager())) {
			ctx.setWebrtcSessionManager(WebUtil.VIDYO_WEBRTC_SESSION_MANGER);
		}
		if (StringUtils.isNotBlank(getBlockChrome())) {
			ctx.setBlockChrome(getBlockChrome());
		}
		if (StringUtils.isNotBlank(getBlockFF())) {
			ctx.setBlockFF(getBlockFF());
		}
		if (StringUtils.isNotBlank(getBlockEdge())) {
			ctx.setBlockEdge(getBlockEdge());
		}
		if (StringUtils.isNotBlank(getBlockSafari())) {
			ctx.setBlockSafari(getBlockSafari());
		}
		if (StringUtils.isNotBlank(getBlockSafariVersion())) {
			ctx.setBlockSafariVersion(getBlockSafariVersion());
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

	/**
	 * @return the blockChrome
	 */
	public String getBlockChrome() {
		return blockChrome;
	}

	/**
	 * @param blockChrome
	 *            the blockChrome to set
	 */
	public void setBlockChrome(String blockChrome) {
		this.blockChrome = blockChrome;
	}

	/**
	 * @return the blockFF
	 */
	public String getBlockFF() {
		return blockFF;
	}

	/**
	 * @param blockFF
	 *            the blockFF to set
	 */
	public void setBlockFF(String blockFF) {
		this.blockFF = blockFF;
	}

	/**
	 * @return the blockEdge
	 */
	public String getBlockEdge() {
		return blockEdge;
	}

	/**
	 * @param blockEdge
	 *            the blockEdge to set
	 */
	public void setBlockEdge(String blockEdge) {
		this.blockEdge = blockEdge;
	}

	/**
	 * @return the blockSafari
	 */
	public String getBlockSafari() {
		return blockSafari;
	}

	/**
	 * @param blockSafari
	 *            the blockSafari to set
	 */
	public void setBlockSafari(String blockSafari) {
		this.blockSafari = blockSafari;
	}

	/**
	 * @return the blockSafariVersion
	 */
	public String getBlockSafariVersion() {
		return blockSafariVersion;
	}

	/**
	 * @param blockSafariVersion
	 *            the blockSafariVersion to set
	 */
	public void setBlockSafariVersion(String blockSafariVersion) {
		this.blockSafariVersion = blockSafariVersion;
	}

}
