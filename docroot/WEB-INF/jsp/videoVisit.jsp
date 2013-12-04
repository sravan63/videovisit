	<%-- <c:forEach var="meeting" items="${WebAppContext.meetings}"> --%>
		
		<%-- <c:if test="${meeting.meetingId == WebAppContext.videoVisit.meetingId}"> --%>	
			<div style="float:left">
				<h3 class="page-title">Video Visit with ${WebAppContext.videoVisit.hostFirstName} 
					${WebAppContext.videoVisit.hostLastName}
					<c:if test="${not empty WebAppContext.videoVisit.hostTitle}">, ${WebAppContext.videoVisit.hostTitle}</c:if>
				</h3>
			</div>
		<!-- </c:if> -->
	<!-- </c:forEach> -->

	<div id="nav-user">
		<ul>
			<%-- <li>${WebAppContext.member.lastName}, ${WebAppContext.member.firstName} ${WebAppContext.member.middleName}</li> --%>
			<li>${WebAppContext.videoVisit.userName}</li>
			<li class="last"><a href="mdohelp.htm" target="_blank">Help</a></li>
		</ul>
	</div>
                                
     <div id="video-main" style="width:100%">
         <iframe id="joinNowIframe" src ="${WebAppContext.videoVisit.vidyoUrl}" scrolling="no" width="100%" height="700">
             <p>Your browser does not support iframes.</p>
         </iframe>
     </div>
