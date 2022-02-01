    <div id="leftCol">
      <div id="tpmgLogo" class="pb10">
        <img src="images/global/TPGM_Logo_Final_Small.png" alt="TPMG Logo" style="margin:0 auto;">
      </div>	
      <ul id="connectedNav">
        <li class="bb-mdo-navigation-section collapsed">       
          <div class="connectedNavPanelHeader"><a href="javascript: void(0);">Stay Connected with <br />Your Doctor</a></div>
          <ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
            <li>Manage &amp; Schedule
              <ul>
                <li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/securedClusterQuery.do?cluster=pharmacycenter">Prescriptions</a></li>
                <li><a id="appointments" target="MDO_ExternalLink" href="https://mydoctor.kaiserpermanente.org/ncal/appointments/index.html">Appointments</a>

                  <!-- "Appointments" disclaimer popup -->
                  <div id="appt-disclaimer" title="Appointments That Can Be Made Online">
                    <div class="dialog-inset">
                      <p>The appointments that generally can be booked online are:</p>
                      <ul>
                        <li>Adult and Family Medicine</li>
                        <li>Obstetrics and Gynecology</li>
                        <li>Pediatrics</li>
                        <li>Optometry</li>
                      </ul>
                    </div>
                    <form id="form-appt-disclaimer">
                      <!--input id="dont-show-again" type="checkbox" title="Don't show this message again"/>
                      <label for="dont-show-again">Don't show this message again</label--> 
                      <label for="dont-show-again">
                        <input id="dont-show-again" type="checkbox" title="Don't show this message again"/>
                        Don't show this message again
                      </label> 
                    </form>
                  </div>

                </li>
              </ul>
            </li>
            <li>View Information
              <ul>
              	<li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/labtestresults/entrypage.do">Test results</a></li>
                <li><a target="MDO_ExternalLink" href="https://healthy.kaiserpermanente.org/health/mycare/consumer/my-health-manager/my-medical-record/immunizations/">Immunization record</a></li>
                <li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/pastofficevisits/entrypage.do">Past visits</a></li>
                <li><a target="MDO_ExternalLink" href="https://healthy.kaiserpermanente.org/health/mycare/consumer/my-health-manager/my-medical-record/hospital-stays">Hospital Stays</a></li>
               
              </ul>
            </li>
            <li>E-mail Your Doctor
              <ul>
                <li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/contactphysician/entrypage.do">Compose message</a></li>
                <li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/mailbox/epicrecmsglist.do">View messages</a></li>
              </ul>
            </li>
            <li>Preventive Health Reminders
              <ul>
                <!-- <li><a target="MDO_ExternalLink" href="http://www.kp.org/mypreventivehealth">Screening tests and immunizations</a></li> -->
				<li><a target="MDO_ExternalLink" href="https://mydoctor.kaiserpermanente.org/ncal/prompt/?refUrl=mdoLeftNav">Screening tests and immunizations</a></li>                
				<!-- <li><a target="MDO_ExternalLink" href="https://mydoctor.kaiserpermanente.org/portal/member.portal?refUrl=https://mydoctor.kaiserpermanente.org/kpweb/securedClusterQuery.do?cluster=mymedicalrecord&kp_shortcut_referrer=kp.org/mypreventivehealth">Screening tests and immunizations</a></li> -->
              </ul>
            </li>
            <li>Manage Your Family's Health
                 <ul>
  
                   <li><a href="https://mydoctor.kaiserpermanente.org/ncal/myfh/myfh_landing.html">Learn how</a></li>
                   <li><a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/proxy/entrypage.do">Set up access</a></li>

   					
                   <li class="connectedTout">These secure features require you to <a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/signonpage.do">sign in</a>.
                     <a target="MDO_ExternalLink" href="https://members.kaiserpermanente.org/kpweb/privacystate/entrypage.do">Privacy Practices</a>
                   </li>
                   
                 </ul>
               </li>          
          </ul>          
        </li>
        <li id="bb-mdo-bookmarkDoctor-bookmarkList" class="bb-mdo-navigation-section collapsed">
          <div class="connectedNavPanelHeader"><a href="javascript: void(0);">Bookmarked Doctors</a></div>
          <ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
          </ul>
        </li>
        <li class="bb-mdo-navigation-section collapsed">
          <div class="connectedNavPanelHeader"><a href="javascript: void(0);">Find a Doctor&rsquo;s <br />
            Home Page</a></div>
          <ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
            <li>
            <form action="https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/providers/providersearchpage.jsp?refresh=true" method="POST" name="searchDirectoryLeftMenu" >
              <label for="lastName">Last Name</label>
	          <input type="text" name="Last Name" onfocus="clearText(this)" />
              <br class="clearBoth" />
              <label for="firstName">First Name</label>
              <input type="text" name="First Name" onfocus="clearText(this)" />
              <br class="clearBoth" />
              
              
              
             
              
              
                       
            <label for="Specialty">Specialty</label><br/>             
            
            <select class="bb-jq-specialty-data"   name="Specialty"    id="Specialty-leftnav"     value="Specialty"   >  
            
             
             <option    value="Any"></option>

            	<option  value="Acupuncture">Acupuncture</option>                 

            	<option  value="Adolescent Medicine">Adolescent Medicine</option>                 

            	<option  value="Allergy Asthma and Immunology">Allergy</option>                 

            	<option  value="Anesthesiology">Anesthesiology</option>                 

            	<option  value="Anesthesiology Cardiovascular">Anesthesiology:  Cardiovascular</option>                 

            	<option  value="Audiology">Audiology</option>                 

            	<option  value="Surgery Bariatric">Bariatric Surgery</option>                 

            	<option  value="Behavioral Medicine">Behavioral Medicine</option>                 

            	<option  value="Cardiology Electrophysiology">Cardiac Electrophysiology</option>                 

            	<option  value="Cardiology">Cardiology</option>                 

            	<option  value="Cardiology Interventional">Cardiology:  Interventional</option>                 

            	<option  value="Cardiology Invasive">Cardiology:  Invasive</option>                 

            	<option  value="Cardiology Transplant">Cardiology:  Transplant</option>                 

            	<option  value="Surgery Cardiovascular">Cardiothoracic Surgery</option>                 

            	<option  value="Addiction Medicine">Chemical Dependency</option>                 

            	<option  value="Critical Care Medicine">Critical Care Medicine</option>                 

            	<option  value="Dermatology">Dermatology</option>                 

            	<option  value="Dermatology Micro Surgery">Dermatology:  Micro Surgery</option>                 

            	<option  value="Emergency Medicine">Emergency Medicine</option>                 

            	<option  value="Endocrinology">Endocrinology</option>                 

            	<option  value="Family Medicine">Family Medicine</option>                 

            	<option  value="Gastroenterology">Gastroenterology</option>                 

            	<option  value="Genetics">Genetics</option>                 

            	<option  value="Geriatric Medicine">Geriatric Medicine</option>                 

            	<option  value="Gyn Oncology">Gyn Oncology</option>                 

            	<option  value="Head and Neck Surgery">Head and Neck Surgery</option>                 

            	<option  value="Health Education">Health Education</option>                 

            	<option  value="Hematology">Hematology</option>                 

            	<option  value="Hospital Medicine">Hospital Medicine</option>                 

            	<option  value="Immunohistopathology">Immunohistopathology</option>                 

            	<option  value="Infectious Diseases">Infectious Diseases</option>                 

            	<option  value="Inpatient Psychiatry">Inpatient Psychiatry</option>                 

            	<option  value="Inpatient Psychiatry Child">Inpatient Psychiatry-Child</option>                 

            	<option  value="Internal Medicine">Internal Medicine</option>                 

            	<option  value="Maxillofacial Surgery">Maxillofacial Surgery</option>                 

            	<option  value="Minor Injury">Minor Injury</option>                 

            	<option  value="Neonatology">Neonatology</option>                 

            	<option  value="Nephrology">Nephrology</option>                 

            	<option  value="Neurointerventional Radiology">Neurointerventional Radiology</option>                 

            	<option  value="Neurology">Neurology</option>                 

            	<option  value="Neurological Surgery">Neurosurgery</option>                 

            	<option  value="Nuclear Medicine">Nuclear Medicine</option>                 

            	<option  value="Nutrition">Nutrition</option>                 

            	<option  value="Ob Gyn">Obstetrics and Gynecology</option>                 

            	<option  value="Occupational Medicine">Occupational Medicine</option>                 

            	<option  value="Occupational Therapy">Occupational Therapy</option>                 

            	<option  value="Medical Oncology">Oncology</option>                 

            	<option  value="Ophthalmology">Ophthalmology</option>                 

            	<option  value="Ophthalmology Corneal Disease">Ophthalmology:  Corneal Disease</option>                 

            	<option  value="Ophthalmology Glaucoma">Ophthalmology:  Glaucoma</option>                 

            	<option  value="Ophthalmology Oculoplastic">Ophthalmology:  Oculoplastic</option>                 

            	<option  value="Ophthalmology Pediatric">Ophthalmology:  Pediatric</option>                 

            	<option  value="Ophthalmology Vitreo Retinal">Ophthalmology:  Vitreo-Retinal</option>                 

            	<option  value="Optometry">Optometry</option>                 

            	<option  value="Orthopaedic Surgery">Orthopedics</option>                 

            	<option  value="Orthopaedics Hand Surgery">Orthopedics: Hand Surgery</option>                 

            	<option  value="Pain Management">Pain Management</option>                 

            	<option  value="Pathology">Pathology</option>                 

            	<option  value="Pathology Anatomic">Pathology:  Anatomic</option>                 

            	<option  value="Pathology Clinical">Pathology:  Clinical</option>                 

            	<option  value="Pathology Surgical">Pathology:  Surgical</option>                 

            	<option  value="Pediatric Anesthesiology">Pediatric Anesthesiology</option>                 

            	<option  value="Pediatric Cardiology">Pediatric Cardiology</option>                 

            	<option  value="Pediatric Critical Care">Pediatric Critical Care</option>                 

            	<option  value="Pediatric Endocrinology">Pediatric Endocrinology</option>                 

            	<option  value="Pediatric Gastroenterology">Pediatric Gastroenterology</option>                 

            	<option  value="Pediatric Hematology Oncology">Pediatric Hematology/Oncology</option>                 

            	<option  value="Pediatric Infectious Disease">Pediatric Infectious Disease</option>                 

            	<option  value="Pediatric Nephrology">Pediatric Nephrology</option>                 

            	<option  value="Pediatric Neurology">Pediatric Neurology</option>                 

            	<option  value="Orthopaedics Pediatric">Pediatric Orthopedics</option>                 

            	<option  value="Pediatric Pulmonology">Pediatric Pulmonology</option>                 

            	<option  value="Pediatric Rheumatology">Pediatric Rheumatology</option>                 

            	<option  value="Surgery Pediatric">Pediatric Surgery</option>                 

            	<option  value="Pediatric Urology">Pediatric Urology</option>                 

            	<option  value="Pediatrics">Pediatrics</option>                 

            	<option  value="Pediatrics Hospital Medicine">Pediatrics Hospital Medicine</option>                 

            	<option  value="Perinatology">Perinatology</option>                 

            	<option  value="Physical Med Rehabilitation">Physical Medicine and Rehabilitation</option>                 

            	<option  value="Physical Therapy">Physical Therapy</option>                 

            	<option  value="Plastic Surgery">Plastic Surgery</option>                 

            	<option  value="Podiatric Surgery">Podiatric Surgery</option>                 

            	<option  value="Psychiatry">Psychiatry</option>                 

            	<option  value="Psychiatry Child Adolescent">Psychiatry:  Child/Adolescent</option>                 

            	<option  value="Pulmonary Diseases">Pulmonary Medicine</option>                 

            	<option  value="Radiation Oncology">Radiation Oncology</option>                 

            	<option  value="Radiology">Radiology</option>                 

            	<option  value="Radiology Interventional">Radiology Interventional</option>                 

            	<option  value="Radiology Body Imaging">Radiology:  Body Imaging</option>                 

            	<option  value="Ob Gyn Reproductive Endocrine">Reproductive Endocrinology</option>                 

            	<option  value="Rheumatology">Rheumatology</option>                 

            	<option  value="Speech Therapy">Speech Therapy</option>                 

            	<option  value="Orthopaedics Spine Surgery">Spine Surgery</option>                 

            	<option  value="Sports Medicine">Sports Medicine</option>                 

            	<option  value="Surgery Colon Rectal">Surgery:  Colon/Rectal</option>                 

            	<option  value="Surgery General">Surgery: General</option>                 

            	<option  value="Surgical Critical Care">Surgical Critical Care</option>                 

            	<option  value="Thoracic Surgery">Thoracic Surgery</option>                 

            	<option  value="Urgent Care">Urgent Care</option>                 

            	<option  value="Urogynecology">Urogynecology</option>                 

            	<option  value="Urology">Urology</option>                 

            	<option  value="Vascular Surgery">Vascular Surgery</option>                 

            </select>
            
             <br class="clearBoth" />
         
             <label for="facility"  class="separator" >Facility</label>
            <select  class="validation-finddoctor-facility"  name="facility"  id="facility" >              
              <option value="">-</option>

               <option  value="Alameda" >Alameda</option>               

               <option  value="Antioch" >Antioch</option>               

               <option  value="Campbell" >Campbell</option>               

               <option  value="Clovis" >Clovis</option>               

               <option  value="Daly City" >Daly City</option>               

               <option  value="Davis" >Davis</option>               

               <option  value="Delta Fair" >Delta Fair</option>               

               <option  value="Elk Grove Big Horn" >Elk Grove Big Horn</option>               

               <option  value="Elk Grove Promenade" >Elk Grove Promenade</option>               

               <option  value="Fairfield" >Fairfield</option>               

               <option  value="Folsom" >Folsom</option>               

               <option  value="Fremont" >Fremont</option>               

               <option  value="Fresno" >Fresno</option>               

               <option  value="Gilroy" >Gilroy</option>               

               <option  value="Hayward" >Hayward</option>               

               <option  value="Kaiser Foundation Rehab Ctr" >Kaiser Foundation Rehab Ctr</option>               

               <option  value="Lincoln" >Lincoln</option>               

               <option  value="Livermore" >Livermore</option>               

               <option  value="Manteca" >Manteca</option>               

               <option  value="Martinez" >Martinez</option>               

               <option  value="Milpitas" >Milpitas</option>               

               <option  value="Modesto" >Modesto</option>               

               <option  value="Mountain View" >Mountain View</option>               

               <option  value="Napa" >Napa</option>               

               <option  value="Novato" >Novato</option>               

               <option  value="Oakhurst" >Oakhurst</option>               

               <option  value="Oakland" >Oakland</option>               

               <option  value="Park Shadelands" >Park Shadelands</option>               

               <option  value="Petaluma" >Petaluma</option>               

               <option  value="Pinole" >Pinole</option>               

               <option  value="Pleasanton" >Pleasanton</option>               

               <option  value="Rancho Cordova" >Rancho Cordova</option>               

               <option  value="Redwood City" >Redwood City</option>               

               <option  value="Richmond" >Richmond</option>               

               <option  value="Rohnert Park" >Rohnert Park</option>               

               <option  value="Roseville" >Roseville</option>               

               <option  value="Sacramento" >Sacramento</option>               

               <option  value="San Francisco" >San Francisco</option>               

               <option  value="San Jose" >San Jose</option>               

               <option  value="San Mateo" >San Mateo</option>               

               <option  value="San Rafael" >San Rafael</option>               

               <option  value="San Rafael Downtown" >San Rafael Downtown</option>               

               <option  value="Santa Clara Homestead" >Santa Clara Homestead</option>               

               <option  value="Santa Rosa" >Santa Rosa</option>               

               <option  value="Selma" >Selma</option>               

               <option  value="So Sacramento" >So Sacramento</option>               

               <option  value="So San Francisco" >So San Francisco</option>               

               <option  value="Stockton" >Stockton</option>               

               <option  value="Tracy" >Tracy</option>               

               <option  value="Vacaville" >Vacaville</option>               

               <option  value="Vallejo" >Vallejo</option>               

               <option  value="Walnut Creek" >Walnut Creek</option>               

            </select>
              <br class="clearBoth" />
<!--              <label for="distance"> Distance</label>-->
<!--              <select class="validation-finddoctor-distance" name="distance" id="distance">-->
<!--                <option value="Distance" selected="selected">Distance</option>-->
<!--                <option>-</option>-->
<!--                <option>1 mile</option>-->
<!--                <option>5 miles</option>-->
<!--                <option>10 miles</option>-->
<!--                <option>15 miles</option>-->
<!--                <option>20 miles</option>-->
<!--                <option>25 miles</option>-->
<!--              </select>-->
              <br class="clearBoth" />
              <input class="submitbtn validation-finddoctor-search" type="submit" value="Search Directory" />
              <br class="clearBoth" />
            </form>
            </li>
            <li>
            <ul>
              <li><a href="https://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/providers/providersearchhome.jsp">Advanced Search</a></li>
            </ul>
            </li>
          </ul>
        </li>
        <li id="bb-mdo-recentlyViewed" class="bb-mdo-navigation-section collapsed">
          <div class="connectedNavPanelHeader"><a href="javascript: void(0);">Recently Viewed</a></div>
          <ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
          </ul>
        </li>
        <li id="bb-mdo-bookmarkedPages" class="bb-mdo-navigation-section collapsed">
          <div class="connectedNavPanelHeader"><a href="javascript: void(0);">Bookmarked Pages</a></div>
          <ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
          </ul>
        </li>
        <!--[if !IE]>
		<li class="bb-mdo-navigation-section collapsed">
			<div class="connectedNavPanelHeader"><a href="javascript: void(0);">Facility Finder</a></div>
			<ul class="bb-mdo-navigation-section-contents bb-mdo-navigation-collapsed">
				<li>
				<form action="post">
					<label for="City or Zip Code">Search by City or Zip Code</label>
					<input type="text" />
					<br class="clearBoth" />

					<input class="submitbtn" type="submit" value="Search" />
		            <br class="clearBoth" />
				</form>
				<br class="clearBoth" />
				</li>
				<li><a href="javascript: void(0);">View all Facilities</a></li>
			</ul>
		</li>
		<![endif]-->
      </ul>
      <!--[if !IE]>
      <a id="visitKp" href="https://www.kaiserpermanente.org/" target="_blank">Visit kp.org</a>
      <![endif]-->


      <!-- MEP disclaimer popup -->
      <div id="mep-disclaimer" title="Before you view the program:">
        <div class="dialog-inset">
          <p style="margin-bottom:5px; font-weight:bold; color:#A7503C">Are you having back pain with any of the following?</p>
          <ul>
            <li>Severe pain, weakness or tingling in your leg(s).</li>
            <li>Difficulty stopping urination or loss of control of bladder or bowels.</li>
            <li>Unexplained fever, nausea or vomiting.</li>
            <li>A history of cancer or unexplained weight loss.</li>
          </ul>
          <form id="form-mep-disclaimer">
            <label>
              <input type="radio" name="mep-disc" value="continue"/>
              <span>No, I am not experiencing any of the above health issues.</span>
            </label>
            <label>
              <input type="radio" name="mep-disc" value="next"/>
              <span>Yes, and I have not discussed these health issues with my doctor.</span>
            </label>
            <label>
              <input type="radio" name="mep-disc" value="continue"/>
              <span>Yes, I have one or more of these health issues but have been cleared by my doctor to proceed with this program.</span>
            </label>
          </form>
        </div>
      </div>

      <!-- MEP disclaimer popup - Warning -->
      <div id="mep-disclaimer-warning" title="">
        <!--div class="dialog-inset"-->
          <p style="font-weight:bold; color:#A7503C">We understand that you are experiencing one or more of the health issues that might be impacting your back pain.</p>
          <p>We recommend that you discuss these health issues with your doctor before proceeding with this program.</p>
          <p>Once you are cleared by your doctor to do this program, we hope it helps you find relief from your back pain.</p>
        <!--/div-->
      </div>


    </div>
    <!--[if !IE]>	/leftCol   <![endif]-->
    <div id="navLoader"><img src="https://mydoctor.kaiserpermanente.org/ncal/static_includes/img/ajax-loader.gif" alt="Loading..."/></div>

