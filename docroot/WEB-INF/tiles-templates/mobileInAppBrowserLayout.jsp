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
        
        <!-- <meta name="apple-itunes-app" content="app-id=497468339">	 -->
        <meta name="google-play-app" content="app-id=org.kp.tpmg.preventivecare">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

		<link rel="stylesheet" type="text/css" href="css/library/plugin/smartbanner/jquery.smartbanner.css">
		<link rel="stylesheet" type="text/css" href="css/site/global/mobile.css">
		<link rel="apple-touch-icon" href="images/mobile/kppc_icon.png">
		
		<!--Start Importing Open Sans Font-->
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,700" />
        <!--End Importing Open Sans Font-->

		<script type="text/javascript" src="js/library/jquery/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="js/library/plugin/smartbanner/jquery.smartbanner.js"></script>
		<script type="text/javascript" src="js/site/mobile/mobile-web.js"></script>
		<script type="text/javascript" src="js/site/validation/validate.js"></script>
		<script type="text/javascript" src="js/site/global/dateExtensions_loader.js"></script>
		
		<noscript>
			<meta http-equiv="refresh" content="0; url=mobileenablejavascript.htm"></meta>
		</noscript>
    </head>
    <!--End Head-->

    <!--Start Body -->
	<body onorientationchange="">
	
		<tiles:insertAttribute name="gtm" />
		
		<!--  Code for Spinner Animation -->
			<style type='text/css'>@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4s;animation-delay: -0.4s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.3s;animation-delay: -0.3s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.2s;animation-delay: -0.2s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.09999999999999998s;animation-delay: -0.09999999999999998s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.09999999999999998s;animation-delay: 0.09999999999999998s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.19999999999999996s;animation-delay: 0.19999999999999996s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.30000000000000004s;animation-delay: 0.30000000000000004s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.4s;animation-delay: 0.4s;}.uil-default-css { position: relative;background:none;width: 450px;height: 700px;}</style>
			<input type="hidden" id="inAppBrowserFlag" value='<%=request.getParameter("inAppBrowserFlag")%>' />
			<div id="layover" style=" position: fixed; width:100%; height:100%;	background-color:rgba(126, 126, 126, 0.5);	z-index: 10;display:none">
				<div class='uil-default-css' style='-webkit-transform:scale(0.28)'><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(0deg) translate(0,-50px);transform:rotate(0deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(36deg) translate(0,-50px);transform:rotate(36deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(72deg) translate(0,-50px);transform:rotate(72deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(108deg) translate(0,-50px);transform:rotate(108deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(144deg) translate(0,-50px);transform:rotate(144deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(180deg) translate(0,-50px);transform:rotate(180deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(216deg) translate(0,-50px);transform:rotate(216deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(252deg) translate(0,-50px);transform:rotate(252deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(288deg) translate(0,-50px);transform:rotate(288deg) translate(0,-50px);border-radius:10px;position:absolute;'></div><div style='top:83px;left:93px;width:14px;height:34px;background:#706259;-webkit-transform:rotate(324deg) translate(0,-50px);transform:rotate(324deg) translate(0,-50px);border-radius:10px;position:absolute;'></div></div>
			</div>
		<!-- End of code for Spinner Animation -->
    	
    	<div id="main-window" class="main-window" style="position:relative;">
			<!--<div class="page-content">-->
				<tiles:insertAttribute name="content" />
			<!--</div>-->
		</div>
	</body>
</html>
