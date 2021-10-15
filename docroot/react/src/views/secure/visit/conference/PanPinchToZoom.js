import React from "react";
import './conference.less';

class PanPinchToZoom extends React.Component {
    constructor(props) {
        super(props);
    
        this.touchDist;
        this.imageW;
        this.imageH;
        this.pinchX;
        this.pinchY;
        this.offsetX;
        this.offsetY;
        this.o_screenX,
        this.o_screenY;
        this.o_clientX;
        this.o_clientY;	
        this.zooming=false;
        this.mode=0;
        this.touchTime;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.resetRemoteFeedStyle = this.resetRemoteFeedStyle.bind(this);

        this.doNotPerformPinchZoom = this.doNotPerformPinchZoom.bind(this);

        this.onfgDivClick = this.onfgDivClick.bind(this);

        // this.mousedown = this.mousedown.bind(this);
        // this.mousemove = this.mousemove.bind(this);
        // this.mouseup = this.mouseup.bind(this);
        
    }
    componentDidMount(){
		this.resetRemoteFeedStyle();
       // document.getElementById('image').css({position:'absolute',left:'200px',top:'60px',width:'165px',height:'143px', overflow:'hidden'});
    }

	componentDidUpdate(){
		this.resetRemoteFeedStyle();
       // document.getElementById('image').css({position:'absolute',left:'200px',top:'60px',width:'165px',height:'143px', overflow:'hidden'});
    }

	resetRemoteFeedStyle(){
		document.getElementById('video').removeAttribute("style");
	}

	doNotPerformPinchZoom(e){
		if(((e.target.id ==="video" && e.target.dataset.view === "larger") || (e.target.id ==="presvideo")) && !this.props.disablePanPinchToZoom){
			return false;
		}
		return true;
	}
	handleTouchStart(e, flag){
		console.log("::flag");
		console.log(flag);
       // e.preventDefault();
	   if(this.doNotPerformPinchZoom(e)){
		   return;
	   }
		//if(e.target.id=="panPinchZoomDiv"){
			this.touchTime=new Date().valueOf();
			if (e.touches.length==1){
				this.mode=1;
			var imageTop = document.getElementById(e.target.id).style.top;
			var imageLeft = document.getElementById(e.target.id).style.left;
			this.offsetX = e.touches[0].clientX-imageLeft;
			this.offsetY = e.touches[0].clientY-imageTop;
			}
			if (e.touches.length==2){
				this.mode=2;
				var dx = e.touches[0].screenX-e.touches[1].screenX;
				var dy = e.touches[0].screenY-e.touches[1].screenY;
				this.pinchX = e.touches[0].clientX+(e.touches[1].clientX-e.touches[0].clientX)/2; 
				this.pinchY = e.touches[0].clientY+(e.touches[1].clientY-e.touches[0].clientY)/2; 
				var imageTop = document.getElementById(e.target.id).style.top;
				var imageLeft = document.getElementById(e.target.id).style.left;
				this.offsetX = this.pinchX-imageLeft;
				this.offsetY = this.pinchY-imageTop;
				this.touchDist = Math.sqrt((dx*dx)+(dy*dy));
				//$('#marker').css({left:this.pinchX+'px',top:this.pinchY+'px'}).show();

				this.imageW=document.getElementById(e.target.id).width;
				this.imageH=document.getElementById(e.target.id).height;
				// e.preventDefault();
				e.stopPropagation();		  
				return false;
			}
		//}
	}
	
	handleTouchMove(e) {
       // e.preventDefault();
	   	if(this.doNotPerformPinchZoom(e)){
			return;
		}
		//if(e.target.id=="panPinchZoomDiv"){
			if (e.touches.length==1 && this.mode==1){
				ox=e.touches[0].clientX-this.offsetX;
				oy=e.touches[0].clientY-this.offsetY;
				if(ox*3 < 100){
					ox=170;
				}
				if(oy*3 < 100){
					oy = 170;
				}
				//document.getElementById(e.target.id).style.cssText=`width:${(ox*3)}px; height:${(oy*3)}px;`;
				//document.getElementById("remoteFeedContainerDiv").style.cssText=`overflow:hidden `;
				//document.getElementById("presentation-view").style.cssText=`overflow: hidden`;
				document.getElementById(e.target.id).style.cssText=`transform:scale(${(ox*3/100)}); `;
			// e.preventDefault();
				e.stopPropagation();		  
				return false;
			}
			if (e.touches.length==2 && this.mode==2){
				var dx = e.touches[0].screenX-e.touches[1].screenX;
				var dy = e.touches[0].screenY-e.touches[1].screenY;
				var touchDist2 = Math.sqrt((dx*dx)+(dy*dy));
				var scale = (((touchDist2/this.touchDist)-1)*1)+1;
				var ox=(this.pinchX)-(this.offsetX*scale);
				var oy=(this.pinchY)-(this.offsetY*scale);

				if ((this.imageW*scale)>50){
					document.getElementById(e.target.id).style.cssText=`position:absolute; left:${ox}px; top:${oy}px; width:${(this.imageW*scale)}px; height:${(this.imageH*scale)}px`;
				}
				// e.preventDefault();
				e.stopPropagation();		  
				return false;
			}
		//}
	}
	
	handleTouchEnd(e){
      //  e.preventDefault();
	  	if(this.doNotPerformPinchZoom(e)){
			return;
		}
		//if(e.target.id=="panPinchZoomDiv"){
			this.mode=0;
			this.imageW=document.getElementById(e.target.id).width;
			this.imageH=document.getElementById(e.target.id).height;
			//document.getElementById("remoteFeedContainerDiv").style.cssText=`overflow: unset `;
			//document.getElementById("presentation-view").style.cssText=`overflow: unset`;
		//}
	}

	mousedown(e){
    //    // e.preventDefault();
	//    	if(this.doNotPerformPinchZoom(e)){
	// 		return;
	// 	}
	// 	//if(e.target.id=="panPinchZoomDiv"){
	// 		e.touches = new Array(2);
	// 		e.touches[0] = {};
	// 		e.touches[1] = {};
	// 		this.o_screenX = e.screenX-30;
	// 		this.o_screenY = e.screenY;
	// 		this.o_clientX = e.clientX-30;
	// 		this.o_clientY = e.clientY;

	// 		e.touches[0].screenX = e.screenX-30;
	// 		e.touches[0].screenY = e.screenY;
	// 		e.touches[1].screenX = e.screenX+30;
	// 		e.touches[1].screenY = e.screenY;
	// 		e.touches[0].clientX = e.clientX-30;
	// 		e.touches[0].clientY = e.clientY;
	// 		e.touches[1].clientX = e.clientX+30;
	// 		e.touches[1].clientY = e.clientY;
	// 		this.handleTouchStart(e);
	// 		this.zooming=true;
	// 	//}
	}
	mousemove(e){
    //    // e.preventDefault();
	//   	if(this.doNotPerformPinchZoom(e)){
	// 		return;
	// 	}
	// 	//if(e.target.id=="panPinchZoomDiv"){
	// 		if (this.zooming==true){
	// 			e.touches = new Array(2);
	// 			e.touches[0] = {};
	// 			e.touches[1] = {};
	// 			e.touches[0].screenX = this.o_screenX;
	// 			e.touches[0].screenY = this.o_screenY;
	// 			e.touches[1].screenX = e.screenX+30;
	// 			e.touches[1].screenY = e.screenY;
				
	// 			e.touches[0].clientX = this.o_clientX;
	// 			e.touches[0].clientY = this.o_clientY;
	// 			e.touches[1].clientX = e.clientX+30;
	// 			e.touches[1].clientY = e.clientY;
	// 			this.handleTouchMove(e);
	// 		}
	// 	//}
	}
	
	mouseup(e){
    //    // e.preventDefault();
	//   	if(this.doNotPerformPinchZoom(e)){
	// 		return;
	// 	}
	// 	//if(e.target.id=="panPinchZoomDiv"){
	// 		this.zooming=false;
	// 		console.log(e);	
	// 	//}
	}
	
    onfgDivClick(){
        // var time=new Date().valueOf()-this.touchTime;
		// if (time<100){ 
        //     document.getElementById(e.target.id).style.cssText =`position:absolute; left:0px; top: 60px; width:165px; height:143px`;
    	// }
		alert("pan");
    }

    render(){
        return(
		<div id = "panPinchZoomDiv" onClick={this.onfgDivClick} onMouseDown={this.mousedown} onMouseUp={this.mouseup} onMouseMove={this.mousemove} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
			{this.props.children}
			{/* <div ref={this.presentationViewMedia} id="presentation-view" className="presentation-view" style={{display:this.props.isContentShared ? 'flex' : 'none'}}></div>
			<div className={this.props.remoteStreamVisibleClass} style={this.props.remoteContainerCssText}>
				<div className={`${this.props.remoteContainerClass} ${this.props.isContentShared? "remoteFeedPinchAndZoom" : ""}`} style={this.props.remoteContainerCssText}>
					<video ref={(node) => { this.panPinchRemoteFeed = node; }} data-view="larger" onMouseDown={this.mousedown} onMouseUp={this.mouseup} onMouseMove={this.mousemove} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} className={this.props.remoteVideoFeedClass} width="100%" height="100%"  id="video" autoPlay="autoplay" playsInline="playsinline"></video>
				</div>
			</div> */}
		</div>
        );
    }
}

export default PanPinchToZoom;