/**
 * Defines configuration for the application
 * @return {Object} RequireJS define object
 */

/*jshint multistr:true */
/*jslint browser: true, indent : 4, nomen : true, maxerr : 10, es5: true */
/*global requirejs: false, bootstrap: false, handlebars: false, define: false, jquery: false, jQuery: false */

(function () {
    'use strict';
    define(function () {
        var config = {
            /* behavior */
            developerEdition: true,
            enableChat: false,
            pluginVersion: "1.0.2.00057",
            pluginMimeType: "application/x-vidyoweb-", // will add version later on
            activexType: "VidyoInc.VidyoWeb_", // will add version later on
            pluginDetectionTimeout: 1000, //in ms, polling frequency
            /* Logging */
            enableVidyoPluginLogs: false, // jsclient
            enableVidyoClientLogs: false, // client
            enableAppLogs: true, // main application
            applicationLevelsCategories: {
                // all: true,
                // none: false,
                call: "debug",
                portal: "warning",
                configuration: "debug",
                login: "debug",
                application: "info",
                soap: "warning",
                ui: "info",
                callback: "info",
                cache: "none"
            },
            defaultLogLevelsAndCategories: "fatal error warning info@App info@AppEvents info@AppEmcpClient info@LmiApp info@LmiH264SvcPace",
            enableStackTrace: false,
            searchDelay: 750, // in ms
            userRefreshTimeout: 5000, // in ms
            participantRefreshTimeout: 3000, // in ms
            progressStepInPercents: 15,
            pluginCookieExpDays: 365,
            maxVolForSpeakerMic: 65535,
            defaultVolForSpeakerMic: 49000,
            /* Configuration of lib */
            defaultPreviewMode: "PIP",
            enableShowConfParticipantName: true,
            defaultFullpageMode: true,
            /* Notifications */
            notificationUserStatusTimeout: 10000,
            notificationDefaultTimeout: 5000,
            enableNotifications: false, // Participant joined/left notification popups, etc
            enableDesktopNotifications: false, // Currently only Chrome supports it
            /* Conference control */
            defaultRecorderTypes: ['"HD-RECORDER"', '"HIGH-QUALITY"'],
            /* SOAP configuration */
            soapProxyURL: "http://ttg-apps-qa.kp.org/soap_proxy.php",
            soapUserServicePath: "http://thvid.kp.org/services/v1_1/VidyoPortalUserService?wsdl",
           /* Generic classes */
            btnOnClass: "btn-success",
            btnPrimaryClass: "btn-primary",
            btnOffClass: "btn-danger",
            btnChangingClass: "btn-warning",
            btnInfoClass: "btn-info",
            btnAltClass: "btn-inverse",
            /* Splash */
            splash: ".splash",
            /* audio */
            audioIncomingCallMp3: 'vidyoplayer/audio/incomingCall.mp3',
            audioIncomingCallOgg: 'vidyoplayer/audio/incomingCall.ogg',
            audioIncomingCallWav: 'vidyoplayer/audio/incomingCall.wav',
            /* UI containers */
            infoWrapper: "#infoWrapper",
            infoTemplate:
    '\
    <h3 style="color: #000000;">{{{title}}}</h3>\
    {{#if details}}\
        <p>{{{details}}}</p>\
    {{/if}}\
    ',
            errorWrapper: "#errorWrapper",
            errorTemplate:
    '\
    <h3 style="color: #000000;">{{{error}}}</h3>\
    {{#if details}}\
        <p>{{{details}}}</p>\
    {{/if}}\
    ',
            mainMenu: "#mainMenu",
            liHeader: "li.nav-header",
            inCallContainer: "#inCallContainer",
            /* Configuration menu */
            configurationContainer: "#configurationWrap",
            configurationContainerClass: "#configurationWrap",
            configurationLogLevelsAndCategoriesInput: "#logLevelsAndCategories",
            configurationTemplate: '\
            <a id="configurationCross" href="#" class="close" data-hide="alert">&times;</a>\
    <h3 class="text-left">Settings</h3>\
	<div class="control-group">\
	    <label class="control-label" for="configurationCamera">Camera</label>\
	    <div id="configurationCamera" class="controls">\
	        <table>\
	            {{#each camera}}\
	                <tr>\
	                    {{#if isSelected}}\
	                        <td><input type="radio" class="input" name="Camera" value="{{id}}" checked></input></td><td><label>{{name}}</label></td>\
	                    {{else}}\
	                        <td><input type="radio" class="input" name="Camera" value="{{id}}"></input></td><td><label>{{name}}</label></td>\
	                    {{/if}}\
	                </tr>\
	            {{/each}}\
	        </table>\
	    </div>\
	</div>\
	<div class="control-group">\
	    <label class="control-label" for="configurationSpeaker">Speaker</label>\
	    <div id="configurationSpeaker" class="controls">\
	        <table>\
	            {{#each speaker}}\
	        		<tr>\
	                	{{#if isSelected}}\
		                    <td><input type="radio" class="input" name="Speaker" value="{{id}}" checked></input></td><td><label>{{name}}</label></td>\
		                {{else}}\
		                    <td><input type="radio" class="input" name="Speaker" value="{{id}}"></input></td><td><label>{{name}}</label></td>\
		                {{/if}}\
	        		</tr>\
	            {{/each}}\
	        </table>\
	    </div>\
	</div>\
	<div class="control-group">\
	    <label class="control-label" for="configurationMicrophone">Microphone</label>\
	    <div id="configurationMicrophone" class="controls">\
	    	 <table>\
	            {{#each microphone}}\
	            	<tr>\
		                {{#if isSelected}}\
		                    <td><input type="radio" class="input" name="Microphone" value="{{id}}" checked></input></td><td><label>{{name}}</label></td>\
		                {{else}}\
		                    <td><input type="radio" class="input" name="Microphone" value="{{id}}"></input></td><td><label>{{name}}</label></td>\
		                {{/if}}\
	            	</tr>\
	            {{/each}}\
	    	</table>\
	    </div>\
	</div>\
    ',      
            titleBar: "#titleBar",
            setupCameraConfigContainer: "#setupCameraConfigContainer",
            setupCameraConfigTemplate: '\
    <div class="control-group">\
        <div id="configurationCamera" class="controls">\
            <table>\
                {{#each camera}}\
                    <tr>\
                        {{#if isSelected}}\
                            <td><input type="radio" class="input" name="Camera" value="{{id}}" checked="checked" style="vertical-align:top; margin-right:5px;"></input></td>\
            				<td><label style="margin-bottom:0;">{{name}}</label></td>\
                        {{else}}\
                            <td><input type="radio" class="input" name="Camera" value="{{id}}" style="vertical-align:top; margin-right:5px;"></input></td>\
            				<td><label style="margin-bottom:0;">{{name}}</label></td>\
                        {{/if}}\
                    </tr>\
                {{/each}}\
            </table>\
        </div>\
    </div>\
    ',
    		setupMicConfigContainer: "#setupMicConfigContainer",
    		setupMicConfigTemplate: '\
	    <div id="configurationMicrophone" class="controls">\
	    	 <table>\
	            {{#each microphone}}\
	            	<tr>\
		                {{#if isSelected}}\
		                    <td><input type="radio" class="input" name="Microphone" value="{{id}}" checked="checked" style="vertical-align:top; margin-right:5px;"></input></td>\
    						<td><label style="margin-bottom:0;">{{name}}</label></td>\
		                {{else}}\
		                    <td><input type="radio" class="input" name="Microphone" value="{{id}}" style="vertical-align:top; margin-right:5px;"></input></td>\
    						<td><label style="margin-bottom:0;">{{name}}</label></td>\
		                {{/if}}\
	            	</tr>\
	            {{/each}}\
	    	</table>\
	    </div>\
	</div>\
    ',
    		setupSpeakerConfigContainer: "#setupSpeakerConfigContainer",
    		setupSpeakerConfigTemplate: '\
	    <div id="configurationSpeaker" class="controls">\
	        <table>\
	            {{#each speaker}}\
	        		<tr>\
	                	{{#if isSelected}}\
		                    <td><input type="radio" class="input" name="Speaker" value="{{id}}" checked="checked" style="vertical-align:top; margin-right:5px;"></input></td>\
    						<td><label style="margin-bottom:0;">{{name}}</label></td>\
		                {{else}}\
		                    <td><input type="radio" class="input" name="Speaker" value="{{id}}" style="vertical-align:top; margin-right:5px;"></input></td>\
    						<td><label style="margin-bottom:0;">{{name}}</label></td>\
		                {{/if}}\
	        		</tr>\
	            {{/each}}\
	        </table>\
	    </div>\
	</div>\
    ',
            /* Login menu */
            userLoginPopup: "#userLoginPopup",
            /* Login menu inputs */

            userLoginError: "#userLoginError",
            userLoginErrorWrapper: "#userLoginErrorWrapper",
            userLoginPortal: "#userLoginPortal",
            userLoginUsername: "#userLoginUsername",
            userLoginPassword: "#userLoginPassword",
            userLoginProgressContainer: "#userLoginProgressBarContainer",
            userLoginProgressBar: "#userLoginProgressBar",
            userLoginButton: "#userLoginButton",
            userLoginInputs: ".userLoginInput",
            /* Guest menu */
            guestLoginPopup: "#guestLoginPopup",
            /* Guest menu inputs */
            guestLoginInputs: ".guestLoginInput",
            guestLoginErrorWrapper: "#guestLoginErrorWrapper",
            guestLoginError: "#guestLoginError",
            guestURL: "#guestURL",
            guestName: "#guestName",
            guestPIN: "#guestPIN",
            guestProgressBarContainer: "#guestLoginProgressBarContainer",
            guestProgressBar: "#guestLoginProgressBar",
            guestLoginButton: "#guestLoginButton",
            /* Joining */
            preCallJoinAsUserPopup: "#preCallJoinAsUserPopup",
            preCallJoinProgressBarContainer: "#preCallJoinProgressBarContainer",
            preCallJoinProgressBar: "#preCallJoinProgressBar",
            /* Incoming call */
            preCallIntitePopup: "#preCallIntitePopup",
            preCallIntitePopupInvitee: "#preCallIntitePopupInvitee",
            preCallIntitePopupButtonAccept: "#preCallIntitePopupButtonAccept",
            preCallIntitePopupButtonReject: "#preCallIntitePopupButtonReject",
            /* Plugin object */
            pluginContainer: "#pluginContainer",
            pluginAndChatContainer: "#pluginAndChatContainer",
            pluginIdName: "vidyoPlugin",
            pluginTemplate: "<object id='{{id}}' type='{{mimeType}}' width='1px' height='1px'>",
            pluginWidth: 100,
            pluginHeight: 100,
            pluginInstallInstructionsTemplate: "\
    <p>\
        <h5>Please follow the following instructions to install it.</h5>\
        <p>\
            <ol>\
                <li>Read <a href='files/EULA.html'>End User License Agreement</a>. By downloading plugin you acknoledge that you read EULA and that you agree to it.</li>\
                <li>Download VidyoWeb plugin for <a class='btn btn-small' href='files/VidyoWeb-win32-{{version}}.msi'>Microsoft Windows</a> or <a class='btn btn-small' href='files/VidyoWeb-macosx-{{version}}.pkg'>Apple OSX</a>.</li>\
                <li>Install it by running the installer.</li>\
                <li>VidyoWeb API sample will start automatically when plugin is installed.</li>\
            </ol>\
        </p>\
        <p>\
            <small>&copy; 2013, 2014 <a href='http://www.vidyo.com'>Vidyo</a>. All rights reserved.</small>\
        </p>\
    </p>\
    ",
            pluginEnableInstructionsTemplate: "\
    <p>\
        <h5>Plugin is not enabled in the browser</h5>\
        <p>\
            <ul>\
                <li>Please allow VidyoWeb plugin to access this page.</li>\
            </ul>\
        </p>\
        <p>\
            <small>&copy; 2013, 2014 <a href='http://www.vidyo.com'>Vidyo</a>. All rights reserved.</small>\
        </p>\
    </p>\
    ",
            /* In call UI */
            inCallChatContainer: "#inCallChatContainer",
            inCallPluginAndControls: "#inCallPluginAndControlsWrap",
            inCallButtonPanel: "#inCallButtonPanel",
            inCallButtonParticipants: "#inCallButtonParticipants",
            inCallButtonParticipantsBadge: "#inCallButtonParticipantsBadge",
            inCallButtonMuteVideo: "#inCallButtonMuteVideo",
            inCallButtonMuteSpeaker: "#inCallButtonMuteSpeaker",
            inCallButtonMuteMicrophone: "#inCallButtonMuteMicrophone",
            inCallButtonShare: "#inCallButtonShare",
            inCallButtonLocalShare: "#inCallButtonLocalShare",
            inCallButtonToggleLayout: "#inCallButtonToggleLayout",
            inCallButtonFullpage: "#inCallButtonFullpage",
            inCallButtonFullscreen: "#inCallButtonFullscreen",
            inCallButtonDisconnect: "#inCallButtonDisconnect",
            inCallButtonEndMeeting: "#inCallButtonEndMeeting",
            inCallButtonTogglePreview: "#inCallButtonTogglePreview",
            inCallButtonToggleConfig: "#inCallButtonToggleConfig",
            inCallLocalShareList: "#inCallLocalShareList",
            inCallShareList: "#inCallShareList",
            inCallSelectedShareClass: "inCallSelectedShare",
            inCallSelectedLocalShareClass: "inCallSelectedLocalShare",
            setupCameraButtonToggleConfig: "#setupCameraButtonToggleConfig",
            setupMicButtonToggleConfig: "#setupMicButtonToggleConfig",
            setupSpeakerButtonToggleConfig: "#setupSpeakerButtonToggleConfig",
            /* Panels */
            inCallChatTabs: "#inCallChatTabs",
            inCallChatPanes: "#inCallChatPanes",
            inCallChatTextField: "#inCallChatTextField",
            inCallChatTextSend: "#inCallChatTextSend",
            inCallChatGroupTabLink: "#inCallChatGroupTabLink",
            inCallChatGroupPane: "#inCallChatGroupPane",
            inCallChatGroupTab: "#inCallChatGroupTab",
            inCallChatForm: "#inCallChatForm",
            inCallChatMinimizeLink: "#inCallChatMinimizeLink",
            inCallChatTabTemplate: '<li data-uri="{{uri}}" id="chatTab{{endpointId}}"><a href="#chatPane{{endpointId}}" data-uri="{{uri}}" data-missed="{{numMissed}}">{{name}}&nbsp;<span class="badge badge-info">{{numMissed}}</span>&nbsp;<i class="close pull-right">&times;</i></a></li>',
            inCallChatPaneTemplate: '<div class="tab-pane" data-uri="{{uri}}" id="chatPane{{endpointId}}"><ul></ul></div>',
            inCallChatPaneMessageTemplate: '<li><div class="chatName{{#if isOutgoing}} chatSelf{{/if}}">[{{name}}]</div><div class="chatMessage">{{message}}</div><div class="chatTime">{{time}}</div></li>',
            inCallParticipantsPanel: "#inCallParticipantsPanel",
            inCallParticipantsList: "#inCallParticipantsList",
            inCallParticipantsClass: ".inCallParticipant",
            inCallParticipantInfoButtonClass: ".inCallInfoButton",
            inCallParticipantPinButtonClass: ".inCallPinButton",
            inCallRecordButtonClass: ".inCallRecordButton",
            inCallLockButtonClass: ".inCallLockButton",
            inCallParticipantHeaderName: "#inCallParticipantHeaderName",
            inCallParticipantsSearchForUserInput: "#inCallParticipantsSearchForUserInput",
            inCallParticipantTemplate: '\
    <li class="inCallParticipant" data-uri="{{uri}}">\
        <div class="inCallParticipantNameDiv">\
            {{#if isMe}}\
                <strong>{{name}}</strong>\
            {{else}}\
                {{name}}\
            {{/if}}\
        </div>\
        <div class="btn-toolbar pull-right btn-group" style="display:none;">\
            {{#unless isMe}}\
                {{#if isChatEnabled}}\
                    <a href="#" role="button" class="btn btn-mini" data-type="chat" data-uri="{{uri}}" data-name="{{name}}" title="Chat with {{name}}"><i class="icon-comment"></i></a>\
                {{/if}}\
            {{/unless}}\
            <a href="#" role="button" class="btn btn-mini btn-info inCallInfoButton" data-type="info" data-uri="{{uri}}" title="Information about {{name}}"><i class="icon-info-sign"></i></a>\
        </div>\
    </li>\
    ',
            inCallParticipantsTemplate: '\
    <li class="nav-header inCallParticipantHeader">\
        <div id="inCallParticipantHeaderName" title="{{sessionDisplayText}}">{{sessionDisplayText}}</div>\
        <div class="btn-toolbar">\
            {{#if isChatEnabled}}\
                <a href="#" role="button" class="btn btn-small" data-type="group_chat" title="Chat with everyone"><i class="icon-comment-alt"></i></a>\
            {{/if}}\
            {{#if isOwner}}\
                <a href="#" role="button" class="btn btn-small inCallLockButton" data-type="lock" title="Click to lock"><i class="icon-unlock"></i></a>\
                {{#if isRecordable}}\
                    <a href="#" role="button" class="btn btn-small inCallRecordButton" data-type="record" title="Record"><i class="icon-record"></i></a>\
                {{/if}}\
            {{else}}\
                <a href="#" role="button" class="btn btn-small btn-danger inCallLockButton disabled hide" title="Room is locked"><i class="icon-lock"></i></a>\
                <a href="#" role="button" class="btn btn-small btn-danger inCallRecordButton disabled hide" title="Conference is being recorded"><i class="icon-record"></i></a>\
            {{/if}}\
        </div>\
    </li>\
    {{#if isOwner}}\
        <li id="inCallParticipantUserSearchContainer">\
            <form class="form-search">\
                <input type="text" class="input-block-level search-query" id="inCallParticipantsSearchForUserInput" placeholder="Type name to invite">\
            </form>\
        </li>\
    {{/if}}\
    {{#each participants}}\
    <li class="inCallParticipant" data-uri="{{uri}}">\
        <div class="inCallParticipantNameDiv">\
            {{#if isMe}}\
                <strong>{{name}}</strong>\
            {{else}}\
                {{name}}\
            {{/if}}\
        </div>\
        <div class="btn-toolbar pull-right btn-group" style="display:none;">\
            {{#unless isMe}}\
                <a href="#" role="button" class="btn btn-mini" data-type="chat" data-uri="{{uri}}" data-name="{{name}}" title="Chat with {{name}}"><i class="icon-comment"></i></a>\
            {{/unless}}\
            <a href="#" role="button" class="btn btn-mini btn-info inCallInfoButton" data-type="info" data-uri="{{uri}}" title="Information about {{name}}"><i class="icon-info-sign"></i></a>\
        </div>\
    </li>\
    {{/each}}\
    ',
            inCallParticipantInfoTemplate: '\
    {{#if isMe}}\
    <dl class="dl-horizontal">\
        <dt>Local:</dt><dd>&nbsp;</dd>\
        <dt>Resolution</dt>\
        <dd>{{encoderInfo.rect.width}}x{{encoderInfo.rect.height}}@{{encoderInfo.sendFrameRate}}</dd>\
        <dt>FIRs</dt>\
        <dd>{{encoderInfo.numFirs}}</dd>\
        <dt>NACKs</dt>\
        <dd>{{encoderInfo.numNacks}}</dd>\
        <dt>I-frames</dt>\
        <dd>{{encoderInfo.numIFrames}}</dd>\
        <dt>RTT</dt>\
        <dd>{{encoderInfo.mediaRTT}} ms</dd>\
        <dt>Remote:</dt><dd>&nbsp;</dd>\
    {{else}}\
    <dl class="dl-horizontal">\
    {{/if}}\
        <dt>Video bitrate</dt>\
        <dd>{{videoKBitsPerSecRecv}} kbps</dd>\
        <dt>Resolution</dt>\
        <dd>{{videoResolution.width}}x{{videoResolution.height}}@{{videoFrameRate}}</dd>\
    {{#unless isMe}}\
        <dt>Audio bitrate</dt>\
        <dd>{{audioKBitsPerSecRecv}} kbps</dd>\
        <dt>NACKs</dt>\
        <dd>{{nacks}}</dd>\
        <dt>FIRs</dt>\
        <dd>{{firs}}</dd>\
    {{/unless}}\
    </dl>\
    ',
            inCallLocalSharesTemplate: '\
    {{#if sharing}}\
    <li role="presentation"><a class="inCallLocalShareItem inCallLocalShareUnshare" role="menuitem" tabindex="-1" href="#">Stop sharing</a></li>\
    <li class="divider"></li>\
    {{/if}}\
    {{#each desktops}}\
    {{#if highlight}}\
    <li role="presentation"><a class="inCallLocalShareItem inCallLocalSelectedShare" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{else}}\
    <li role="presentation"><a class="inCallLocalShareItem" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{/if}}\
    {{/each}}\
    <li class="divider"></li>\
    {{#each windows}}\
    {{#if highlight}}\
    <li role="presentation"><a class="inCallLocalShareItem inCallLocalSelectedShare" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{else}}\
    <li role="presentation"><a class="inCallLocalShareItem" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{/if}}\
    {{/each}}\
    ',
            inCallSharesTemplate: '\
    <li role="presentation"><a class="inCallShareItem" role="menuitem" data-id="-1" tabindex="-1" href="#">Hide remote share</a></li>\
    <li class="divider"></li>\
    {{#each shares}}\
    {{#if highlight}}\
    <li role="presentation"><a class="inCallShareItem inCallSelectedShare" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{else}}\
    <li role="presentation"><a class="inCallShareItem" role="menuitem" data-id="{{id}}" tabindex="-1" href="#">{{name}}</a></li>\
    {{/if}}\
    {{/each}}\
    ',
            inCallShareItems: "inCallShareItem",
            inCallButtonShareBadge: "#inCallButtonShareBadge",
            /* Notification UI */
            notificationContainer: "#notificationContainer",
            /* Pre-call UI */
            preCallContainer: "#preCallContainer",
            preCallPortalName: "#preCallPortalName",
            preCallUserDisplayName: "#preCallUserDisplayName",
            preCallSearchField: "#preCallSearchField",
            preCallJoinMyRoomButton: "#preCallJoinMyRoomButton",
            preCallJoinConferencePinDialog: "#preCallJoinConferencePinDialog",
            preCallJoinConferencePinDialogPIN: "#preCallJoinConferencePinDialogPIN",
            preCallJoinConferencePinDialogButton: "#preCallJoinConferencePinDialogButton",
            preCallJoinConferencePinDialogErrorWrapper: "#preCallJoinConferencePinDialogErrorWrapper",
            preCallJoinConferencePinDialogError: "#preCallJoinConferencePinDialogError",
            preCallLogoutButton: "#preCallLogoutButton",
            preCallSearchNavigationList: "#preCallSearchNavigationList",
            preCallSearchProgressTemplate: '\
                    <li><strong>Searching...</strong></li>\
                    <li id="preCallSearchProgressBarContainer">\
                        <div>\
                            <div class="progress progress-striped active ">\
                                <div class="bar" style="width: 100%;"></div>\
                            </div>\
                        </div>\
                    </li>\
    ',
            preCallSearchUserClass: ".user",
            preCallAddUserIcon: "icon-star",
            preCallRemoveUserIcon: "icon-remove-circle",
            preCallMyRoomTemplate: '\
        {{#if total}}\
            <ul class="unstyled">\
            {{#each Entity}}\
                <li>{{displayName}}</li>\
            {{/each}}\
        {{else}}\
            <em>Empty</em>\
        {{/if}}\
    ',
            preCallInvitingDialogTemplate: '\
    {{#if isDirect}}\
    Incoming call from <strong>{{user}}</strong>\
    {{else}}\
    <strong>{{user}}</strong> is inviting you to a conference\
    {{/if}}\
    ',
            preCallSearchJustUserTemplate: '{{printUserNoButtons}}',
            preCallSearchUserTemplate: '\
                            <li class="user favUser" data-id="{{id}}">\
                                {{printUser}}\
                            </li>\
    ',
            preCallSearchTemplate: '\
                    <li class="nav-header small-font"><i class="icon-star"></i>Favorites <span class="badge badge-info">{{favNum}}</span></li>\
                    {{#if favNum}}\
                        {{#each fav}}\
                            <li class="user favUser" data-id="{{id}}">\
                                {{printUser}}\
                            </li>\
                        {{/each}}\
                    {{else}}\
                        <li class="user favUser">None</li>\
                    {{/if}}\
                    {{#if userNum}}\
                        <li class="nav-header small-font"><i class="icon-search"></i>Search results <span class="badge badge-info">{{userNum}}</span></li>\
                        {{#each user}}\
                            <li class="user searchUser" data-id="{{id}}">\
                                {{printUser}}\
                            </li>\
                        {{/each}}\
                    {{/if}}\
    '
        };
        config.pluginMimeType += config.pluginVersion;
        config.activexType += config.pluginVersion;

        return config;
    });
}());
