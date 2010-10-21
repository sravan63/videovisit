<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<h3>Video Visits Member development logins and links:</h3>

<h4>Test Logins</h4>
<ul>
<li><a href="sso?mrn=1">mrn=1 - regular user</a></li> 
</ul>

<h4>Direct Page Links</h4>
<ul>
<li><a href="intro.htm">Intro</a></li> 
<li><a href="login.htm">Login</a></li> 
<li><a href="landing.htm">Landing</a></li> 
<li><a href="visit.htm">Visit</a></li> 
<li><a href="help.htm">Help</a></li> 
<li><a href="logout.htm">Logout</a></li> 
</ul>


<%-- NOTE: when development is over use something similar to the following code
           to redirect to the single-sign-on infrastructure. 
--%>
<%-- Redirected because we can't set the welcome page to a virtual URL. --%>
<%--
<c:redirect url="/sso">
	<c:param name="nuid" value='<%= request.getParameter("nuid") %>'/>
</c:redirect>
--%>