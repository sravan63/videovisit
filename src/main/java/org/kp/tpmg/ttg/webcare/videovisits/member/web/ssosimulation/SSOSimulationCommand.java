package org.kp.tpmg.ttg.webcare.videovisits.member.web.ssosimulation;

import static org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties.getExtPropertiesValueByKey;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_ENTERED;
import static org.kp.tpmg.ttg.webcare.videovisits.member.web.utils.WebUtil.LOG_EXITING;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.command.MeetingCommand;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.KpOrgSignOnInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.data.UserInfo;
import org.kp.tpmg.ttg.webcare.videovisits.member.web.service.WebService;
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
					UserInfo user = new UserInfo();
					user.setLastName(getExtPropertiesValueByKey("MEMBER_LAST_NAME"));
					user.setGuid(getExtPropertiesValueByKey("MEMBER_GUID"));
					user.setEmail(getExtPropertiesValueByKey("MEMBER_EMAIL"));
					user.setAge(Integer.parseInt(getExtPropertiesValueByKey("MEMBER_AGE")));
					user.setFirstName(getExtPropertiesValueByKey("MEMBER_FIRST_NAME"));
					user.setServiceArea(null);

					kpSignOnInfo.setSystemError(null);
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
					MeetingCommand.setWebAppContextMemberInfo(ctx, memberInfo);
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

	private static String invalidateWebAppContext(WebAppContext ctx) {
		if (ctx != null) {
			ctx.setMemberDO(null);
			ctx.setKpOrgSignOnInfo(null);
			ctx.setAuthenticated(false);
		}
		return "400";
	}

}
