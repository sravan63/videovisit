<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>


<div class="page-content">
	<div class="intro">
		<div class="pic-frame">
			<div class="pic">
				<img src="images/mobile/vv-patient-welcome-image.jpg">
			</div>
		</div>
		<h1>Video Visits</h1>
		<div class="only-handsets">
			<p>Meet with your doctor by video on your mobile device.</p>
		</div>
		<div class="only-tablets">
			<p>Kaiser Permanente is pleased to offer you the opportunity to meet with your doctor from your smartphone or tablet.</p>
			<p>To attend a video visit, you will need a device with a front-facing camera, the Video Visits app and a fast internet connection (4G or Wi-fi highly recommended).</p>
		</div>

		<button id="signInId" class="button-main only-tablets" onclick="modalShow('modal-login');">Sign on here</button>
	</div>

	<%@ include file="common/information.jsp" %>	


		<button id="signInId" class="button-main only-handsets" onclick="modalShow('modal-login');">Sign on here</button>

</div>