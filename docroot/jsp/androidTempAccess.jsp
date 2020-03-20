<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
</head>
<script type = "text/javascript">
            
            function Redirect(){
            	var url = "https://qa1.mydoctor.kaiserpermanente.org/videovisit/#/login";
            	window.open("googlechrome://navigate?url=" + url,"_system");
            }

            function blankRedirect(){
            	var url = "https://qa1.mydoctor.kaiserpermanente.org/videovisit/#/login";
            	window.open("googlechrome://navigate?url=" + url,"_blank");
            }

            function oldone(){
            	window.open('https://qa2.mydoctor.kaiserpermanente.org/videovisit#/login', '_blank');
            }

            
         
</script>
<body>
Hi Android...
<br>
<br>
Please click below button to launch REACT on browser
<br>
<br><br>
<button onclick="Redirect()">Click Me</button>
<button onclick="blankRedirect()">Blank Click Me</button>
<button onclick="oldone()">Oldone Click Me</button>
</body>
</html>


   