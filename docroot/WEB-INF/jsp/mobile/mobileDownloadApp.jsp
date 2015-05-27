<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<script>
	$(document).ready(function(){
		setTimeout(function (){
			$('#abc').css('display','');
		}, 3000);
		window.location = "https://itunes.apple.com/us/app/kp-preventive-care-for-northern/id497468339?mt=8";
	});
</script>

<div id="abc" style="background: url('images/mobile/bkgrnd.png') no-repeat center center fixed; background-size: cover; position:fixed; height:100%; width:100%; display:none;">
	<div style="padding:30px 20px; font-weight:HelveticaNeue; font-size:20px;">
		<p style="font-weight:bold; font-size:20px;"> Join Your Video Visit </p>
		<p style="font-size:14px; margin:10px 0; color:#191919;"> Get KP Preventive Care to start your visit with your doctor. </p>
		<button type="button" style="float:right; color:#006BA6; border:1px solid #006BA6; border-radius:3px; font-size:18px; width:130px; height:35px; background-color:#FFFFFF;">Download</button>
	</div>
	<img src="images/mobile/phone.png" style="position:absolute; width:50%; bottom:0;"></img>
</div>