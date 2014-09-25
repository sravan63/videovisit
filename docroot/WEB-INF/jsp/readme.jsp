<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.io.*"%>
<%@ page import="javax.servlet.http.*"%>
<br><br>
<%
	String fileName="readme.txt";
	FileReader inputFile = null;
	BufferedReader bufferReader = null;
    try{
    	String filePath = request.getSession().getServletContext().getRealPath(fileName);
    	
	    //Create object of FileReader
	    inputFile = new FileReader(filePath);
	
	    //Instantiate the BufferedReader Class
	    bufferReader = new BufferedReader(inputFile);
	
	    //Variable to hold the one line data
	    String line;
	
	    // Read file line by line and print on the console
	    while ((line = bufferReader.readLine()) != null)   {%>
	        <%=line%>
		  	<br>
	   <% }	   
    }catch(Exception e){
            System.out.println("Error while reading file line by line:" 
            + e.getMessage());                      
    }finally{
    	try{
    		//Close the readers
    		if(bufferReader != null){ 
    			bufferReader.close();
     	    }
    	    
    	    if(inputFile != null){ 
    	    	inputFile.close();
    	    }
    	}catch(Exception e){
    		System.out.println("Error while closing the readers:" 
    	            + e.getMessage());          
    	}
    }

%>
