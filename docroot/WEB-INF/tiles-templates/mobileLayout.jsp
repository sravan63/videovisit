<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

    <!--Start Head-->
    <head>
        <meta charset="utf-8">
        <title>
        	<tiles:getAsString name="title" />  
        </title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

		<!-- 
		<script src="js/library/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
        <script src="js/library/jquery/jquery-ui-1.8.2.custom.min.js" type="text/javascript"></script>
       	 -->
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script src="js/site/mobile/global.js"></script>

		<link rel="stylesheet" href="css/site/global/mobile-reset.min.css">
		<link rel="stylesheet" href="css/site/global/mobile-global.css">
		<link rel="stylesheet" href="css/site/global/mobile-web.css">
       
       
       	<link rel="shortcut icon" href="ico/favicon.ico">
		<link rel="apple-touch-icon" href="images/vv-apple-touch-icon-72@2x.png">

    </head>
    <!--End Head-->

    <!--Start Body -->
	<body>
    	
    	<div id="main-window" class="main-window profile">
    		<!--  TODO - What is this used for ? -->
			<div class="scrollup"> <!--  button that scrolls to top  --> </div>
		
			<tiles:insertAttribute name="header" />
			
			<div class="page-content-wrapper welcome-page">
				<div class="page-content">
					<tiles:insertAttribute name="sidebar" />
					<tiles:insertAttribute name="content" />
				</div>
			</div>
			<tiles:insertAttribute name="footer" />
		</div>
      
       

</body>
</html>

