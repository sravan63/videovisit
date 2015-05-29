<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

    <!--Start Head-->
    <head>
    	<!-- <meta charset="utf-8">	 -->
        <title>
        	<tiles:getAsString name="title" />
        </title>
        
        <meta name="apple-itunes-app" content="app-id=497468339">
        <meta name="google-play-app" content="app-id=org.kp.tpmg.preventivecare">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

		<link rel="stylesheet" type="text/css" href="css/library/plugin/smartbanner/jquery.smartbanner.css">
		<link rel="stylesheet" type="text/css" href="css/site/global/mobile.css">
		<link rel="apple-touch-icon" href="images/mobile/phone.png">

		<script type="text/javascript" src="js/library/jquery/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="js/library/plugin/smartbanner/jquery.smartbanner.js"></script>
		<noscript> <meta http-equiv="refresh" content="0; url=mobileenablejavascript.htm"></meta> </noscript>
    </head>
    <!--End Head-->

    <!--Start Body -->
	<body onorientationchange="">
	
		<tiles:insertAttribute name="gtm" />
    	
    	<div id="main-window" class="main-window">
			<!--<div class="page-content">-->
				<tiles:insertAttribute name="content" />
			<!--</div>-->
		</div>
		
		<script type="text/javascript">
			$(function() { $.smartbanner() } )
			
			$.smartbanner({
				title: 'KP Preventive Care',
				author: 'Kaiser Permanente',
				icon: null,
				url: null,
				button: 'OPEN',
				scale: 'auto',
				daysHidden: 0,
				daysReminder: 0,
				layer: false,
				appendToSelector: '#content-window'
			})
	    </script>
	</body>
</html>