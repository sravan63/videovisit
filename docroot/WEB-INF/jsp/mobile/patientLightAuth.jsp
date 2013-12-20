<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<div class="page-content">
	<div id="login-form" >
	
		<form class="login-form">
			<p id="globalError" class="globalfailmessage hide-me"></p>

			<ul class="form-block">
				<li><label>Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1" placeholder="Last Name" autocorrect = "off" pattern="[a-zA-Z]+" required>
					<div id="lastNameErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<li><label>Medical Record #</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2" placeholder="MRN" autocorrect = "off" pattern="[0-9]*" required>
					<div id="mrnErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<li>
					<label>Date of Birth</label>
					<input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3" placeholder="MM" autocorrect = "off" pattern="[0-9]*" required>
					<input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4" placeholder="DD" autocorrect = "off" pattern="[0-9]*"required>
					<input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5" placeholder="YYYY" autocorrect = "off" pattern="[0-9]*"required>
					<div id="dateOfBirthDayErrorId" class="localfailmessage hide-me">
					<p></p>
					</div>
					<div id="dateOfBirthMonthErrorId" class="localfailmessage hide-me">
					<p></p>
					</div>
					<div id="dateOfBirthYearErrorId" class="localfailmessage hide-me">
						<p></p>
					</div>
				</li>
				<button id="login-submit" class="off" tabindex="6" >Sign on</button>
			</ul>

			<p class="disclaimer">Children age 11 or younger may not use this website alone. A parent or legal guardian may use this website and have the child with them during the visit.</p>
		</form>
	
		</div>

	<%@ include file="common/information.jsp" %>	
	

		

</div>

<!-- 
<div style="display:block; border-bottom: 1px solid #CCC; line-height:1 em; font-size: 16px; font-family: Helvetica, Neue; overflow: auto; height: auto; color:#78BE20;">
	
	</div>
	
	<div style="margin: 55px 0 0; text-align: center; color: #DA6426; font-size: 20px;">
		<h2> Video Visits Mobile </h2>
		<h2> Coming Soon </h2>
	</div>
	
	<div style="margin: 25px 0 40px; text-align: center; color: #666666;">
		<p style="word-wrap: break-word;"> Until then, please use a laptop or desktop computer to access Video Visits.
	</div>
</div> -->