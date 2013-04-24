<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.WebAppContext" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--  Include modal dialog jsps -->
<%@ include file="../patientLoginModal.jsp" %>
<%@ include file="logoutModal.jsp" %>
<%@ include file="preloader.jsp" %>
				
<div class="header">
		
		<!-- Google Tag Manager -->
		<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-S5C2"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-S5C2');</script>
		<!-- End Google Tag Manager -->

		<div class="header-title"></div>
		<c:if test="${WebAppContext.member != null}">
			<button alt="Sign off" id="btn-logout" class="btn-nav-new btn-logout" onclick="javascript:modalShow('modal-logout');"><span class="icon-logout"></span><span class="label">Sign off</span></button>
		</c:if>
</div>