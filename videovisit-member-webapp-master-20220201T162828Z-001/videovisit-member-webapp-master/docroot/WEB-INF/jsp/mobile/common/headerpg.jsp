<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--  Include modal dialog jsps -->
<%@ include file="pglogoutModal.jsp" %>

<div class="header">		
	<div class="header-title"></div>
	<c:if test="${WebAppContext.careGiver}">
		<button alt="Log out" id="btn-logout" class="btn-nav btn-logout" onclick="javascript:modalShow('pg-modal-logout');"><span class="icon-logout"></span></button>
	</c:if>
</div>
