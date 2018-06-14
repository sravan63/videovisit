<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

    <!--Start Head-->
    <head>
        <meta charset="utf-8">
        <!--[if IE]><![endif]-->
		<meta http-equiv="X-Frame-Options" content="deny">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title> <tiles:insertAttribute name="title" /> </title>
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

        <!--Start CSS-->
        <c:forEach var='item' items='${cssDependencies}'>
        <link rel="stylesheet" type="text/css" href="${item}" />
        </c:forEach>
        <!-- DE10221 start -->
 <!--        <link rel="stylesheet" type="text/css" href="css/site/global/base.css" /> -->
		<link rel="stylesheet" type="text/css" href="css/site/global/structure.css" />
<!-- 		<link rel="stylesheet" type="text/css" href="css/site/global/print.css" /> -->
		<!-- DE10221 End -->
        <!--End CSS-->

        <!--Start JavaScript-->
        <c:forEach var='item' items='${jsDependencies}'>
        <script src="${item}" type="text/javascript" charset="UTF-8"></script>
        </c:forEach>
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
			<div id="layover" style=" position: fixed; width:100%; height:100%; background-color:rgba(126, 126, 126, 0.5);  z-index: 1100; display:none;">                
            <div style="background: #A9A9A9 url(images/global/desktop_spinner.gif) no-repeat center center;width:100%;height:100%;z-index: 999;opacity: 0.5; filter: alpha(opacity=50);"></div>
       	</div>
        <!-- ============ BEGIN:  #container-primary ============ -->
        <div id="container-primary">

                <!-- ============ BEGIN:  #header ============ -->
                <tiles:insertAttribute name="header" />
                <!-- ============== END:  #header ============ -->

                <!-- ============ BEGIN:  #container-main ============ -->
                <div id="container-main">


                        <!-- ============ BEGIN:  #sidebar ============ -->
                        <tiles:insertAttribute name="sidebar" />
                        <!-- ============ END:  #sidebar ============== -->



                        <!-- ============ BEGIN: #block-main ============== -->
                        <div id="content-main">
							<div id="layover-content-main" style=" position: absolute; width:100%; height:100%; background-color:rgba(126, 126, 126, 0.5);  z-index: 1100; display:none;">                
					            <div style="background: #A9A9A9 url(images/global/desktop_spinner.gif) no-repeat center center;width:100%;height:100%;z-index: 999;opacity: 0.5; filter: alpha(opacity=50);"></div>
					       	</div>
                                <div class="header-inner"></div>


                                <!-- ============ BEGIN: #userInfo ============== -->
                                <tiles:insertAttribute name="userInfo" />
                                <!-- ============ END:  #userInfo ============== -->


                                <!-- Start Page Content -->
                                <tiles:insertAttribute name="content" />
                                <!-- End Page Content -->


                                <!-- ============ BEGIN:  #footer ============ -->
                                <tiles:insertAttribute name="footer" />
                                <!-- ============== END:  #footer ============ -->


                        </div>
                        <!-- ============ END:  #block-main ============== -->

                </div>
                <!-- ============== END:  #container-main ============ -->


        </div>
        <!-- ============== END:  #container-primary ============ -->

</body>
</html>

