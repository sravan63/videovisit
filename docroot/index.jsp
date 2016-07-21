<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@page import="java.util.ResourceBundle"%>
<%-- NOTE: when development is over use something similar to the following code
           to redirect to the single-sign-on infrastructure. 
--%>
<%-- Redirected because we can't set the welcome page to a virtual URL. --%>


<%
//ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
//String url = rbInfo.getString("MDO_LIVE_CHECK_URL");
/*URL u = new URL(url);
BufferedReader in = new BufferedReader(
new InputStreamReader(u.openStream())); */
boolean live = false;
/* String inputLine;
while ((inputLine = in.readLine()) != null)
{
	if ( inputLine.contains("My Doctor Online") )
	{
		live = true;
	}
}
in.close();
*/
	if ( live )
	{
%>
	<c:redirect url="/mdolive.htm">
	</c:redirect>
	
<%
	}
	else
	{
%>
	<c:redirect url="/mdo.htm">
	</c:redirect>
<%
	}
%>