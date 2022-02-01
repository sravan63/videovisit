// Restrict legal input chars
$(document).ready(function() {
  $(document).delegate(':input:visible', 'keypress', function(e) {
    var legalChars = /[\w\d\s\t\b\(\)\[\]\{\}\-.@#,\'\"\:]/gi;
    var cCode = !e.charCode ? e.which : e.charCode;
    var key = String.fromCharCode(cCode);

    if(cCode !== 9 && cCode !== 0) { // Allow normal tab functionality
      if (!(legalChars.test(key))) {
         e.preventDefault();
         return false;
      }
    }
  });
});
