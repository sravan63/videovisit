<%@page import="java.util.ResourceBundle"%>
<% 
                                ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
                            	String setupUrl = rbInfo.getString("MEGA_MEETING_SETUP_URL");
 %>

<div id="videoVisitSetupContainer">
    <div class="videoVisitContainer">
    	<div id="videoVisitSetupPageContents">
    		<div id="setupPageTitle">
   				<h2> Video Visit Preparation </h2>
   				<h3> Check your system and your environment. </h3>
			</div>
			<div id="helpButtonContent" class="buttons">
				<a href="mdohelp.htm" class="button" target="_blank"> Get Help </a>
			</div>			
			<div id="setupMainContents">
				<iframe src="<%=setupUrl%>" width="725" height="507" frameborder="0" scrolling="no">
					Video Audio Setup Wizard
				</iframe>
			</div>
			<div id="setupLastNav" class="buttons">
				<a href="login.htm" class="button"> Join Your Video Visit </a>
			</div>
		</div>
	</div>
</div>