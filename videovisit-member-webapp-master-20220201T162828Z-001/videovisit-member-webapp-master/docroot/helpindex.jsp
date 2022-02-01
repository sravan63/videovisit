<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@page import = "org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties"%>
<%-- NOTE: when development is over use something similar to the following code
           to redirect to the single-sign-on infrastructure. 
--%>
<%-- Redirected because we can't set the welcome page to a virtual URL. --%>


<%
boolean live = false;
try{
	String url = AppProperties.getExtPropertiesValueByKey("MDO_LIVE_HEADER_URL");
	URL u = new URL(url);
	BufferedReader in = new BufferedReader(
	new InputStreamReader(u.openStream()));
	
	String inputLine;
	while ((inputLine = in.readLine()) != null)
	{
		if ( inputLine.contains("My Doctor Online") )
		{
			live = true;
		}
	}
	in.close();
}catch(Exception e){
	
}

	if ( live )
	{
%>
	<c:redirect url="/mdohelplive.htm">
	</c:redirect>
	
<%
	}
	else
	{
%>
	<c:redirect url="/mdohelp.htm">
	</c:redirect>
<%
	}
%>