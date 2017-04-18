
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/start/jquery-ui.css">
<link rel="stylesheet" href="vidyoplayer/css/main-webrtc.css">
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/fadjebjcpiiklefiadeicakcnkhgbaoo">
<script src="./lib/jquery-1.12.2.min.js"></script>
<script src="./lib/jquery-ui.min.js"></script>

<!-- <script src="../../scripts/webrtc/vidyo.client.messages.js"></script>
<script src="./scripts/vidyowebrtc/vidyo.client.private.messages.js"></script>
<script src="./scripts/vidyowebrtc/vidyo.client.js"></script> -->

<!-- <script src="./scripts/main.js"></script> -->

<script src="vidyoplayer/scripts/webrtc/vidyo.client.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.private.messages.js"></script>
    <script src="vidyoplayer/scripts/webrtc/vidyo.client.js"></script> 
    <script src="vidyoplayer/scripts/main-webrtc.js"></script>






<script type="text/javascript">
        bodyLoaded();
    </script>
    
<div class="container" id="whole">
<div class="videoWrapperFull" id="VidyoSplash" align="center">
   <img src="./images/logo-big.jpg"
      style="padding-top: 75px;">

   <div id="loaderBar"><img src="images/loader-bar.gif" alt="Loading"/></div>

</div>

<div class="videoWrapperSmall" id="VidyoArea" align="center">
   <div id="participantDiv0" class="participant-wrapper">
      <video id="remoteVideo0" autoplay="" class="remotevideo-default"></video>
      <span id="participant0" class="participant-title"></span>
   </div>
   
   <div id="participantDiv1" class="participant-wrapper">
      <video id="remoteVideo1" autoplay="" class="remotevideo-default"></video>
      <span id="participant1" class="participant-title"></span>
   </div>
   
   <div id="participantDiv2" class="participant-wrapper">
      <video id="remoteVideo2" autoplay="" class="remotevideo-default"></video>
      <span id="participant2" class="participant-title"></span>
   </div>
   
   <div id="participantDiv3" class="participant-wrapper">
      <video id="remoteVideo3" autoplay="" class="remotevideo-default"></video>
      <span id="participant3" class="participant-title"></span>
   </div>

   <!-- Shares container -->
   <div id="shareVideoDiv" class="sharevideo-wrapper">
      <video id="shareVideo0" autoplay="" class="remotevideo-default"></video>
      <span id="shareName" class="participant-title"></span>
   </div>
   
   <div id="selfViewDiv" class="local-participant-wrapper">
      <video id="localVideo" autoplay="" muted class="localvideo-default"></video>
      <span id="localNameDiv" class="local-participant-title">Self View</span>
   </div>
   
</div>
</div>
<div class="buttons" id="Buttons" align="center" style="display: none;">
    <button id="img_share_b"   onclick="toggleShare()">
       <img id="img_share" height="15px" src="./images/share.png">
    </button>
    <button id="img_camera_b"   onclick="toggleCameraIcon()">
       <img id="img_camera" height="15px" src="./images/camera.png">
    </button>
    <button id="img_mic_b"       onclick="toggleMicIcon()">
       <img id="img_mic" height="15px" src="./images/mic.png">
    </button>
    <button id="img_speaker_b"   onclick="toggleSpeakerIcon()">
       <img id="img_speaker" height="15px" src="./images/speaker.png">
       </button>
    <button id="img_disconnect_b"onclick="sendLeaveEvent()">
       <img id="img_speaker" height="15px" src="./images/disconnect.png">
    </button>
</div>
