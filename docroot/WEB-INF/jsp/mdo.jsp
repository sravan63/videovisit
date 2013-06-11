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
    				<div id="videoContainer" style="background: url('<%=videoImagePath%>') no-repeat scroll center transparent;">
    				</div>
    			</div>
    			
    			<div id="navContent">
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
	    						sb.append("<div id=\"" + ip.getId() + "\" class=\"icon\" style=\"background: url('" + ip.getPromoIcon().getPath() + "') no-repeat scroll top center transparent;\"></div>");
	    						sb.append("<div style=\"margin-left:12px;\">");
	    						sb.append("<h3>" + ip.getHeader() + "</h3>");
	    						sb.append("<p>" + ip.getAbstractText() + "</p>");
	    						sb.append("<div class=\"buttons\">");
	    						sb.append("<button class=\"button\" alt=\"" + ip.getIconPromoHyperLink().getTitle() + "\" value=\"" + ip.getIconPromoHyperLink().getTitle() + "\" onclick=\"window.location.href = '" + ip.getIconPromoHyperLink().getUrl() + "'\">" +  ip.getIconPromoHyperLink().getTitle() + "</button>");
	    						sb.append("</div></div></div>");
	    						out.println(sb.toString());
	    					}
    					}
	    			%>

    				<!-- 
    				<div class="landingHalf leftNavContent" >
	    					<div id="getPreparedIcon" class="icon">
	    					</div>
	    					<div style="margin-left:12px;">
	    						<h3>  Get Prepared Before Your Visit </h3>
	    						<p> It's important  to check your system and environment before your visit. </p>
	    						<div class="buttons">
	    							<button class="button" alt="Get Prepared" value="Get Prepared"> Get Prepared </button>
	    						</div>
	    					</div>
	    				</div>
	    				
    				<div class="landingHalf rightNavContent">
    					<div id="joinVideoVisit" class="icon"> 
    					</div>
    					<div style="margin-left:12px;">
    						<h3>  Join Video Visit </h3>
    						<p> You can Video VIsits from any device. </p>
    						<div class="buttons">
    							<button class="button" alt="Join Your Video Visit" value="Join Your Video Visit"> Join Your Video Visit </button>
    						</div>
    					</div>   					
    				</div>
    				 -->
    			</div>
    			<div id="lastContent">
    			<%	
    			
    				if ( promos != null)
    				{
    					for ( promo p : promos)
    					{
    						StringBuffer sb = new StringBuffer();
    						sb.append("<div class=\"landingTwoThird ");
    						sb.append(p.getId());
    						sb.append("\">");
    						//sb.append("<div  id=\"" + ip.getId() + "\" class=\"icon\" ></div>");
    						sb.append("<div style=\"margin-left:12px;\">");
    						sb.append("<h4>" + p.getHeader() + "</h4>");
    						sb.append("<p>" + p.getAbstractText() + "</p>");
    						sb.append("<div style=\"float:right; margin-right:2px;\">");
    						sb.append("<a href=\"" + p.getPromoHyperLink().getUrl()+"\">" + p.getPromoHyperLink().getTitle() + "&#62;</a>");
    						sb.append("</div></div></div>");
    						out.println(sb.toString());
    					}
    				}
    			%>
    			
    			<!-- 
    			    <div class="landingTwoThird leftNav">
    					<div style="margin-left:12px;">
    						<h4> Get Support </h3>
    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						<div style="float:right; margin-right:2px;">
    							<a> More &#62; </a>
    						</div>
    					</div>
    				</div>
    				
    				<div class="landingTwoThird centerNav">
    					<div style="margin-left:12px;">
    						<h4> Cancel and Reschedule </h3>
    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						<div style="float:right; margin-right:2px;">
    							<a> More &#62; </a>
    						</div>
    					</div>    					
    				</div>
    				
    				<div class="landingTwoThird rightNav">
    					<div style="margin-left:12px;">
    						<h4> How to Schedule a Video Visit </h3>
    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						<div style="float:right; margin-right:2px;">
    							<a> More &#62; </a>
    						</div>
    					</div>
    				</div>
    				 -->
    			</div>
    		</div>
    	</div>
    </div>