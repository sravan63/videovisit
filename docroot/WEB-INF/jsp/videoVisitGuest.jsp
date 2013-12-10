<!-- Join Now modal for patient guest -->

<div style="float:left">
	<h3 class="page-title">Video Visit for ${WebAppContext.meetings[0].member.firstName} 
		${WebAppContext.meetings[0].member.lastName} 
	</h3>
</div>

<div id="nav-user">
	<ul>
		<li class="last"><a href="mdohelp.htm" target="_blank">Help</a></li>
	</ul>
</div>

<div id="video-main" style="width:100%">
    <iframe id="joinNowIframeGuest" src="${WebAppContext.videoVisit.vidyoUrl}" scrolling="no" width="100%">
        <p>Your browser does not support iframes.</p>
    </iframe>
</div>