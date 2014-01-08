<%@page import="java.util.ResourceBundle"%>
<% 
                                ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
                            	String setupUrl = null;
 %>

<script src="js/library/jquery/jquery-1.8.3.min.js" type="text/javascript"></script>
 
    <div class="videoVisitContainer">
    	<div id="videoVisitSetupPageContents">
    		<div id="setupPageTitle">
   				<h2> Video Visit Preparation </h2>
   				<h3> You will need the 'Vidyo Web' plug-in for your visit. </h3>
			</div>
			<div id="helpButtonContent" class="buttons">
				<a href="mdohelp.htm" class="button" target="_blank"> Get Help </a>
			</div>
			<div id="setupMainContents">
			    <div id="browserNotSupportedDiv" Style="text-align: center;height: 100px;margin-top: 100px;display: none;">
			      
			    </div>
			    <iframe id="setupWizardiFrame" src="" width="725" height="650" frameborder="0" scrolling="no">
				
                </iframe>
			
		    </div>
			<div id="setupLastNav" class="buttons">
				<a href="login.htm" class="button"> Join Your Video Visit </a>
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
			
			var browserNotSupportedMsg = "<p>Video Visits is supported on 32 bit browsers only";
			browserNotSupportedMsg += "<br/><br/>";
			browserNotSupportedMsg += "So your current browser is unsupported.<br/>Please <a href='mdohelp.htm' target='_blank'>download</a> a 32 bit browser.</p>";
					
			
			if(browserInfo.isIE) {
				if (((browserInfo.version == 8 || browserInfo.version == 9) && !browserInfo.is32Bit) || browserInfo.version <= 7) {
					 $('#setupWizardiFrame').css('display','none');	
					 $('#browserNotSupportedDiv').css('display','');				
					  $('#browserNotSupportedDiv').html(browserNotSupportedMsg);
				} else{
			                $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
				}
			}else{
			     
			      $('#setupWizardiFrame').attr('src','../vidyoplayer/setupWizard.html');
			}
      
	
</script>
