
<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
    <input type="hidden" id="pluginName" value="" /> 
	<input type="hidden" id="pluginNewVersion" value="" /> 
	<input type="hidden" id="pluginOldVesrions" value="" /> 
    <div id="videoVisitSetupContainer">
     <div class="videoVisitContainer" style="padding:0 0;">
    	<div id="videoVisitSetupPageContents">
    		<div id="setupPageTitle" style="float:left; width:60%;">
   				<h2> Video Visit Preparation </h2>
   				<h3> You will need the 'Vidyo Web' plug-in for your visit. </h3>
			</div>
			<div id="helpButtonContent" class="buttons" style="float:right; width:40%;">
				<a href="mdohelp.htm" class="button" target="_blank" style="margin-top: 9px;"> Get Help </a>
			</div>
			<div id="setupMainContents">
			    <div id="browserNotSupportedDiv" Style="height: 100px;margin-top: 100px;display: none;">
			      	<p class="error error-guest-login"></p>
			    </div>
			    <iframe id="setupWizardiFrame" src="" width="725" height="600" frameborder="0" scrolling="no">
				
                </iframe>
			
		    </div>
			<div id="setupLastNav" class="buttons">
			  <% String isGuest = request.getParameter("isGuest");
			      if(isGuest == null || (isGuest != null && !"Y".equalsIgnoreCase(isGuest))){
			   %>
				<a href="login.htm" class="button"> Join Your Video Visit </a>
			  <% } %>
			</div>
		</div>
	 </div>
	</div>
	<script type="text/javascript">

	function getBrowserInfo() {
		
		var browserUserAgent = navigator.userAgent;
		
		
		var browserInfo = new Object();
		
		browserInfo.is32Bit = true;
	
		if (browserUserAgent.indexOf("x64") != -1) {
			browserInfo.is32Bit = false;
		}
		browserInfo.is32BitOS = true;
	
		if (browserUserAgent.indexOf("WOW64") != -1 || browserUserAgent.indexOf("Win64") != -1 ){
			browserInfo.is32BitOS = false;
		} 
	
		browserInfo.isIE = false;
		browserInfo.isFirefox = false;
		browserInfo.isChrome = false;
		browserInfo.isSafari = false;
		
		var jqBrowserInfoObj = $.browser; 
	
		browserInfo.version = jqBrowserInfoObj.version;
		
		if ( jqBrowserInfoObj.mozilla) {
			browserInfo.isFirefox = true;
		} else if ( jqBrowserInfoObj.msie){
			browserInfo.isIE = true;
		} else if ( jqBrowserInfoObj.chrome){
			browserInfo.isChrome = true;
		} else if ( jqBrowserInfoObj.safari){
			browserInfo.isSafari = true;
		}
	
		return browserInfo;
		}	


			var browserInfo = getBrowserInfo();
			
			var browserNotSupportedMsg = "Video Visits is supported on 32 bit browsers only.";
			browserNotSupportedMsg += "<br /><br />";
			browserNotSupportedMsg += "Your current browser is unsupported.";
			browserNotSupportedMsg += "<br /><br />";
			browserNotSupportedMsg += "Please <a href='mdohelp.htm' target='_blank'>Download a 32 bit browser</a>";
			
			
			if(browserInfo.isIE) {
				if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
					 
					 $('#setupWizardiFrame').css('display','none');	
					 $('#browserNotSupportedDiv').css('display','');				
					 $('p.error').html(browserNotSupportedMsg);
					 $('#setupLastNav').css('display','none');
					 
				} else{
			                $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
				}
			}else{
			     
			      $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
			}
      
	
</script>
