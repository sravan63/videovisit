<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <!--Start Head-->
    <head>
        <meta charset="utf-8">
        <!--[if IE]><![endif]-->

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title> <tiles:insertAttribute name="title" /> </title>
        <meta name="description" content="">
        <meta name="author" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

        <!--Start Favicon-->
        <link rel="shortcut icon" href="images/favicon/favicon.ico">
        <link rel="apple-touch-icon" href="images/favicon/apple-touch-icon.png">
        <!--End Favicon-->

        <!--Start CSS-->
	      	<c:forEach var='item' items='${cssDependencies}'>
	        	<link rel="stylesheet" type="text/css" href="${item}" />
	        </c:forEach>
        
	        <link rel="stylesheet" type="text/css" href="vidyoplayer/css/bootstrap.min.css">
		    <link rel="stylesheet" type="text/css" href="vidyoplayer/css/elusive-webfont.css">
		    <link rel="stylesheet" type="text/css" href="vidyoplayer/css/bootstrap-notify.css">
		    <!--[if lte IE 7]><script src="vidyoplayer/scripts/libs/lte-ie7.js"></script><![endif]-->
		    <!-- Custom css -->
		    <link rel="stylesheet" type="text/css" href="vidyoplayer/css/vidyo-app.css">
			<link rel="stylesheet" type="text/css" href="vidyoplayer/css/jNotify.jquery.css" media="screen" />
			
			<style type="text/css">
		        .btn{
		            background-position: 0 0;
		            border-radius: 0px;
		        }
				.btn-group + .btn-group{
					margin-left: 0px;
				}
				.btn-group > .btn:first-child{
					border-radius: 0px;
				}
				.btn-warning {
					background-color: #CD0000;
					background-image: linear-gradient(to bottom, #CD0000, #CD0000);
				}
				.btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning.active{
		 			background-position: 0 0;
				}
		        .btn-group{
		            height: 40px;
		        }
				.btn-group .btn-large{
		            margin-top: 3px;
		            width: 65px;
		            height: 33px;
		            padding: 0px;
		            border: 0;
		            border-radius: 0px !important;
		            background-color: transparent;
		            background-repeat: no-repeat;
				}
		
		        .btn-group .btn-leaveEnd{
		            margin-top: 3px;
		            height: 33px;
		            padding: 0px;
		            border: 0;
		            border-radius: 0px !important;
		            background-color: transparent;
		            background-repeat: no-repeat;
		        }
		
		        .btn-leave-meeting{
		            border-right: 1px solid grey;
		        }
		        .btn-end-meeting{
		            background-image: url("vidyoplayer/img/button_end_mtg.png");
		            width: 95px;
		            border-right: 1px solid grey;
		        }
		
		        .btn-local-share{
		            background-image: url("vidyoplayer/img/screenshare.png");
		            background-position: 5px;
		        }
		        .btn-config{
		            background-image: url("vidyoplayer/img/settings.png");
		        }
		
		        .btn-tmv-success{
		            background-image: url("vidyoplayer/img/video_on_off.png");
		            width: 60px;
		        }
		        .btn-tmv-failure{
		            background-image: url("vidyoplayer/img/video_on_off.png");
		            background-position: 0 -30px;
		        }
		
		        .btn-tms-success{
		            background-image: url("vidyoplayer/img/speaker_on_off.png");
		            width: 60px;
		        }
		        .btn-tms-failure{
		            background-image: url("vidyoplayer/img/speaker_on_off.png");
		            background-position: 0 -30px;
		        }
		
		        .btn-tmm-success{
		            background-image: url("vidyoplayer/img/mic_on_off.png");
		            width: 60px;
		        }
		        .btn-tmm-failure{
		            background-image: url("vidyoplayer/img/mic_on_off.png");
		            background-position: 0 -30px;
		        }
		
		        #inCallContainer{
		            margin: 0;
		            padding: 0px !important;
		            border: 0px;
		            background-color: #FFFFFF;
		            width: auto !important;
		        }
		        #inCallPluginAndControlsWrap{
		            width: auto !important;
		            margin: 0;
		            float: left;
		        }
		        #pluginWrap{
		            /*float: left;*/
		        }
		        #btnContainer{
		            /*float: left;*/
		        }
		        #configurationWrap{
		            width: 150px;
		        }
		        #configurationWrap, #inCallLocalShareList{
		            position: absolute;
		            right: 0;
		            left: auto;
		        }
				#infoWrapper, #errorWrapper{
					background-color: #FFFFFF;
				}
		
		        #setupInstructions a.installbutton:hover{
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
			</style>
        <!--End CSS-->

        <!--Start JavaScript-->
	       	<c:forEach var='item' items='${jsDependencies}'>
	        	<script src="${item}" type="text/javascript"></script>
	        </c:forEach>
	        
	        <script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>
	        
			<!--  <script src="environment/path.js" type="text/javascript"></script> -->
	
			<script type="text/javascript" src="vidyoplayer/scripts/libs/jnotify/jquery.js"></script>
			<script type="text/javascript" src="vidyoplayer/scripts/libs/jnotify/jNotify.jquery.js"></script>
        <!--End JavaScript-->
        
        <noscript>
			<meta http-equiv="refresh" content="0; url=enablejavascript.htm"></meta>
		</noscript>

    </head>
    <!--End Head-->

    <!--Start Body -->
	<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
	<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
	<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
	<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
	<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->
	
	    <tiles:insertAttribute name="gtm" />
		<tiles:insertAttribute name="content" />
		
	</body>
	
</html>

