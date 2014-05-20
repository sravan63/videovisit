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
		    
			<link href="vidyoplayer/css/bootstrap.min.css" rel="stylesheet">
		    <link href="vidyoplayer/css/elusive-webfont.css" rel="stylesheet">
		
		    <!--[if lte IE 7]><script src="vidyoplayer/scripts/libs/lte-ie7.js"></script><![endif]-->
		    <!-- Custom css -->
		    <link rel="stylesheet" href="vidyoplayer/css/vidyo-app.css">
		
		    <style type="text/css">       
		        body{
		        	background-color: #F6F6E8;
		        }		        
		        table td{
		        	border-bottom: none;
		        	padding: 0;
		        }
		        .button {
		            padding: 4px 10px 3px 7px;
		            background: none repeat scroll 0 0 #4D8993;
		            color: #FFFFFF;
		            font-size: 15px;
		            font-family: Arial;     
		        }				
				#setupInstructions{
					float:none;
					margin-bottom: 0;
				}
		        #setupInstructions .button{
		            font-weight: normal;
		        }
		        #setupInstructions a.button:hover{
		            color: #FFFFFF;
		            text-decoration: none;
		        }
		        #displayDevices{
		            padding: 10px 35px;
		            border: 1px solid #E9E9E9;
		            color: #666666;
		            font-size: 15px;
		            /*font-family: 'Avenir Next';*/
		        }
		        #displayDevices h3{
		            color: #666666;
		            margin-bottom: 10px;
		            font-size: 17.5px;
		            font-weight: normal;
		        }
		        #displayDevices table{
		            font-size: 15px;
		            margin: 0;
		        }
		        #displayDevices table th{
		            border: none;
		            font-size: 15px;
		            font-weight: bold;
		            padding-left: 0;
		            text-align: left;
		        }
		        #displayDevices table tr{
		            border: none;
		            font-size: 15px;
		        }
		        #displayDevices table td{
		            border: none;
		            font-size: 15px;
		            vertical-align: middle;
		            padding: 0;
		        }
		        #displayDevices .threeColumns{
		            width: 29%;
		            float: left;
		            border-right: 1px solid #CCCCCC;
		            height: auto;
		            border-left: none;
		            padding: 0 5px;
		            margin: 0 5px 20px;
		        }
		    </style>
	   
	    <!--End CSS-->
	
		<!--Start JavaScript-->
		    <c:forEach var='item' items='${jsDependencies}'>
		        <script src="${item}" type="text/javascript"></script>
		    </c:forEach>
		 
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
		<!--End JavaScript-->
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

                        <!-- ============ BEGIN: #block-main ============== -->
                        <div id="content-main">

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

</body>
</html>