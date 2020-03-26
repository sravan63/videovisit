<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--  Include modal dialog jsps -->

<%@ include file="logoutModal.jsp" %>
				
<div class="header">
		<div class="header-title"></div>
		<c:if test="${WebAppContext.memberDO != null}">
			<button alt="Sign off" id="btn-logout" class="btn-nav-new btn-logout" onclick="javascript:modalShow('modal-logout');"><span class="icon-logout"></span><span class="label">Sign off</span></button>
		</c:if>
</div>