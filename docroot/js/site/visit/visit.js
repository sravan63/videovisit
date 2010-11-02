$(document).ready(function() {
    
    $( '#quitMeetingModal' ).jqm().jqDrag('.jqDrag');
    /*var _init = $.ui.dialog.prototype._init;

	//Custom Dialog Init
	$.ui.dialog.prototype._init = function() {
		var self = this;
        _init.apply(this, arguments);
		uiDialogTitlebar = this.uiDialogTitlebar;


		uiDialogTitlebar.append('<a href="#" id="dialog-override" class="dialog-override ui-dialog-titlebar-eo">Emergency Override</a>');

		//Minimize Button
		this.uiDialogTitlebarMin = $('.dialog-override', uiDialogTitlebar).hover(function(){
			$(this).addClass('ui-state-hover');
		}, function(){
			$(this).removeClass('ui-state-hover');
		}).click(function(){
			self.eOverride();
			return false;
		});

	};
	//Custom Dialog Functions
	$.extend($.ui.dialog.prototype, {
		eOverride: function() {
			console.log("Emergency Override");
		}
	});

        $("#quitMeeting").click(function(){
            $('.dialog-block2').dialog({
		modal: true,
		//stack: false,
		resizable: false,
		width: 360
            });
        })

	$('.dialog-block-override').dialog({
		modal: true,
		//stack: false,
		resizable: false,
		width: 360,
		dialogClass: 'emergency-override'
	});
        

        $("#dialogclose").click(function(){
            $(".dialog-block2").dialog('close');
        })*/

});

