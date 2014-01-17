<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <!--Start Head-->
    <head>
        <meta charset="utf-8">
        <!--[if IE]><![endif]-->

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="author" content="">
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">

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
        
        <!--Start JavaScript-->
        <script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
        
        <script src="js/library/jquery/jquery-ui/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script>
        
        <script src="js/site/videovisit/videoVisit.js" type="text/javascript"></script>
        
<!--         <script src="environment/path.js" type="text/javascript"></script> -->
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
<!--[if (gt IE 9)|!(IE)]><!-->
 <body> 
 <!--<![endif]-->
    <tiles:insertAttribute name="gtm" />
	<tiles:insertAttribute name="content" />
	
</body>
</html>

