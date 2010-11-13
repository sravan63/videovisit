(function ($) {
/* Usage: $('input[title!=""]').hint();
 *
 * When included in the page this plugin will look for any input fields with a populated title attribute.
 * It will use the text in the title attribute to populate the input field.
 * It also applies a class of "blur" to the input element to use if needed.
 */
$.fn.hint = function (blurClass) {
    if (!blurClass) blurClass = 'blur';
    
    return this.each(function () {
        var $input = $(this),
            title = $input.attr('title'),
            $form = $(this.form),
            $win = $(window);

        function remove() {
            if (this.value === title && $input.hasClass(blurClass)) {
                $input.val('').removeClass(blurClass);
            }
        }

        // only apply logic if the element has the attribute
        if (title) { 
            // on blur, set value to title attr if text is blank
            $input.blur(function () {
                if (this.value === '') {
                    $input.val(title).addClass(blurClass);
                }
            }).focus(remove).blur(); // now change all inputs to title
            
            // clear the pre-defined text when form is submitted
            $form.submit(remove);
            $win.unload(remove); // handles Firefox's autocomplete
        }
    });
};

})(jQuery);