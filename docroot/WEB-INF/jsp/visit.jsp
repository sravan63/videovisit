<h3 class="page-title">Video Visit with ${WebAppContext.meetings[0].host.firstName} ${WebAppContext.meetings[0].host.lastName}, DPM</h3>

                <div id="video-main" style="width:785px">
                    <iframe src ="blank.jsp" width="100%" height="600">
                        <p>Your browser does not support iframes.</p>
                    </iframe>
                </div>

                <div id="quitMeetingModal" class="jqmWindow dialog-block2" style="position:absolute; display:none" title="Quit Meeting">
			<div class="dialog-content-question">
                            <h2 class="jqHandle jqDrag"><span style="padding-left:8px">Quit Meeting</span></h2>
				<p class="question">Are you sure you want to quit this meeting?</p>
				<div class="pagination">
					<ul>
						<li><a id="dialogclose" class="jqmClose" href="#">No &rsaquo;&rsaquo;</a></li>
						<li><a id="quitMeetingLink" quitmeetingid="${WebAppContext.meetings[0].meetingId}" href="#">Yes &rsaquo;&rsaquo;</a></li>
					</ul>
				</div>
			</div>
		</div>

