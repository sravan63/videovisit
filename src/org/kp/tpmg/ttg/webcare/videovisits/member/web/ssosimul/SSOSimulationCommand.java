package org.kp.tpmg.ttg.webcare.videovisits.member.web.ssosimul;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil;
import org.kp.tpmg.videovisit.model.user.Member;
import org.kp.ttg.sharedservice.domain.MemberInfo;

public class SSOSimulationCommand {

	public SSOSimulationCommand() {
	}

	public static final Logger logger = Logger.getLogger(SSOSimulationCommand.class);

	public static String performSSOSimulationSignOn(HttpServletRequest request) throws Exception {
		logger.info(LOG_ENTERED);
		String strResponse = null;
		try {
			WebAppContext ctx = WebAppContext.getWebAppContext(request);
			WebService.initWebService(request);
			final KpOrgSignOnInfo kpSignOnInfo = new KpOrgSignOnInfo();
			kpSignOnInfo.setSsoSession(request.getSession().getId());
			final List<Object> interruptList = new ArrayList<Object>();
			final List<Object> ebizAccountRoles = new ArrayList<Object>();
			if (ctx != null) {
				final String userName = request.getParameter("username");
				final String password = request.getParameter("password");

				logger.debug("userName= " + userName + ",password=" + password);
				final String memberName = getExtPropertiesValueByKey("MEMBER_USERNAME");
				final String memberPassword = getExtPropertiesValueByKey("MEMBER_PASSWORD");
				final String nonMemberName = getExtPropertiesValueByKey("NON_MEMBER_USERNAME");
				final String nonMemberPassword = getExtPropertiesValueByKey("NON_MEMBER_PASSWORD");

				if (StringUtils.isNotBlank(memberName) && StringUtils.isNotBlank(memberPassword)
						&& memberName.equalsIgnoreCase(userName) && memberPassword.equalsIgnoreCase(password)) {
					ebizAccountRoles.add(getExtPropertiesValueByKey("MEMBER_EBIZ_ACCOUNT_ROLES"));
					interruptList.add(getExtPropertiesValueByKey("MEMBER_INTERRUPT_LIST"));
					UserInfo user = new UserInfo();
					user.setRegion(getExtPropertiesValueByKey("MEMBER_REGION"));
					user.setEbizAccountRoles(ebizAccountRoles);
					user.setLastName(getExtPropertiesValueByKey("MEMBER_LAST_NAME"));
					user.setTermsAndCondAccepted(getExtPropertiesValueByKey("MEMBER_TERMS_AND_COND_ACCEPTED"));
					user.setActivationStatusCode(getExtPropertiesValueByKey("MEMBER_ACTIVATION_STATUS_CODE"));
					user.setPreferredFirstName(getExtPropertiesValueByKey("MEMBER_PREFERRED_FIRST_NAME"));
					user.setGuid(getExtPropertiesValueByKey("MEMBER_GUID"));
					user.setEmail(getExtPropertiesValueByKey("MEMBER_EMAIL"));
					user.setAge(Integer.parseInt(getExtPropertiesValueByKey("MEMBER_AGE")));
					user.setDisabledReasonCode(null);
					user.setEpicEmail(getExtPropertiesValueByKey("MEMBER_EPIC_EMAIL"));
					user.setFirstName(getExtPropertiesValueByKey("MEMBER_FIRST_NAME"));
					user.setServiceArea(null);

					kpSignOnInfo.setSystemError(null);
					kpSignOnInfo.setInterruptList(interruptList);
					kpSignOnInfo.setSuccess(true);
					kpSignOnInfo.setBusinessError(null);
					kpSignOnInfo.setUser(user);
					kpSignOnInfo.setFailureInfo(null);

					final MemberInfo memberInfo = new MemberInfo();
					memberInfo.setMrn(getExtPropertiesValueByKey("MEMBER_MRN"));
					memberInfo.setDateOfBirth(getExtPropertiesValueByKey("MEMBER_DATE_OF_BIRTH"));
					memberInfo.setFirstName(getExtPropertiesValueByKey("MEMBER_FIRST_NAME"));
					memberInfo.setLastName(getExtPropertiesValueByKey("MEMBER_LAST_NAME"));
					memberInfo.setMiddleName(getExtPropertiesValueByKey("MEMBER_MIDDLE_NAME"));
					memberInfo.setEmail("");
					memberInfo.setGender(getExtPropertiesValueByKey("MEMBER_GENDER"));

					ctx.setNonMember(Boolean.FALSE);
					setWebAppContextMemberInfoForSSOSimul(ctx, memberInfo);
					ctx.setKpOrgSignOnInfo(kpSignOnInfo);
					ctx.setKpKeepAliveUrl(WebService.getKpOrgSSOKeepAliveUrl());
					
					strResponse = "200";
				} else if (StringUtils.isNotBlank(nonMemberName) && StringUtils.isNotBlank(nonMemberPassword)
						&& memberName.equalsIgnoreCase(nonMemberName)
						&& memberPassword.equalsIgnoreCase(nonMemberPassword)) {
					ctx.setNonMember(Boolean.TRUE);
					strResponse = "200";
				} else {
					strResponse = invalidateWebAppContext(ctx);
				}

			} else {
				logger.warn("SSO Sign on failed as webapp context from the rquest is null");
				strResponse = "400";
			}
		} catch (Exception e) {
			logger.error("System Error" + e.getMessage(), e);
			if (StringUtils.isBlank(strResponse)) {
				strResponse = "400";
			}

		}
		logger.info(LOG_EXITING);
		return strResponse;
	}

	private static void setWebAppContextMemberInfoForSSOSimul(WebAppContext ctx, MemberInfo memberInfo) {
		final Member memberDO = new Member();
		try {
			final String dateStr = memberInfo.getDateOfBirth();
			if (StringUtils.isNotBlank(dateStr)) {
				if (dateStr.endsWith("Z")) {
					Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime(dateStr);
					memberDO.setDateOfBirth(String.valueOf(cal.getTimeInMillis()));
				} else {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					Date date = sdf.parse(memberInfo.getDateOfBirth());
					memberDO.setDateOfBirth(String.valueOf(date.getTime()));
				}
			}
		} catch (Exception e) {
			logger.warn("error while parsing string date to long.");
		}

		memberDO.setEmail(memberInfo.getEmail());
		memberDO.setFirstName(WordUtils.capitalizeFully(memberInfo.getFirstName()));
		memberDO.setGender(memberInfo.getGender());
		memberDO.setLastName(WordUtils.capitalizeFully(memberInfo.getLastName()));
		memberDO.setMiddleName(WordUtils.capitalizeFully(memberInfo.getMiddleName()));

		memberDO.setMrn(WebUtil.fillToLength(memberInfo.getMrn(), '0', 8));

		ctx.setMemberDO(memberDO);
	}

	private static String invalidateWebAppContext(WebAppContext ctx) {
		if (ctx != null) {
			ctx.setMemberDO(null);
			ctx.setKpOrgSignOnInfo(null);
			ctx.setAuthenticated(false);
		}
		return "400";
	}

}
