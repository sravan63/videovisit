$(document).ready (function () {
	
	var _init = $.ui.dialog.prototype._init;
	
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


	$('.dialog-block').dialog({
		modal: true,
		//stack: false,
		resizable: false,
		width: 360

	});
	
	$('.dialog-block-override').dialog({
		modal: true,
		//stack: false,
		resizable: false,
		width: 360,
		dialogClass: 'emergency-override'
	});
	
	$('.note').each (function (){
		$(this).qtip({
			content: $('.tooltip', this).html (),
			position: {
				my: "bottom center",
				at: "top center",
				adjust: {
					y: -12,
					screen: true
					}
			},
			hide: {
				effect: function () { $(this).fadeOut(100); }
			},
			style: {
				tip: {
         			corner: true
      			}
			}	
		});
	});
	
	//Clinician Accordian Nav
	  $('#sidebar-main h2').click(function() {
			 $(this).toggleClass("show");
			 $(this).next().animate({ height: "toggle", opacity: "toggle"}, 500 );
			return false;
		}).next().hide();
	  
});







