<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@page import="java.util.ResourceBundle"%>
<%
	ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
	String url = rbInfo.getString("MDO_LIVE_FOOTER_URL");
	URL u = new URL(url);
	BufferedReader in = new BufferedReader(
	new InputStreamReader(u.openStream()));
	
	String inputLine;
	while ((inputLine = in.readLine()) != null)
	   out.println(inputLine);
	in.close();
%>
