$(document).ready(function() {
    
	$('#content-main #nav-user').hide();
    $('.helptabs').hide();
    $('ul#helpNavLinks li a:first').addClass("active")
    $('div.content div:first').show();

    $('ul#helpNavLinks li a').click(function() {

        $('ul#helpNavLinks li a').removeClass('active');
        $(this).addClass('active');
        $('.helptabs').hide();

        var activeContent = $(this).attr('href');
        $(activeContent).fadeIn();
        return false;
    });

    $(".back").click(function(){
        history.go(-1);
        return false;
    })
});

