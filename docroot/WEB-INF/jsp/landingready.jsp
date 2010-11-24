<div id="landing-portal-ready">
    <div class="landing-portal-single-container">
        <img src=${WebAppContext.meetings[0].host.imageUrl} alt="" />
        <div class="landing-portal-details">
            <div class="hidden timestamp">${WebAppContext.meetings[0].scheduledTimestamp}</div>
            <h3>Your visit is scheduled for </h3>
            <p class="label">Meeting with:</p>
            <p class="name">${WebAppContext.meetings[0].host.firstName} ${WebAppContext.meetings[0].host.lastName}, DPM<br><a target="_blank" href="${WebAppContext.meetings[0].host.homePageUrl}">Visit home page</a></p>
            <a id="joinbutton" class="btn" meetingid="${WebAppContext.meetings[0].meetingId}" href="https://tpmg.megameeting.com/?page=guest&conid=${WebAppContext.meetings[1].mmMeetingName}&user=&agree=1&reload=1">Click here to join now</a>
            <p class="smallprint">Please note, the meeting will begin when your doctor joins.</p>
        </div>
    </div>

    <div class="landing-portal-single-container">
        <img src=${WebAppContext.meetings[1].host.imageUrl} alt="" />
        <div class="landing-portal-details">
            <div class="hidden">${WebAppContext.meetings[1].meetingId}</div>
            <div class="hidden timestamp">${WebAppContext.meetings[1].scheduledTimestamp}</div>
            <h3>Your visit is scheduled for </h3>
            <p class="label">Meeting with:</p>
            <p class="name">${WebAppContext.meetings[1].host.firstName} ${WebAppContext.meetings[1].host.lastName}, DPM<br><a target="_blank" href="${WebAppContext.meetings[1].host.homePageUrl}">Visit home page</a></p>
            <a id="joinbutton" class="btn" meetingid="${WebAppContext.meetings[1].meetingId}" href="https://tpmg.megameeting.com/?page=guest&conid=${WebAppContext.meetings[1].mmMeetingName}&user=&agree=1&reload=1">Click here to join now</a>
            <p class="smallprint">Please note, the meeting will begin when your doctor joins.</p>
        </div>
    </div>
</div>


