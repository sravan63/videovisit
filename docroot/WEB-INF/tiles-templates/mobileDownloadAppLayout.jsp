<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

    <!--Start Head-->
    <head>
        <title>
        	<tiles:getAsString name="title" />  
        </title>
        
        <meta charset="utf-8">
        <meta name="apple-itunes-app" content="497468339">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

		<link rel="stylesheet" href="css/site/global/mobile.css">
		<link rel="apple-touch-icon" href="images/vv-apple-touch-icon-72@2x.png">

		<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
		
		<noscript>
			<meta http-equiv="refresh" content="0; url=mobileenablejavascript.htm"></meta>
		</noscript>
    </head>
    <!--End Head-->

    <!--Start Body -->
	<body onorientationchange="">
	
		<tiles:insertAttribute name="gtm" />
    	
    	<div id="main-window" class="main-window">
			<div>
				<!--<div class="page-content">-->
					<tiles:insertAttribute name="content" />
				<!--</div>-->
			</div>
		</div>
</body>
</html>