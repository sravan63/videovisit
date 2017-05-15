<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<script>
	$(document).ready(function(){
		$("head").append("<meta name='apple-itunes-app' content='app-id=497468339'>");
		
		$(function() { $.smartbanner() } )
		
		$.smartbanner({
			title: 'KP Preventive Care',
			author: 'Kaiser Permanente',
			icon: null,
			url: null,
			button: 'OPEN',
			scale: 'auto',
			daysHidden: 0,
			daysReminder: 0,
			layer: false,
			appendToSelector: '#content-window'
		})
	});
	
	var now = new Date().valueOf();
    var app={
    	launchApp: function(){
        	this.timer = setTimeout(this.openWebApp, 2000);
            window.location.replace("kppc://videovisit?signon=true");
        },
        openWebApp: function(){
            //alert('in timeout ' + new Date().valueOf() + ' ' + now);
            if (new Date().valueOf() - now > 9000) return;
            //alert('after date check');
            var os = getAppOS();

            if(os == "iOS"){
                    window.location.replace("https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8");
            }
            else if(os == "Android"){
                    window.location.replace("https://play.google.com/store/apps/details?id=org.kp.tpmg.preventivecare&hl=en");
            }
            else{
                    // we should never reach this condition
                    alert("No device detected");
            }
        }
    }
</script>

<div id="content-window">
	<div id="contents">
		<h1> Join Your Video Visit </h1>
		<p> Get My Doctor Online to start your visit with your doctor. </p>
		<button type="button" onclick="app.launchApp();">Open</button>
	</div>
	<img src="images/mobile/phone.png"></img>
</div>