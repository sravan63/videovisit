<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@page import="java.util.ResourceBundle"%>
<%@page import="java.util.Properties" %>
<%
	try{
		ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
		//Read external properties file
		File file = new File(rbInfo.getString("VIDEOVISIT_EXT_PROPERTIES_FILE"));
		FileInputStream fileInput = new FileInputStream(file);
		Properties appProp = new Properties();
		appProp.load(fileInput);
		String url = appProp.getProperty("MDO_LIVE_FOOTER_URL");
		//String url = rbInfo.getString("MDO_LIVE_FOOTER_URL");
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
