<script>
if (!this.mdoGlobalSearch) {
	    this.mdoGlobalSearch = {};
    }

function submitSearch(){
    if($('#mastheadSearchBox').val() == 'Search')
    {
	event.returnValue=false;
      return false;
    }
    else {document.search.submit();}
  }
var suggestionToCategory = {};
function submitSearch2(){
    if($('#searchBox').val() == 'Search')
    {
	event.returnValue=false;
      return false;
    }
    else {
    	if($('#searchBox').val() != 'Search' && $('#category').val() == '')
        {
			suggestionToCategory = {};
        	$.ajax({
	        	 async: false,
	       		 url: "http://mydoctor.kaiserpermanente.org/ncal/mdo/globalsearch/loadTypeAheadResults.jsp?term=" + $('#searchBox').val(),
	   	          dataType: "xml",
	   	          success: function(xmlResponse) {
	   			  $(xmlResponse).find("Suggestion").each(function(){
    		          if($(this).find("Value").text() == $('#searchBox').val())
    		          {
    		        	  var cat = $(this).find("Category").text();
    		        	  $('#category').val(cat);
    		          }
					suggestionToCategory[$(this).find("Value").text()] = $(this).find("Category").text();
    		        })
    	          }
    	        })
        }
        document.searchContent.submit();
	}
}

</script>
<!--satish US15275 start -->
<div id="masthead">
<a href="#" class="mdo-video-logo MART-masthead-logo">
                        <h1>Video Visits <br>
                        <small>The Permanente Medical Group</small>
                        </h1>
                        </a>

  <!--satish US15275 end -->
	<div id="mastheadSearch">
		<form name="search" action="http://mydoctor.kaiserpermanente.org/ncal/mdo/globalsearch/globalSearch.jsp" method="GET">
            <input id="mastheadSearchBox"  class="searchBox mdoSearchBox nonAjaxSearch" type="text" name="search" value="Search" autocomplete="off"/>
			<input id="mastheadCategory" class="category" name="category" type="hidden" value=""/>
            
            <div id="mastheadSearchBtn">
            	<a id="globalSearchBtn" class="mdoGlobalSearch" href="javascript:submitSearch();"></a>
            </div>
		</form>
	</div>
</div>   <!--[if !IE]>  /masthead   <![endif]-->

<div id="mainNav">
  <ul>
	<li id="active"><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/"> Home </a></li>
	<li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/ourdoctors.jsp"> Our Doctors </a></li>
	<li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/stayinghealthy/"> Staying Healthy </a></li>
	<li><a href="http://mydoctor.kaiserpermanente.org/ncal/mdo/presentation/healthguide/"> A-Z Health Topics </a></li>
  </ul>
</div>
<!--[if !IE]>	/mainNav   <![endif]-->

<!-- Commented by Mandar A. 04/14/2014 -->
<!-- <script  type="text/javascript">
function sendEmail()
{
   var subject = document.title;
   var body_message = window.location;     
   var mailto_link = "mailto:?subject="+subject+"&body="+escape(body_message);
   win = window.open(mailto_link,'emailWindow');
   if (win && win.open &&!win.closed) {
      win.close();
   }
}
</script>	-->

<!-- Commented by Mandar A. 04/08/2014 -->
<!--<div id="iconNav"> 
      <ul id="iconList"> 
        <li id="email"><a href="javascript:sendEmail();" title="E-mail">E-mail</a></li> 
        <li id="print"><a href="javascript: void(0);" title="Print">Print</a></li> 
        <li id="favorites"><a href="javascript: void(0);" title="Bookmark This Page">Bookmark This Page</a></li> 
        <li id="favorites-bookmarked"><a href="javascript: void(0);" title="Bookmarked Page">BookmarkedPage</a></li>	 -->   
 	 	<!--[if !IE]><li id="help"><a href="javascript: void(0);" title="Help">Help</a></li><![endif]--> 
 <!--       <li id="normalFont"><a href="#fontsize0" title="Normal Font Size"></a></li>
		<li id="mediumFont"><a href="#fontsize1" title="Medium Font Size"></a></li>
		<li id="largeFont"><a href="#fontsize2" title="Large Font Size"></a></li>
      </ul> 
    </div> -->

<input type="hidden" name="bb-mdo-doctor-initialContentUrl" id="bb-mdo-doctor-initialContentUrl" value="/mydoctor.kaiserpermanente.org/videovisits" />
<input type="hidden" name="bb-mdo-doctor-initialContentName" id="bb-mdo-doctor-initialContentName" value="Video Visits" />
