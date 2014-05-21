function setCookie(cname,cvalue,exdays)
{
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
	{
	  var c = ca[i].replace(/^\s+|\s+$/g,"");
	  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

function setPluginFileType(elementId,pluginFileVersion) 
{	
	var osName = navigator.platform;		
			
	if (osName.toUpperCase().indexOf('MAC')!==-1) {
	    elementId.href="vidyoplayer/files/VidyoWeb-macosx-"+ pluginFileVersion +".pkg";
	}else if (osName.toUpperCase().indexOf('WIN')!==-1){
	    elementId.href="vidyoplayer/files/VidyoWeb-win32-"+ pluginFileVersion +".msi";
	}
}