<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faqitem"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.hyperlink"%>
<%@ page import="java.util.*"%>
 <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />

<script>
$(document).ready(function() {
	  var myArr = [];
	 
	$("#faq").click(function() {
	  	this.value = '';
	});  

	$(".scrollup").click(scrollMe);
	// Shows and hides scroll to top button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 320) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});
	// scrolls to top for anchor page states on load
	/* scrollMe(); */

	// Remove the image title's
	$("img").removeAttr("title");	
});	

function scrollMe(){
	$('html, body').animate({scrollTop:0}, 'slow');
	return false;
}

</script>
<%
	faq f = WebAppContext.getWebAppContext(request).getFaq();

%>
	
    <div class="videoVisitContainer">
     	
    	<div class="scrollup"></div>
    	
    	<div id="videoVisitHelpPageContents">
    		<div id="helpPageTitle">
    		<%
    			if ( f != null && f.getFaqListTitle() != null )
    			{
    		%>
    				<h2> <%=f.getFaqListTitle() %> </h2>
    		<%
    			}
    		%>
    		</div>
    		
    		<div id="helpMainContents">
    			<div id="helpNavContents">
    			<%
    				 StringBuffer left = new StringBuffer();
    				 StringBuffer right = new StringBuffer();
    				 left.append("<div class=\"landingHalf leftNavContent\">");
    				 right.append("<div class=\"landingHalf rightNavContent\">");
    				 if ( f != null && (f.getFaqItems() != null && f.getFaqItems().size() > 0))
    				 {
    					 int leftcount = 0;
    					 int rightcount = 0;
    					 int count = 0;
    					
    					 for ( faqitem fi : f.getFaqItems() )
    					 {
    						 String orientation = fi.getOrientation();
    						 if ( orientation.equalsIgnoreCase("left") )
    						 {
    							 if ( leftcount == 0 )
    							 {
    								 left.append("<div class=\"innerNav\">"); 
    							 }
    							 else
    								 left.append("<div class=\"innerNav\" style=\"margin-top: 23px;\">");
    							 
    							 left.append("<h4>" + fi.getHeader() + "</h4>");
    							 left.append("<ul>");
    							 for ( hyperlink h : fi.getFaqHyperLinks())
    							 {
    								 String section = h.getSection();
    								 left.append("<li> <a href=\"#" + section + "\"> " + h.getTitle() + " </a> </li>");
    							 }
    							 left.append("</ul>");
    							 left.append("</div>");
    							 leftcount ++;
    						 }
    						 else
    						 {
    							 if ( rightcount == 0)
    								 right.append("<div class=\"innerNav\">");
    							 else
    								 right.append("<div class=\"innerNav\" style=\"margin-top: 23px;\">");
    							 
    							 right.append("<h4>" + fi.getHeader() + "</h4>");
    							 right.append("<ul>");
    							 for ( hyperlink h : fi.getFaqHyperLinks())
    							 {
    								 String section = h.getSection();
    								 right.append("<li> <a href=\"#" + section + "\"> " + h.getTitle() + " </a> </li>");
    							 }
    							 right.append("</ul>");
    							 right.append("</div>");
    							 rightcount ++;
    						 }
    						 
    						 count ++;
    					 }
    					 left.append("</div>");
    					 right.append("</div>");
    				 }
    				 
    				 out.println(left.toString());
    				 out.println(right.toString());
    			%>
    			
    			<!-- 
    				<div class="landingHalf leftNavContent">
    					<div class="innerNav">
    						<h4> Learn About Video Visits </h4>
    						<ul>
    							<li> <a href="#leftNavLinkA"> What is a Video Visit? </a> </li>
    							<li> <a href="#leftNavLinkB"> Do I have the right equipment for a visit? </a> </li>
    							<li> <a href="#leftNavLinkC"> How do I prepare for a visit? </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Scheduling a Video Visit </h4>
    						<ul>
    							<li> <a href="#leftNavLinkD"> How do I schedule a Video Visit? </a> </li>
    							<li> <a href="#leftNavLinkE"> How do I cancel or reschedule a Video Visit? </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Joining a Video Visit </h4>
    						<ul>
    							<li> <a href="#leftNavLinkF"> How do I join a Video Visit? </a> </li>
    							<li> <a href="#leftNavLinkG"> I'm having trouble signing on. </a> </li>
    							<li> <a href="#leftNavLinkH"> What is my Medical Record Number? </a> </li>
    							<li> <a href="#leftNavLinkI"> I see an error message. </a> </li>
    							<li> <a href="#leftNavLinkJ"> I need to unblock cookies. </a> </li>
    						</ul>
    					</div>
    				</div>
    				<div class="landingHalf rightNavContent">
    					<div class="innerNav">
    						<h4> Video Troubleshooting </h4>
    						<ul>
    							<li> <a href="#rightNavLinkA"> My Video is choppy. </a> </li>
    							<li> <a href="#rightNavLinkB"> My Video is slow. </a> </li>
    							<li> <a href="#rightNavLinkC"> I can't download Adobe Flash. </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Video Troubleshooting </h4>
    						<ul type="disc">
    							<li> <a href="#rightNavLinkD"> Lorem Ipsum dol. </a> </li>
    							<li> <a href="#rightNavLinkE"> Consectetur adipisicing elit. </a> </li>
    							<li> <a href="#rightNavLinkF"> Sed do eiusmod tempor. </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Connection Problems </h4>
    						<ul type="disc">
    							<li> <a href="#rightNavLinkG"> Lorem Ipsum dol. </a> </li>
    							<li> <a href="#rightNavLinkH"> Consectetur adipisicing elit. </a> </li>
    							<li> <a href="#rightNavLinkI"> Sed do eiusmod tempor. </a> </li>
    						</ul>
    					</div>			
    				</div>
    			</div>
    		 -->
    			<div id="helpLastContents">
    				<div>
    					<%
    					if ( f != null && (f.getFaqItems() != null && f.getFaqItems().size() > 0))
       				 	{
    						for ( faqitem fi :f.getFaqItems())
    						{
    							StringBuffer details = new StringBuffer();
    							details.append("<div>");
    							details.append("<h4>" + fi.getHeader() + "</h4>");
    							details.append("<div style=\"margin-top: 20px;\">");
    							for ( hyperlink h : fi.getFaqHyperLinks())
    							{
    								details.append("<p id= \"" + h.getSection() + "\" class=\"subHead\">" + h.getTitle() + "</p>");
    								details.append("<p>" + h.getAbstractText() + "</p>");
    							}
    							details.append("</div>");
    							details.append("</div>");
    							out.println(details.toString());
    						}
       				 	}
    					%>
    					<!-- 
    				<div>
    			    	<div>
    						<h4> Learn About Video Visits</h4>
    						<div style="margin-top: 20px;">
    							<p id="leftNavLinkA" class="subHead"> What is Video Visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
	    						
    							<p id="leftNavLinkB" class="subHead"> Do I have the right equipment for the Visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
	    						<p id="leftNavLinkC" class="subHead"> How do I prepare for a visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>
    				
    			    	<div style="margin-top: 25px;">
    						<h4> Scheduling a Video Visit </h4>
    						<div style="margin-top: 20px;">
    							<p id="leftNavLinkD" class="subHead">  How do I schedule a Video Visit? </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							
    							<p id="leftNavLinkE" class="subHead"> How do I cancel or reschedule a Video Visit? </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>					
    						</div>
    					</div>
    					
    			    	<div style="margin-top: 25px;">
    						<h4> Joining a Video Visit </h4>
    						<div style="margin-top: 20px;">
    							<p id="leftNavLinkF" class="subHead"> How do I join a Video Visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
	    						
    							<p id="leftNavLinkG" class="subHead"> I'm having trouble signing on. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
	    						<p id="leftNavLinkH" class="subHead"> What is my Medical Record Number? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
	    						<p id="leftNavLinkI" class="subHead"> I see an error message. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
	    						<p id="leftNavLinkJ" class="subHead"> I need to unblock cookies. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						</div>
    					</div>
    				</div>
    				
    				<div>
    			    	<div>
    						<h4> Video Troubleshooting </h4>
    						<div style="margin-top: 20px;">
    							<p id="rightNavLinkA" class="subHead"> My Video is choppy. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							
    							<p id="rightNavLinkB" class="subHead"> My Video is slow. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
    							<p id="rightNavLinkC" class="subHead"> I can't download Adobe Flash. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>
    			    	<div style="margin-top: 25px;">
    						<h4> Audio Troubleshooting </h4>
    						<div style="margin-top: 20px;">
    							<p id="rightNavLinkD" class="subHead"> Lorem Ipsum dol. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							
    							<p id="rightNavLinkE" class="subHead"> Consectetur adipisicing elit. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
    							<p id="rightNavLinkF" class="subHead"> Sed do eiusmod tempor. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>
    			    	<div style="margin-top: 25px;">
    						<h4> Connection Problems </h4>
    						<div style="margin-top: 20px;">
    							<p id="rightNavLinkG" class="subHead"> Lorem Ipsum dol. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							
    							<p id="rightNavLinkH" class="subHead"> Consectetur adipisicing elit. </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
    							<p id="rightNavLinkI" class="subHead"> Sed do eiusmod tempor. </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>    					    					
    				</div>
    					 -->
    				</div>    				
    			</div>
    		</div>
    	</div>	
    </div>
</div>
