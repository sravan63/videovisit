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
    <!--End CSS-->

	<!--Start JavaScript-->
    <c:forEach var='item' items='${jsDependencies}'>
        <script src="${item}" type="text/javascript"></script>
    </c:forEach>
    <!--End JavaScript-->
        
	<noscript>
		<meta http-equiv="refresh" content="0; url=enablejavascript.htm"></meta>
	</noscript>
	
	<script type="text/javascript">
		var bb_mdo_sectionViewer_contentTitle =""  ; 
		var appContextPath = "/ncal/";
		document.documentElement.className += ' bb-mdo-loading';
			
		function clearText(element){		
			element.value = "";						
		}
	</script>
	
    </head>
    <!--End Head-->

    <!--Start Body -->
	<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
	<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
	<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
	<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
	<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->

	<tiles:insertAttribute name="gtm" />
	
        <!-- ============ BEGIN:  #container-wrap ============ -->
        <div id="container_wrap">
        	
        	<!-- ============ BEGIN:  #container ============ -->
			<div id="container">


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
                        

                                <!-- ============ BEGIN: #userInfo ============== -->
                                <tiles:insertAttribute name="userInfo" />
                                <!-- ============ END:  #userInfo ============== -->


                                <!-- Start Page Content -->
                                <tiles:insertAttribute name="content" />
                                <!-- End Page Content -->
                                

                        </div>
                        <!-- ============ END:  #block-main ============== -->

                </div>
                <!-- ============== END:  #container-main ============ -->

			</div>
			<!-- ============== END:  #container ============ -->

        </div>
        <!-- ============== END:  #container-wrap ============ -->
		
		
        <!-- ============ BEGIN:  #footer ============ -->
        <tiles:insertAttribute name="footer" />
        <!-- ============== END:  #footer ============ -->

</body>
</html>