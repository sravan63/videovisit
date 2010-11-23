${WebAppContext.member.firstName} ${WebAppContext.member.lastName}
${WebAppContext.meetings[0].host.firstName} 
${WebAppContext.meetings[0].host.lastName}
${WebAppContext.meetings[0].host.title}
${WebAppContext.meetings[0].host.imageUrl}
${WebAppContext.meetings[0].host.homePageUrl}

                <div id="landing-portal-ready">
                	<img src=${WebAppContext.meetings[0].host.imageUrl} alt="" />
                	<div class="landing-portal-details">
                    	<h3>Your visit is scheduled for 2:15pm.</h3>
                        <p class="label">Meeting with:</p>
                        <p class="name">${WebAppContext.meetings[0].host.firstName} ${WebAppContext.meetings[0].host.lastName}, DPM<br><a target="_blank" href="#">Visit home page</a></p>
                        <a id="joinbutton" class="btn" href="#">Click here to join now</a>
                        <p class="smallprint">Please note, the meeting will begin when your doctor joins.</p>
                    </div>
                <div id="landing-portal-ready">
                	<img src=${WebAppContext.meetings[1].host.imageUrl} alt="" />
                	<div class="landing-portal-details">
                    	<h3>Your visit is scheduled for 2:15pm.</h3>
                        <p class="label">Meeting with:</p>
                        <p class="name">${WebAppContext.meetings[1].host.firstName} ${WebAppContext.meetings[1].host.lastName}, DPM<br><a target="_blank" href="#">Visit home page</a></p>
                        <a id="joinbutton" class="btn" href="#">Click here to join now</a>
                        <p class="smallprint">Please note, the meeting will begin when your doctor joins.</p>
                    </div>
                </div>


