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

	<!--Start Importing Open Sans Font-->
	<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,700" />
	<!--End Importing Open Sans Font-->

	<!-- Chrome Extension Link -->
	<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/mmedphfiemffkinodeemalghecnicmnh">

	<!--Start CSS-->
	<c:forEach var='item' items='${cssDependencies}'>
		<link rel="stylesheet" type="text/css" href="${item}" />
	</c:forEach>

	<link href="css/library/conference/bootstrap.min.css" rel="stylesheet">
	<link href="css/library/conference/elusive-webfont.css" rel="stylesheet">

	<!--[if lte IE 7]><script src="vidyoplayer/scripts/libs/lte-ie7.js"></script><![endif]-->
	<!-- Custom css -->
	<link rel="stylesheet" href="css/library/conference/vidyo-app.css">

	<style type="text/css">
		/*body{
		        	background-color: #F6F6E8;
		        }*/	        
		        table td{
		        	border-bottom: none;
		        	padding: 0;
		        }
		        /*.button {
		            padding: 4px 10px 3px 7px;
		            background: none repeat scroll 0 0 #4D8993;
		            color: #FFFFFF;
		            font-size: 15px;
		            font-family: Arial;     
		        }	*/
		#setupInstructions {
			float: none;
			margin-bottom: 0;
		}

		#setupInstructions .button {
			font-weight: normal;
		}

		#setupInstructions a.button:hover {
			color: #FFFFFF;
			text-decoration: none;
		}
	</style>

	<!--End CSS-->

	<!--Start JavaScript-->
	<c:forEach var='item' items='${jsDependencies}'>
		<script src="${item}" type="text/javascript"></script>
	</c:forEach>

	<noscript>
		<meta http-equiv="refresh" content="0; url=enablejavascript.htm">
		</meta>
	</noscript>

	<script type="text/javascript">
		var bb_mdo_sectionViewer_contentTitle = "";
		var appContextPath = "/ncal/";
		document.documentElement.className += ' bb-mdo-loading';

		function clearText(element) {
			element.value = "";
		}
	</script>
	<!--End JavaScript-->
</head>
<!--End Head-->

    <!--Start Body -->
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->

<body>
	<!--<![endif]-->

	<tiles:insertAttribute name="gtm" />

        <!-- ============ BEGIN:  #Container-primary ============ -->
        <div id="setupContainer-primary">
        

                <!-- ============ BEGIN:  #header ============ -->
                <tiles:insertAttribute name="header" />
                <!-- ============== END:  #header ============ -->

                <!-- ============ BEGIN:  #Container-main ============ -->
                <div id="setupContainer-main">


                        <!-- ============ BEGIN: #block-main ============== -->
                        <div id="setupContent-main">


                                <!-- Start Page Content -->
                                <tiles:insertAttribute name="content" />
                                <!-- End Page Content -->

                        </div>
                        <!-- ============ END:  #block-main ============== -->
                        

                </div>
                <!-- ============== END:  #container-main ============ -->


        </div>
        <!-- ============== END:  #container-primary ============ -->


</body>
</html>
