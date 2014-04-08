/*!  Print */
if (!this.mdoprint) {
	this.mdoprint = {};
}
if (!this.mdodoctor) {
	this.mdodoctor = {};
}

jQuery(document).ready(function() {

	if($('#print')) { /*print button found*/

		$('#print').bind('click', function() {
			mdoprint.show();
			return false;
		});
	}
});

mdodoctor.attachLink = function() {
  $('.docLink, .personLink').click(function(e) {
  e.preventDefault();
  var isDoctor = $(this).hasClass('docLink');
  docLinkTemp = $(this).attr('href');
  docLink = docLinkTemp.replaceAll("/microsite/", "/mscontent/");
  if(docLink.indexOf(' ') >= 0) {
    docLink = docLink.replaceAll(" ", "_");
  }
  if(docLink) {
    // Set property to prevent "mdodoctor.show" from being called till after successful response.
    if(typeof this.active === 'undefined' || !this.active) {
      mdodoctor.show(docLink, isDoctor, this);
      this.active = true;
    }
  }
  return false;
});
}

mdodoctor.show = function (docLink, isDoctor, obj) {
	mylink = docLink;
	var $mdodialog = $('<div id="doctorInfo" style="diplay:none; postion:relative;"></div>');
	$mdodialog.appendTo('body');

	var printhtml = $('<div class="printSection">This is going to add the doctor content</div>');
	printhtml.appendTo($mdodialog);

    $('#doctorInfo').load(mylink,function() {
      obj.active = false; // See "mdodoctor.attachLink" function
      if(!(typeof(person_homepage_url) == 'undefined')) {
        var dialogOpts = {
          modal: true,
          autoOpen: false,
          //height: 450,
          width: 740,
          resizable: false,
          close: function(event, ui){
            $(this).dialog('destroy').remove();
          },
          buttons : (function() {
            var o = {};
            o.Close = function() {
              $(this).dialog("close");
            }
            if(isDoctor) { // Only show if doctor
              o["Visit My Home Page"] = function(e) {
                //window.location = person_homepage_url;
                window.open(person_homepage_url);
              }
            }
            return o;
          })()
        /*
          {
  				"Close" : function() {
  							$(this).dialog("close");
  					},
  				"Visit My Home Page" : function(e) {
                        //window.location = person_homepage_url;
                        window.open(person_homepage_url);
  					}
  				}
          */
			};
    }
    else
    {
     var dialogOpts = {
	        modal: true,
	        autoOpen: false,
	        height: 450,
	        width: 740,
	        resizable: false,
	        close: function(event, ui){
				$(this).dialog('destroy').remove();
				},
			buttons : {
				"Close" : function() {
							$(this).dialog("close");
					}
				}
			};
    }
    $mdodialog.dialog(dialogOpts);
  	$mdodialog.dialog('open');
  	return false;
    });


};

mdoprint.show = function () {

	var $printdialog = $('<div id="printcontainer" style="diplay:none; postion:relative;"></div>');
	$printdialog.appendTo('body');

  var printToPrinter = '<label classname="blockLabel printMainSection" class="blockLabel printMainSection"><input type="radio" name="printSection" value="mainSection" checked="checked">Print content (printer friendly page).</label>';
  var printPDF = '<label classname="blockLabel printEntirePage" class="blockLabel printEntirePage"><input type="radio" name="printSection" value="entirePage">Print/save full page (generates a pdf).<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Please enable pop-ups to use this feature)</label>';
	var printhtml = $('<div class="printSection"><p></p><div><form class="printForm" enctype="application/x-www-form-urlencoded"><div class="printPageMain">' + printToPrinter + printPDF + '</div></form></div></div>');

	printhtml.appendTo($printdialog);

	function successFunc(data, XMLHttpRequest){
		$('#loader').dialog('close');

		try {
			//var filename = $(data).find('#fileName').html();
			var nw = window.open();
			nw.document.open("text/html", false);
			nw.document.write(data);
			nw.document.close();
			var val = nw.document.getElementById("fileName").innerHTML;
			var f = appContextPath + "mdo/presentation/print/" + val;
			nw.open(f, "_self");
		}
		catch(err){
			//alert("Error:" + err.message);
		}
		//var url = appContextPath + 'mdo/presentation/print/' + filename;
		//window.open(url, '_blank');
	}

	var dialogOpts = {
	        modal: true,
	        autoOpen: false,
	        height: 300,
	        width: 450,
	        resizable: false,
	        close: function(event, ui){
				$(this).dialog('destroy').remove();
				},
			buttons : {
				"Print" : function(e) {

					var val_name = $("input[name='printSection']:checked").val();
					if(val_name === 'entirePage'){

						$(this).dialog("close");
						var pageHtml = $('body').html();
						//pageHtml = $('<div>' + pageHtml + '</div>');

						//var html = $(pageHtml).find('iframe').remove().end().html();
						//pageHtml = html;


						if(jQuery.browser.msie){
							pageHtml = $('<div>' + pageHtml + '</div>');
							//var src = $(pageHtml).find('#headshot').attr('src');
							$(pageHtml).find('#headshot').replaceWith('<img id="headshot" src="' + util.src + '"></img>');
							//var html = $(pageHtml).find('#headshot').replaceWith('<img id="headshot" src="' + src + '"></img>').end().html();
							//alert("HTML: " + html);
							//var html = $(pageHtml).html();
							//alert("pageHtml: " + $(pageHtml).find('#doctor').html());
							pageHtml = $(pageHtml).html();

						}

						pageHtml = encodeURIComponent(pageHtml);
					<!--	loadingmodal.loadImageDialog("Generating pdf...Please wait.");	-->
						var pageUrl =  '/videovisit/printPdf/rest/';
						$.ajax({ 
						  url: pageUrl , 
              type: 'POST', 
              context:document, 
              data: {
                innerHTML: pageHtml
              }, 
              dataType: 'html', 
              success: successFunc,
              error: function() {
                
              }
            });

					}
					else {
						$(this).dialog("close");
						mdoprint.print();
					}

					},
				"Cancel" : function() {
							$(this).dialog("close");
					}
				}

			};


	 	$printdialog.dialog(dialogOpts);
  		$printdialog.dialog('open');
  		return false;

	  };

mdoprint.print = function () {

		$('html').addClass('printContentOnly');
		var fileref = $('<link />');
		fileref.attr("rel", "stylesheet");
		fileref.attr("type", "text/css");
		fileref.attr("media", "print");
		fileref.attr("href", "/videovisit/css/site/mdo/print.css");
		fileref.attr("charset", "utf-8");
		$('head:eq(0)').append(fileref);
				
		setTimeout(function()
		{
			window.print();
		}, 0);

};
// Credits: http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
(function() {
    var beforePrint = function() {
		$('#masthead>h1').replaceWith('<div id="header"><h2>My Doctor Online</h2><h3>The Permanente Medical Group</h3></div>');
		$('#myOffices').hide();
		$('div.bb-mdo-bookmarkDoctor-bookmarkMe').hide();
		$('#myOffices_p').css('width', '90%');
		$('#myOffices_p').show();
    };
    var afterPrint = function() {
		$('#masthead>#header').replaceWith('<h1>My Doctor Online The Permanente Medical Group</h1>');
    	$('#myOffices').show();
		$('div.bb-mdo-bookmarkDoctor-bookmarkMe').show();
		$('#myOffices_p').hide();
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
}());
///////////////////////end: Credits//////////////////////////////////////


