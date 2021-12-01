import React, { useEffect } from 'react';
import * as WebUI from '../../../../pexip/complex/webui.js';

function CapturePhoto({ sendFile, selfViewVideo }) {
    let rtc =null, photoCanvas, videoPlayer;

    // Similar to componentDidMount
    useEffect(() => {
        rtc = WebUI.getRTC();
    }, []);

    const takePhoto = () => {
        videoPlayer = selfViewVideo.current;
        const context = photoCanvas.getContext('2d');
        context.drawImage(videoPlayer, 0, 0, 680, 360);
        photoCanvas.toBlob(sendFile);
        photoCanvas.dataset.view = "captured";
        rtc && rtc.renegotiate();
    };

    return (
        <div className="c-camera-feed">
            <button data-view="smaller" onClick={takePhoto} style={{position: 'absolute',top: '390px', width: 'fit-content', background:'cyan'}}>Take photo!</button>
            <div className="c-camera-feed__stage">
                <canvas id = "capturedPhotoCanvas" data-view="empty" width="680" height="360" ref={ref => (photoCanvas = ref)} style={{position: 'absolute', top: '483px', left: '1077px', zIndex: '3',  width: '20%' }}/>
            </div>
        </div>
    );
}

export default CapturePhoto;