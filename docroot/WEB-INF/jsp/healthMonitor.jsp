<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script src="js/library/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="js/site/global/commonScript.js"></script>
   <c:choose>
      <c:when test="${allOk}">
		<!-- DASHBOARD_ALL_OK -->
	  </c:when>
      <c:otherwise>
		<!-- DASHBOARD_FATAL -->
	 </c:otherwise>
   </c:choose>
					<h3>Health Monitoring</h3>
					<table id="healthMonitor" width="460px">
						<tr>
							<th width="160px"> Monitoring Item</th>
							<th width="300px"> Status</th>
						</tr>
						<tr>
							<td>Database Status</td>
							<td> ${db}  </td>
						</tr>

					</table>

