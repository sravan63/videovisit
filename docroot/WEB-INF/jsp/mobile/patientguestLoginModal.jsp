<input type="hidden" id="isPG" value="true" />

<div>
	<p id="globalError" class="globalfailmessage hide-me" style="background-color:#686A6C;"></p>
</div>

<div style="padding:10px;">
	<div id="login-form">
		<h1>Sign In as a Guest</h1>	
		<form class="login-form" style="margin:10px 0 0;">
			<ul class="form-block" style="padding-right:6px;">
				<!--<li style="padding-right:6px; height:30px; border-radius:2px;">
					<p style="width:100%; background-color:#706259; color:#FFFFFF; text-align:center; padding:5px 1px 5px 5px; border-top-left-radius:3px; border-top-right-radius:3px;">
						Enter Patient&#39s Information
					</p>
				</li>-->
				<li><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Patient Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required></li>

				<button id="login-submit-pg" class="off" tabindex="6" style="width:100%; height:35px; background-color:#0061A9; color:#FFFFFF; font-weight:bold; font-size:14px; margin:10px auto; border-radius:4px;" disabled="disabled">Sign In</button>
			</ul>
		</form>
		
		</div>
		<p class="disclaimer" style="margin: 0 0 10px;">Children age 11 and younger must have a parent present during the visit.</p>

	 	<%@ include file="common/informationpg.jsp" %>
</div>

<style>
	button#login-submit-pg{
		opacity:0.5;
	}
</style>
