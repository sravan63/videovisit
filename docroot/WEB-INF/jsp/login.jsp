<h3 class="page-title">Member Login</h3>
<p class="login">Children under age 13 may not use this website. A parent or legal guardian may use this website and have the child with them during the conference.</p>
<p class="login">Please sign on by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <input type="hidden" name="consentFormTXT_A" id="consentFormTXT_A" value="consent_forms/${WebAppContext.consentVersion}_A.txt" />
	<input type="hidden" name="consentFormTXTIE_A" id="consentFormTXTIE_A" value="consent_forms/${WebAppContext.consentVersion}_A.ie.txt" />
	<input type="hidden" name="consentFormTXT_P" id="consentFormTXT_P" value="consent_forms/${WebAppContext.consentVersion}_P.txt" />
	<input type="hidden" name="consentFormTXTIE_P" id="consentFormTXTIE_P" value="consent_forms/${WebAppContext.consentVersion}_P.ie.txt" />
    <ul class="form-block">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" tabindex="2"></li>
        <li>
            <label>Birth Month, Day and Year</label>
            <label class="label-month" for="birth_month">Month</label>
            <input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" tabindex="3">

            <label class="label-day" for="birth_day">Day</label>
            <input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" tabindex="4">

            <label class="label-year" for="birth_year">Year</label>
            <input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" tabindex="5">
        </li>
        <li><label for="captcha">Enter Code Shown</label><a id="captchaImage" href="#" tabindex="100"><img width="160" id="stickyImg" src="stickyImg" alt="captcha image" class="gfx-captcha" /></a><input type="text" name="captcha" id="captcha" class="captcha" tabindex="6"></li>
        <li class="smallprint align-right">Click image to refresh. Letters are case sensitive</li>
  	</ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button" tabindex="7">
    </div>
</form>
<p class="error error-login"><a name="errors"></a></p>

<div id="consentModal" class="jqmWindow dialog-block2" style="position:absolute; display:none" title="Consent to Participate">
	<div class="dialog-content-question">
        <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Consent to Participate</span></h2>
		<p class="question">Consent text goes here</p>
		<form id="consentForm" method="post" action="">
		<div id="parental-consent-fields" style="display: none">
		    The date of birth entered indicates the patient is a minor.<br />A parent or legal guardian of the patient must provide consent by filling out the following fields in order for the patient to participate in the video visit.
			<ul>
				<li><label for="parent_last_name">Parent's Last Name</label><input type="text" name="parent_last_name" id="parent_last_name" tabindex="9"></li>
				<li><label for="parent_first_name">Parent's First Name</label><input type="text" name="parent_first_name" id="parent_first_name" tabindex="10"></li>
				<li><label for="relationship">Relationship to Patient</label>
					<select id="relationship" tabindex="11" >
						<option value="Parent">Parent</option>
					 	<option value="Legal Guardian">Legal Guardian</option>					  	
					</select>
				</li>
			</ul>
		</div>
		<div class="pagination">
		    <ul>
		    	<li id="consentListitem">
        			<input type="checkbox" name="consentVersion" value="${WebAppContext.consentVersion}" id="understand_terms" class="understand_terms" tabindex="12">
        			<label id="textIfChild" class="label-understand-terms" for="understand_terms">I attest that I am the parent/legal guardian of the patient of this video visit, and I have read the above description of telemedicine and agree to the telemedicine consultation.</label>
        			<label id="textIfAdult" class="label-understand-terms" for="understand_terms">Consent checkbox text for over 18 goes here.</label>
        		</li>
			    <li><a id="dialogclose" class="jqmClose" href="#" tabindex="13">Cancel &rsaquo;&rsaquo;</a></li>
				<li><a id="consentLink" href="#" tabindex="14" >Continue &rsaquo;&rsaquo;</a></li>
			</ul>
		</div>
		</form>
	</div>
</div>