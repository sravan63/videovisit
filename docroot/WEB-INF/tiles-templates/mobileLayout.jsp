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

        <script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
        <script src="js/site/global/dateExtensions_loader.js" type="text/javascript"></script>
        <script src="js/site/validation/validate.js" type="text/javascript"></script>
        <script src="js/site/mobile/mobile-web.js" type="text/javascript"></script>

		<link rel="stylesheet" href="css/site/global/mobile.css">
		<link rel="apple-touch-icon" href="images/vv-apple-touch-icon-72@2x.png">

		 <noscript>
			<meta http-equiv="refresh" content="0; url=mobileenablejavascript.htm"></meta>
		</noscript>

    </head>
    <!--End Head-->

    <!--Start Body -->
	<body onorientationchange="">
    	
    	<div id="main-window" class="main-window">
    		<!--  TODO - What is this used for ? -->
			<!-- <div class="scrollup"> </div> --> <!--  button that scrolls to top  -->
		
			<tiles:insertAttribute name="header" />
			
			<div class="">
				<!--<div class="page-content">-->
					<tiles:insertAttribute name="sidebar" />
					<tiles:insertAttribute name="content" />
				<!--</div>-->
			</div>
			<tiles:insertAttribute name="footer" />
		</div>
      
       

</body>
</html>

