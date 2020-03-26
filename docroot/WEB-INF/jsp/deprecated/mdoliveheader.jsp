<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@page import = "org.kp.tpmg.ttg.webcare.videovisits.member.web.properties.AppProperties"%>
<%
	try{
		String url = AppProperties.getExtPropertiesValueByKey("MDO_LIVE_HEADER_URL");
		URL u = new URL(url);
		BufferedReader in = new BufferedReader(
		new InputStreamReader(u.openStream()));
		
		String inputLine;
		while ((inputLine = in.readLine()) != null)
		   out.println(inputLine);
		in.close();
	}catch(Exception e){
		
	}
%>
