<h3 class="page-title">Member Login</h3>
<p class="login">Please sign on below by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <input type="hidden" name="consentFormTXT" id="consentFormTXT" value="consent_forms/${WebAppContext.consentVersion}.txt" />
    <ul class="form-block">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn"></li>
        <li><label>Birth Month and Year</label> <label class="label-month" for="birth_month">Month</label><input type="text" name="birth_month" title="mm" id="birth_month" class="birth_month"> <label class="label-year" for="birth_year">Year</label><input type="text" name="birth_year" title="yyyy" class="birth_year"></li>
        <li><label for="captcha">Enter Code Shown</label><a id="captchaImage" href="#"><img width="160" id="stickyImg" src="stickyImg" alt="captcha image" class="gfx-captcha" /></a><input type="text" name="captcha" id="captcha" class="captcha"></li>
        <li class="smallprint align-right">Click image to refresh. Letters are case sensitive</li>
        <li class="textarea-block"><h4>Consent to Participate</h4>
            <textarea id="terms" name="terms" class="terms-entry">Loading...</textarea></li>
        <li><input type="checkbox" name="consentVersion" value="version 1.2" id="understand_terms" class="understand_terms"><label class="label-understand-terms" for="understand_terms">I have read the above description of telemedicine and agree to the telemedicine consultation.</label></li>
    </ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button">
    </div>
</form>
<p class="error error-login"><a name="errors"></a></p>

