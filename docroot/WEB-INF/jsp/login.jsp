<h3 class="page-title">Member Login</h3>
<p class="login">Children under age 13 may not use this website. A parent or legal guardian may use this website and have the child with them during the conference.</p>
<p class="login">Please sign on below by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <input type="hidden" name="consentFormTXT" id="consentFormTXT" value="consent_forms/${WebAppContext.consentVersion}.txt" />
	<input type="hidden" name="consentFormTXTIE" id="consentFormTXTIE" value="consent_forms/${WebAppContext.consentVersion}.ie.txt" />
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
        <li class="textarea-block"><h4>Consent to Participate</h4>
            <textarea id="terms" name="terms" class="terms-entry" tabindex="7" readonly>Loading...</textarea></li>
        <li><input type="checkbox" name="consentVersion" value="version 1.2" id="understand_terms" class="understand_terms" tabindex="8"><label class="label-understand-terms" for="understand_terms">I have read the above description of telemedicine and agree to the telemedicine consultation.</label></li>
    </ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button" tabindex="9">
    </div>
</form>
<p class="error error-login"><a name="errors"></a></p>

<div id="consentModal" class="jqmWindow dialog-block2" style="position:absolute; display:none" title="Consent to Participate">
	<div class="dialog-content-question">
        <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Consent to Participate</span></h2>
		<p class="question">We have ways of making you consent!</p>
		<div class="pagination">
		    <ul>
			    <li><a id="dialogclose" class="jqmClose" href="#">Cancel &rsaquo;&rsaquo;</a></li>
				<li><a id="consentLink" href="#">Consent &rsaquo;&rsaquo;</a></li>
			</ul>
		</div>
	</div>
</div>

