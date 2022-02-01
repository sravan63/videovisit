package org.kp.tpmg.ttg.webcare.videovisits.member.web.context;

import java.io.Serializable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VendorPluginDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.VideoVisitParamsDTO;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink;
import org.kp.tpmg.videovisit.model.meeting.MeetingDO;
import org.kp.tpmg.videovisit.model.user.Caregiver;
import org.kp.tpmg.videovisit.model.user.Member;

public class WebAppContext implements Serializable {

	private static final long serialVersionUID = 5877497198027418539L;

	public static final Logger logger = Logger.getLogger(WebAppContext.class);

	private String meetingCode;
	private String patientLastName;
	private String nocache;
	private String guestMeetingId;

	private String contextId;
	private Member memberDO = null;
	private List<MeetingDO> myMeetings = null;
	private int totalmeetings = 0;
	private String megaMeetingURL = null;
	private String megaMeetingMobileURL = null;
	private String clinicianSingleSignOnURL = null;
	private boolean careGiver;
	private long meetingId = 0;
	public static final String HTTP_SESSION_KEY = "WebAppContext";
	private faq objFaq;
	private List<promo> promos;
	private List<iconpromo> iconpromos;
	private videolink videoLink;
	private String careGiverName = "";
	private VideoVisitParamsDTO videoVisit = null;
	private boolean hasJoinedMeeting = false;
	private VendorPluginDTO vendorPlugin = null;

	private KpOrgSignOnInfo kpOrgSignOnInfo = null;
	private String kpKeepAliveUrl = null;
	private boolean isAuthenticated = false;
	private boolean isNonMember = false;
	private String blockChrome = "true";
	private String blockFF = "true";
	private String blockEdge = "true";
	private String blockSafari = "true";
	private String blockSafariVersion = "12";
	private boolean showPeripheralsPage = true;
	private boolean isNative = false;
	private String bandwidth;
	private String blockPexipIE = "true";
	
	private String pexMobBlockSafariVer = null;
	private String pexMobBlockChromeVer = null;
	private String pexMobBlockFirefoxVer = null;
	
	private String pexBlockSafariVer = null;
	private String pexBlockChromeVer = null;
	private String pexBlockEdgeVer = null;
	private String pexBlockFirefoxVer = null;
	
	private boolean showPexipPrecall = false;
		
	/**
	 * Defaulting clientId  to "vv-mbr-web".
	 * Other possible values vv-mbr-sso-web,vv-mbr-sso-sim,vv-mbr-guest
	 */
	private String clientId = "vv-mbr-web";
	
	/**
	 * Defaulting backButtonClientId  to "vv-mbr-back-btn".
	 * Other possible values vv-mbr-sso-back-btn,vv-mbr-sso-sim-back-btn,vv-mbr-guest-back-btn
	 */
	private String backButtonClientId = "vv-mbr-back-btn";
	private boolean isAndroidSDK = false;

	public String getGuestMeetingId() {
		return guestMeetingId;
	}

	public void setGuestMeetingId(String guestMeetingId) {
		this.guestMeetingId = guestMeetingId;
	}

	public String getNocache() {
		return nocache;
	}

	public void setNocache(String nocache) {
		this.nocache = nocache;
	}

	public String getMeetingCode() {
		return meetingCode;
	}

	public void setMeetingCode(String meetingCode) {
		this.meetingCode = meetingCode;
	}

	public String getPatientLastName() {
		return patientLastName;
	}

	public void setPatientLastName(String patientLastName) {
		this.patientLastName = patientLastName;
	}

	public static WebAppContext getWebAppContext(HttpServletRequest request) {
		return (WebAppContext) request.getSession().getAttribute(WebAppContext.HTTP_SESSION_KEY);
	}

	public static WebAppContext getWebAppContext(HttpSession session) {
		return (WebAppContext) session.getAttribute(WebAppContext.HTTP_SESSION_KEY);
	}

	public static void setWebAppContext(HttpServletRequest request, WebAppContext ctx) {
		request.getSession().setAttribute(WebAppContext.HTTP_SESSION_KEY, ctx);
	}

	public String getContextId() {
		return contextId;
	}

	public void setContextId(String contextId) {
		this.contextId = contextId;
	}

	public void setTotalmeetings(int total) {
		this.totalmeetings = total;
	}

	public int getTotalmeetings() {
		return totalmeetings;
	}

	public String getMegaMeetingURL() {
		return megaMeetingURL;
	}

	public void setMegaMeetingURL(String megaMeetingURL) {
		this.megaMeetingURL = megaMeetingURL;
	}

	public long getTimestamp() {
		return System.currentTimeMillis() / 1000;
	}

	public String getMegaMeetingMobileURL() {
		return megaMeetingMobileURL;
	}

	public void setMegaMeetingMobileURL(String megaMeetingMobileURL) {
		this.megaMeetingMobileURL = megaMeetingMobileURL;
	}

	public String getClinicianSingleSignOnURL() {
		return clinicianSingleSignOnURL;
	}

	public void setClinicianSingleSignOnURL(String clinicianSingleSignOnURL) {
		this.clinicianSingleSignOnURL = clinicianSingleSignOnURL;
	}

	public void setCareGiver(boolean careGiver) {
		this.careGiver = careGiver;
	}

	public boolean getCareGiver() {
		return careGiver;
	}

	public void setMeetingId(long meetingId) {
		this.meetingId = meetingId;
	}

	public long getMeetingId() {
		return meetingId;
	}

	public void setFaq(faq objFaq) {
		this.objFaq = objFaq;
	}

	public faq getFaq() {
		return objFaq;
	}

	public void setPromo(List<promo> promos) {
		this.promos = promos;
	}

	public List<promo> getPromo() {
		return promos;
	}

	public void setIconPromo(List<iconpromo> iconpromos) {
		this.iconpromos = iconpromos;
	}

	public List<iconpromo> getIconPromo() {
		return iconpromos;
	}

	public void setVideoLink(videolink videoLink) {
		this.videoLink = videoLink;
	}

	public videolink getVideoLink() {
		return videoLink;
	}

	public void setCareGiverName(String careGiverName) {
		this.careGiverName = careGiverName;
	}

	public String getCareGiverName() {
		return careGiverName;
	}

	public VideoVisitParamsDTO getVideoVisit() {
		return videoVisit;
	}

	public void setVideoVisit(VideoVisitParamsDTO videoVisit) {
		this.videoVisit = videoVisit;
	}

	public boolean isHasJoinedMeeting() {
		return hasJoinedMeeting;
	}

	public void setHasJoinedMeeting(boolean hasJoinedMeeting) {
		this.hasJoinedMeeting = hasJoinedMeeting;
	}

	/**
	 * @return the vendorPlugin
	 */
	public VendorPluginDTO getVendorPlugin() {
		return vendorPlugin;
	}

	/**
	 * @param vendorPlugin
	 *            the vendorPlugin to set
	 */
	public void setVendorPlugin(VendorPluginDTO vendorPlugin) {
		this.vendorPlugin = vendorPlugin;
	}

	/**
	 * @return the kpOrgSignOnInfo
	 */
	public KpOrgSignOnInfo getKpOrgSignOnInfo() {
		return kpOrgSignOnInfo;
	}

	/**
	 * @param kpOrgSignOnInfo
	 *            the kpOrgSignOnInfo to set
	 */
	public void setKpOrgSignOnInfo(KpOrgSignOnInfo kpOrgSignOnInfo) {
		this.kpOrgSignOnInfo = kpOrgSignOnInfo;
	}

	/**
	 * @return the kpKeepAliveUrl
	 */
	public String getKpKeepAliveUrl() {
		return kpKeepAliveUrl;
	}

	/**
	 * @param kpKeepAliveUrl
	 *            the kpKeepAliveUrl to set
	 */
	public void setKpKeepAliveUrl(String kpKeepAliveUrl) {
		this.kpKeepAliveUrl = kpKeepAliveUrl;
	}

	/**
	 * @return the isAuthenticated
	 */
	public boolean isAuthenticated() {
		return isAuthenticated;
	}

	/**
	 * @param isAuthenticated
	 *            the isAuthenticated to set
	 */
	public void setAuthenticated(boolean isAuthenticated) {
		this.isAuthenticated = isAuthenticated;
	}

	/**
	 * @return the isNonMember
	 */
	public boolean isNonMember() {
		return isNonMember;
	}

	/**
	 * @param isNonMember
	 *            the isNonMember to set
	 */
	public void setNonMember(boolean isNonMember) {
		this.isNonMember = isNonMember;
	}

	/**
	 * @return the myMeetings
	 */
	public List<MeetingDO> getMyMeetings() {
		return myMeetings;
	}

	/**
	 * @param myMeetings
	 *            the myMeetings to set
	 */
	public void setMyMeetings(List<MeetingDO> myMeetings) {
		this.myMeetings = myMeetings;
	}

	/**
	 * @return the memberDO
	 */
	public Member getMemberDO() {
		return memberDO;
	}

	/**
	 * @param memberDO
	 *            the memberDO to set
	 */
	public void setMemberDO(Member memberDO) {
		this.memberDO = memberDO;
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
	 * @param blockEdge the blockEdge to set
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
	 * @param blockSafari the blockSafari to set
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
	 * @param blockSafariVersion the blockSafariVersion to set
	 */
	public void setBlockSafariVersion(String blockSafariVersion) {
		this.blockSafariVersion = blockSafariVersion;
	}

	/**
	 * @return the showPeripheralsPage
	 */
	public boolean isShowPeripheralsPage() {
		return showPeripheralsPage;
	}

	/**
	 * @param showPeripheralsPage the showPeripheralsPage to set
	 */
	public void setShowPeripheralsPage(boolean showPeripheralsPage) {
		this.showPeripheralsPage = showPeripheralsPage;
	}

	/**
	 * @return the isNative
	 */
	public boolean getIsNative() {
		return isNative;
	}

	/**
	 * @param isNative the isNative to set
	 */
	public void setIsNative(boolean isNative) {
		this.isNative = isNative;
	}

	/**
	 * @return the bandwidth
	 */
	public String getBandwidth() {
		return bandwidth;
	}

	/**
	 * @param bandwidth the bandwidth to set
	 */
	public void setBandwidth(String bandwidth) {
		this.bandwidth = bandwidth;
	}

	/**
	 * @return the blockPexipIE
	 */
	public String getBlockPexipIE() {
		return blockPexipIE;
	}

	/**
	 * @param blockPexipIE the blockPexipIE to set
	 */
	public void setBlockPexipIE(String blockPexipIE) {
		this.blockPexipIE = blockPexipIE;
	}

	/**
	 * @return the clientId
	 */
	public String getClientId() {
		return clientId;
	}

	/**
	 * @param clientId the clientId to set
	 */
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	/**
	 * @return the backButtonClientId
	 */
	public String getBackButtonClientId() {
		return backButtonClientId;
	}

	/**
	 * @param backButtonClientId the backButtonClientId to set
	 */
	public void setBackButtonClientId(String backButtonClientId) {
		this.backButtonClientId = backButtonClientId;
	}
	
	/**
	 * @return the pexMobBlockSafariVer
	 */
	public String getPexMobBlockSafariVer() {
		return pexMobBlockSafariVer;
	}

	/**
	 * @param pexMobBlockSafariVer the pexMobBlockSafariVer to set
	 */
	public void setPexMobBlockSafariVer(String pexMobBlockSafariVer) {
		this.pexMobBlockSafariVer = pexMobBlockSafariVer;
	}

	/**
	 * @return the pexMobBlockChromeVer
	 */
	public String getPexMobBlockChromeVer() {
		return pexMobBlockChromeVer;
	}

	/**
	 * @param pexMobBlockChromeVer the pexMobBlockChromeVer to set
	 */
	public void setPexMobBlockChromeVer(String pexMobBlockChromeVer) {
		this.pexMobBlockChromeVer = pexMobBlockChromeVer;
	}

	/**
	 * @return the pexMobBlockFirefoxVer
	 */
	public String getPexMobBlockFirefoxVer() {
		return pexMobBlockFirefoxVer;
	}

	/**
	 * @param pexMobBlockFirefoxVer the pexMobBlockFirefoxVer to set
	 */
	public void setPexMobBlockFirefoxVer(String pexMobBlockFirefoxVer) {
		this.pexMobBlockFirefoxVer = pexMobBlockFirefoxVer;
	}

	/**
	 * @return the pexBlockSafariVer
	 */
	public String getPexBlockSafariVer() {
		return pexBlockSafariVer;
	}

	/**
	 * @param pexBlockSafariVer the pexBlockSafariVer to set
	 */
	public void setPexBlockSafariVer(String pexBlockSafariVer) {
		this.pexBlockSafariVer = pexBlockSafariVer;
	}

	/**
	 * @return the pexBlockChromeVer
	 */
	public String getPexBlockChromeVer() {
		return pexBlockChromeVer;
	}

	/**
	 * @param pexBlockChromeVer the pexBlockChromeVer to set
	 */
	public void setPexBlockChromeVer(String pexBlockChromeVer) {
		this.pexBlockChromeVer = pexBlockChromeVer;
	}

	/**
	 * @return the pexBlockEdgeVer
	 */
	public String getPexBlockEdgeVer() {
		return pexBlockEdgeVer;
	}

	/**
	 * @param pexBlockEdgeVer the pexBlockEdgeVer to set
	 */
	public void setPexBlockEdgeVer(String pexBlockEdgeVer) {
		this.pexBlockEdgeVer = pexBlockEdgeVer;
	}

	/**
	 * @return the pexBlockFirefoxVer
	 */
	public String getPexBlockFirefoxVer() {
		return pexBlockFirefoxVer;
	}

	/**
	 * @param pexBlockFirefoxVer the pexBlockFirefoxVer to set
	 */
	public void setPexBlockFirefoxVer(String pexBlockFirefoxVer) {
		this.pexBlockFirefoxVer = pexBlockFirefoxVer;
	}
	
	/**
	 * @return the showPexipPrecall
	 */
	public boolean isShowPexipPrecall() {
		return showPexipPrecall;
	}

	/**
	 * @param showPexipPrecall the showPexipPrecall to set
	 */
	public void setShowPexipPrecall(boolean showPexipPrecall) {
		this.showPexipPrecall = showPexipPrecall;
	}

	/**
	 * @param meetingId
	 * @return
	 */
	public MeetingDO getMyMeetingByMeetingId(final String meetingId) {
		if (StringUtils.isNotBlank(meetingId) && CollectionUtils.isNotEmpty(this.myMeetings)) {
			for (MeetingDO meeting : this.myMeetings) {
				if (meetingId.equalsIgnoreCase(meeting.getMeetingId())) {
					return meeting;
				}
			}
		}
		return null;
	}
	
	/**
	 * @param firstName
	 * @param lastName
	 * @param email
	 * @return
	 */
	public boolean isCaregiverExist(final String meetingId, final String firstName, final String lastName,
			final String email) {
		boolean caregiverExist = false;
		if (StringUtils.isNotBlank(firstName) && StringUtils.isNotBlank(lastName) && StringUtils.isNotBlank(email)) {
			final MeetingDO meeting = getMyMeetingByMeetingId(meetingId);
			if (CollectionUtils.isNotEmpty(meeting.getCaregiver())) {
				for (Caregiver caregiver : meeting.getCaregiver()) {
					if (firstName.equalsIgnoreCase(caregiver.getFirstName())
							&& lastName.equalsIgnoreCase(caregiver.getLastName())
							&& email.equalsIgnoreCase(caregiver.getEmailAddress())) {
						caregiverExist = true;
						break;
					}
				}
			}
		}
		return caregiverExist;
	}

	/**
	 * @return the isAndroidSDK
	 */
	public boolean isAndroidSDK() {
		return isAndroidSDK;
	}

	/**
	 * @param isAndroidSDK the isAndroidSDK to set
	 */
	public void setAndroidSDK(boolean isAndroidSDK) {
		this.isAndroidSDK = isAndroidSDK;
	}

}
