<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<script>
	var app={
		launchApp: function(){
			window.location.replace("kppc://videovisit");
				this.timer = setTimeout(this.openWebApp, 1000);
		},
		openWebApp: function(){
			window.location.replace("https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8");
		}
	}
</script>

<div id="content-window">
	<div id="contents">
		<h1> Join Your Video Visit </h1>
		<p> Get KP Preventive Care to start your visit with your doctor. </p>
		<button type="button" onclick="app.launchApp();">Open</button>
	</div>
	<img src="images/mobile/phone.png"></img>
</div>