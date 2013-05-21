<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<%-- NOTE: when development is over use something similar to the following code
           to redirect to the single-sign-on infrastructure. 
--%>
<%-- Redirected because we can't set the welcome page to a virtual URL. --%>
<c:redirect url="/intro.htm">
</c:redirect>
