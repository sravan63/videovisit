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

       
        
        <noscript>
			<meta http-equiv="refresh" content="0; url=enablejavascript.htm"></meta>
		</noscript>

		<script type="text/javascript">
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	</script>
	<script type="text/javascript">
	try {
		var pageTracker = _gat._getTracker("UA-9446919-1");
		pageTracker._setLocalGifPath("/ncal/Images/__utm.gif");
		pageTracker._setLocalRemoteServerMode();
        //pageTracker._setDomainName(".mydoctor.kaiserpermanente.org");
		//pageTracker._trackPageview();
		
		
	} catch(err) {}</script>
	
	<script type="text/javascript">
	var bb_mdo_sectionViewer_contentTitle =""  ; 
	var appContextPath = "/ncal/";
	document.documentElement.className += ' bb-mdo-loading';
		
	function clearText(element){		
		element.value = "";						
	}		
	</script>
	
	
	
	<link rel="stylesheet" href="http://mydoctor.kaiserpermanente.org/ncal/static_includes/css/mdo/jquery-ui-1.8.2.custom.css" type="text/css" media="screen" title="no title" charset="utf-8" />
	<link rel="stylesheet" href="css/site/mdo/styles.css" type="text/css" media="screen" charset="utf-8"/>
	<!--[if IE]>
	<link rel="stylesheet" type="text/css" href="http://mydoctor.kaiserpermanente.org/ncal/static_includes/css/mdo/iestyles.css" media="screen" charset="utf-8" />
	<![endif]-->
    <link rel="stylesheet" href="http://mydoctor.kaiserpermanente.org/ncal/static_includes/css/mdo/jquery-mdo.css" type="text/css" media="screen" charset="utf-8"/>
    <link rel="stylesheet" href="http://mydoctor.kaiserpermanente.org/ncal/static_includes/css/mdo/new_styles.css" type="text/css" media="screen" charset="utf-8"/> 
	<link rel="stylesheet" href="css/site/mdo/print.css" type="text/css" media="print" charset="utf-8"/> 
	
	<link rel="stylesheet" href="css/site/mdo/vv_styles.css" type="text/css" media="screen" charset="utf-8"/>

	<script type="text/javascript"  src="http://mydoctor.kaiserpermanente.org/ncal/static_includes/js/common/jquery/jquery-1.4.4.min.js"></script> 
	<script type="text/javascript"  src="http://mydoctor.kaiserpermanente.org/ncal/static_includes/js/common/jquery/jquery-ui-1.8.7.min.js"></script>
	
	<!--script type="text/javascript"  src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/jquery-ui.min.js"></script-->
	
	<script type="text/javascript"  src="http://mydoctor.kaiserpermanente.org/ncal/static_includes/js/common/jquery/jquery.address-1.2.2.min.js?strict=false"></script> 
	<script type="text/javascript"  src="http://mydoctor.kaiserpermanente.org/ncal/static_includes/js/common/jquery/jq-plugins-v1.min.js"></script>
  	
 	 
  	   <script type="text/javascript"  src="http://mydoctor.kaiserpermanente.org/ncal/static_includes/js/mdo/jq/mdo-jquery-v1.min.js"></script>  
    </head>
    <!--End Head-->

    <!--Start Body -->
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->

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

