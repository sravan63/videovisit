<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--  Include modal dialog jsps -->
<%@ include file="../patientLoginModal.jsp" %>
<%@ include file="logoutModal.jsp" %>
				
<div class="header">
		<div class="header-title"></div>
		<c:if test="${WebAppContext.member != null}">
			<button alt="Log out" id="btn-logout" class="btn-nav btn-logout" onclick="javascript:modalShow('modal-logout');"><span class="icon-logout"></span></button>
		</c:if>
</div>