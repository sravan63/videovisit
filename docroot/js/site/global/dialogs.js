function DialogBlockMegaMeetingPopupOpen(className){
	$('.' + className).dialog({
		modal: true,
		resizable: false,
		width: "auto",
		autoOpen: false,
		title:'',
		closeOnEscape:false,
		dialogClass:'hide-title',
		beforeClose: function(event, ui) {
	    $(".ui-dialog-titlebar-close").removeClass('ui-state-focus'); // Prevent close btn from appearing focused
    }
	});
	$('.' + className).dialog( "open" );
}

function DialogBlockPopupClose(className){
	$('.' + className).dialog( "close" );
}