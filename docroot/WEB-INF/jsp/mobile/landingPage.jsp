<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.context.*" %>
<%@ page import="org.kp.tpmg.ttg.webcare.videovisits.member.web.command.*" %>
<%@ page import="org.kp.tpmg.videovisit.webserviceobject.xsd.*" %>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix='fn' uri='http://java.sun.com/jsp/jstl/functions' %>


<%

	MeetingCommand.retrieveMeeting(request, response);
%>

<h1>Upcoming Video Visits</h1>


<c:if test="${WebAppContext.totalmeetings>0}">

</c:if>

<c:if test="${WebAppContext.totalmeetings <= 0}">

     <div id="landing-portal-none">
     <p>You have no video visits scheduled within the next 15 minutes.</p>
                    <p>Please check back again later.</p>
     </div>

</c:if>
