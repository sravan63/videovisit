<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.videolink"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.iconpromo"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.promo"%>
<%@ page import="java.util.*"%>
<%
	videolink videoLink = WebAppContext.getWebAppContext(request).getVideoLink();
	String videoTitle = "";
	String videoAbstract = "";
	String videoImagePath = "";
	String videoImageTitle = "";
	
	if ( videoLink != null ) 
	{
		String id = videoLink.getId();
		videoTitle = videoLink.getTitle();
		videoAbstract = videoLink.getAbstractText();
		videoImagePath = videoLink.getVideoIcon().getPath();
		videoImageTitle = videoLink.getVideoIcon().getTitle();
	}
	
	List<iconpromo> iconpromos = WebAppContext.getWebAppContext(request).getIconPromo();
	List<promo> promos = WebAppContext.getWebAppContext(request).getPromo();
%>

<div class="videoVisitContainer">
		<div id="videoVisitHomeContents">
    		<div id="mainHeader">
    			<h2> <%=videoTitle%> </h2>
    			<h3> <%=videoAbstract%> </h4>
    		</div>
    		
    		<div id="mainContent">
    			
    			<div id="videoWrapper">
    				<div id="videoContainer" style="background: url('/videovisit/<%=videoImagePath%>') no-repeat scroll center transparent;">
    				</div>
    			</div>
    			
    			<div id="navContent">
    				<div class="row">
    				<%
    					if ( iconpromos != null )
    					{
	    					for ( iconpromo ip : iconpromos)
	    					{
	    						StringBuffer sb = new StringBuffer();
	    						sb.append("<div class=\"landingHalf ");
	    						sb.append(ip.getId());
	    						sb.append("\">");
	    						//sb.append("<div  id=\"" + ip.getId() + "\" class=\"icon\" ></div>");
	    						sb.append("<div id=\"" + ip.getId() + "\" class=\"icon\" style=\"background: url('" + ip.getPromoIcon().getPath() + "') no-repeat scroll top center transparent; float: left;\"></div>");
	    						sb.append("<div><h3>" + ip.getHeader() + "</h3>");
	    						sb.append("<p>" + ip.getAbstractText() + "</p>");
	    						sb.append("<button class=\"button\" alt=\"" + ip.getIconPromoHyperLink().getTitle() + "\" value=\"" + ip.getIconPromoHyperLink().getTitle() + "\" onclick=\"window.location.href = '" + ip.getIconPromoHyperLink().getUrl() + "'\">" +  ip.getIconPromoHyperLink().getTitle() + "</button>");
	    						sb.append("</div></div>");
	    						out.println(sb.toString());
	    					}
    					}
	    			%>

    				<!-- 
    					<div class="row">
	    					<div class="landingHalf leftNavContent">
    							<div id="iconpromo1" class="icon" style="background: url('images/icon_checklist.png') no-repeat scroll top center transparent;">
    							</div>
    							<div class="innerNav">
    								<h3> Get Prepared Before Your Visit </h3>
    								<p> It's important  to check your system and environment before your visit. </p>
    								<div class="buttons">
    									<button class="button" alt="Get Prepared" value="Get Prepared"> Get Prepared </button>
	    							</div>
	    						</div>
    						</div>
    						<div class="landingHalf rightNavContent">
	    						<div id="iconpromo2" class="icon" style="background: url('images/icon_devices.png') no-repeat scroll top center transparent;">
    							</div>
		    					<div class="innerNav">
    								<h3> Join Video Visit </h3>
    								<p> You can join your Video Visit up to 15 minutes before your appointment. </p>
    								<div class="buttons">
    									<button class="button" alt="Join Your Video Visit" value="Join Your Video Visit"> Join Your Video Visit </button>
    								</div>
		    					</div>   					
    						</div>
    					</div>
    				 -->
    				 </div>
    			</div>
    			
    			<div id="lastContent">
    				<div class="row">
    				<%	
    			
    					if ( promos != null)
    					{
    						for ( promo p : promos)
	    					{
    							StringBuffer sb = new StringBuffer();
    							sb.append("<div class=\"threeColumns ");
    							sb.append(p.getId());
    							sb.append("\">");
    							//sb.append("<div  id=\"" + ip.getId() + "\" class=\"icon\" ></div>");
    							sb.append("<h4>" + p.getHeader() + "</h4>");
    							sb.append("<p>" + p.getAbstractText() + "</p>");
	    						sb.append("<a href=\"" + p.getPromoHyperLink().getUrl()+"\" style=\"float:right; margin-right:2px;\">" + p.getPromoHyperLink().getTitle() + "&#62;</a>");
    							sb.append("</div>");
    							out.println(sb.toString());
    						}
    					}
    				%>
    			
    				<!-- 
    			    	<div class="row">
		    			    <div class="threeColumns promo1">
    							<h4> Get Support </h3>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							<a style="float:right; margin-right:2px;"> More &#62; </a>
    						</div>
    					
	    					<div class="threeColumns promo2">
    							<h4> Cancel and Reschedule </h3>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
    							<a style="float:right; margin-right:2px;"> More &#62; </a>					
    						</div>
    				
    						<div class="threeColumns promo3">
    							<h4> How to Schedule a Video Visit </h3>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor. </p>
    							<a style="float:right; margin-right:2px;"> More &#62; </a>
    						</div>
    					</div>
    				 -->
    				 </div>
    			</div>
    			
    		</div>    		
   	</div>
</div>