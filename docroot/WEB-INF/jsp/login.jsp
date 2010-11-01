<h3 class="page-title">Member Login</h3>
<p class="login">Please sign on below by completing the fields below.</p>
<form id="loginForm" method="post" action="">
    <ul class="form-block">
        <li><label for="last_name">Last Name</label><input type="text" name="last_name" id="last_name"></li>
        <li><label for="mrn">Medical Record Number</label><input type="text" name="mrn" id="mrn"></li>
        <li><label>Birth Month and Year</label> <label class="label-month" for="birth_month">Month</label><input type="text" name="birth_month" value="mm" id="birth_month" class="birth_month"> <label class="label-year" for="birth_year">Year</label><input type="text" name="birth_year" value="yyyy" class="birth_year"></li>
        <li><label for="captcha">Enter Code Shown</label><a id="captchaImage" href="#"><img width="160" id="stickyImg" src="stickyImg" alt="captcha image" class="gfx-captcha" /></a><input type="text" name="captcha" id="captcha" class="captcha"></li>
        <li class="smallprint align-right">Letters are not case sensitive</li>
        <li class="textarea-block"><h4>Consent to Participiate</h4>
            <textarea name="terms" class="terms-entry">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. unt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. unt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</textarea></li>
        <li><input type="checkbox" name="consentVersion" value="understand_terms" id="understand_terms" class="understand_terms"><label class="label-understand-terms" for="understand_terms">I have read and agree to the terms of consent above.</label></li>
    </ul>
    <div class="submit-block">
        <input type="submit" name="login" value="Login &rsaquo;&rsaquo;" id="login" class="button">
    </div>
</form>
<p class="error error-login"></p>

