<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<div>
	<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
</div>

<div style="padding:10px;">
	<div id="login-form">
		<h1>Sign In to Video Visits</h1>	
		<form class="login-form" style="margin:10px 0 0;">
			<ul class="form-block" style="padding-right:6px;">
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required></li>
				<li><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect = "off" pattern="[0-9]*" required></li>
				<li style="border:1px solid rgba(0,0,0,0.3); border-top:none; border-radius:0; margin-right:-6px; overflow:auto; background-color:#FFFFFF;">
					<label style="padding-left:4px; float:left; margin-top:5px; color:#000000;">Date of Birth</label>
					<span style="float:right; margin:3px 10px 0 0;">
						<input type="text" name="birth_month" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="mm" autocorrect="off" pattern="[0-9]*" title="mm" required style="border:none; background-color:#F1F1F1; padding:0 20px; border-radius:0;">
						<label style="margin:0 10px;"> / </label>
						<input type="text" name="birth_year" id="birth_year" class="birth_year" maxlength="4" tabindex="4" placeholder="yyyy" autocorrect="off" pattern="[0-9]*" title="mm/yyyy" required style="border:none; background-color:#F1F1F1; width:30px; padding:0 20px; border-radius:0;">
					</span>
				</li>

				<button id="login-submit" class="off" tabindex="6" style="width:100%; height:35px; background-color:#0061A9; color:#FFFFFF; font-weight:bold; font-size:14px; margin:10px auto; border-radius:4px;" disabled="disabled">Sign In</button>
			</ul>
		</form>
		
		</div>
		<p class="disclaimer">Children age 11 and younger must have a parent present during the visit.</p>
	 	
	 	<%@ include file="common/informationTwo.jsp" %>
</div>

<style>
	button#login-submit{
		opacity: 0.5;
	}
	input::-webkit-input-placeholder{
		color: #000000;
	}
</style>
