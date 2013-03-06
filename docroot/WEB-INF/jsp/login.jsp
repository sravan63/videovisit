<%@ include file="preloader.jsp" %>

<h3 class="page-title">Member Login</h3>
<p class="login">Children under age 11 may not use this website. A parent or legal guardian may use this website and have the child with them during the conference.</p>
<p class="login">Please sign on by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <input type="hidden" name="consentFormTXT" id="consentFormTXT" value="consent_forms/consent_2011_08_01.txt" />
    <input type="hidden" name="consentFormTXT_A" id="consentFormTXT_A" value="consent_forms/consent_2011_08_01.txt" />
	<input type="hidden" name="consentFormTXTIE_A" id="consentFormTXTIE_A" value="consent_forms/consent_2011_08_01.txt" />
	<input type="hidden" name="consentFormTXT_P" id="consentFormTXT_P" value="consent_forms/consent_2011_08_01.txt" />
	<input type="hidden" name="consentFormTXTIE_P" id="consentFormTXTIE_P" value="consent_forms/consent_2011_08_01.txt" />
    <ul class="form-block">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name" tabindex="1"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn" maxlength="8" tabindex="2"></li>
        <li>
            <label>Date of Birth</label>
            <label class="label-month" for="birth_month">Month</label>
            <input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month" maxlength="2" tabindex="3">

            <label class="label-day" for="birth_day">Day</label>
            <input type="text" name="birth_day" title="dd" id="birth_day" class="birth_day" maxlength="2" tabindex="4">

            <label class="label-year" for="birth_year">Year</label>
            <input type="text" name="birth_year" title="yyyy" class="birth_year" id="birth_year" maxlength="4" tabindex="5">
        </li>
        <!--  
        <li><label id="captchaLabel" for="captcha">Enter Code Shown</label><a id="captchaImage" href="#" tabindex="100"><img width="160" id="stickyImg" src="stickyImg" alt="captcha image" class="gfx-captcha" /></a><input type="text" name="captcha" id="captcha" class="captcha" maxlength="5" tabindex="6"></li>
        <li class="smallprint align-right">Click image to refresh. Letters are case sensitive</li>
        -->
  	</ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button" tabindex="7">
    </div>
</form>
<p class="error error-login"><a name="errors"></a></p>

<div id="consentModal" class="jqmWindow dialog-block2" style="position:absolute; display:none" title="Consent to Participate">
	<div class="dialog-content-question">
        <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Consent to Participate</span></h2>
        <span class="pcf-child pcf-child-top">The date of birth entered indicates the patient is a minor.  A parent or legal guardian of the patient must provide consent below in order for the video visit to proceed.</span>
		<form id="consentForm" method="post" action="">
        <div class="textarea-block">
            <textarea id="terms" name="terms" class="terms-entry" readonly>Loading...</textarea>
        </div>
		
		<div id="parental-consent-fields">

			<ul>
				<li class="pcf-child"><label for="parent_first_name">First Name</label><input type="text" name="parent_first_name" id="parent_first_name" tabindex="8"></li>
				<li class="pcf-child"><label id="parent_last_name_label" for="parent_last_name">Last Name</label><input type="text" name="parent_last_name" id="parent_last_name" tabindex="9"></li>
				<li class="pcf-child"><label for="relationship">Relationship to Patient</label>
					<select id="relationship" class="required" tabindex="10" >
					    <option value="" selected>Select one...</option>
						<option value="Parent">Parent</option>
					 	<option value="Legal Guardian">Legal Guardian</option>					  	
					</select>
				</li>
		
		    	<li class="pagination" id="consentListitem">
        			<input type="checkbox" name="consentVersion" value="consent_2011_08_01" id="understand_terms" class="understand_terms" tabindex="11">
        			<label class="pcf-child label-understand-terms" for="understand_terms">I attest that I am the parent/legal guardian of the patient of this video visit, and I have read the above description of telemedicine and agree to the telemedicine consultation.</label>

        			<label class="pcf-adult label-understand-terms" for="understand_terms">I have read the above description of telemedicine and agree to the telemedicine consultation.</label>
        		</li>
	<span id="consentButtons">
			    <li class="pagination"><a id="dialogclose" class="jqmClose" href="#" tabindex="12">Cancel &rsaquo;&rsaquo;</a></li>
				<li class="pagination"><a id="consentLink" href="#" tabindex="13" >Continue &rsaquo;&rsaquo;</a></li>
	</span>
			</ul>
		</div>
		</form>
	</div>
</div>