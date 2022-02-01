<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<!--Start Head-->

<head>
	<meta charset="utf-8">
	<!--[if IE]><![endif]-->

	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>
		<tiles:insertAttribute name="title" />
	</title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

        <!--Start Favicon-->
        <link rel="shortcut icon" href="images/favicon/favicon.ico">
        <link rel="apple-touch-icon" href="images/favicon/apple-touch-icon.png">
        <!--End Favicon-->
        
        <!-- Chrome Extension Link -->
        <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/mmedphfiemffkinodeemalghecnicmnh">

	<!--Start CSS-->
	<c:forEach var='item' items='${cssDependencies}'>
		<link rel="stylesheet" type="text/css" href="${item}" />
	</c:forEach>

	<link rel="stylesheet" type="text/css" href="css/library/conference/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/library/conference/elusive-webfont.css">
	<link rel="stylesheet" type="text/css" href="css/library/conference/bootstrap-notify.css">
	<!--[if lte IE 7]><script src="vidyoplayer/scripts/libs/lte-ie7.js"></script><![endif]-->
	<!-- Custom css -->
	<link rel="stylesheet" type="text/css" href="css/library/conference/vidyo-app.css">
	<link rel="stylesheet" type="text/css" href="css/library/conference/jNotify.jquery.css" media="screen" />
	<link rel="stylesheet/less" type="text/css" href="css/site/global/video-visit.less" />

	<style type="text/css">
		.btn {
			background-position: 0 0;
			border-radius: 0px;
		}

		.btn-group+.btn-group {
			margin-left: 0px;
		}

		.btn-group>.btn:first-child {
			border-radius: 0px;
		}

		.btn-warning {
			background-color: #CD0000;
			background-image: linear-gradient(to bottom, #CD0000, #CD0000);
		}

		.btn-warning:hover,
		.btn-warning:focus,
		.btn-warning:active,
		.btn-warning.active {
			background-position: 0 0;
		}

		.btn-group {
			height: auto;
			font-family: Avenir Next, sans-serif;
		}

		.btn-group .btn-large {
			padding-top: 3px;
			width: 80px;
			height: 60px;
			padding: 0px;
			border: 0;
			border-radius: 0px !important;
			background-color: transparent;
			background-repeat: no-repeat;
			box-shadow: none;
			border-bottom: 1px solid #6A6A6A;
		}

		.btn-group .btn-leaveEnd {
			margin-top: 3px;
			height: 33px;
			padding: 0px;
			border: 0;
			border-radius: 0px !important;
			background-color: transparent;
			background-repeat: no-repeat;
		}

		.btn-leave-meeting {
			background-image: url("images/conference/button_leave_return.png");
			background-position: 10px 0;
			width: 105px;
			border-right: 1px solid grey;
		}

		.btn-end-meeting {
			background-image: url("images/conference/button_end_mtg.png");
			background-position: 20px 1px;
			width: 105px;
			border-right: 1px solid grey;
		}

		.btn-local-share {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -125px;
		}

		.btn-hideDetails {
			background-image: url("images/conference/sprite.png");
			background-position: 0 8px;
		}

		.btn-config {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -67px;
		}

		.btn-tmv-success {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -400px;
			/*width: 60px;	*/
		}

		.btn-tmv-failure {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -455px;
		}

		.btn-tms-success {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -290px;
			/*width: 60px;	*/
		}

		.btn-tms-failure {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -345px;
		}

		.btn-tmm-success {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -180px;
			/*width: 60px;	*/
		}

		.btn-tmm-failure {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -235px;
		}

		.btn-tmc {
			background-image: url("images/conference/sprite.png");
			background-position: 5px -510px;
			border-bottom:
		}

		#inCallContainer {
			margin: 0;
			padding: 0px !important;
			border: 0px;
			background-color: #FFFFFF;
			width: auto !important;
		}

		#inCallPluginAndControlsWrap {
			width: auto !important;
			margin: 0;
			background-color: black;
		}

		#infoWrapper,
		#errorWrapper {
			background-color: #FFFFFF;
			border-radius: 0;
			border: 1px solid #A2A0A0;
		}

		#setupInstructions a.installbutton:hover {
			color: #FFFFFF;
			text-decoration: none;
		}

		.installbutton {
			padding: 4px 10px 3px 7px;
			background: none repeat scroll 0 0 #4D8993;
			color: #FFFFFF;
			font-size: 15px;
			font-family: Arial;
			font-weight: normal;
		}

		#patientTitle,
		#clinicianTitle {
			font-family: Avenir Next, sans-serif;
			color: #4A4A4A;
			line-height: 1em;
			margin-top: 41px;
			margin-left: 55px;
			margin-bottom: 10px;
			font-size: 35px;
		}

		.container-videovisit-header #patientTitle,
		.container-videovisit-header #clinicianTitle {
			color: #888888;
			margin: 10px 0;
			font-size: 24px;
		}

		.right-container {
			color: #006BA6;
			margin-top: 10px;
			margin-right: 10px;
			display: flex;
			justify-content: flex-end;
			font-size: 17px;
		}

		.right-container a {
			text-decoration: none;
		}

		.help {
			color: #006BA6;
			padding-right: 10px;
			border-right: 1px solid;
		}

		.refresh-button {
			padding-left: 10px;
			cursor: pointer;
		}

		#volume-control-speaker,
		#volume-control-mic {
			border: none;
			border-radius: 4px;
		}
	</style>
	<!--End CSS-->

	<!--Start JavaScript-->
	<c:forEach var='item' items='${jsDependencies}'>
		<script src="${item}" type="text/javascript"></script>
	</c:forEach>
	<!--End JavaScript-->

	<noscript>
		<meta http-equiv="refresh" content="0; url=enablejavascript.htm">
		</meta>
	</noscript>

</head>
<!--End Head-->

<!--Start Body -->
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->

<body style="padding:0;">
	<!--<![endif]-->

	<tiles:insertAttribute name="gtm" />
	<tiles:insertAttribute name="content" />

	<!-- Mandar A. US15318 - Start -->
	<div id="layover"
		style="position:fixed; top:0; width:100%; height:100%; background-color:rgba(126, 126, 126, 0.5); z-index:1100; display:none;">
		<div
			style="background:#A9A9A9 url(images/global/desktop_spinner.gif) no-repeat center center; width:100%; height:100%; z-index:999; opacity:0.5; filter:alpha(opacity=50);">
		</div>
	</div>
	<!-- Mandar A. US15318 - End -->

</body>

</html>