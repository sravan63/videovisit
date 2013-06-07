<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faq"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.faqitem"%>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.parser.hyperlink"%>
<%@ page import="java.util.*"%>
<%
	faq f = WebAppContext.getWebAppContext(request).getFaq();
%>
    <div class="videoVisitContainer">
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
    						 if ( count % 2  == 0 )
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
    								 left.append("<li> <a href=\"#\"> " + h.getTitle() + " </a> </li>");
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
    								 right.append("<li> <a href=\"#\"> " + h.getTitle() + " </a> </li>");
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
    							<li> <a href="#"> What is a Video Visit? </a> </li>
    							<li> <a href="#"> Do I have the right equipment for a visit? </a> </li>
    							<li> <a href="#"> How do I prepare for a visit? </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Scheduling a Video Visit </h4>
    						<ul>
    							<li> <a href="#"> How do I schedule a Video Visit? </a> </li>
    							<li> <a href="#"> How do I cancel or reschedule a Video Visit? </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Joining a Video Visit </h4>
    						<ul>
    							<li> <a href="#"> How do I join a Video Visit? </a> </li>
    							<li> <a href="#"> I'm having trouble signing on. </a> </li>
    							<li> <a href="#"> What is my Medical Record Number? </a> </li>
    							<li> <a href="#"> I see an error message. </a> </li>
    							<li> <a href="#"> I need to unblock cookies. </a> </li>
    						</ul>
    					</div>
    				</div>
    				<div class="landingHalf rightNavContent">
    					<div class="innerNav">
    						<h4> Video Troubleshooting </h4>
    						<ul>
    							<li> <a href="#"> My Video is choppy. </a> </li>
    							<li> <a href="#"> My Video is slow. </a> </li>
    							<li> <a href="#"> I can't download Adobe Flash. </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Video Troubleshooting </h4>
    						<ul type="disc">
    							<li> <a href="#"> Lorem Ipsum dol. </a> </li>
    							<li> <a href="#"> Consectetur adipisicing elit. </a> </li>
    							<li> <a href="#"> Sed do eiusmod tempor. </a> </li>
    						</ul>
    					</div>
    					<div class="innerNav" style="margin-top: 23px;">
    						<h4> Connection Problems </h4>
    						<ul type="disc">
    							<li> <a href="#"> Lorem Ipsum dol. </a> </li>
    							<li> <a href="#"> Consectetur adipisicing elit. </a> </li>
    							<li> <a href="#"> Sed do eiusmod tempor. </a> </li>
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
    								details.append("<p class=\"subHead\">" + h.getTitle() + "</p>");
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
    						<h4> Learn About Video Visits</h4>
    						<div style="margin-top: 20px;">
    							<p class="subHead"> What is Video Visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
	    						
    							<p class="subHead"> Do I have the right equipment for the Visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
	    						<p class="subHead"> How do I prepare for a visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>
    				
    			    	<div style="margin-top: 25px;">
    						<h4> Learn About Video Visits</h4>
    						<div style="margin-top: 20px;">
    							<p class="subHead"> What is Video Visit? </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    							
    							<p class="subHead"> Do I have the right equipment for the Visit? </p>
	    						<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
    						
    							<p class="subHead"> How do I prepare for a visit? </p>
    							<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> 						
    						</div>
    					</div>
    					 -->
    				</div>    				
    			</div>
    		</div>
    	</div>	
    </div>